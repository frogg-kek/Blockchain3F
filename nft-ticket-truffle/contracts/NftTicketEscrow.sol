// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NftTicketEscrow
 * @dev Paprasta NFT tipo bilietų sistema su perpardavimu ir „escrow“ stiliaus pervedimais.
 *      Edukacinis pavyzdys, tinkamas Remix ir testnetams (pvz., Sepolia).
 *
 * Funkcijos:
 *  - Renginių kūrimas organizatorių
 *  - Pirminis bilietų pirkimas
 *  - Antrinės rinkos perpardavimas su „escrow“ tvarkymu sutartyje
 *  - Bilieto patikrinimas (pažymėjimas kaip panaudoto)
 *  - Renginio atšaukimas ir bilietų grąžinimas
 *
 * Pastabos:
 *  - Bilietai yra paprasti struktūros (ne ERC-721 įgyvendinimas), kad kodas būtų kompaktiškas.
 *  - Visi išoriniai ETH pervedimai naudoja „checks-effects-interactions“ modelį.
 */
contract NftTicketEscrow {
    // ---------- Tipai ----------
    enum TicketStatus {
        None,
        Active,
        ForSale,
        PendingTransfer,
        Used,
        Refunded
    }

    struct EventData {
        uint256 id;
        address organizer;
        string name;
        uint256 date; // UNIX laiko žyma
        uint256 ticketPrice; // wei vienetais
        uint256 maxTickets;
        uint256 soldTickets;
        bool isCancelled;
    }

    struct Ticket {
        uint256 id;
        uint256 eventId;
        address owner;
        uint256 resalePrice; // jei ForSale
        TicketStatus status;
    }

    // ---------- Saugykla ----------
    mapping(uint256 => EventData) public eventsData;
    mapping(uint256 => Ticket) public tickets;

    uint256 public nextEventId = 1;
    uint256 public nextTicketId = 1;

    address public platformAdmin;
    // baziniai punktai: 10000 = 100%. pvz., 250 = 2.5%
    uint256 public platformFeeBps = 250;

    // ---------- Įvykiai ----------
    event EventCreated(uint256 indexed eventId, address indexed organizer, string name, uint256 date, uint256 ticketPrice, uint256 maxTickets);
    event PrimaryTicketPurchased(uint256 indexed eventId, uint256 indexed ticketId, address indexed buyer, uint256 price);
    event TicketListedForResale(uint256 indexed ticketId, uint256 indexed eventId, address indexed seller, uint256 resalePrice);
    event ResaleCompleted(uint256 indexed ticketId, uint256 indexed eventId, address indexed buyer, address seller, uint256 price, uint256 fee);
    event TicketUsed(uint256 indexed ticketId, uint256 indexed eventId, address indexed user);
    event EventCancelled(uint256 indexed eventId);
    event RefundIssued(uint256 indexed ticketId, uint256 indexed eventId, address indexed recipient, uint256 amount);
    event PlatformFeeUpdated(uint256 oldBps, uint256 newBps);

    // ---------- Modifikatoriai ----------
    modifier onlyAdmin() {
        require(msg.sender == platformAdmin, "Tik administratorius");
        _;
    }

    modifier onlyOrganizer(uint256 eventId) {
        require(eventsData[eventId].organizer == msg.sender, "Tik organizatorius");
        _;
    }

    // ---------- Konstruktorius ----------
    constructor() {
        platformAdmin = msg.sender;
        platformFeeBps = 250; // numatytasis 2.5%
    }

    // ---------- Administratoriaus funkcijos ----------
    /// @notice Nustatyti platformos mokestį baziniais punktais (10000 = 100%). Tik administratorius.
    function setPlatformFeeBps(uint256 newBps) external onlyAdmin {
        require(newBps <= 5000, "Mokestis per didelis"); // apsauga nuo neadekvačių mokesčių (>50%)
        uint256 old = platformFeeBps;
        platformFeeBps = newBps;
        emit PlatformFeeUpdated(old, newBps);
    }

    // ---------- Renginio ir bilieto ciklas ----------
    /// @notice Sukurti renginį. Organizatoriumi tampa msg.sender.
    function createEvent(string memory name, uint256 date, uint256 ticketPrice, uint256 maxTickets) external {
        require(date > block.timestamp, "data turi būti ateityje");
        require(ticketPrice > 0, "bilieto kaina turi būti > 0");
        require(maxTickets > 0, "bilietų skaičius turi būti > 0");

        uint256 eventId = nextEventId++;

        eventsData[eventId] = EventData({
            id: eventId,
            organizer: msg.sender,
            name: name,
            date: date,
            ticketPrice: ticketPrice,
            maxTickets: maxTickets,
            soldTickets: 0,
            isCancelled: false
        });

        emit EventCreated(eventId, msg.sender, name, date, ticketPrice, maxTickets);
    }

    /// @notice Įsigyti pirminį bilietą tiesiogiai iš organizatoriaus.
    function buyPrimaryTicket(uint256 eventId) external payable {
        EventData storage ev = eventsData[eventId];
        require(ev.organizer != address(0), "renginys neegzistuoja");
        require(!ev.isCancelled, "renginys atšauktas");
        require(block.timestamp < ev.date, "renginys jau prasidėjo arba baigėsi");
        require(ev.soldTickets < ev.maxTickets, "nebėra bilietų");
        require(msg.value == ev.ticketPrice, "neteisinga mokėjimo suma");

        // Efektai: „išleidžiamas“ bilietas ir atnaujinamas parduotų skaičius
        uint256 ticketId = nextTicketId++;
        tickets[ticketId] = Ticket({
            id: ticketId,
            eventId: eventId,
            owner: msg.sender,
            resalePrice: 0,
            status: TicketStatus.Active
        });

        ev.soldTickets++;

        // Sąveikos: pervedamos lėšos organizatoriui (checks-effects-interactions)
        (bool sent, ) = payable(ev.organizer).call{value: msg.value}('');
        require(sent, "pervedimas organizatoriui nepavyko");

        emit PrimaryTicketPurchased(eventId, ticketId, msg.sender, msg.value);
    }

    /// @notice Įtraukti savo bilietą į perpardavimą pasirinkta kaina.
    function listTicketForResale(uint256 ticketId, uint256 resalePrice) external {
        Ticket storage t = tickets[ticketId];
        require(t.owner == msg.sender, "ne bilieto savininkas");
        require(t.status == TicketStatus.Active, "bilietas neaktyvus");
        require(resalePrice > 0, "perpardavimo kaina turi būti > 0");

        t.resalePrice = resalePrice;
        t.status = TicketStatus.ForSale;

        emit TicketListedForResale(ticketId, t.eventId, msg.sender, resalePrice);
    }

    /// @notice Įsigyti perpardavimui pateiktą bilietą. Sutartis tvarko „escrow“ ir platformos mokestį.
    function buyResaleTicket(uint256 ticketId) external payable {
        Ticket storage t = tickets[ticketId];
        require(t.status == TicketStatus.ForSale, "bilietas neparduodamas");
        require(msg.value == t.resalePrice, "neteisinga mokėjimo suma");
        require(msg.sender != t.owner, "savininkas negali pirkti savo bilieto");

        address seller = t.owner;
        uint256 price = t.resalePrice;
        uint256 fee = (price * platformFeeBps) / 10000;
        uint256 sellerAmount = price - fee;

        // Efektai: pakeičiamas savininkas ir atstatomi perpardavimo laukai prieš pervedant lėšas
        t.owner = msg.sender;
        t.resalePrice = 0;
        t.status = TicketStatus.Active;

        // Sąveikos: apmokamas pardavėjas ir platforma
        (bool sentSeller, ) = payable(seller).call{value: sellerAmount}('');
        require(sentSeller, "mokėjimas pardavėjui nepavyko");

        if (fee > 0) {
            (bool sentFee, ) = payable(platformAdmin).call{value: fee}('');
            require(sentFee, "mokesčio pervedimas nepavyko");
        }

        emit ResaleCompleted(ticketId, t.eventId, msg.sender, seller, price, fee);
    }

    /// @notice Patikrinti (panaudoti) bilietą. Tai pažymi jį kaip panaudotą.
    /// @dev Supaprastinimui leidžiama kviesti bet kam; produkcijoje ribokite vartų personalui ar organizatoriui.
    function validateTicket(uint256 ticketId) external {
        Ticket storage t = tickets[ticketId];
        require(t.status == TicketStatus.Active, "bilietas neaktyvus");

        EventData storage ev = eventsData[t.eventId];
        require(ev.organizer != address(0), "renginys neegzistuoja");
        // Pasirinktinai galima reikalauti laiko prieš renginio datą
        // require(block.timestamp <= ev.date, "renginys jau pasibaigė");

        t.status = TicketStatus.Used;

        emit TicketUsed(ticketId, t.eventId, msg.sender);
    }

    /// @notice Atšaukti renginį. Gali kviesti tik organizatorius.
    function cancelEvent(uint256 eventId) external onlyOrganizer(eventId) {
        EventData storage ev = eventsData[eventId];
        require(!ev.isCancelled, "jau atšaukta");

        ev.isCancelled = true;

        emit EventCancelled(eventId);
    }

    /// @notice Grąžinti bilieto sumą, kai renginys atšauktas.
    /// @dev Grąžinama pradinė pirminio bilieto kaina. Jei bilietas pirktas per perpardavimą,
    ///      paprastumo dėlei vis tiek grąžiname pradinę renginio bilieto kainą.
    function refundTicket(uint256 ticketId) external {
        Ticket storage t = tickets[ticketId];
        require(t.owner == msg.sender, "ne bilieto savininkas");
        require(t.status != TicketStatus.Refunded, "jau grąžinta");

        EventData storage ev = eventsData[t.eventId];
        require(ev.organizer != address(0), "renginys neegzistuoja");
        require(ev.isCancelled, "renginys neatšauktas");

        uint256 amount = ev.ticketPrice;

        // Efektai: pažymėti kaip grąžintą, kad nebūtų pakartotinai naudojamas
        t.status = TicketStatus.Refunded;

        // Sąveika: pervesti grąžinamą sumą bilieto savininkui
        (bool sent, ) = payable(msg.sender).call{value: amount}('');
        require(sent, "grąžinimo pervedimas nepavyko");

        emit RefundIssued(ticketId, t.eventId, msg.sender, amount);
    }

    // ---------- Pagalbinės / vaizdo funkcijos ----------
    /// @notice Pagalbinė funkcija patikrinti, ar renginys egzistuoja
    function eventExists(uint256 eventId) public view returns (bool) {
        return eventsData[eventId].organizer != address(0);
    }

    /// @notice Gauti pagrindinę bilieto informacijos grupę
    function getTicket(uint256 ticketId) external view returns (uint256 id, uint256 eventId, address owner, uint256 resalePrice, TicketStatus status) {
        Ticket storage t = tickets[ticketId];
        return (t.id, t.eventId, t.owner, t.resalePrice, t.status);
    }

    // Atsarginės funkcijos: atmesti tiesioginius ETH siuntimus nekviečiant funkcijų
    receive() external payable {
        revert("naudokite sutarties funkcijas");
    }

    fallback() external payable {
        revert("naudokite sutarties funkcijas");
    }
}

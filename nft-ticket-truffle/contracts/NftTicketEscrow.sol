// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NftTicketEscrow
 * @dev Simple NFT-like ticketing and resale system with escrow-style transfers.
 *      Educational example suitable for Remix and testnets (Sepolia, etc).
 *
 * Features:
 *  - Event creation by organizers
 *  - Primary ticket purchases
 *  - Secondary resale marketplace with on-contract escrow handling
 *  - Ticket validation (mark as used)
 *  - Event cancellation and ticket refunds
 *
 * Notes:
 *  - Tickets are simple structs (not an ERC-721 implementation) to keep code compact.
 *  - All external calls that transfer ETH use the checks-effects-interactions pattern.
 */
contract NftTicketEscrow {
    // ---------- Types ----------
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
        uint256 date; // UNIX timestamp
        uint256 ticketPrice; // in wei
        uint256 maxTickets;
        uint256 soldTickets;
        bool isCancelled;
    }

    struct Ticket {
        uint256 id;
        uint256 eventId;
        address owner;
        uint256 resalePrice; // if ForSale
        TicketStatus status;
    }

    // ---------- Storage ----------
    mapping(uint256 => EventData) public eventsData;
    mapping(uint256 => Ticket) public tickets;

    uint256 public nextEventId = 1;
    uint256 public nextTicketId = 1;

    address public platformAdmin;
    // basis points: 10000 = 100%. e.g. 250 = 2.5%
    uint256 public platformFeeBps = 250;

    // ---------- Events ----------
    event EventCreated(uint256 indexed eventId, address indexed organizer, string name, uint256 date, uint256 ticketPrice, uint256 maxTickets);
    event PrimaryTicketPurchased(uint256 indexed eventId, uint256 indexed ticketId, address indexed buyer, uint256 price);
    event TicketListedForResale(uint256 indexed ticketId, uint256 indexed eventId, address indexed seller, uint256 resalePrice);
    event ResaleCompleted(uint256 indexed ticketId, uint256 indexed eventId, address indexed buyer, address seller, uint256 price, uint256 fee);
    event TicketUsed(uint256 indexed ticketId, uint256 indexed eventId, address indexed user);
    event EventCancelled(uint256 indexed eventId);
    event RefundIssued(uint256 indexed ticketId, uint256 indexed eventId, address indexed recipient, uint256 amount);
    event PlatformFeeUpdated(uint256 oldBps, uint256 newBps);

    // ---------- Modifiers ----------
    modifier onlyAdmin() {
        require(msg.sender == platformAdmin, "Only admin");
        _;
    }

    modifier onlyOrganizer(uint256 eventId) {
        require(eventsData[eventId].organizer == msg.sender, "Only organizer");
        _;
    }

    // ---------- Constructor ----------
    constructor() {
        platformAdmin = msg.sender;
        platformFeeBps = 250; // default 2.5%
    }

    // ---------- Admin functions ----------
    /// @notice Set platform fee in basis points (10000 = 100%). Only admin.
    function setPlatformFeeBps(uint256 newBps) external onlyAdmin {
        require(newBps <= 5000, "Fee too large"); // prevent crazy fees (>50%)
        uint256 old = platformFeeBps;
        platformFeeBps = newBps;
        emit PlatformFeeUpdated(old, newBps);
    }

    // ---------- Event & Ticket lifecycle ----------
    /// @notice Create an event. Organizer becomes msg.sender.
    function createEvent(string memory name, uint256 date, uint256 ticketPrice, uint256 maxTickets) external {
        require(date > block.timestamp, "date must be in future");
        require(ticketPrice > 0, "ticketPrice must be > 0");
        require(maxTickets > 0, "maxTickets must be > 0");

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

    /// @notice Buy a primary ticket directly from the organizer.
    function buyPrimaryTicket(uint256 eventId) external payable {
        EventData storage ev = eventsData[eventId];
        require(ev.organizer != address(0), "event does not exist");
        require(!ev.isCancelled, "event cancelled");
        require(block.timestamp < ev.date, "event already started or passed");
        require(ev.soldTickets < ev.maxTickets, "sold out");
        require(msg.value == ev.ticketPrice, "incorrect payment");

        // Effects: mint ticket and update sold count
        uint256 ticketId = nextTicketId++;
        tickets[ticketId] = Ticket({
            id: ticketId,
            eventId: eventId,
            owner: msg.sender,
            resalePrice: 0,
            status: TicketStatus.Active
        });

        ev.soldTickets++;

        // Interactions: transfer funds to organizer (checks-effects-interactions)
        (bool sent, ) = payable(ev.organizer).call{value: msg.value}('');
        require(sent, "transfer to organizer failed");

        emit PrimaryTicketPurchased(eventId, ticketId, msg.sender, msg.value);
    }

    /// @notice List an owned ticket for resale at a chosen price.
    function listTicketForResale(uint256 ticketId, uint256 resalePrice) external {
        Ticket storage t = tickets[ticketId];
        require(t.owner == msg.sender, "not ticket owner");
        require(t.status == TicketStatus.Active, "ticket not active");
        require(resalePrice > 0, "resalePrice must be > 0");

        t.resalePrice = resalePrice;
        t.status = TicketStatus.ForSale;

        emit TicketListedForResale(ticketId, t.eventId, msg.sender, resalePrice);
    }

    /// @notice Buy a ticket listed for resale. Contract handles escrow and platform fee.
    function buyResaleTicket(uint256 ticketId) external payable {
        Ticket storage t = tickets[ticketId];
        require(t.status == TicketStatus.ForSale, "ticket not for sale");
        require(msg.value == t.resalePrice, "incorrect payment");
        require(msg.sender != t.owner, "owner cannot buy their own ticket");

        address seller = t.owner;
        uint256 price = t.resalePrice;
        uint256 fee = (price * platformFeeBps) / 10000;
        uint256 sellerAmount = price - fee;

        // Effects: change ownership and reset resale fields before transferring funds
        t.owner = msg.sender;
        t.resalePrice = 0;
        t.status = TicketStatus.Active;

        // Interactions: pay seller and platform
        (bool sentSeller, ) = payable(seller).call{value: sellerAmount}('');
        require(sentSeller, "payment to seller failed");

        if (fee > 0) {
            (bool sentFee, ) = payable(platformAdmin).call{value: fee}('');
            require(sentFee, "payment of fee failed");
        }

        emit ResaleCompleted(ticketId, t.eventId, msg.sender, seller, price, fee);
    }

    /// @notice Validate (use) a ticket. This marks it as Used.
    /// @dev For simplicity callable by anyone; in production restrict to gate staff or organizer.
    function validateTicket(uint256 ticketId) external {
        Ticket storage t = tickets[ticketId];
        require(t.status == TicketStatus.Active, "ticket not active");

        EventData storage ev = eventsData[t.eventId];
        require(ev.organizer != address(0), "event does not exist");
        // Optionally require time before event date
        // require(block.timestamp <= ev.date, "event already passed");

        t.status = TicketStatus.Used;

        emit TicketUsed(ticketId, t.eventId, msg.sender);
    }

    /// @notice Cancel an event. Only organizer may call.
    function cancelEvent(uint256 eventId) external onlyOrganizer(eventId) {
        EventData storage ev = eventsData[eventId];
        require(!ev.isCancelled, "already cancelled");

        ev.isCancelled = true;

        emit EventCancelled(eventId);
    }

    /// @notice Refund a ticket after its event has been cancelled.
    /// @dev Refunds the original primary ticket price. If ticket was purchased via resale,
    ///      we still refund the original event ticket price for simplicity.
    function refundTicket(uint256 ticketId) external {
        Ticket storage t = tickets[ticketId];
        require(t.owner == msg.sender, "not ticket owner");
        require(t.status != TicketStatus.Refunded, "already refunded");

        EventData storage ev = eventsData[t.eventId];
        require(ev.organizer != address(0), "event does not exist");
        require(ev.isCancelled, "event not cancelled");

        uint256 amount = ev.ticketPrice;

        // Effects: mark refunded so it can't be reused
        t.status = TicketStatus.Refunded;

        // Interaction: send refund to ticket owner
        (bool sent, ) = payable(msg.sender).call{value: amount}('');
        require(sent, "refund transfer failed");

        emit RefundIssued(ticketId, t.eventId, msg.sender, amount);
    }

    // ---------- Helpers / Views ----------
    /// @notice Helper to check if an event exists
    function eventExists(uint256 eventId) public view returns (bool) {
        return eventsData[eventId].organizer != address(0);
    }

    /// @notice Get basic ticket info tuple
    function getTicket(uint256 ticketId) external view returns (uint256 id, uint256 eventId, address owner, uint256 resalePrice, TicketStatus status) {
        Ticket storage t = tickets[ticketId];
        return (t.id, t.eventId, t.owner, t.resalePrice, t.status);
    }

    // Fallbacks: reject direct ETH sends without calling functions
    receive() external payable {
        revert("use contract functions");
    }

    fallback() external payable {
        revert("use contract functions");
    }
}
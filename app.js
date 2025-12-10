// ========== KONTRAKTO KONFIGURACIJA ==========
const CONTRACT_ADDRESS = "0xB295A74952f01E966E2b06a3EBaebCEc2d276Bde";

const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "eventId", "type": "uint256" }
    ],
    "name": "buyPrimaryTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "ticketId", "type": "uint256" }
    ],
    "name": "buyResaleTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "eventId", "type": "uint256" }
    ],
    "name": "cancelEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "date", "type": "uint256" },
      { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "maxTickets", "type": "uint256" }
    ],
    "name": "createEvent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "ticketId", "type": "uint256" },
      { "internalType": "uint256", "name": "resalePrice", "type": "uint256" }
    ],
    "name": "listTicketForResale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "ticketId", "type": "uint256" }
    ],
    "name": "refundTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" }
    ],
    "name": "EventCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "organizer", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "date", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "ticketPrice", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "maxTickets", "type": "uint256" }
    ],
    "name": "EventCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "oldBps", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "newBps", "type": "uint256" }
    ],
    "name": "PlatformFeeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "ticketId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "PrimaryTicketPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "ticketId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "RefundIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "ticketId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "seller", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "fee", "type": "uint256" }
    ],
    "name": "ResaleCompleted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "ticketId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "seller", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "resalePrice", "type": "uint256" }
    ],
    "name": "TicketListedForResale",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "ticketId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "TicketUsed",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "ticketId", "type": "uint256" }
    ],
    "name": "validateTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "eventId", "type": "uint256" }
    ],
    "name": "eventExists",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "eventsData",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "address", "name": "organizer", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "uint256", "name": "date", "type": "uint256" },
      { "internalType": "uint256", "name": "ticketPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "maxTickets", "type": "uint256" },
      { "internalType": "uint256", "name": "soldTickets", "type": "uint256" },
      { "internalType": "bool", "name": "isCancelled", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "ticketId", "type": "uint256" }
    ],
    "name": "getTicket",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "uint256", "name": "resalePrice", "type": "uint256" },
      { "internalType": "uint8", "name": "status", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextEventId",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextTicketId",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformAdmin",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformFeeBps",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "tickets",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "uint256", "name": "eventId", "type": "uint256" },
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "uint256", "name": "resalePrice", "type": "uint256" },
      { "internalType": "uint8", "name": "status", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let connectedAccount = null;
let provider = null;
let signer = null;
let contract = null;
let currentNetwork = null;

// Suderinta su enum TicketStatus (Solidity):
// None(0), Active(1), ForSale(2), PendingTransfer(3), Used(4), Refunded(5)
const STATUS_LABELS = {
  0: "None",
  1: "Active",
  2: "For Sale",
  3: "Pending Transfer",
  4: "Used",
  5: "Refunded"
};

document.addEventListener("DOMContentLoaded", async () => {
  await initializeApp();

  // Wallet mygtukas
  const connectBtn = document.getElementById("connectWalletBtn");
  if (connectBtn) {
    connectBtn.addEventListener("click", connectWallet);
  }

  // Formos ir mygtukai
  const createEventForm = document.getElementById("createEventForm");
  if (createEventForm) {
    createEventForm.addEventListener("submit", (e) => {
      e.preventDefault();
      createEvent();
    });
  }

  const buyPrimaryForm = document.getElementById("buyPrimaryForm");
  if (buyPrimaryForm) {
    buyPrimaryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      buyPrimaryTicket();
    });
  }

  const listResaleForm = document.getElementById("listResaleForm");
  if (listResaleForm) {
    listResaleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      listTicketForResale();
    });
  }

  const buyResaleForm = document.getElementById("buyResaleForm");
  if (buyResaleForm) {
    buyResaleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      buyResaleTicket();
    });
  }

  const getTicketInfoBtn = document.getElementById("getTicketInfoBtn");
  if (getTicketInfoBtn) {
    getTicketInfoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      getTicketInfo();
    });
  }

  const validateTicketBtn = document.getElementById("validateTicketBtn");
  if (validateTicketBtn) {
    validateTicketBtn.addEventListener("click", (e) => {
      e.preventDefault();
      validateTicket();
    });
  }
});

async function initializeApp() {
  if (typeof window.ethereum === "undefined") {
    showWarningBanner();
    addStatusMessage("Error: MetaMask not detected. Please install MetaMask.", "error");
    return;
  }

  addStatusMessage("MetaMask detected. Ready to connect wallet.", "info");

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    currentNetwork = network.name;
    updateNetworkStatus();
  } catch (error) {
    console.error("Error initializing provider:", error);
  }

  window.ethereum.on("accountsChanged", handleAccountsChanged);
  window.ethereum.on("chainChanged", () => location.reload());
}

function showWarningBanner() {
  const banner = document.getElementById("metamaskWarning");
  if (banner) banner.style.display = "block";
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    connectedAccount = null;
    updateWalletButton();
    addStatusMessage("Wallet disconnected.", "warning");
  } else if (accounts[0] !== connectedAccount) {
    connectedAccount = accounts[0];
    updateWalletButton();
    addStatusMessage(`Account switched to ${shortAddress(connectedAccount)}`, "info");
  }
}

function updateNetworkStatus() {
  const statusDiv = document.getElementById("networkStatus");
  if (statusDiv && currentNetwork) {
    statusDiv.textContent = `Network: ${currentNetwork}`;
  }
}

function updateWalletButton() {
  const btn = document.getElementById("connectWalletBtn");
  if (!btn) return;

  if (connectedAccount) {
    btn.textContent = shortAddress(connectedAccount);
    btn.style.background = "var(--secondary-color)";
  } else {
    btn.textContent = "Connect Wallet";
    btn.style.background = "";
  }
}

// ========== Pinigines prisijungimas ==========
async function connectWallet() {
  try {
    if (typeof window.ethereum === "undefined") {
      addStatusMessage("MetaMask not installed. Please install it to continue.", "error");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    connectedAccount = accounts[0];
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const network = await provider.getNetwork();
    currentNetwork = network.name;
    updateNetworkStatus();

    initializeContract();

    updateWalletButton();
    addStatusMessage(`Wallet connected: ${shortAddress(connectedAccount)}`, "success");
  } catch (error) {
    addStatusMessage(`Connection failed: ${error.message}`, "error");
    console.error("Wallet connection error:", error);
  }
}

function initializeContract() {
  if (!signer || !CONTRACT_ADDRESS) {
    addStatusMessage(
      "Warning: Contract address not configured. Please add it to app.js",
      "warning"
    );
    return;
  }
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

// ==========  Kontrakto panaudojimas ==========

async function createEvent() {
  if (!checkConnection()) return;

  try {
    const eventName = document.getElementById("eventName").value.trim();
    const eventDateStr = document.getElementById("eventDate").value.trim();
    const ticketPriceStr = document.getElementById("ticketPrice").value.trim();
    const maxTicketsStr = document.getElementById("maxTickets").value.trim();

    if (!eventName || !eventDateStr || !ticketPriceStr || !maxTicketsStr) {
      addStatusMessage("Please fill in all fields.", "error");
      return;
    }

    const eventTimestamp = Number(eventDateStr);
    const nowSec = Math.floor(Date.now() / 1000);

    if (Number.isNaN(eventTimestamp) || eventTimestamp <= nowSec) {
      addStatusMessage("Event date must be a valid UNIX timestamp in the future.", "error");
      return;
    }

    if (Number(ticketPriceStr) <= 0) {
      addStatusMessage("Ticket price must be > 0.", "error");
      return;
    }

    if (Number(maxTicketsStr) <= 0) {
      addStatusMessage("Max tickets must be > 0.", "error");
      return;
    }

    addStatusMessage("Creating event... Transaction pending.", "pending");

    const tx = await contract.createEvent(
      eventName,
      eventDateStr,     
      ticketPriceStr,   
      maxTicketsStr 
    );

    addStatusMessage(`Transaction sent: ${tx.hash}`, "info");

    const receipt = await tx.wait();

    // Extract event ID from EventCreated event logs
    let eventId = null;
    if (receipt.logs && receipt.logs.length > 0) {
      try {
        const eventInterface = new ethers.utils.Interface(CONTRACT_ABI);
        for (const log of receipt.logs) {
          try {
            const parsed = eventInterface.parseLog(log);
            if (parsed.name === "EventCreated") {
              eventId = parsed.args.eventId.toString();
              break;
            }
          } catch (e) {
            continue;
          }
        }
      } catch (e) {
        console.error("Error parsing logs:", e);
      }
    }

    if (!eventId) {
      addStatusMessage("Error: Could not extract event ID from transaction. Check console.", "error");
      console.error("Receipt:", receipt);
      return;
    }

    addStatusMessage(`Event created! ID: ${eventId}`, "success");

    // Verify event was created
    addStatusMessage(`Verifying event ${eventId} exists...`, "pending");
    try {
      const eventData = await contract.eventsData(eventId);

      if (!eventData.organizer || eventData.organizer === "0x0000000000000000000000000000000000000000") {
        addStatusMessage(`Error: Event ${eventId} was not properly created on-chain.`, "error");
        return;
      }

      addStatusMessage(
        `✓ Event ${eventId} verified! Name: ${eventData.name}, Price: ${ethers.utils.formatEther(eventData.ticketPrice)} ETH`,
        "success"
      );

      const buyEventIdField = document.getElementById("eventId");
      if (buyEventIdField) {
        buyEventIdField.value = eventId;
        addStatusMessage(`Event ID ${eventId} auto-filled in purchase form. Ready to buy tickets!`, "info");
      }
    } catch (verifyError) {
      addStatusMessage(`Error verifying event: ${verifyError.message}`, "error");
      console.error("Verify error:", verifyError);
      return;
    }

    const form = document.getElementById("createEventForm");
    if (form) form.reset();
  } catch (error) {
    addStatusMessage(`Error: ${error.message}`, "error");
    console.error("Create event error:", error);
  }
}

async function buyPrimaryTicket() {
  if (!checkConnection()) return;

  try {
    const eventIdStr = document.getElementById("eventId").value.trim();

    if (!eventIdStr) {
      addStatusMessage("Please enter event ID.", "error");
      return;
    }

    addStatusMessage("Checking event status...", "pending");

    let eventData;
    try {
      eventData = await contract.eventsData(eventIdStr);
    } catch (error) {
      console.error("eventsData call error:", error);
      addStatusMessage(`RPC error while reading event: ${error.message || error}`, "error");
      return;
    }

    if (!eventData.organizer || eventData.organizer === "0x0000000000000000000000000000000000000000") {
      addStatusMessage(`Error: Event ID ${eventIdStr} does not exist in this contract.`, "error");
      return;
    }

    if (eventData.isCancelled) {
      addStatusMessage(`Error: Event ID ${eventIdStr} has been cancelled.`, "error");
      return;
    }

    const ticketPriceWei = eventData.ticketPrice;
    const priceEth = ethers.utils.formatEther(ticketPriceWei);

    addStatusMessage(`Buying primary ticket for ${priceEth} ETH... Transaction pending.`, "pending");

    const tx = await contract.buyPrimaryTicket(eventIdStr, {
      value: ticketPriceWei
    });

    addStatusMessage(`Transaction sent: ${tx.hash}`, "info");

    const receipt = await tx.wait();
    addStatusMessage(`Ticket purchased! Hash: ${receipt.transactionHash}`, "success");

    const form = document.getElementById("buyPrimaryForm");
    if (form) form.reset();
  } catch (error) {
    addStatusMessage(`Error: ${error.message}`, "error");
    console.error("Buy primary ticket error:", error);
  }
}

async function listTicketForResale() {
  if (!checkConnection()) return;

  try {
    const ticketIdStr = document.getElementById("resaleTicketId").value.trim();
    const resalePriceStr = document.getElementById("resalePrice").value.trim();

    if (!ticketIdStr || !resalePriceStr) {
      addStatusMessage("Please fill in all fields.", "error");
      return;
    }

    if (Number(resalePriceStr) <= 0) {
      addStatusMessage("Resale price must be > 0.", "error");
      return;
    }

    addStatusMessage("Listing ticket for resale... Transaction pending.", "pending");

    const tx = await contract.listTicketForResale(
      ticketIdStr,
      resalePriceStr
    );

    addStatusMessage(`Transaction sent: ${tx.hash}`, "info");

    const receipt = await tx.wait();
    addStatusMessage(`Ticket listed for resale! Hash: ${receipt.transactionHash}`, "success");

    const form = document.getElementById("listResaleForm");
    if (form) form.reset();
  } catch (error) {
    addStatusMessage(`Error: ${error.message}`, "error");
    console.error("List for resale error:", error);
  }
}

async function buyResaleTicket() {
  if (!checkConnection()) return;

  try {
    const ticketIdStr = document.getElementById("buyResaleTicketId").value.trim();

    if (!ticketIdStr) {
      addStatusMessage("Please enter a ticket ID.", "error");
      return;
    }

    addStatusMessage("Fetching ticket info...", "pending");

    let ticketData;
    try {
      ticketData = await contract.tickets(ticketIdStr);
    } catch (error) {
      addStatusMessage(`Error: Cannot fetch ticket ${ticketIdStr}. It may not exist.`, "error");
      console.error("GetTicket error:", error);
      return;
    }

    if (!ticketData.owner || ticketData.owner === "0x0000000000000000000000000000000000000000") {
      addStatusMessage(`Error: Ticket ID ${ticketIdStr} does not exist.`, "error");
      return;
    }

    if (ticketData.owner.toLowerCase() === connectedAccount.toLowerCase()) {
      addStatusMessage(`Error: You cannot buy your own ticket (ID ${ticketIdStr}).`, "error");
      return;
    }

    const statusNum = Number(ticketData.status);
    if (statusNum !== 2) { // ForSale
      addStatusMessage(
        `Error: Ticket ID ${ticketIdStr} is not for sale. Current status: ${STATUS_LABELS[statusNum] || "Unknown"}`,
        "error"
      );
      return;
    }

    const resalePrice = ticketData.resalePrice;
    if (!resalePrice || resalePrice.toString() === "0") {
      addStatusMessage(`Error: Ticket ID ${ticketIdStr} has no valid resale price set.`, "error");
      return;
    }

    const priceInEth = ethers.utils.formatEther(resalePrice);
    addStatusMessage(`Resale price: ${priceInEth} ETH. Preparing transaction...`, "info");

    try {
      const gasEstimate = await contract.estimateGas.buyResaleTicket(ticketIdStr, {
        value: resalePrice
      });
      addStatusMessage(`Gas estimate: ${gasEstimate.toString()}. Sending transaction...`, "info");
    } catch (gasError) {
      addStatusMessage(`Warning: Gas estimation failed. Trying transaction anyway...`, "warning");
      console.error("Gas estimation error:", gasError);
    }

    const tx = await contract.buyResaleTicket(ticketIdStr, {
      value: resalePrice,
      gasLimit: 300000
    });

    addStatusMessage(`Transaction sent: ${tx.hash}`, "info");

    const receipt = await tx.wait();
    addStatusMessage(`✅ Resale ticket purchased! Hash: ${receipt.transactionHash}`, "success");

    const form = document.getElementById("buyResaleForm");
    if (form) form.reset();
  } catch (error) {
    let errorMsg = error.message;
    if (error.data && error.data.message) {
      errorMsg = error.data.message;
    } else if (error.reason) {
      errorMsg = error.reason;
    } else if (error.error && error.error.message) {
      errorMsg = error.error.message;
    }

    addStatusMessage(`Error: ${errorMsg}`, "error");
    console.error("Buy resale ticket full error:", error);
  }
}

async function getTicketInfo() {
  if (!checkConnection()) return;

  try {
    const ticketIdStr = document.getElementById("ticketIdCheck").value.trim();

    if (!ticketIdStr) {
      addStatusMessage("Please enter a ticket ID.", "error");
      return;
    }

    addStatusMessage("Fetching ticket info...", "pending");

    const ticketData = await contract.tickets(ticketIdStr);

    if (!ticketData.owner || ticketData.owner === "0x0000000000000000000000000000000000000000") {
      addStatusMessage(`Error: Ticket ID ${ticketIdStr} does not exist. Buy a primary ticket first to create tickets.`, "error");
      return;
    }

    displayTicketInfo(ticketData);
    addStatusMessage("Ticket info retrieved successfully.", "success");
  } catch (error) {
    addStatusMessage(`Error: ${error.message}`, "error");
    console.error("Get ticket info error:", error);
  }
}

async function validateTicket() {
  if (!checkConnection()) return;

  try {
    const ticketIdStr = document.getElementById("ticketIdCheck").value.trim();

    if (!ticketIdStr) {
      addStatusMessage("Please enter a ticket ID.", "error");
      return;
    }

    addStatusMessage("Validating ticket...", "pending");

    const tx = await contract.validateTicket(ticketIdStr);

    addStatusMessage(`Validation tx sent: ${tx.hash}`, "info");

    const receipt = await tx.wait();
    addStatusMessage("✓ Ticket validated on-chain.", "success");
  } catch (error) {
    addStatusMessage(`Error: ${error.message}`, "error");
    console.error("Validate ticket error:", error);
  }
}

// ========== UI HELPERS ==========
function displayTicketInfo(ticketData) {
  const display = document.getElementById("ticketInfoDisplay");

  const eventId = ticketData.eventId ? ticketData.eventId.toString() : "-";
  const owner = ticketData.owner || "-";
  const statusIndex =
    ticketData.status !== undefined ? Number(ticketData.status) : null;
  const status =
    statusIndex !== null && statusIndex !== undefined
      ? STATUS_LABELS[statusIndex] || "Unknown"
      : "-";
  const resalePriceEth = ticketData.resalePrice
    ? ethers.utils.formatEther(ticketData.resalePrice) + " ETH"
    : "-";

  document.getElementById("ticketEventId").textContent = eventId;
  document.getElementById("ticketOwner").textContent = owner;
  document.getElementById("ticketStatus").textContent = status;
  document.getElementById("ticketResalePrice").textContent = resalePriceEth;

  if (display) display.style.display = "block";
}

function checkConnection() {
  if (!connectedAccount) {
    addStatusMessage("Please connect your wallet first.", "error");
    return false;
  }
  if (!contract) {
    addStatusMessage("Contract not initialized. Check console for details.", "error");
    return false;
  }
  return true;
}

function shortAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// ========== STATUS MESSAGES ==========
function addStatusMessage(message, type = "info") {
  const statusLog = document.getElementById("statusLog");
  if (!statusLog) return;

  const messageEl = document.createElement("p");
  messageEl.className = `status-message ${type}`;

  const time = new Date().toLocaleTimeString();
  const timeEl = document.createElement("small");
  timeEl.style.display = "block";
  timeEl.style.opacity = "0.7";
  timeEl.textContent = time;

  messageEl.appendChild(timeEl);
  messageEl.appendChild(document.createTextNode(message));

  statusLog.appendChild(messageEl);
  statusLog.scrollTop = statusLog.scrollHeight;
}

function clearStatus() {
  const statusLog = document.getElementById("statusLog");
  if (statusLog) {
    statusLog.innerHTML = '<p class="status-message info">Status log cleared.</p>';
  }
}

// OPTIONAL DEBUG HELPER (galėsi pasikviesti iš console: debugCheck())
async function debugCheck() {
  try {
    if (!provider) {
      console.log("No provider in dApp");
      addStatusMessage("debugCheck: no provider", "error");
      return;
    }
    if (!contract) {
      console.log("No contract in dApp");
      addStatusMessage("debugCheck: contract not initialized", "error");
      return;
    }

    console.log("=== DEBUG START ===");
    console.log("Front-end CONTRACT_ADDRESS:", CONTRACT_ADDRESS);

    const net = await provider.getNetwork();
    console.log("Front-end network:", net);

    const nextEv = await contract.nextEventId();
    console.log("Front-end nextEventId():", nextEv.toString());

    const ev1 = await contract.eventsData(1);
    console.log("Front-end eventsData(1):", ev1);

    addStatusMessage("debugCheck complete. Look at browser console (F12).", "info");
  } catch (e) {
    console.error("debugCheck error:", e);
    addStatusMessage("debugCheck error: " + (e.message || e), "error");
  }
}

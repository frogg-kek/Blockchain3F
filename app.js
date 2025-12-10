// ========================================
// NFT TICKET ESCROW dApp - JavaScript
// Interact with smart contract via MetaMask
// ========================================

// ========== CONTRACT CONFIGURATION ==========
const CONTRACT_ADDRESS = "0x02788Ea16deE4fBbC08040A5cd3E5108A96Ba8f2";

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
    "inputs": [
      { "internalType": "uint256", "name": "newBps", "type": "uint256" }
    ],
    "name": "setPlatformFeeBps",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
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
      { "internalType": "enum NftTicketEscrow.TicketStatus", "name": "status", "type": "uint8" }
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
      { "internalType": "enum NftTicketEscrow.TicketStatus", "name": "status", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ========== GLOBAL STATE ==========
let connectedAccount = null;
let provider = null;
let signer = null;
let contract = null;
let currentNetwork = null;

const STATUS_LABELS = {
  0: "None",
  1: "Active",
  2: "For Sale",
  3: "Used",
  4: "Expired"
};

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", async () => {
  await initializeApp();
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

// ========== WALLET CONNECTION ==========
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

// ========== CONTRACT INTERACTIONS ==========
async function createEvent() {
  if (!checkConnection()) return;

  try {
    const eventName = document.getElementById("eventName").value.trim();
    const eventDate = document.getElementById("eventDate").value.trim();
    const ticketPrice = document.getElementById("ticketPrice").value.trim();
    const maxTickets = document.getElementById("maxTickets").value.trim();

    if (!eventName || !eventDate || !ticketPrice || !maxTickets) {
      addStatusMessage("Please fill in all fields.", "error");
      return;
    }

    addStatusMessage("Creating event... Transaction pending.", "pending");

    const tx = await contract.createEvent(
      eventName,
      eventDate,
      ticketPrice,
      maxTickets
    );

    addStatusMessage(`Transaction sent: ${tx.hash}`, "info");

    const receipt = await tx.wait();

	
    
    addStatusMessage(`Event created! Transaction hash: ${receipt.hash}`, "success");

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
    const eventId = document.getElementById("eventId").value;
    const price = document.getElementById("primaryPrice").value;

    if (!eventId || !price) {
      addStatusMessage("Please fill in all fields.", "error");
      return;
    }

    addStatusMessage("Buying primary ticket... Transaction pending.", "pending");

    const tx = await contract.buyPrimaryTicket(BigInt(eventId), {
      value: BigInt(price)
    });

    addStatusMessage(`Transaction sent: ${tx.hash}`, "info");

    const receipt = await tx.wait();
    addStatusMessage(`Ticket purchased! Hash: ${receipt.hash}`, "success");

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
    const ticketId = document.getElementById("resaleTicketId").value;
    const resalePrice = document.getElementById("resalePrice").value;

    if (!ticketId || !resalePrice) {
      addStatusMessage("Please fill in all fields.", "error");
      return;
    }

    addStatusMessage("Listing ticket for resale... Transaction pending.", "pending");

    const tx = await contract.listTicketForResale(
      BigInt(ticketId),
      BigInt(resalePrice)
    );

    addStatusMessage(`Transaction sent: ${tx.hash}`, "info");

    const receipt = await tx.wait();
    addStatusMessage(`Ticket listed for resale! Hash: ${receipt.hash}`, "success");

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
    const ticketId = document.getElementById("buyResaleTicketId").value;

    if (!ticketId) {
      addStatusMessage("Please enter a ticket ID.", "error");
      return;
    }

    addStatusMessage("Fetching ticket info...", "pending");

    // Get ticket info
    let ticketData;
    try {
      ticketData = await contract.tickets(ticketId);
    } catch (error) {
      addStatusMessage(`Error: Cannot fetch ticket ${ticketId}. It may not exist.`, "error");
      console.error("GetTicket error:", error);
      return;
    }
    
    // Check if ticket exists (owner is not zero address)
    if (!ticketData.owner || ticketData.owner === "0x0000000000000000000000000000000000000000") {
      addStatusMessage(`Error: Ticket ID ${ticketId} does not exist. Please check the ticket ID and try again.`, "error");
      return;
    }

    // Check if it's your own ticket
    if (ticketData.owner.toLowerCase() === connectedAccount.toLowerCase()) {
      addStatusMessage(`Error: You cannot buy your own ticket (ID ${ticketId}).`, "error");
      return;
    }

    // Check ticket status (2 = ForSale)
    const statusNum = Number(ticketData.status);
    if (statusNum !== 2) {
      const statusNames = {0: "None", 1: "Active", 2: "ForSale", 3: "PendingTransfer", 4: "Used", 5: "Refunded"};
      addStatusMessage(`Error: Ticket ID ${ticketId} is not for sale. Current status: ${statusNames[statusNum] || "Unknown"}`, "error");
      return;
    }

    const resalePrice = ticketData.resalePrice;

    if (!resalePrice || resalePrice.toString() === "0") {
      addStatusMessage(`Error: Ticket ID ${ticketId} has no valid resale price set.`, "error");
      return;
    }

    const priceInEth = ethers.utils.formatEther(resalePrice);
    addStatusMessage(`Resale price: ${priceInEth} ETH. Preparing transaction...`, "info");

    // Try to estimate gas first
    try {
      const gasEstimate = await contract.estimateGas.buyResaleTicket(BigInt(ticketId), {
        value: resalePrice
      });
      addStatusMessage(`Gas estimate: ${gasEstimate.toString()}. Sending transaction...`, "info");
    } catch (gasError) {
      addStatusMessage(`Warning: Gas estimation failed. Trying transaction anyway...`, "warning");
      console.error("Gas estimation error:", gasError);
    }

    // Send transaction with manual gas limit if estimation fails
    const tx = await contract.buyResaleTicket(BigInt(ticketId), {
      value: resalePrice,
      gasLimit: 300000 // Manual gas limit as fallback
    });

    addStatusMessage(`Transaction sent: ${tx.hash}`, "info");

    const receipt = await tx.wait();
    addStatusMessage(`✅ Resale ticket purchased! Hash: ${receipt.transactionHash}`, "success");

    const form = document.getElementById("buyResaleForm");
    if (form) form.reset();
  } catch (error) {
    // Better error parsing
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
    const ticketId = document.getElementById("ticketIdCheck").value;

    if (!ticketId) {
      addStatusMessage("Please enter a ticket ID.", "error");
      return;
    }

    addStatusMessage("Fetching ticket info...", "pending");

    const ticketData = await contract.tickets(BigInt(ticketId));

    // Check if ticket exists
    if (!ticketData.owner || ticketData.owner === "0x0000000000000000000000000000000000000000") {
      addStatusMessage(`Error: Ticket ID ${ticketId} does not exist. Buy a primary ticket first to create tickets.`, "error");
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
    const ticketId = document.getElementById("ticketIdCheck").value;

    if (!ticketId) {
      addStatusMessage("Please enter a ticket ID.", "error");
      return;
    }

    addStatusMessage("Validating ticket...", "pending");

    const tx = await contract.validateTicket(BigInt(ticketId));

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
  const resalePrice = ticketData.resalePrice
    ? ticketData.resalePrice.toString()
    : "-";

  document.getElementById("ticketEventId").textContent = eventId;
  document.getElementById("ticketOwner").textContent = owner;
  document.getElementById("ticketStatus").textContent = status;
  document.getElementById("ticketResalePrice").textContent = resalePrice;

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

// ========== EVENT LISTENERS ==========
const connectBtn = document.getElementById("connectWalletBtn");
if (connectBtn) {
  connectBtn.addEventListener("click", connectWallet);
}

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => e.preventDefault());
});

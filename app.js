// ========================================
// NFT TICKET ESCROW dApp - JavaScript
// Interact with smart contract via MetaMask
// ========================================

// Check if ethers is loaded
if (typeof ethers === 'undefined') {
    console.error('ethers.js library not loaded! Make sure the CDN script is loaded before app.js');
}

// ========== CONTRACT CONFIGURATION ==========
// IMPORTANT: Replace these with your actual contract details
const CONTRACT_ADDRESS = "0x52ff2612FFCa9932c41887bEDB073361983762A6";
const CONTRACT_ABI = [
    [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			}
		],
		"name": "buyPrimaryTicket",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
		],
		"name": "buyResaleTicket",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			}
		],
		"name": "cancelEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ticketPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxTickets",
				"type": "uint256"
			}
		],
		"name": "createEvent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "resalePrice",
				"type": "uint256"
			}
		],
		"name": "listTicketForResale",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
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
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			}
		],
		"name": "EventCancelled",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "organizer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ticketPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "maxTickets",
				"type": "uint256"
			}
		],
		"name": "EventCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "oldBps",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newBps",
				"type": "uint256"
			}
		],
		"name": "PlatformFeeUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "PrimaryTicketPurchased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RefundIssued",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "fee",
				"type": "uint256"
			}
		],
		"name": "ResaleCompleted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "newBps",
				"type": "uint256"
			}
		],
		"name": "setPlatformFeeBps",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "resalePrice",
				"type": "uint256"
			}
		],
		"name": "TicketListedForResale",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
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
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
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
			{
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			}
		],
		"name": "eventExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "eventsData",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "organizer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ticketPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxTickets",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "soldTickets",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isCancelled",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketId",
				"type": "uint256"
			}
		],
		"name": "getTicket",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "resalePrice",
				"type": "uint256"
			},
			{
				"internalType": "enum NftTicketEscrow.TicketStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextEventId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextTicketId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "platformAdmin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "platformFeeBps",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tickets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "eventId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "resalePrice",
				"type": "uint256"
			},
			{
				"internalType": "enum NftTicketEscrow.TicketStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
];

// ========== GLOBAL STATE ==========
let connectedAccount = null;
let provider = null;
let signer = null;
let contract = null;
let currentNetwork = null;

// Status labels mapping
const STATUS_LABELS = {
    0: "None",
    1: "Active",
    2: "For Sale",
    3: "Used",
    4: "Expired"
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
});

/**
 * Initialize the dApp on page load
 */
async function initializeApp() {
    // Check if MetaMask is available
    if (typeof window.ethereum === 'undefined') {
        showWarningBanner();
        addStatusMessage('Error: MetaMask not detected. Please install MetaMask.', 'error');
        return;
    }

    addStatusMessage('MetaMask detected. Ready to connect wallet.', 'info');

    // Try to detect current network
    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        currentNetwork = network.name;
        updateNetworkStatus();
    } catch (error) {
        console.error('Error initializing provider:', error);
    }

    // Listen for account changes
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', () => location.reload());
}

/**
 * Show warning banner if MetaMask is not available
 */
function showWarningBanner() {
    const banner = document.getElementById('metamaskWarning');
    banner.style.display = 'block';
}

/**
 * Handle account changes from MetaMask
 */
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        connectedAccount = null;
        updateWalletButton();
        addStatusMessage('Wallet disconnected.', 'warning');
    } else if (accounts[0] !== connectedAccount) {
        connectedAccount = accounts[0];
        updateWalletButton();
        addStatusMessage(`Account switched to ${shortAddress(connectedAccount)}`, 'info');
    }
}

/**
 * Update network status display
 */
function updateNetworkStatus() {
    const statusDiv = document.getElementById('networkStatus');
    if (currentNetwork) {
        statusDiv.textContent = `Network: ${currentNetwork}`;
    }
}

/**
 * Update wallet button text based on connection state
 */
function updateWalletButton() {
    const btn = document.getElementById('connectWalletBtn');
    if (connectedAccount) {
        btn.textContent = shortAddress(connectedAccount);
        btn.style.background = 'var(--secondary-color)';
    } else {
        btn.textContent = 'Connect Wallet';
        btn.style.background = '';
    }
}

// ========== WALLET CONNECTION ==========
/**
 * Connect wallet to MetaMask
 */
async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            addStatusMessage('MetaMask not installed. Please install it to continue.', 'error');
            return;
        }

        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        connectedAccount = accounts[0];
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = await provider.getSigner();

        // Get network info
        const network = await provider.getNetwork();
        currentNetwork = network.name;
        updateNetworkStatus();

        // Initialize contract instance
        initializeContract();

        updateWalletButton();
        addStatusMessage(`Wallet connected: ${shortAddress(connectedAccount)}`, 'success');
    } catch (error) {
        addStatusMessage(`Connection failed: ${error.message}`, 'error');
        console.error('Wallet connection error:', error);
    }
}

/**
 * Initialize contract instance
 */
function initializeContract() {
    if (!signer || CONTRACT_ADDRESS === "PASTE_CONTRACT_ADDRESS_HERE") {
        addStatusMessage('Warning: Contract address not configured. Please add it to app.js', 'warning');
        return;
    }
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

// ========== CONTRACT INTERACTIONS ==========

/**
 * Create a new event
 */
async function createEvent() {
    if (!checkConnection()) return;

    try {
        const eventName = document.getElementById('eventName').value;
        const eventDate = document.getElementById('eventDate').value;
        const ticketPrice = document.getElementById('ticketPrice').value;
        const maxTickets = document.getElementById('maxTickets').value;

        // Validation
        if (!eventName || !eventDate || !ticketPrice || !maxTickets) {
            addStatusMessage('Please fill in all fields.', 'error');
            return;
        }

        addStatusMessage('Creating event... Transaction pending.', 'pending');

        // Call contract function
        // Note: Adjust the function name and parameters to match your contract
        const tx = await contract.createEvent(
            eventName,
            BigInt(eventDate),
            BigInt(ticketPrice),
            BigInt(maxTickets)
        );

        addStatusMessage(`Transaction sent: ${tx.hash}`, 'info');

        // Wait for confirmation
        const receipt = await tx.wait();
        addStatusMessage(`Event created! Transaction hash: ${receipt.hash}`, 'success');

        // Clear form
        document.getElementById('createEventForm').reset();
    } catch (error) {
        addStatusMessage(`Error: ${error.message}`, 'error');
        console.error('Create event error:', error);
    }
}

/**
 * Buy a primary ticket
 */
async function buyPrimaryTicket() {
    if (!checkConnection()) return;

    try {
        const eventId = document.getElementById('eventId').value;
        const price = document.getElementById('primaryPrice').value;

        if (!eventId || !price) {
            addStatusMessage('Please fill in all fields.', 'error');
            return;
        }

        addStatusMessage('Buying primary ticket... Transaction pending.', 'pending');

        // Call contract function with payment
        // Note: Adjust to match your contract's function signature
        const tx = await contract.buyPrimaryTicket(
            BigInt(eventId),
            {
                value: BigInt(price)
            }
        );

        addStatusMessage(`Transaction sent: ${tx.hash}`, 'info');

        const receipt = await tx.wait();
        addStatusMessage(`Ticket purchased! Hash: ${receipt.hash}`, 'success');

        document.getElementById('buyPrimaryForm').reset();
    } catch (error) {
        addStatusMessage(`Error: ${error.message}`, 'error');
        console.error('Buy primary ticket error:', error);
    }
}

/**
 * List a ticket for resale
 */
async function listTicketForResale() {
    if (!checkConnection()) return;

    try {
        const ticketId = document.getElementById('resaleTicketId').value;
        const resalePrice = document.getElementById('resalePrice').value;

        if (!ticketId || !resalePrice) {
            addStatusMessage('Please fill in all fields.', 'error');
            return;
        }

        addStatusMessage('Listing ticket for resale... Transaction pending.', 'pending');

        // Call contract function
        // Note: Adjust to match your contract's function
        const tx = await contract.listForResale(
            BigInt(ticketId),
            BigInt(resalePrice)
        );

        addStatusMessage(`Transaction sent: ${tx.hash}`, 'info');

        const receipt = await tx.wait();
        addStatusMessage(`Ticket listed for resale! Hash: ${receipt.hash}`, 'success');

        document.getElementById('listResaleForm').reset();
    } catch (error) {
        addStatusMessage(`Error: ${error.message}`, 'error');
        console.error('List for resale error:', error);
    }
}

/**
 * Buy a ticket from resale
 */
async function buyResaleTicket() {
    if (!checkConnection()) return;

    try {
        const ticketId = document.getElementById('buyResaleTicketId').value;

        if (!ticketId) {
            addStatusMessage('Please enter a ticket ID.', 'error');
            return;
        }

        addStatusMessage('Fetching resale price... ', 'pending');

        // First, get the ticket info to know the resale price
        const ticketData = await contract.getTicket(BigInt(ticketId));
        const resalePrice = ticketData.resalePrice;

        addStatusMessage('Buying resale ticket... Transaction pending.', 'pending');

        // Call contract function with payment
        // Note: Adjust to match your contract's function
        const tx = await contract.buyResaleTicket(
            BigInt(ticketId),
            {
                value: resalePrice
            }
        );

        addStatusMessage(`Transaction sent: ${tx.hash}`, 'info');

        const receipt = await tx.wait();
        addStatusMessage(`Resale ticket purchased! Hash: ${receipt.hash}`, 'success');

        document.getElementById('buyResaleForm').reset();
    } catch (error) {
        addStatusMessage(`Error: ${error.message}`, 'error');
        console.error('Buy resale ticket error:', error);
    }
}

/**
 * Get ticket information (read-only)
 */
async function getTicketInfo() {
    if (!checkConnection()) return;

    try {
        const ticketId = document.getElementById('ticketIdCheck').value;

        if (!ticketId) {
            addStatusMessage('Please enter a ticket ID.', 'error');
            return;
        }

        addStatusMessage('Fetching ticket info...', 'pending');

        // Call read-only contract function
        // Note: Adjust to match your contract's function
        const ticketData = await contract.getTicket(BigInt(ticketId));

        // Display ticket information
        displayTicketInfo(ticketData);

        addStatusMessage('Ticket info retrieved successfully.', 'success');
    } catch (error) {
        addStatusMessage(`Error: ${error.message}`, 'error');
        console.error('Get ticket info error:', error);
    }
}

/**
 * Validate a ticket
 */
async function validateTicket() {
    if (!checkConnection()) return;

    try {
        const ticketId = document.getElementById('ticketIdCheck').value;

        if (!ticketId) {
            addStatusMessage('Please enter a ticket ID.', 'error');
            return;
        }

        addStatusMessage('Validating ticket...', 'pending');

        // Call contract validation function
        // Note: Adjust to match your contract's function
        const isValid = await contract.validateTicket(BigInt(ticketId));

        if (isValid) {
            addStatusMessage('✓ Ticket is valid and can be used for access.', 'success');
        } else {
            addStatusMessage('✗ Ticket is invalid. It may have been used or expired.', 'error');
        }
    } catch (error) {
        addStatusMessage(`Error: ${error.message}`, 'error');
        console.error('Validate ticket error:', error);
    }
}

// ========== UI HELPERS ==========

/**
 * Display ticket information in the UI
 */
function displayTicketInfo(ticketData) {
    // Assuming ticketData has: eventId, owner, status, resalePrice
    const display = document.getElementById('ticketInfoDisplay');

    // Extract data (adjust field names to match your contract's returned object)
    const eventId = ticketData.eventId ? ticketData.eventId.toString() : '-';
    const owner = ticketData.owner || '-';
    const status = ticketData.status ? STATUS_LABELS[ticketData.status] || 'Unknown' : '-';
    const resalePrice = ticketData.resalePrice ? ticketData.resalePrice.toString() : '-';

    // Update display elements
    document.getElementById('ticketEventId').textContent = eventId;
    document.getElementById('ticketOwner').textContent = owner;
    document.getElementById('ticketStatus').textContent = status;
    document.getElementById('ticketResalePrice').textContent = resalePrice;

    display.style.display = 'block';
}

/**
 * Check if wallet is connected
 */
function checkConnection() {
    if (!connectedAccount) {
        addStatusMessage('Please connect your wallet first.', 'error');
        return false;
    }
    if (!contract) {
        addStatusMessage('Contract not initialized. Check console for details.', 'error');
        return false;
    }
    return true;
}

/**
 * Shorten wallet address for display (0x1234...abcd)
 */
function shortAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// ========== STATUS MESSAGES ==========

/**
 * Add a message to the status log
 * @param {string} message - The message to display
 * @param {string} type - Message type: 'info', 'success', 'error', 'warning', 'pending'
 */
function addStatusMessage(message, type = 'info') {
    const statusLog = document.getElementById('statusLog');

    // Create message element
    const messageEl = document.createElement('p');
    messageEl.className = `status-message ${type}`;

    // Add timestamp
    const time = new Date().toLocaleTimeString();
    const timeEl = document.createElement('small');
    timeEl.style.display = 'block';
    timeEl.style.opacity = '0.7';
    timeEl.textContent = time;

    messageEl.appendChild(timeEl);
    messageEl.appendChild(document.createTextNode(message));

    statusLog.appendChild(messageEl);

    // Auto-scroll to bottom
    statusLog.scrollTop = statusLog.scrollHeight;
}

/**
 * Clear the status log
 */
function clearStatus() {
    const statusLog = document.getElementById('statusLog');
    statusLog.innerHTML = '<p class="status-message info">Status log cleared.</p>';
}

// ========== EVENT LISTENERS ==========

document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);

// Prevent form submissions (we handle buttons manually)
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => e.preventDefault());
});

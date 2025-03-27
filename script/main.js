// Currency Converter
let exchangeRates = {};
const CURRENCY_API = 'https://api.exchangerate-api.com/v4/latest/USD';

async function fetchExchangeRates() {
    try {
        const response = await fetch(CURRENCY_API);
        const data = await response.json();
        exchangeRates = data.rates;
        updateCurrencyConverter();
    } catch (error) {
        document.querySelector('.converter-result').textContent = 
            'Failed to fetch rates. Using offline data.';
        exchangeRates = { USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110.0 }; // Fallback
    }
}

function convertCurrency() {
    const amount = parseFloat(document.querySelector('.currency-amount').value);
    const from = document.querySelector('.currency-from').value;
    const to = document.querySelector('.currency-to').value;
    
    if (!amount || !exchangeRates[from] || !exchangeRates[to]) return;
    
    const result = (amount / exchangeRates[from]) * exchangeRates[to];
    document.querySelector('.converter-result').textContent = 
        `${amount.toFixed(2)} ${from} = ${result.toFixed(2)} ${to}`;
}

// Unit Converter
const unitConversions = {
    length: {
        cm: 1,
        m: 100,
        km: 100000,
        in: 2.54
    }
};

function convertUnits() {
    const amount = parseFloat(document.querySelector('.unit-amount').value);
    const from = document.querySelector('.unit-from').value;
    const to = document.querySelector('.unit-to').value;
    
    if (!amount) return;
    
    const result = amount * unitConversions.length[from] / unitConversions.length[to];
    document.querySelector('.unit-result').textContent = 
        `${amount} ${from} = ${result.toFixed(2)} ${to}`;
}

// History Feature
let calculationHistory = [];

function addToHistory(calculation) {
    calculationHistory.unshift(calculation);
    if (calculationHistory.length > 10) calculationHistory.pop();
    updateHistoryPanel();
}

function updateHistoryPanel() {
    const historyPanel = document.querySelector('.history-panel');
    historyPanel.innerHTML = calculationHistory
        .map(entry => `<div class="history-entry">${entry}</div>`)
        .join('');
}

// Theme Switcher
function setTheme(theme) {
    document.body.className = theme;
    localStorage.setItem('calculatorTheme', theme);
}

// Mode Switcher
function switchMode(mode) {
    document.querySelectorAll('.active-mode').forEach(el => el.classList.remove('active-mode'));
    document.getElementById(mode).classList.add('active-mode');
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Theme initialization
    const savedTheme = localStorage.getItem('calculatorTheme') || 'dark';
    setTheme(savedTheme);

    // Event Listeners for new features
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });

    document.querySelectorAll('.currency-amount, .currency-from, .currency-to').forEach(el => {
        el.addEventListener('input', convertCurrency);
    });

    document.querySelectorAll('.unit-amount, .unit-from, .unit-to').forEach(el => {
        el.addEventListener('input', convertUnits);
    });

    fetchExchangeRates();
});

// Modified calculate function to include history
function calculate() {
    // ... previous calculate code ...
    if (computation !== undefined) {
        const historyEntry = `${previousOperand} ${operationSymbol} ${currentOperand} = ${currentOperand}`;
        addToHistory(historyEntry);
    }
}


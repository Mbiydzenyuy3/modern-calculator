let currentOperand = "0";
let previousOperand = "";
let operation = undefined;
let newNumber = true;

const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".button");
const clearButton = document.querySelector('[data-action="clear"]');

function updateDisplay() {
  let displayValue = currentOperand;

  if (displayValue.length > 10) {
    displayValue = parseFloat(displayValue).toExponential(5);
  }

  if (displayValue === "Error") {
    display.style.fontSize = "40px";
  } else {
    const fontSize =
      displayValue.length > 10 ? 80 - (displayValue.length - 7) * 4 : 80;
    display.style.fontSize = `${fontSize}px`;
  }

  display.textContent = displayValue;
}

function handleNumber(number) {
  if (newNumber) {
    currentOperand = number === "." ? "0." : number;
    newNumber = false;
  } else {
    if (number === "." && currentOperand.includes(".")) return;
    currentOperand += number;
  }

  if (currentOperand !== "0." && !currentOperand.startsWith("0.")) {
    currentOperand = currentOperand.replace(/^0+/, "");
  }

  updateDisplay();
}

function clearCalculator() {
  currentOperand = "0";
  previousOperand = "";
  operation = undefined;
  newNumber = true;
  clearButton.textContent = "AC";
  updateDisplay();
}

function toggleSign() {
  currentOperand = (parseFloat(currentOperand) * -1).toString();
  updateDisplay();
}

function convertToPercent() {
  currentOperand = (parseFloat(currentOperand) / 100).toString();
  updateDisplay();
}

function setOperation(newOperation) {
  if (operation && !newNumber) calculate();
  operation = newOperation;
  previousOperand = currentOperand;
  newNumber = true;
  clearButton.textContent = "C";
}

function calculate() {
  let computation;
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev)) return;

  switch (operation) {
    case "add":
      computation = prev + current;
      break;
    case "subtract":
      computation = prev - current;
      break;
    case "multiply":
      computation = prev * current;
      break;
    case "divide":
      if (current === 0) {
        currentOperand = "Error";
        clearCalculator();
        return;
      }
      computation = prev / current;
      break;
  }

  currentOperand = computation.toString();
  operation = undefined;
  previousOperand = "";
  newNumber = true;
  updateDisplay();
}

// Event Listeners
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const number = button.dataset.number;

    if (number) handleNumber(number);
    if (action) {
      switch (action) {
        case "clear":
          clearCalculator();
          break;
        case "sign":
          toggleSign();
          break;
        case "percent":
          convertToPercent();
          break;
        case "calculate":
          calculate();
          break;
        default:
          setOperation(action);
      }
    }
  });
});

// Theme Switcher
function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("calculatorTheme", theme);
}

// Mode Switcher
function switchMode(mode) {
  document
    .querySelectorAll(".active-mode")
    .forEach((el) => el.classList.remove("active-mode"));
  document.getElementById(mode).classList.add("active-mode");
  document
    .querySelectorAll(".mode-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Theme initialization
  const savedTheme = localStorage.getItem("calculatorTheme") || "dark";
  setTheme(savedTheme);

  // Event Listeners for new features
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchMode(btn.dataset.mode));
  });

  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => setTheme(btn.dataset.theme));
  });

  document
    .querySelectorAll(".currency-amount, .currency-from, .currency-to")
    .forEach((el) => {
      el.addEventListener("input", convertCurrency);
    });

  fetchExchangeRates();
});

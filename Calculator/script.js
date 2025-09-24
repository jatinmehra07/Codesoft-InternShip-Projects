const display = document.getElementById('display');
const buttons = document.querySelectorAll('.button');

let currentInput = '0';
let operator = null;
let previousInput = '';
let shouldResetDisplay = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function handleNumber(number) {
    if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    if (operator && !shouldResetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operator = nextOperator;
    shouldResetDisplay = true;
}

function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case 'x':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        default:
            return;
    }
    currentInput = result.toString();
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function clearCalculator() {
    currentInput = '0';
    operator = null;
    previousInput = '';
    shouldResetDisplay = false;
    updateDisplay();
}

function handleDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function handleBackspace() {
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        const target = e.target;
        const action = target.dataset.action;

        if (target.classList.contains('number')) {
            handleNumber(target.textContent);
        } else if (target.classList.contains('operator')) {
            handleOperator(target.textContent);
        } else if (action === 'calculate') {
            calculate();
        } else if (action === 'clear') {
            clearCalculator();
        } else if (action === 'decimal') {
            handleDecimal();
        } else if (action === 'backspace') {
            handleBackspace();
        }
    });
});

// Initial display update
updateDisplay();
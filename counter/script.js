// ============================================================
// DEMONSTRATION 1: HOISTING
// Function is called BEFORE it's defined
// This works because of HOISTING!
// ============================================================

// This function is called before it's defined (hoisting works!)
const counter = createCounter();

// ============================================================
// DEMONSTRATION 2: SCOPE & CLOSURE
// The count variable is inside this function (SCOPE)
// Inner functions form a CLOSURE to access it
// ============================================================

function createCounter() {
    // This variable is ONLY accessible inside this function (SCOPE)
    // It's NOT accessible from outside!
    let count = 0; // PRIVATE variable (closure)

    // These inner functions form a CLOSURE
    // They "remember" the count variable even after createCounter() returns
    return {
        increment: function () {
            count++;
            updateDisplay(count);
            return count;
        },
        decrement: function () {
            count--;
            updateDisplay(count);
            return count;
        },
        reset: function () {
            count = 0;
            updateDisplay(count);
            return count;
        },
        getCount: function () {
            return count;
        }
    };
}

// ============================================================
// DEMONSTRATION 3: HOISTING (var)
// var variables are hoisted but initialized as undefined
// ============================================================

// This works because var is hoisted (but value is undefined until assigned)
console.log("Hoisting demo: message before declaration =", message); // undefined (not error!)
var message = "This variable was hoisted!";
console.log("Hoisting demo: message after declaration =", message);

// ============================================================
// DOM MANIPULATION
// ============================================================

const display = document.getElementById('counterDisplay');
const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');
const resetBtn = document.getElementById('resetBtn');

function updateDisplay(value) {
    display.textContent = value;
}

// ============================================================
// EVENT HANDLING
// ============================================================

increaseBtn.addEventListener('click', function () {
    counter.increment();
});

decreaseBtn.addEventListener('click', function () {
    counter.decrement();
});

resetBtn.addEventListener('click', function () {
    counter.reset();
});

// ============================================================
// KEYBOARD SUPPORT
// ============================================================

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' || e.key === '+' || e.key === '=') {
        counter.increment();
        e.preventDefault();
    } else if (e.key === 'ArrowDown' || e.key === '-') {
        counter.decrement();
        e.preventDefault();
    } else if (e.key === 'r' || e.key === 'R') {
        counter.reset();
        e.preventDefault();
    }
});

// ============================================================
// CONSOLE HELP
// ============================================================

console.log('✅ Counter app loaded!');
console.log('💡 Try typing these in the console:');
console.log('   counter.increment()  → Increase count');
console.log('   counter.decrement()  → Decrease count');
console.log('   counter.reset()      → Reset to zero');
console.log('   counter.getCount()   → See current count');
console.log('💡 Keyboard shortcuts: ↑ = increase, ↓ = decrease, R = reset');
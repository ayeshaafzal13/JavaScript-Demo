// ============================================================
// DATA - Famous Quotes
// ============================================================

const quotesData = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Well done is better than well said.", author: "Benjamin Franklin" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" }
];

// ============================================================
// STATE
// ============================================================

let currentQuote = null;
let favorites = [];
let totalQuotesLoaded = 0;

// ============================================================
// DOM REFERENCES
// ============================================================

const loadingEl = document.getElementById('loading');
const quoteContent = document.getElementById('quoteContent');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const copyBtn = document.getElementById('copyBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const favoritesSection = document.getElementById('favoritesSection');
const favoritesList = document.getElementById('favoritesList');
const totalQuotesEl = document.getElementById('totalQuotes');
const favoriteCountEl = document.getElementById('favoriteCount');

// ============================================================
// LOAD FAVORITES FROM LOCAL STORAGE
// ============================================================

function loadFavorites() {
    try {
        const saved = localStorage.getItem('favoriteQuotes');
        if (saved) {
            favorites = JSON.parse(saved);
        }
    } catch (e) {
        favorites = [];
    }
    updateFavoritesDisplay();
}

// ============================================================
// SAVE FAVORITES TO LOCAL STORAGE
// ============================================================

function saveFavorites() {
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    updateFavoritesDisplay();
}

// ============================================================
// PROMISE DEMO - Loading a random quote
// ============================================================

function getRandomQuote() {
    return new Promise(function(resolve, reject) {
        // Simulate API delay
        setTimeout(function() {
            try {
                if (quotesData && quotesData.length > 0) {
                    var randomIndex = Math.floor(Math.random() * quotesData.length);
                    var quote = quotesData[randomIndex];
                    resolve(quote);
                } else {
                    reject(new Error('No quotes available!'));
                }
            } catch (error) {
                reject(error);
            }
        }, 800); // 0.8 second delay
    });
}

// ============================================================
// ASYNC/AWAIT - Get and display quote
// ============================================================

async function displayRandomQuote() {
    try {
        // Show loading
        loadingEl.classList.remove('hidden');
        quoteContent.classList.add('hidden');

        // Get quote using async/await
        var quote = await getRandomQuote();
        currentQuote = quote;

        // Update UI
        quoteText.textContent = quote.text;
        quoteAuthor.textContent = '— ' + quote.author;

        // Update total count
        totalQuotesLoaded++;
        totalQuotesEl.textContent = totalQuotesLoaded;

        // Hide loading, show quote
        loadingEl.classList.add('hidden');
        quoteContent.classList.remove('hidden');

        // Update favorite button
        updateFavoriteButton();

        console.log('✅ Quote loaded:', quote.text.substring(0, 30) + '...');

    } catch (error) {
        loadingEl.innerHTML = `
            <p style="color: #ef4444;">❌ Error loading quote</p>
            <p style="color: #888; font-size: 0.9rem; margin-top: 0.5rem;">${error.message}</p>
            <button onclick="location.reload()" style="
                margin-top: 1rem;
                padding: 10px 24px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            ">🔄 Try Again</button>
        `;
        console.error('Error:', error);
    }
}

// ============================================================
// UPDATE FAVORITE BUTTON
// ============================================================

function updateFavoriteButton() {
    if (!currentQuote) return;

    var isFavorite = favorites.some(function(fav) {
        return fav.text === currentQuote.text && fav.author === currentQuote.author;
    });

    if (isFavorite) {
        favoriteBtn.textContent = '⭐ Remove from Favorites';
        favoriteBtn.style.background = '#dc3545';
        favoriteBtn.style.color = 'white';
    } else {
        favoriteBtn.textContent = '⭐ Add to Favorites';
        favoriteBtn.style.background = '#ffc107';
        favoriteBtn.style.color = '#333';
    }
}

// ============================================================
// FAVORITE BUTTON CLICK
// ============================================================

favoriteBtn.addEventListener('click', function() {
    if (!currentQuote) return;

    var isFavorite = favorites.some(function(fav) {
        return fav.text === currentQuote.text && fav.author === currentQuote.author;
    });

    if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(function(fav) {
            return !(fav.text === currentQuote.text && fav.author === currentQuote.author);
        });
        showToast('❌ Removed from favorites!');
    } else {
        // Add to favorites
        favorites.push({
            text: currentQuote.text,
            author: currentQuote.author
        });
        showToast('⭐ Added to favorites!');
    }

    saveFavorites();
    updateFavoriteButton();
});

// ============================================================
// DISPLAY FAVORITES
// ============================================================

function updateFavoritesDisplay() {
    // Update count
    favoriteCountEl.textContent = favorites.length;

    // Show/hide favorites section
    if (favorites.length > 0) {
        favoritesSection.classList.remove('hidden');
    } else {
        favoritesSection.classList.add('hidden');
    }

    // Render favorites list
    favoritesList.innerHTML = '';
    favorites.forEach(function(fav, index) {
        var div = document.createElement('div');
        div.className = 'favorite-item';

        var textSpan = document.createElement('span');
        textSpan.className = 'fav-text';
        textSpan.textContent = '"' + fav.text + '"';

        var authorSpan = document.createElement('span');
        authorSpan.className = 'fav-author';
        authorSpan.textContent = '— ' + fav.author;

        var removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            favorites.splice(index, 1);
            saveFavorites();
            updateFavoriteButton();
            showToast('❌ Removed from favorites!');
        });

        div.appendChild(textSpan);
        div.appendChild(authorSpan);
        div.appendChild(removeBtn);
        favoritesList.appendChild(div);
    });
}

// ============================================================
// COPY BUTTON
// ============================================================

copyBtn.addEventListener('click', function() {
    if (!currentQuote) return;

    var textToCopy = '"' + currentQuote.text + '" — ' + currentQuote.author;

    // Use modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
            .then(function() {
                showToast('📋 Copied to clipboard!');
            })
            .catch(function() {
                // Fallback
                fallbackCopy(textToCopy);
            });
    } else {
        fallbackCopy(textToCopy);
    }
});

function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('📋 Copied to clipboard!');
    } catch (e) {
        showToast('❌ Could not copy!');
    }
    document.body.removeChild(textarea);
}

// ============================================================
// NEW QUOTE BUTTON
// ============================================================

newQuoteBtn.addEventListener('click', function() {
    displayRandomQuote();
});

// ============================================================
// TOAST MESSAGE
// ============================================================

function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(function() {
        toast.classList.add('show');
    }, 10);

    // Hide after 2 seconds
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Space' || e.key === ' ' || e.key === 'n' || e.key === 'N') {
        // Space or N for new quote
        if (!loadingEl.classList.contains('hidden')) return;
        displayRandomQuote();
        e.preventDefault();
    } else if (e.key === 'c' || e.key === 'C') {
        // C for copy
        copyBtn.click();
        e.preventDefault();
    } else if (e.key === 'f' || e.key === 'F') {
        // F for favorite
        favoriteBtn.click();
        e.preventDefault();
    }
});

// ============================================================
// CONSOLE HELP
// ============================================================

console.log('✅ Quote Generator loaded!');
console.log('💡 Keyboard shortcuts:');
console.log('   Space/N → New quote');
console.log('   C → Copy quote');
console.log('   F → Favorite/unfavorite');

// ============================================================
// START THE APP
// ============================================================

// Load favorites from localStorage
loadFavorites();

// Display first quote
displayRandomQuote();
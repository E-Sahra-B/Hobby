const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');

const figureParts = document.querySelectorAll('.figure-part');

const words = ['kedi', 'köpek', 'zürafa', 'fil', 'maymun', 'kaplan', 'aslan', 'tavşan', 'yılan', 'kurbağa', 'balık', 'kuş', 'örümcek', 'kelebek', 'arı', 'karınca', 'sincap', 'kirpi', 'baykuş', 'deve'];

let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];

// Kelimeyi göster
function displayWord() {
    wordEl.innerHTML = `
    ${selectedWord
            .split('')
            .map(
                letter => `
          <span class="letter">
            ${correctLetters.includes(letter) ? letter : ''}
          </span>
        `
            )
            .join('')}
  `;

    const innerWord = wordEl.innerText.replace(/\n/g, '');

    if (innerWord === selectedWord) {
        finalMessage.innerText = 'Tebrikler! Kazandınız! 😃';
        playAgainBtn.innerText = 'Yeni Oyun';
        popup.style.display = 'flex';
    }
}

// Bildirimi göster
function showNotification() {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Yanlış harfleri ve adamı güncelle
function updateWrongLettersEl() {
    // Yanlış harfleri göster
    wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? '<p>Yanlış</p>' : ''}
    ${wrongLetters.map(letter => `<span>${letter}</span>`)}
  `;

    // Adamın parçalarını göster
    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;

        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    // Kaybetme durumu
    if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = 'Maalesef kaybettiniz. 😕';
        playAgainBtn.innerText = 'Yeni Oyun';
        popup.style.display = 'flex';
    }
}

function restartGame() {
    // Dizileri boşalt
    correctLetters.splice(0);
    wrongLetters.splice(0);

    selectedWord = words[Math.floor(Math.random() * words.length)];

    displayWord();

    updateWrongLettersEl();

    popup.style.display = 'none';
}

// Harf girişi
window.addEventListener('keydown', e => {
    if (popup.style.display === 'flex') {
        if (e.key === 'Enter') {
            restartGame();
        }
        return;
    }

    const letter = e.key.toLocaleLowerCase('tr-TR');

    if ('abcçdefgğhıijklmnoöprsştuüvyz'.includes(letter)) {
        if (selectedWord.includes(letter)) {
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);

                displayWord();
            } else {
                showNotification();
            }
        } else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);

                updateWrongLettersEl();
            } else {
                showNotification();
            }
        }
    }
});

// Tekrar oyna butonu
playAgainBtn.addEventListener('click', restartGame);

displayWord();


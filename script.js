const resultDisplay = document.querySelector('.result-display h4');
const youWin = document.querySelector('.youWin');
const youLose = document.querySelector('.youLose');
const youDraw = document.querySelector('.youDraw');
const roundCount = document.getElementById('round-count');
const historyList = document.getElementById('history-list');
const resetButton = document.querySelector('.reset-btn');
const playAgainBtn = document.getElementById('playAgainBtn');
const cancelAndResetBtn = document.getElementById('cancelAndResetBtn');


const modalResultMessage = document.getElementById('modal-result-message');
const modalWin = document.getElementById('modalWin');
const modalLose = document.getElementById('modalLose');
const modalDraw = document.getElementById('modalDraw');
const modalTotalGames = document.getElementById('modalTotalGames');
const modalWinPercentage = document.getElementById('modalWinPercentage');

let scores = { win: 0, lose: 0, draw: 0, round: 1 };

const playAgainModal = new bootstrap.Modal(document.getElementById('playAgainModal'));

function updateScores() {
    youWin.textContent = scores.win;
    youLose.textContent = scores.lose;
    youDraw.textContent = scores.draw;
    roundCount.textContent = scores.round;
}

function saveGame() {
    localStorage.setItem('rpsScores', JSON.stringify(scores));
    const historyItems = Array.from(historyList.children).map(li => li.innerHTML);
    localStorage.setItem('rpsHistory', JSON.stringify(historyItems));
}

function loadGame() {
    const savedScores = JSON.parse(localStorage.getItem('rpsScores'));
    if (savedScores) {
        scores = savedScores;
    }
    updateScores();

    const savedHistory = JSON.parse(localStorage.getItem('rpsHistory')) || [];
    savedHistory.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = item;
        historyList.prepend(li);
    });
}

function getCompMove() {
    const moves = ['rock', 'paper', 'scissors'];
    return moves[Math.floor(Math.random() * moves.length)];
}

function playgame(playerMove) {
    const computerMove = getCompMove();
    let resultText = '';
    let resultClass = '';
    let currentRoundResult = '';

    if (playerMove === computerMove) {
        scores.draw++;
        resultText = 'It\'s a Draw! 🤝';
        resultClass = 'draw-text';
        currentRoundResult = 'It was a Draw!';
    } else if (
        (playerMove === 'rock' && computerMove === 'scissors') ||
        (playerMove === 'paper' && computerMove === 'rock') ||
        (playerMove === 'scissors' && computerMove === 'paper')
    ) {
        scores.win++;
        resultText = 'You Win! 🎉';
        resultClass = 'win-text';
        currentRoundResult = 'You Won!';
    } else {
        scores.lose++;
        resultText = 'You Lose! 😩';
        resultClass = 'lose-text';
        currentRoundResult = 'You Lost!';
    }

    resultDisplay.textContent = resultText;
    resultDisplay.className = `result-display ${resultClass}`;

    addHistoryItem(playerMove, computerMove, resultClass);
    updateScores();
    saveGame();

    modalResultMessage.textContent = currentRoundResult;
    modalWin.textContent = scores.win;
    modalLose.textContent = scores.lose;
    modalDraw.textContent = scores.draw;
    const totalGames = scores.win + scores.lose + scores.draw;
    const winPercentage = totalGames > 0 ? ((scores.win / totalGames) * 100).toFixed(1) : 0;
    modalTotalGames.textContent = totalGames;
    modalWinPercentage.textContent = `${winPercentage}%`;

    setTimeout(() => {
        playAgainModal.show();
    }, 500);
}

function addHistoryItem(playerMove, computerMove, resultClass) {
    const li = document.createElement('li');
    li.className = 'd-flex justify-content-between align-items-center';
    const outcomeBadge = resultClass === 'win-text' ? '<span class="badge bg-success">Win</span>' :
                         resultClass === 'lose-text' ? '<span class="badge bg-danger">Lose</span>' :
                         '<span class="badge bg-warning text-dark">Draw</span>';

    li.innerHTML = `
        <div>
            <span class="${resultClass}">Round ${scores.round}:</span> You chose <b>${playerMove}</b> vs. Computer's <b>${computerMove}</b>
        </div>
        ${outcomeBadge}
    `;
    historyList.prepend(li);
}

function resetGame() {
    scores = { win: 0, lose: 0, draw: 0, round: 1 };
    historyList.innerHTML = '';
    resultDisplay.textContent = 'Choose your move';
    resultDisplay.className = 'result-display';
    updateScores();
    saveGame();
}

resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the game? This will erase all scores and history.')) {
        resetGame();
    }
});

playAgainBtn.addEventListener('click', () => {
    playAgainModal.hide();
    scores.round++;
    updateScores();
    saveGame();
    resultDisplay.textContent = 'Choose your move';
    resultDisplay.className = 'result-display';
});

cancelAndResetBtn.addEventListener('click', () => {
    resetGame();
});

loadGame();
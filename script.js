const sentenceEl = document.getElementById("sentence");
const inputArea = document.getElementById("inputArea");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart");

let startTime, timerInterval, currentSentence, correctChars;

// Initialize Game
async function initGame() {
  startTime = null;
  correctChars = 0;
  inputArea.value = "";
  timeEl.textContent = "0";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "100";

  // Fetch random paragraph
  currentSentence = await fetchRandomParagraph();
  sentenceEl.textContent = currentSentence;

  inputArea.addEventListener("input", handleInput);
}

// Fetch Random Paragraph from Free API
async function fetchRandomParagraph() {
  try {
    const response = await fetch(
      "https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1"
    );
    const data = await response.json();
    return data[0]; // First paragraph from the API response
  } catch (error) {
    console.error("Error fetching paragraph:", error);
    return "Error fetching paragraph. Please check your internet connection.";
  }
}

// Handle Typing Input
function handleInput() {
  if (!startTime) {
    startTime = new Date();
    timerInterval = setInterval(updateTime, 1000);
  }

  const userInput = inputArea.value;
  const sentenceToMatch = currentSentence.substring(0, userInput.length);

  // Highlight errors
  if (userInput === sentenceToMatch) {
    sentenceEl.innerHTML = `<span class="highlight">${sentenceToMatch}</span>${currentSentence.substring(
      userInput.length
    )}`;
    correctChars = userInput.length;
  } else {
    sentenceEl.innerHTML = `<span class="highlight error">${sentenceToMatch}</span>${currentSentence.substring(
      userInput.length
    )}`;
  }

  // End game when sentence is completed
  if (userInput === currentSentence) {
    clearInterval(timerInterval);
    calculateWPM();
  }

  calculateAccuracy(userInput);
}

// Update Timer
function updateTime() {
  const elapsedTime = Math.floor((new Date() - startTime) / 1000);
  timeEl.textContent = elapsedTime;
}

// Calculate WPM
function calculateWPM() {
  const elapsedTime = Math.floor((new Date() - startTime) / 1000);
  const wordsTyped = currentSentence.split(" ").length;
  const wpm = Math.round((wordsTyped / elapsedTime) * 60);
  wpmEl.textContent = wpm;
}

// Calculate Accuracy
function calculateAccuracy(userInput) {
  const accuracy = Math.round((correctChars / userInput.length) * 100) || 100;
  accuracyEl.textContent = accuracy;
}

// Restart Game
restartBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  initGame();
});

// Start Game
initGame();

document.addEventListener("DOMContentLoaded", () => {
  const homeScreen = document.getElementById("home-screen");
  const addQuestionScreen = document.getElementById("add-question-screen");
  const historyScreen = document.getElementById("history-screen");
  const questionsContainer = document.getElementById("questions-container");
  const historyContainer = document.getElementById("history-container");
  const addQuestionInput = document.getElementById("new-question");
  const addQuestionButton = document.getElementById("add-question");
  const saveButton = document.getElementById("save-responses");
  const goToAddQuestions = document.getElementById("go-to-add-questions");
  const goToHistory = document.getElementById("go-to-history");
  const goToHomeFromAdd = document.getElementById("go-to-home-from-add");
  const goToHomeFromHistory = document.getElementById("go-to-home-from-history");

  let questions = [];
  let history = [];

  function saveToFile() {
    const data = JSON.stringify({ questions, history });
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "reflection_data.json";
    a.click();
    
    // Immediately reload the file to reflect new data
    setTimeout(loadFromFile, 500);
  }

  function loadFromFile() {
    fetch("reflection_data.json")
      .then(response => response.json())
      .then(data => {
        questions = data.questions || [];
        history = data.history || [];
        localStorage.setItem("questions", JSON.stringify(questions));
        localStorage.setItem("history", JSON.stringify(history));
        renderQuestions();
        renderHistory();
      })
      .catch(() => {
        console.log("No existing file found. Using default localStorage values.");
        questions = JSON.parse(localStorage.getItem("questions")) || [];
        history = JSON.parse(localStorage.getItem("history")) || [];
        renderQuestions();
        renderHistory();
      });
  }

  function renderQuestions() {
    questionsContainer.innerHTML = "";
    questions.forEach((question, index) => {
      const div = document.createElement("div");
      div.innerHTML = `<label>${question}</label>
                      <input type="number" min="1" max="5" data-question="${index}">`;
      questionsContainer.appendChild(div);
    });
  }

  function saveResponses() {
    const responses = {};
    document.querySelectorAll("input[data-question]").forEach(input => {
      const questionIndex = input.getAttribute("data-question");
      responses[questions[questionIndex]] = input.value;
    });
    history.push(responses);
    localStorage.setItem("history", JSON.stringify(history));
    saveToFile();
  }

  function addQuestion() {
    const newQuestion = addQuestionInput.value.trim();
    if (newQuestion) {
      questions.push(newQuestion);
      localStorage.setItem("questions", JSON.stringify(questions));
      addQuestionInput.value = "";
      renderQuestions();
    }
  }

  function renderHistory() {
    historyContainer.innerHTML = "";
    questions.forEach((question) => {
      const counts = [0, 0, 0, 0, 0];
      history.forEach(entry => {
        if (entry[question] !== undefined) {
          counts[entry[question] - 1]++;
        }
      });
      
      const div = document.createElement("div");
      div.innerHTML = `<h3>${question}</h3><p>${counts.join(" | ")}</p>`;
      historyContainer.appendChild(div);
    });
  }

  function showScreen(screen) {
    homeScreen.style.display = "none";
    addQuestionScreen.style.display = "none";
    historyScreen.style.display = "none";
    screen.style.display = "block";
  }

  loadFromFile();
  saveButton.addEventListener("click", saveResponses);
  addQuestionButton.addEventListener("click", addQuestion);
  goToAddQuestions.addEventListener("click", () => showScreen(addQuestionScreen));
  goToHistory.addEventListener("click", () => {
    loadFromFile(); // Ensure latest data is loaded before viewing history
    showScreen(historyScreen);
  });
  goToHomeFromAdd.addEventListener("click", () => showScreen(homeScreen));
  goToHomeFromHistory.addEventListener("click", () => showScreen(homeScreen));
});

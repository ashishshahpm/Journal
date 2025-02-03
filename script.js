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

  let questions = JSON.parse(localStorage.getItem("questions")) || [];
  let history = JSON.parse(localStorage.getItem("history")) || [];

  function saveToFile() {
    const data = JSON.stringify({ questions, history });
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "reflection_data.json";
    a.click();
  }

  function loadFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      questions = data.questions || [];
      history = data.history || [];
      localStorage.setItem("questions", JSON.stringify(questions));
      localStorage.setItem("history", JSON.stringify(history));
      renderQuestions();
      renderHistory();
    };
    reader.readAsText(file);
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

  renderQuestions();
  renderHistory();

  saveButton.addEventListener("click", saveResponses);
  addQuestionButton.addEventListener("click", addQuestion);
  goToAddQuestions.addEventListener("click", () => showScreen(addQuestionScreen));
  goToHistory.addEventListener("click", () => showScreen(historyScreen));
  goToHomeFromAdd.addEventListener("click", () => showScreen(homeScreen));
  goToHomeFromHistory.addEventListener("click", () => showScreen(homeScreen));

  document.getElementById("load-file").addEventListener("change", loadFromFile);
});

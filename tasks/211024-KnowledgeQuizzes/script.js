const dataName = "tests";
const state = {
  dataName,
  tests: loadData(dataName),
  selectedTest: null,
  currentQuestionIndex: 0,
  points: 0,
};
console.log(state);

renderSelectTest();

function renderQuestion(question, conteiner) {
  const titleHtml = `<p>${question.title}</p>`;
  const shufledAnswersHtml = shufle(
    question.answers.map(
      (answer) =>
        `<div><label><input type="radio" name="answer" value="${answer.id}" required /> ${answer.text}</label></div>`
    )
  );
  const answersHtml = shufledAnswersHtml.join("");

  conteiner.innerHTML = titleHtml + answersHtml;
}

function shufle(arr) {
  const result = arr.map((el) => el);

  result.sort(() => {
    const randomNumber = Math.random();
    if (randomNumber > 0.5) {
      return 1;
    } else {
      return -1;
    }
  });
  return result;
}
function renderQuestionProgress(current, count, container) {
  container.innerHTML = `${current} задание из ${count}`;
}
function renderSelectTest() {
  const optionHtml = state.tests
    .map((test) => `<option value="${test.id}" label="${test.title}"></option>`)
    .join("");
  document.body.innerHTML = `<div id="selectTestContainer">
      <form id='selectTestForm'>
        <label>
          Выберите тест:
<select  name='testId'>
          ${optionHtml}
        </select>
          
        </label>

        

        <input type="submit" value="Пройти тест" />
      </form>
    </div>`;
  const selectTestForm = document.querySelector("#selectTestForm");

  if (selectTestForm) {
    selectTestForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const dataForm = new FormData(event.target);

      const test = state.tests.find(
        (test) => test.id === dataForm.get("testId")
      );
      if (test) {
        state.selectedTest = test;
      } else {
        alert("Тест не нашелся");
      }
      renderTestList();
      console.log(test);
    });
  }
}
function renderTestList() {
  state.currentQuestionIndex = 0;
  state.points = 0;
  document.body.innerHTML = `<div id="testContainer">
      <div id="questionProgress"></div>
      <form id="questionForm">
        <div id="conteinerQuestions"></div>
        <input type="submit" />
      </form>
    </div>
    <div id="testActions">
      <button id="restartButton">Начать заного</button>
      <button id="backButton">Вернуться к выбору теста</button>
    </div>`;
  const testContainer = document.getElementById("testContainer");
  const conteinerQuestion = document.querySelector("#conteinerQuestions");
  const questionForm = document.querySelector("#questionForm");
  const questionProgress = document.querySelector("#questionProgress");
  const restartButton = document.getElementById("restartButton");
  const backButton = document.getElementById("backButton");

  //обработка ответа пользователя

  questionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData.entries());

    if (
      formDataObject.answer ===
      `${
        state.selectedTest.questions[state.currentQuestionIndex].correctAnswer
      }`
    ) {
      state.points += 1;
    }

    state.currentQuestionIndex += 1;

    if (state.currentQuestionIndex >= state.selectedTest.questions.length) {
      testContainer.innerHTML = `<p>Кол-во правильных ответов: ${state.points} из ${state.selectedTest.questions.length}.</p>`;
    } else {
      renderQuestionProgress(
        state.currentQuestionIndex + 1,
        state.selectedTest.questions.length,
        questionProgress
      );
      renderQuestion(
        state.selectedTest.questions[state.currentQuestionIndex],
        conteinerQuestion
      );
    }

    console.log(formDataObject);
  });

  //начать тест заного

  restartButton.addEventListener("click", () => {
    renderTestList();
  });

  //Вернуться к выбору теста

  backButton.addEventListener("click", () => {
    renderSelectTest();
  });

  renderQuestionProgress(
    state.currentQuestionIndex + 1,
    state.selectedTest.questions.length,
    questionProgress
  );
  renderQuestion(
    state.selectedTest.questions[state.currentQuestionIndex],
    conteinerQuestion
  );
}
function saveData(array, name) {
  localStorage.setItem(name, JSON.stringify(array));
}

// Функция для загрузки данных из localStorage
function loadData(name) {
  const data = localStorage.getItem(name);
  return data ? JSON.parse(data) : []; // Если данных нет, возвращаем пустой массив
}

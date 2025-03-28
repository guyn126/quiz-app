let currentQuestion = 0;
let score = 0;
let questions = [];

// Load questions on Render
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://js-server-api.onrender.com/questions")
    .then((res) => res.json())
    .then((data) => {
      questions = data;
      showQuestion();
    })
    .catch((err) => {
      document.getElementById("question").innerText =
        "Loading questions...";
      console.error("Error to load the questions :", err);
    });
});

function showQuestion() {
  const questionBox = document.getElementById("question");
  const choicesBox = document.getElementById("choices");
  const feedback = document.getElementById("feedback");
  const nextBtn = document.getElementById("nextBtn");

  let q = questions[currentQuestion];
  let choices = [...q.incorrect_answers, q.correct_answer];
  choices.sort(() => Math.random() - 0.5);

  questionBox.innerText = q.question;
  choicesBox.innerHTML = "";
  feedback.innerHTML = "";
  nextBtn.classList.add("hidden");

  choices.forEach((choice) => {
    const btn = document.createElement("div");
    btn.classList.add("choice");
    btn.innerText = choice;

    btn.onclick = () => {
      if (choice === q.correct_answer) {
        btn.classList.add("correct");
        feedback.innerText = "Correct !";
        score++;
      } else {
        btn.classList.add("incorrect");
        feedback.innerText = "Wrong answer";
      }

      Array.from(document.getElementsByClassName("choice")).forEach((el) => {
        el.onclick = null;
        if (el.innerText === q.correct_answer) {
          el.classList.add("correct");
        }
      });

      nextBtn.classList.remove("hidden");
    };

    choicesBox.appendChild(btn);
  });

  nextBtn.onclick = () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      showScore();
      saveScore(score);
    }
  };
}

// Show the score
function showScore() {
  document.getElementById("quiz-box").classList.add("hidden");
  document.getElementById("scoreScreen").classList.remove("hidden");
  document.getElementById("scoreText").innerText = `${score} / ${questions.length}`;
}

// Save the score in the API Render
function saveScore(score) {
  fetch("https://js-server-api.onrender.com/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      score: score,
      date: new Date().toISOString(),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Score saved :", data);
    })
    .catch((err) => {
      console.error("Save error :", err);
    });
}

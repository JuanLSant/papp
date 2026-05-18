const questions = [
    {
        question: "¿Qué selección ha ganado más Copas del Mundo?",
        options: ["Brasil", "Alemania", "Italia"],
        correct: 0
    },
    {
        question: "Pregunta 2: ¿Qué selección ganó el Mundial de 2022 en Qatar?",
        options: ["Francia", "Brasil", "Argentina"],
        correct: 2
    },
    {
        question: "Pregunta 3: ¿Cuál de estos países será sede del Mundial 2026?",
        options: ["Japón", "Estados Unidos", "España"],
        correct: 1
    },
    {
        question: "Pregunta 4: ¿Qué selección africana ha llegado más lejos en un Mundial?",
        options: ["Nigeria", "Camerún", "Marruecos"],
        correct: 2
    },
    {
        question: "Pregunta 5: ¿Qué selección es conocida como 'La Albiceleste'?",
        options: ["Uruguay", "Argentina", "Chile"],
        correct: 1
    },
    {
        question: "Pregunta 50: pregunta",
        options: ["respuesta", "respuesta", "respuesta"],
        correct: 0
    }
];

// Carga el score acumulado previo desde localStorage
let score = parseInt(localStorage.getItem('totalScore') || '0');

let currentQuestionIndex = 0;

// Elementos del DOM
const progressFill = document.querySelector('.progress-fill');
const questionElement = document.querySelector('.question h1');
const answerContainers = document.querySelectorAll('.respuesta');
const answerElements = document.querySelectorAll('.respuesta h1');

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        alert(`¡Quiz terminado! Puntuación total acumulada: ${score} puntos.`);
        return;
    }

    questionElement.textContent = questions[currentQuestionIndex].question;

    answerElements.forEach((el, i) => {
        el.textContent = questions[currentQuestionIndex].options[i];
    });

    answerContainers.forEach(container => {
        container.style.background = 'rgba(3, 14, 7, 0.829)';
    });
}

function updateProgress() {
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;
    progressFill.style.width = `${progressPercentage}%`;
}

answerContainers.forEach((container, index) => {
    container.addEventListener('click', () => {
        const correctIndex = questions[currentQuestionIndex].correct;

        if (index === correctIndex) {
            score += 100;
            localStorage.setItem('totalScore', score); // guarda inmediatamente
            container.style.background = '#63f1769d';
        } else {
            container.style.background = '#ff4d4da4';
            answerContainers[correctIndex].style.background = '#63f176';
        }

        answerContainers.forEach(c => c.style.pointerEvents = 'none');

        setTimeout(() => {
            currentQuestionIndex++;
            updateProgress();
            loadQuestion();
            answerContainers.forEach(c => c.style.pointerEvents = 'auto');
        }, 1000);
    });
});

loadQuestion();
updateProgress();
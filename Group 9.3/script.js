/* Annorattah Private Schools — site interactions (vanilla JavaScript) */

"use strict";

const quizQuestions = {
    mathematics: [
        { question: "What is 5 + 7?", options: ["10", "12", "14", "15"], answer: "12" },
        { question: "What is 6 + 4?", options: ["10", "24", "28", "30"], answer: "10" },
        { question: "What do you get when you put 2 fingers and 5 fingers together?", options: ["6", "9", "7", "2"], answer: "7" }
    ],
    english: [
        { question: "What is the plural of child?", options: ["Childs", "Children", "Childes", "Child"], answer: "Children" },
        { question: "Which word is a noun?", options: ["Run", "Beautiful", "Teacher", "Quickly"], answer: "Teacher" },
        { question: "What should we do when we meet a new friend?", options: ["Say hello", "Fight", "Laugh at them", "Run away"], answer: "Say hello" }
    ],
    science: [
        { question: "Which planet do we live on?", options: ["Mars", "Earth", "Venus", "Jupiter"], answer: "Earth" },
        { question: "Where can we get water?", options: ["Trees", "Stones", "Rivers", "Beds"], answer: "Rivers" }
    ],
    socialStudies: [
        { question: "What is the capital city of Malawi?", options: ["Blantyre", "Mzuzu", "Lilongwe", "Zomba"], answer: "Lilongwe" },
        { question: "Which of these can be a community leader?", options: ["Traditional Authority", "Bus conductor", "Nurse", "Shopper"], answer: "Traditional Authority" },
        { question: "Our family is part of the ______.", options: ["School", "Hospital", "Community", "Market"], answer: "Community" }
    ]
};

let activeQuestions = [];
let activeQuestionIndex = 0;
let quizScore = 0;
let questionAnswered = false;

function closeMobileMenu(navbar, menuToggle) {
    if (!navbar || !menuToggle) return;
    navbar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

function startQuiz() {
    const subjectSelect = document.getElementById("subject");
    const quizArea = document.getElementById("quizArea");
    if (!subjectSelect || !quizArea) return;

    const selectedSubject = subjectSelect.value;
    if (!selectedSubject || !quizQuestions[selectedSubject]) {
        quizArea.replaceChildren();
        const message = document.createElement("p");
        message.className = "form-status error";
        message.textContent = "Please choose a subject before starting the quiz.";
        quizArea.append(message);
        subjectSelect.focus();
        return;
    }

    activeQuestions = quizQuestions[selectedSubject];
    activeQuestionIndex = 0;
    quizScore = 0;
    questionAnswered = false;
    renderQuestion();
}

function renderQuestion() {
    const quizArea = document.getElementById("quizArea");
    if (!quizArea || !activeQuestions.length) return;
    const question = activeQuestions[activeQuestionIndex];
    quizArea.replaceChildren();

    const progress = document.createElement("p");
    progress.className = "quiz-progress";
    progress.textContent = `QUESTION ${activeQuestionIndex + 1} OF ${activeQuestions.length}`;

    const heading = document.createElement("h2");
    heading.textContent = `Question ${activeQuestionIndex + 1}`;

    const prompt = document.createElement("p");
    prompt.className = "quiz-question";
    prompt.textContent = question.question;

    const answerList = document.createElement("div");
    answerList.className = "answer-list";

    const feedback = document.createElement("p");
    feedback.id = "feedback";
    feedback.setAttribute("aria-live", "polite");

    question.options.forEach((option) => {
        const answerButton = document.createElement("button");
        answerButton.type = "button";
        answerButton.className = "answer";
        answerButton.textContent = option;
        answerButton.addEventListener("click", () => selectAnswer(option, answerButton, answerList, feedback));
        answerList.append(answerButton);
    });

    quizArea.append(progress, heading, prompt, answerList, feedback);
}

function selectAnswer(selectedOption, selectedButton, answerList, feedback) {
    if (questionAnswered) return;
    questionAnswered = true;
    const question = activeQuestions[activeQuestionIndex];
    const isCorrect = selectedOption.toLowerCase() === question.answer.toLowerCase();

    if (isCorrect) {
        quizScore += 1;
        feedback.textContent = "Correct! Well done! 🎉";
        feedback.style.color = "var(--success)";
        selectedButton.classList.add("correct");
    } else {
        feedback.textContent = `Not quite. The correct answer is: ${question.answer}.`;
        feedback.style.color = "var(--danger)";
        selectedButton.classList.add("incorrect");
    }

    answerList.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
        if (button.textContent.toLowerCase() === question.answer.toLowerCase()) {
            button.classList.add("correct");
        }
    });

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.textContent = activeQuestionIndex === activeQuestions.length - 1 ? "View Results" : "Next Question →";
    nextButton.addEventListener("click", advanceQuiz);
    document.getElementById("quizArea").append(nextButton);
    nextButton.focus();
}

function advanceQuiz() {
    activeQuestionIndex += 1;
    if (activeQuestionIndex < activeQuestions.length) {
        questionAnswered = false;
        renderQuestion();
        return;
    }
    renderQuizResults();
}

function renderQuizResults() {
    const quizArea = document.getElementById("quizArea");
    if (!quizArea) return;
    quizArea.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "Quiz complete!";
    const score = document.createElement("p");
    score.className = "quiz-score";
    score.textContent = `${quizScore} out of ${activeQuestions.length}`;
    const message = document.createElement("p");
    const percentage = Math.round((quizScore / activeQuestions.length) * 100);
    message.textContent = percentage >= 80 ? "Excellent work! Keep it up." : percentage >= 50 ? "Good effort. Practise a little more and try again." : "Keep learning. You can try again whenever you are ready.";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Try Again";
    retry.addEventListener("click", startQuiz);
    quizArea.append(heading, score, message, retry);
    retry.focus();
}

function toggleLearningLinks() {
    const section = document.getElementById("learningLinks");
    if (!section) return;
    section.hidden = !section.hidden;
    if (!section.hidden) section.scrollIntoView({ behavior: "smooth", block: "start" });
}

window.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const menuToggle = document.getElementById("menu-toggle");

    if (navbar && menuToggle) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navbar.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        });

        navbar.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
            toggle.addEventListener("click", () => {
                const dropdown = toggle.closest(".dropdown");
                if (!dropdown) return;
                const shouldOpen = !dropdown.classList.contains("open");
                navbar.querySelectorAll(".dropdown").forEach((item) => {
                    item.classList.remove("open");
                    const itemToggle = item.querySelector(".dropdown-toggle");
                    if (itemToggle) itemToggle.setAttribute("aria-expanded", "false");
                });
                dropdown.classList.toggle("open", shouldOpen);
                toggle.setAttribute("aria-expanded", String(shouldOpen));
            });
        });

        navbar.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                closeMobileMenu(navbar, menuToggle);
                navbar.querySelectorAll(".dropdown").forEach((dropdown) => {
                    dropdown.classList.remove("open");
                    const toggle = dropdown.querySelector(".dropdown-toggle");
                    if (toggle) toggle.setAttribute("aria-expanded", "false");
                });
            });
        });

        document.addEventListener("click", (event) => {
            if (!navbar.contains(event.target) && !menuToggle.contains(event.target)) {
                navbar.querySelectorAll(".dropdown").forEach((dropdown) => {
                    dropdown.classList.remove("open");
                    const toggle = dropdown.querySelector(".dropdown-toggle");
                    if (toggle) toggle.setAttribute("aria-expanded", "false");
                });
                if (window.matchMedia("(max-width: 760px)").matches) closeMobileMenu(navbar, menuToggle);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMobileMenu(navbar, menuToggle);
                navbar.querySelectorAll(".dropdown").forEach((dropdown) => {
                    dropdown.classList.remove("open");
                    const toggle = dropdown.querySelector(".dropdown-toggle");
                    if (toggle) toggle.setAttribute("aria-expanded", "false");
                });
                menuToggle.focus();
            }
        });
    }

    const currentFile = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".navbar a[aria-current]").forEach((link) => link.removeAttribute("aria-current"));
    document.querySelectorAll(".navbar a[href]").forEach((link) => {
        const targetFile = link.getAttribute("href").split("#")[0];
        if (targetFile && targetFile === currentFile) link.setAttribute("aria-current", "page");
    });

    document.querySelectorAll("#year").forEach((element) => {
        element.textContent = new Date().getFullYear();
    });
    
    const loader = document.getElementById("loader");

    if (loader) {
            loader.hidden = true;
            loader.setAttribute("aria-hidden","true");
    }

    const startQuizButton = document.getElementById("start-quiz");
    if (startQuizButton) startQuizButton.addEventListener("click", startQuiz);

    const contactForm = document.querySelector(".form");
    if (contactForm) {
        contactForm.querySelectorAll("input, textarea, select").forEach((field) => {
            if (field.type !== "hidden") field.required = true;
        });
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let status = contactForm.querySelector(".form-status");
            if (!status) {
                status = document.createElement("p");
                status.className = "form-status";
                status.setAttribute("role", "status");
                status.setAttribute("aria-live", "polite");
                contactForm.append(status);
            }
            status.className = "form-status success";
            status.textContent = "Your message has been checked in this browser, but it has not been sent. The school needs a connected email service or backend to receive messages.";
        });
    }

    document.querySelectorAll(".video-card video").forEach((video) => {
        video.addEventListener("error", () => {
            const card = video.closest(".video-card");
            if (!card || card.querySelector(".video-status")) return;
            const status = document.createElement("p");
            status.className = "video-status";
            status.setAttribute("role", "status");
            status.textContent = "This lesson video file is not included in the project. Add the matching MP4 to the videos folder to enable playback.";
            video.insertAdjacentElement("afterend", status);
        });
    });
});

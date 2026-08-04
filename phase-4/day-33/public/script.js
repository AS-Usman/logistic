// Dark mode

const themeButton = document.getElementById("themeButton");

if (themeButton) {

    themeButton.addEventListener("click", function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            themeButton.textContent = "☀️";
        } else {
            themeButton.textContent = "🌙";
        }

    });

}


// Typing animation

const typing = document.getElementById("typing");

if (typing) {

    const words = [
        "Web Developer",
        "Backend Developer",
        "Student",
        "Programmer"
    ];

    let wordIndex = 0;
    let letterIndex = 0;

    function type() {

        if (letterIndex < words[wordIndex].length) {

            typing.textContent +=
                words[wordIndex][letterIndex];

            letterIndex++;

            setTimeout(type, 100);

        } else {

            setTimeout(erase, 1500);

        }
    }


    function erase() {

        if (letterIndex > 0) {

            typing.textContent =
                words[wordIndex].substring(0, letterIndex - 1);

            letterIndex--;

            setTimeout(erase, 50);

        } else {

            wordIndex++;

            if (wordIndex >= words.length) {
                wordIndex = 0;
            }

            setTimeout(type, 500);
        }
    }

    type();
}


function showStatus(message, type) {
    const formStatus = document.getElementById("formStatus");
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = "form-status " + type;
}

// Contact form logic

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    const formStatus = document.getElementById("formStatus");
    const charCount = document.getElementById("charCount");
    const messageError = document.getElementById("messageError");

    function validateField(input, message) {
        if (!input || !input.value.trim()) {
            showStatus(message, "error");
            input?.focus();
            return false;
        }

        if (input.id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
            showStatus("Please enter a valid email address.", "error");
            input.focus();
            return false;
        }

        if (input.id === "message" && input.value.trim().length < 10) {
            showStatus("Message must be at least 10 characters long.", "error");
            input.focus();
            return false;
        }

        return true;
    }

    if (messageInput && charCount) {
        const updateCharCount = () => {
            const count = messageInput.value.length;
            charCount.textContent = `${count}/300`;

            if (count > 250) {
                charCount.style.color = "#f59e0b";
            } else {
                charCount.style.color = "";
            }
        };

        messageInput.addEventListener("input", updateCharCount);
        updateCharCount();
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const isNameValid = validateField(nameInput, "Please enter your name.");
        const isEmailValid = validateField(emailInput, "Please enter your email.");
        const isSubjectValid = validateField(subjectInput, "Please enter a subject.");
        const isMessageValid = validateField(messageInput, "Please enter your message.");

        if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
            return;
        }

        showStatus("Your message was sent successfully!", "success");

        contactForm.reset();
        if (charCount) charCount.textContent = "0/300";
    });

    if (messageInput && messageError) {
        messageInput.addEventListener("input", function () {
            if (messageInput.value.trim().length > 0 && messageInput.value.trim().length < 10) {
                messageError.textContent = "Add at least 10 characters";
            } else {
                messageError.textContent = "";
            }
        });
    }
}


// Contact card interactions

const contactCards = document.querySelectorAll(".contact-card");

contactCards.forEach((card) => {
    card.addEventListener("click", async function () {
        const contactType = card.dataset.contact;
        const value = card.querySelector(".contact-value")?.textContent.trim() || "";

        if (contactType === "location") {
            showStatus("Location: India", "success");
            return;
        }

        try {
            await navigator.clipboard.writeText(value);
            showStatus(`${contactType.charAt(0).toUpperCase() + contactType.slice(1)} copied to clipboard.`, "success");
        } catch (error) {
            showStatus("Copy failed. Please copy it manually.", "error");
        }
    });
});


// Scroll to top

const topButton = document.getElementById("topButton");

if (topButton) {

    topButton.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}
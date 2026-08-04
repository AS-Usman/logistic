// Welcome message
window.addEventListener("load", function () {
    alert("Welcome to my portfolio!");
});


// Dark mode
const themeButton = document.getElementById("themeButton");

if (themeButton) {
    themeButton.addEventListener("click", function () {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            themeButton.textContent = "☀️ Light Mode";
        } else {
            themeButton.textContent = "🌙 Dark Mode";
        }
    });
}


// Typing effect
const typingText = document.getElementById("typing");

if (typingText) {
    const text = "Welcome to My Portfolio";
    let index = 0;

    function typeText() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100);
        }
    }

    typeText();
}


// Contact form validation
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        if (name === "" || email === "" || message === "") {
            alert("Please fill in all fields.");
        } else {
            alert("Thank you, " + name + "! Your message has been submitted.");
            contactForm.reset();
        }
    });
}


// Scroll to top button
const topButton = document.getElementById("topButton");

if (topButton) {
    topButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
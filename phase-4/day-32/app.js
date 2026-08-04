const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve CSS files
app.use(express.static(path.join(__dirname, "public")));

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

// About Page
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Contact Page
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "contact.html"));
});

// Text Response
app.get("/hello", (req, res) => {
    res.send("Welcome to my first Express Server!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
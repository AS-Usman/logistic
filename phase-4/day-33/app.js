const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;


// Serve CSS and JavaScript
app.use(express.static(path.join(__dirname, "public")));


// Home
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});


// About
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});


// Contact
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "contact.html"));
});


// Text response
app.get("/hello", (req, res) => {
    res.send("Hello! This is my Express backend.");
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
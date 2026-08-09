const db = require("./db");
const express = require("express");
const path = require("path");

const app = express();

const PORT = 3000;


// ===============================
// MIDDLEWARE
// ===============================

// Allows Express to read JSON data
app.use(express.json());

// Serves CSS and JavaScript files
app.use(express.static(path.join(__dirname, "public")));


// ===============================
// FRONTEND ROUTES
// ===============================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "contact.html"));
});


// ===============================
// REST API
// ===============================

// Temporary data
let projects = [
    {
        id: 1,
        name: "Portfolio Website",
        technology: "HTML, CSS, JavaScript"
    },
    {
        id: 2,
        name: "Express Project",
        technology: "Node.js, Express"
    }
];


// ===============================
// GET METHOD
// Get all projects
// ===============================

app.get("/api/projects", (req, res) => {

    res.json(projects);

});


// ===============================
// GET METHOD
// Get one project
// ===============================

app.get("/api/projects/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const project = projects.find(
        project => project.id === id
    );

    if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    res.json(project);

});


// ===============================
// POST METHOD
// Add a new project
// ===============================

app.post("/api/projects", (req, res) => {

    const newProject = {
        id: projects.length + 1,
        name: req.body.name,
        technology: req.body.technology
    };

    projects.push(newProject);

    res.status(201).json({
        message: "Project added successfully",
        project: newProject
    });

});


// ===============================
// PUT METHOD
// Update a project
// ===============================

app.put("/api/projects/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const project = projects.find(
        project => project.id === id
    );

    if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    project.name = req.body.name;
    project.technology = req.body.technology;

    res.json({
        message: "Project updated successfully",
        project: project
    });

});


// ===============================
// DELETE METHOD
// Delete a project
// ===============================

app.delete("/api/projects/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const projectIndex = projects.findIndex(
        project => project.id === id
    );

    if (projectIndex === -1) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    const deletedProject = projects.splice(
        projectIndex,
        1
    );

    res.json({
        message: "Project deleted successfully",
        project: deletedProject[0]
    });

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
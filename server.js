const path = require("path");
const express = require("express");
var cors = require("cors");
const simpleGit = require('simple-git');
const fs = require('fs');

const expressApp = express();
expressApp.use(express.json());
expressApp.use(cors());


const port = process.env.PORT || 3001;

expressApp.post("/clone", async (req, res) => {
    console.log("clone called");
    const { username, repo, clonePath } = req.body;
    const gitUrl = `https://github.com/${username}/${repo}.git`;
    const localPath = path.resolve(clonePath, repo); // Create a new directory with the repo name inside clonePath
  
    console.log("Received POST request with data:", req.body); // Log request body
    console.log("gitUrl", gitUrl);
    console.log("localPath", localPath);
  
    try {
      // Create the directory if it doesn't exist
      if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath, { recursive: true });
      }
  
      // Clone the repository into the new directory
      await simpleGit().clone(gitUrl, localPath);
      res.status(200).send("Repository cloned successfully");
    } catch (error) {
      console.log("error", error);
      res.status(500).send("Failed to clone repository");
    }
  });

expressApp.get("/", (req, res) => {
  res.send("GET Request Called !!!");
});

expressApp.get("/test", (req, res) => {
  res.send("Test GET Request Called !!!");
});

expressApp.get("/select-folder", async (req, res) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (result.canceled) {
    res.status(400).json({ error: "No folder selected" });
  } else {
    res.json({ path: result.filePaths[0] });
  }
});

expressApp.listen(port, () => {
  console.log(`Server running at port http://localhost:${port}!`)
});

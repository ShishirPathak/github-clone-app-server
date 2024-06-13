const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const express = require('express');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
    show: false, // Hide the window
  });
}

app.on('ready', () => {
  createWindow();

  // Express setup
  const expressApp = express();
  expressApp.use(express.json());

  expressApp.post('/clone', (req, res) => {
    const { username, repo, clonePath } = req.body;
    // Here you would handle the cloning logic
    res.json({ message: `Cloned ${repo} to ${clonePath}` });
  });

  expressApp.get('/select-folder', async (req, res) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
    });

    if (result.canceled) {
      res.status(400).json({ error: 'No folder selected' });
    } else {
      res.json({ path: result.filePaths[0] });
    }
  });

  expressApp.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

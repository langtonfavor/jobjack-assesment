const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')

const app = express();
app.use(cors())
const port = 3000;

function getDirectoryListing(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    return files.map((file) => {
      const filePath = path.join(directoryPath, file);
      const stats = fs.statSync(filePath);

      const filePermissions = fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK;
      const permissions = {
        readable: checkPermission(filePermissions, filePath),
        writable: checkPermission(filePermissions, filePath),
        executable: checkPermission(filePermissions, filePath),
      };

      return {
        filename: file,
        fullPath: filePath,
        size: stats.size,
        extension: path.extname(file),
        createdDate: stats.birthtime,
        isDirectory: stats.isDirectory(),
        permissions: permissions,
      };
    });
  } catch (error) {
    console.error(`Error retrieving directory listing: ${error.message}`);
    return null;
  }
}

function checkPermission(permission, filePath) {
  try {
    fs.accessSync(filePath, permission);
    return true;
  } catch (error) {
    return false;
  }
}

app.get('/directory', (req, res) => { 
  const directoryPath = req.query.path || __dirname;
  const directoryListing = getDirectoryListing(directoryPath);

  if (!directoryListing) {
    res.status(500).json({ error: 'Failed to retrieve directory listing....' });
  } else {
    const parentDirectory = path.dirname(directoryPath);

    res.json({
      currentDirectory: directoryPath,
      parentDirectory: parentDirectory === directoryPath ? null : parentDirectory,
      files: directoryListing,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    try {
        // Get the uploaded file path
        const imagePath = path.join(__dirname, 'uploads', req.file.filename);

        // Save the image path to path.json
        const pathData = { path: imagePath };
        fs.writeFileSync('path.json', JSON.stringify(pathData));

        // Redirect to another webpage based on the process in path.json
        res.redirect('/process');
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Error uploading image');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

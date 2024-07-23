const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'assets'))); // Adjusted path for static assets

app.post('/upload', (req, res) => {
    const imgData = req.body.imgBase64;
    const base64Data = imgData.replace(/^data:image\/jpeg;base64,/, "");
    const filename = `image-${Date.now()}.jpg`;
    const filepath = path.join(__dirname, 'images', filename); // Adjusted path for images

    fs.writeFile(filepath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Failed to save image:', err);
            res.status(500).send('Failed to save image.');
        } else {
            console.log('Image saved successfully:', filename);
            res.send({ message: 'Image saved successfully.', filename });
        }
    });
});

app.get('/gallery', (req, res) => {
    const galleryPath = path.join(__dirname, 'images');
    fs.readdir(galleryPath, (err, files) => {
        if (err) {
            console.error('Failed to read the gallery directory:', err);
            res.status(500).send('Failed to read the gallery directory.');
        } else {
            const filteredFiles = files.filter(file => file !== '.DS_Store');
            res.json(filteredFiles);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

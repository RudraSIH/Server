const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json()); // for parsing application/json

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

app.get('/fetch-image', async (req, res) => {
    try {
        const imageURL = 'https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/Articles/discover-the-secret-language-of-flowers-2022-hero.jpeg'; // Replace with your image URL
        const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary').toString('base64');
        res.send(buffer);
    } catch (error) {
        res.status(500).send("Error fetching image");
    }
});

// POST API to receive data and send to chatbot
app.post('/response', upload.single('image'), async (req, res) => {
    try {
        const chatbotAPI = 'https://yourchatbotapi.com/send'; // Replace with your chatbot API
        
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).send("No image uploaded");
        }

        // Prepare the data for the chatbot API
        const formData = {
            image: {
                value: req.file.buffer,
                options: {
                    filename: req.file.originalname,
                    contentType: req.file.mimetype
                }
            }
        };

        // Sending the image to the chatbot API
        const response = await axios.post(chatbotAPI, formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            }
        });

        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error sending data to chatbot");
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

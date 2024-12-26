const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

mongoose
    .connect(
        'mongodb+srv://zubalana0:zbhQXHED368PbcVK@cluster0.a5jnl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

const itemSchema = new mongoose.Schema({
    title: String,
    price: String,
    status: Boolean,
});

const Item = mongoose.model('Item', itemSchema);

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/goodsTargetName', async (req, res) => {
    const { URL } = req.body;
    if (!URL) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const response = await axios.get(URL);
        const html = response.data;
        const $ = cheerio.load(html);

        const titles = [];
        const prices = [];
        const statuses = [];

        $('.title__font').each((_, element) => {
            titles.push($(element).text());
        });

        $('.product-price__big').each((_, element) => {
            prices.push($(element).text());
        });

        $('.status-label').each((_, element) => {
            statuses.push($(element).text().includes('Є в наявності') || $(element).text().includes('Закінчується'));
        });

        const items = titles.map((title, index) => ({
            title,
            price: prices[index],
            status: statuses[index],
        }));

        await Item.insertMany(items);
        res.json({ message: 'Data successfully logged', items });
    } catch (error) {
        console.error('Error parsing URL:', error);
        res.status(500).json({ message: 'Error fetching data from URL' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
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
        image: String, 
        createdAt: { type: Date, default: Date.now },
        follow: Boolean,
        url: String
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
        const images = [];

        $('.title__font').each((_, element) => {
            titles.push($(element).text());
        });

        $('.product-price__big').each((_, element) => {
            prices.push($(element).text());
        });

        $('.status-label').each((_, element) => {
            statuses.push($(element).text().includes('Є в наявності') || $(element).text().includes('Закінчується'));
        });

        const imgElement = $('.main-slider__item img').first();
        const imgUrl = imgElement.attr('src');
        images.push(imgUrl);

        let goodsInfo = {};
        goodsInfo.title = titles[0];
        goodsInfo.price = prices[0];
        goodsInfo.status = statuses[0];
        goodsInfo.follow = false;
        goodsInfo.url = URL;
        goodsInfo.image = images[0]; 

        console.log(goodsInfo);

        await Item.create(goodsInfo);

        res.json({ message: 'Data successfully logged', goodsInfo });
    } catch (error) {
        console.error('Error parsing URL:', error);
        res.status(500).json({ message: 'Error fetching data from URL' });
    }
});

app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
});

app.post('/follow', async (req, res) => {
    const { id } = req.body;
    try {
        const item = await Item.findById(id);
        item.follow = !item.follow;
        await item.save();
        bot.sendMessage(process.env.CHAT_ID, `You ${item.follow ? 'followed' : 'unfollowed'} ${item.title}`);
        res.json(item);
    } catch (error) {
        console.error('Error following item:', error);
        res.status(500).json({ message: 'Error following item' });
    }
});

app.post('/getUpdate', async (req, res) => {
    try {
        const { url } = req.body;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const html = await page.content();
        const $ = cheerio.load(html);

        const title = $('.title__font').text().trim();
        const price = $('.product-price__big').text().trim();
        const status = $('.status-label').text().includes('Є в наявності') || $('.status-label').text().includes('Закінчується');
        const imgUrl = $('.main-slider__item img').first().attr('src');

        const item = await Item.findOne({ url: url });

        if (item.title === title && item.price === price && item.status === status && item.image === imgUrl) {
            await browser.close();
            bot.sendMessage(process.env.CHAT_ID, `The data has not changed for item: ${title}`);
            return res.json({ message: 'The data has not changed' });
        } else {
            await Item.updateOne({ url: url }, { title, price, status, image: imgUrl });

            await browser.close();
            bot.sendMessage(process.env.CHAT_ID, `The data has changed for item: ${title}`);
            return res.json({ message: 'The data has changed', updatedItem: { title, price, status, image: imgUrl } });
        }
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Error fetching item' });
    }
});

app.delete('/deleteItem/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Item.findByIdAndDelete(id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

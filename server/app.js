const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const url = 'https://bt.rozetka.com.ua/ua/philips-ep4449-70/p424303650/'

app.post('/goodsTargetName', async (req, res) => {
    console.log(req.body);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
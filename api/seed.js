const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");



const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const MONGODB_URI = "mongodb+srv://test:test@cluster0.zfndztj.mongodb.net/loantracker?retryWrites=true&w=majority";


mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    });
    
// insert data to mongodb
const { Bank } = require("./models/index");


// (async () => {
//     // Bank.deleteMany({});
//     const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//     const page = await browser.newPage({ waitUntil: 'networkidle2' });
//     await page.goto('https://www.banksbd.org/banks', { waitUntil: 'networkidle2' });
//     const bankList = await page.evaluate(() => {
//         const bankList = [];
//         document.querySelectorAll('body > div.container > div > div.col-lg-8 > div.row.desktop > div.col-lg-4').forEach(async (el) => {
//             const bank = el.querySelector('div > p > a').innerText.trim();
//             const image = el.querySelector('div > p > a > img').src;
//             const link = el.querySelector('div > p > a').href;
//             const details = [];
//             await page.goto(link, { waitUntil: 'networkidle2' });
//             const html = await page.content();
//             const $ = cheerio.load(html);
//             // body > div.container > div > div.col-lg-8 > table > tbody
//             $('body > div.container > div > div.col-lg-8 > table > tbody').each((i, el) => {
//                 // body > div.container > div > div.col - lg - 8 > table > tbody > tr: nth - child(1)
//                 // body > div.container > div > div.col-lg-8 > table > tbody > tr:nth-child(1) > td:nth-child(2)
//                 const tr = el.querySelector('tr');
//                 const label = tr.querySelector('td:nth-child(1)').innerText;
//                 const td = tr.querySelector('td:nth-child(2)').innerText;
//                 details.push({ label, td });
//                 console.log(details);

//             });
//             bankList.push({ bank, image, link, details });
//         });
//         return bankList;
//     });
//     console.log(bankList);
//     // await Bank.insertMany(bankList);
//     await browser.close();
// })();







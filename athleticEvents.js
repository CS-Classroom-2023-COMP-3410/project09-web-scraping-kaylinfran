const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');
const path = require('path');

async function searchAthleticEvents() {
    
    const url = "https://denverpioneers.com/";

    const output = await fetch(url);
    const html = await output.text();
    // const $ = cheerio.load(html);

    // const duAthleticEvents = [];

    // data-bind="text: atVs"
    // data-bind="text: opponent.title"
    // data-bind="formatDate:date, format:'MMMM D, YYYY'"

 
    const match = html.match(/var\s+initialData\s*=\s*(\{.*?\});/s);
    if (!match) {
        console.log("Could not find the object");
        return;
    } 

    const obj = JSON.parse(match[1]); 
    const teamName = obj.extra.school_name;
    const events = obj.data;

    const duAthleticEvents = events.map(event => {
        return {
            duTeam: teamName,
            opponent: event.opponent.title,
            date: event.date
        }
    });

    // save results to a JSON file// Ensure results folder exists
    const resultsDir = path.join(__dirname, "results");
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir);
    }

    const filePath = path.join(resultsDir, "athletic_events.json");

    fs.writeFileSync(filePath, JSON.stringify(duAthleticEvents, null, 4));

    console.log("Athletic events saved to results");
}

searchAthleticEvents();

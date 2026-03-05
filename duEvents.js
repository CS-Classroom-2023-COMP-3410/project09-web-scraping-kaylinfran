const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const puppeteer = require('puppeteer');


async function scrapeEvents() {
    // url of the calendar page 
    const url = "https://www.du.edu/calendar";

    // get the html of the calendar page 
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // get the events from the page 
    const events = [];

    // loop through each event item on the page
    $(".events-listing__item").each((index, element) => {

        // grab the title of the event
        const title = $(element).find("h3").text().trim();

        // grab the date 
        const dateText = $(element).find("a > p").first().text().trim();

        // find time, which is in the paragraph
        let time = "";
        $(element).find("p").each((i, p) => {
            if ($(p).find(".icon-du-clock").length) {
                time = $(p).text().trim();
            }
    });

    // keep the march events only
    if (dateText.startsWith("March")) {
        const event = {
            title: title,
            date: dateText
        };

        // if there is a time, add it 
        if (time) {
            event.time = time;
        }
        events.push(event);
        }
    });

    const result = { events };
    // put output into json file in results folder
    await fs.writeJson("results/calendar_events.json", result, { spaces: 2 });
    console.log("calendar_events.json created in folder results");
}

scrapeEvents();
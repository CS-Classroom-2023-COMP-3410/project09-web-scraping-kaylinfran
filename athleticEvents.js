const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');

async function searchAthletics() {

    // Url of website
    const url = "https://denverpioneers.com/index.aspx";

    // grab the html
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // data 
    const events = [];

    // grab data by looping through 
    $("span.accessible-hide").each((index, element) => {
        // grab the team
        const duTeam = $(element).find('span[data-bind="text: sport.title"]').text().trim();
        // grab opponent
        const opponent = $(element).find('span[data-bind="text: opponent.title"]').text().trim();
        // grab the data 
        const date = $(element).find('span[data-bind*="formatDate"]').text().trim();

        // push the data to the events 
        if (duTeam && opponent && date) {
            events.push({
                duTeam: duTeam,
                opponent: opponent,
                date: date
            });
        }
    });
    // save the data to a json file
    await fs.ensureDir("results");
    await fs.writeJson("results/athletic_events.json", { events }, { spaces: 2 });
 
    console.log("Athletic events saved");
}

// was not able to get the data to load in but this is what I had
searchAthletics();
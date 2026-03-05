const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');

async function searchBulletin() {
    const url = "https://bulletin.du.edu/undergraduate/coursedescriptions/comp/";

    try {
        // get the html of the page
        const response = await axios.get(url);
        const html = response.data;

        // load the html into cheerio
        const $ = cheerio.load(html);

        // course data 
        let data = [];

        // loop through each course block title 
        $("p.courseblocktitle").each((index, element) => {
            // replace non-breaking spaces and trim the text
            const text = $(element).text().replace(/\u00a0/g, " ").trim();
            // console.log("text: ", text); // used for testing

            // grab the course code and title 
            const match = text.match(/(COMP \d{4}) (.+?) \(/);

            // if there is a match, process the course information
            if (match) {
                // first part of output
                const course = match[1].replace(" ", "-"); // put in correct format
                // second part of output
                const title = match[2];

                // get the course number
                const num = parseInt(match[1].split(" ")[1]);

                
                if (num >= 3000) {
                    // check if there is a pre-requisite listed
                    const prereqElement = $(element).nextAll("p.courseblockdesc").first();
                    const prereqText = prereqElement.text().replace(/\u00a0/g, " ").trim();

                    // if there is a pre-requisite, do not include it in the output
                    if (!prereqText.toLowerCase().includes("prerequisite")) {
                        data.push({ course, title });
                    } 
                }
            }
        });
            
        // output to json file
        const result = { courses: data };
        await fs.writeJson("results/bulletin.json", result, { spaces: 2 });

        console.log("Data saved to results/bulletin.json");

    } catch (error) {
        console.error("Error getting data:", error);
    }
}


searchBulletin();
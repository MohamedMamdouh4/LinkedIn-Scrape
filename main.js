const puppeteer = require('puppeteer');
const delayFunc = require('./delay')

const skills = ["CSS" , "HTML"]


const linkedInScrape = async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

  try {
        await page.goto('https://www.linkedin.com/login', { 
        waitUntil: "domcontentloaded",
        // timeout: 240000
        });
        // Log in to LinkedIn
        await page.type('#username', "andrewgeeklab@gmail.com");
        await page.type('#password', "01501150039Aa*");
        // await delayFunc.delay(100000)
        await page.click('.btn__primary--large.from__button--floating'); 
        await page.waitForNavigation({ timeout: 600000 })

        //////
        // Post the job
        //////
        await page.goto('https://www.linkedin.com/job-posting' , { 
            waitUntil: "domcontentloaded",
            timeout: 240000
        });
        await page.click('.artdeco-typeahead__input[placeholder="Add the title you are hiring for"]'); // Focus on the input field
          
        await page.keyboard.down('Control')
        await page.keyboard.press('A');
        await page.keyboard.up('Control'); 
        await page.keyboard.press('Backspace'); 
        await page.type('#job-title-typeahead-input-ember26', 'Software Engineer');
          
        /////

        await page.click('.artdeco-typeahead__input.job-posting-shared-company-typeahead__input'); // Company name
        await page.keyboard.down('Control'); 
        await page.keyboard.press('A');
        await page.keyboard.up('Control'); 
        await page.keyboard.press('Backspace');
        await page.type('#company-typeahead-input-ember34', 'orientation code'); 
        await delayFunc.delay(1000)
        /////

        await page.click('.artdeco-dropdown.artdeco-dropdown--placement-bottom.artdeco-dropdown--justification-left.ember-view'); // Workplace type
        await delayFunc.delay(1000)
        await page.keyboard.press('ArrowDown');
        await delayFunc.delay(1000);
        await page.keyboard.press('Enter');

        /////
        const jobLocation = await page.click('.artdeco-typeahead__input[placeholder=""]')
        await page.click('.artdeco-typeahead__input[placeholder=""]'); // Job location
        await page.click('.artdeco-typeahead__input[placeholder=""]'); // Job location
        await delayFunc.delay(2000)
        await page.keyboard.down('Control'); 
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await page.type('.artdeco-typeahead__input[placeholder=""]' , "Cai")
        await delayFunc.delay(2000)
        await page.keyboard.press('ArrowDown');
        await delayFunc.delay(2000)
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        ////
        await page.click('.job-posting-shared-job-type-dropdown__trigger') // Job type [Full-Time , Part-Time]
        await delayFunc.delay(2000)
        await page.keyboard.press('ArrowDown');
        await delayFunc.delay(2000)
        await page.keyboard.press('ArrowDown');
        await delayFunc.delay(2000)
        await page.keyboard.press('ArrowDown');
        await delayFunc.delay(2000)
        await page.keyboard.press('Enter');
        await delayFunc.delay(2000)

        /////
        await delayFunc.delay(2500)
        await page.click("form > button")
        // await delayFunc.delay(200)
        // await page.click("form button:last-child")

        await delayFunc.delay(4000)

        ////Second page////
        await page.click(".ql-editor")
        await page.keyboard.down('Control'); 
        await delayFunc.delay(1000)
        await page.keyboard.press('A');
        await delayFunc.delay(1000)
        await page.keyboard.up('Control');
        await delayFunc.delay(1000)
        await page.keyboard.press('Backspace');
        await delayFunc.delay(1000)
        await page.type(".ql-editor" , `Company Description
            we suggest you enter details here
            Role Description
            This is a full-time on-site role for a Backend Node.js Developer at Orientation Code in Cairo.
            Qualifications
            Proficiency in Node.js and Express.js
            Excellent communication skills and attention to detail`)
        await delayFunc.delay(5000)
        // Close skills section
        const closeSkills = await page.evaluate(() => {
            const closeButtons = document.querySelectorAll(".artdeco-pill.artdeco-pill--slate.artdeco-pill--2.artdeco-pill--dismiss.artdeco-pill--selected.ember-view.mv1.mr2.pv2");
            closeButtons.forEach(button => button.click());
            return closeButtons.length;
        });

        console.log(`Closed ${closeSkills} skill(s)`);

        // Add Skill section 
        
        for(let i = 0 ; i<skills.length ; i++)
        {
            await page.type(".artdeco-pill__input.job-posting-shared-job-skill-typeahead__ta-trigger" , skills[i]);
            await delayFunc.delay(1000)
            await page.keyboard.press("ArrowDown");
            await delayFunc.delay(1500)
            await page.keyboard.press("Enter");
        }

        await delayFunc.delay(1500)
        await page.click(".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view")
        await delayFunc.delay(2500)
        //// third page
        await page.click("input[name='job-posting-apply-method-value']")
        await delayFunc.delay(1000)
        await page.keyboard.down('Control'); 
        await delayFunc.delay(1000)
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await delayFunc.delay(1000)
        await page.keyboard.press('Backspace');
        await delayFunc.delay(1000)
        await page.type("input[name='job-posting-apply-method-value']", "andrewgeeklab@gmail.com");
        await delayFunc.delay(1000)
        // Close questions section
        const closeQuestions = await page.evaluate(() => {
        const closeButtons = document.querySelectorAll(".artdeco-button.artdeco-button--circle.artdeco-button--muted.artdeco-button--1.artdeco-button--tertiary.ember-view.artdeco-card__dismiss");
        closeButtons.forEach(button => button.click());
        return closeButtons.length;
        });
    
        console.log(`Closed ${closeQuestions} question(s)`);

        await delayFunc.delay(2500)
        page.click(".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view")
        await delayFunc.delay(9000)

        ////Final 
        await page.click(".job-posting-footer__secondary-cta.artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--secondary.ember-view")
    }
    catch (error) 
    {
        console.error('Error:', error);
        throw error;
    }
    finally 
    {
          // Get the current URL of the page
          const currentUrl = page.url();
          console.log('Current URL:', currentUrl);
    }
}

linkedInScrape()


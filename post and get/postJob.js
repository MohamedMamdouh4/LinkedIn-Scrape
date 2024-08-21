const puppeteer = require('puppeteer');
var delayFunc = require('../Utils/delay')


const postJob = async (job_title, contract_type , skills , description ,  user_name , password) => {
    const browser = await puppeteer.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

  try {
        await page.goto('https://www.linkedin.com/login', { 
        waitUntil: "domcontentloaded",
        });
        // Log in to LinkedIn
        await page.type('#username', user_name);
        await page.type('#password', password);
        await page.click('.btn__primary--large.from__button--floating'); 
        await page.waitForNavigation({ timeout: 600000 })

        //////
        // Post the job
        //////
        await page.goto('https://www.linkedin.com/job-posting' , { 
            waitUntil: "domcontentloaded",
        });
        await page.click('.artdeco-typeahead__input[placeholder="Add the title you are hiring for"]'); // Focus on the input field
          
        await page.keyboard.down('Control')
        await page.keyboard.press('A');
        await page.keyboard.up('Control'); 
        await page.keyboard.press('Backspace'); 
        await page.type('.artdeco-typeahead__input[placeholder="Add the title you are hiring for"]', job_title );
        console.log(`the feild of title has been inputed ${job_title}`)
        /////

        await page.click('.artdeco-typeahead__input.job-posting-shared-company-typeahead__input'); // Company name
        await page.keyboard.down('Control'); 
        await page.keyboard.press('A');
        await page.keyboard.up('Control'); 
        await page.keyboard.press('Backspace');
        await page.type('.artdeco-typeahead__input.job-posting-shared-company-typeahead__input', 'orientation code'); 
        await delayFunc.delay(1000)
        console.log(`the feild of com name has been inputed`)
        /////

        await page.click('.artdeco-dropdown.artdeco-dropdown--placement-bottom.artdeco-dropdown--justification-left.ember-view'); // Workplace type
        await delayFunc.delay(1000)
        await page.keyboard.press('ArrowDown');
        await delayFunc.delay(1000);
        await page.keyboard.press('Enter');
        console.log(`Workplace type selected`)
        /////
        const jobLocation = await page.click('.artdeco-typeahead__input[placeholder=""]')
        await page.click('.artdeco-typeahead__input[placeholder=""]'); // Job location
        await page.click('.artdeco-typeahead__input[placeholder=""]'); // Job location
        await delayFunc.delay(1000)
        await page.keyboard.down('Control'); 
        await page.keyboard.press('A');
        await page.keyboard.up('Control');
        await page.keyboard.press('Backspace');
        await page.type('.artdeco-typeahead__input[placeholder=""]' , "Maadi")
        await delayFunc.delay(2500)
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        console.log(`location selected`)
        ////
        await page.click('.job-posting-shared-job-type-dropdown__trigger') // Job type [Full-Time , Part-Time , .... , ....]
        await delayFunc.delay(1000)
        for(let i = 0 ; i < contract_type ; i++)
        {
            await page.keyboard.press('ArrowDown');
            await delayFunc.delay(100)
        }
        await page.keyboard.press('Enter');
        await delayFunc.delay(500)

        /////
        await delayFunc.delay(2500000)
        await page.click("form > button")
        // await delayFunc.delay(200)
        // await page.click("form button:last-child")

        await delayFunc.delay(4000)

        ////Second page////
        await page.click(".ql-editor")
        await page.keyboard.down('Control'); 
        await delayFunc.delay(500)
        await page.keyboard.press('A');
        await delayFunc.delay(500)
        await page.keyboard.up('Control');
        await delayFunc.delay(500)
        await page.keyboard.press('Backspace');
        await delayFunc.delay(500)
        await page.type(".ql-editor" , `${description}`)
        await delayFunc.delay(1200)
        console.log("description typed");
        
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
            await delayFunc.delay(2000)
            await page.keyboard.press("ArrowDown");
            await delayFunc.delay(1500)
            await page.keyboard.press("Enter");
        }

        await delayFunc.delay(1500)
        await page.click(".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view")
        await delayFunc.delay(2500)
        //// third page
        // await page.click("input[name='job-posting-apply-method-value']")
        // await delayFunc.delay(100)
        // await page.keyboard.down('Control'); 
        // await delayFunc.delay(100)
        // await page.keyboard.press('A');
        // await page.keyboard.up('Control');
        // await delayFunc.delay(100)
        // await page.keyboard.press('Backspace');
        // await delayFunc.delay(100)
        // await page.type("input[name='job-posting-apply-method-value']", user_name);
        await delayFunc.delay(1400)
        // Close questions section
        
        const closeQuestions = await page.evaluate(() => {
        const closeButtons = document.querySelectorAll(".artdeco-button.artdeco-button--circle.artdeco-button--muted.artdeco-button--1.artdeco-button--tertiary.ember-view.artdeco-card__dismiss");
        closeButtons.forEach(button => button.click());
        return closeButtons.length;
        });
    
        console.log(`Closed ${closeQuestions} question(s)`);
        // Add question section
        await delayFunc.delay(2500)
        page.click(".artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view")
        await delayFunc.delay(9000)

        ////Final 
        await page.click(".job-posting-footer__secondary-cta.artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--secondary.ember-view")
        console.log("task has been finished");
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

module.exports = 
{
    postJob
}


const puppeteer = require("puppeteer");
const delayFunc = require("./delay");

const linkedInScrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  

  await page.setViewport({ width: 1920, height: 1080 });

  try {
    await page.goto("https://www.linkedin.com/login", {
      waitUntil: "domcontentloaded",
      timeout: 240000,
    });
    await page.type("#username", "andrewgeeklab@gmail.com");
    await page.type("#password", "01501150039Aa*");
    await page.click('button[aria-label="Sign in"]');
    await page.waitForNavigation({ timeout: 600000 });

    await page.goto("https://www.linkedin.com/my-items/posted-jobs/", {
      waitUntil: "domcontentloaded",
      timeout: 240000,
    });
    await delayFunc.delay(20000);
    await page.click(".workflow-results-container ul li a.app-aware-link");
    await delayFunc.delay(10000);

    await page.evaluate(() => {
      const button = Array.from(
        document.querySelectorAll(".hiring-job-top-card button.artdeco-button")
      ).find((btn) => btn.innerText.trim() === "View applicants");

      if (button) {
        button.click();
      }
    });

    await delayFunc.delay(5000); 
    const applicantURLs = await page.evaluate(() => {
      const anchors = document.querySelectorAll(".artdeco-list li a");
      return Array.from(anchors).slice(0,3).map((anchor) => {
        let href = anchor.href;
        if (href.startsWith("/")) {
          href = `https://www.linkedin.com${href}`;
        }
        return href;
      });
    });

    console.log("Applicant URLs:", applicantURLs); 

    const extractApplicantDetails = async (urls) => {
      const details = [];
    
      for (const url of urls) {
        const applicantPage = await browser.newPage();
        
        // Maximize each new tab
        await applicantPage.setViewport({ width: 1920, height: 1080 });
        
        try {
          await applicantPage.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 120000,
          });

          // Click the "More" button to reveal additional data
          await applicantPage.click(".hiring-applicant-header-actions > div:last-of-type button");
          await delayFunc.delay(2000); // Wait for the data to load

          // Extract name
          const name = await applicantPage.evaluate(() => {
            const nameElement = document.querySelector(
              "h1.display-flex.align-items-center.t-24"
            );
            return nameElement
              ? nameElement.innerText.split("’s application")[0].trim()
              : null;
          });

          // Extract profile link, email, and phone
          const { profileLink, email, phone } = await applicantPage.evaluate(() => {
            const dropdownItems = document.querySelectorAll('.artdeco-dropdown__content-inner ul li');
            const result = {};

            if (dropdownItems.length >= 3) {
              // First <li> for profileLink
              const profileElement = dropdownItems[0].querySelector('a');
              result.profileLink = profileElement ? profileElement.href : null;

              // Second <li> for email
              const emailElement = dropdownItems[1].querySelector('.hiring-applicant-header-actions__more-content-dropdown-item-text');
              result.email = emailElement ? emailElement.textContent.trim() : null;

              // Third <li> for phone
              const phoneElement = dropdownItems[2].querySelector('hiring-applicant-header-actions__more-content-dropdown-item-text');
              result.phone = phoneElement ? phoneElement.textContent.trim() : null;
            }

            return result;
          });

          if (name) {
            details.push({ url, name, profileLink, email, phone });
          }
    
          await delayFunc.delay(2000);
        } catch (error) {
          console.error(`Failed to extract details from ${url}:`, error);
        } finally {
          await applicantPage.close();
        }
      }
    
      return details;
    };
    
    const applicantNames = await extractApplicantDetails(applicantURLs);

    return { applicantURLs, applicantNames };
  } catch (error) {
    console.error("Error:", error);
    // throw error;
  } finally {
    await browser.close();
  }
};

module.exports = {
    linkedInScrape
}
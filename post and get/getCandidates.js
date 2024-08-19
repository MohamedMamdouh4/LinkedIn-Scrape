const fs = require("fs");
const path = require("path");
const delayFunc = require("../Utils/delay");
const PORT = 3000;

const extractApplicantDetails = async (urls, page) => {
  const details = [];
  const downloadDir = path.resolve(__dirname, '../downloaded CV');

  for (const url of urls) {
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 120000,
      });

      // Click the "More" button to reveal additional data
      await page.click(".hiring-applicant-header-actions > div:last-of-type button");
      await delayFunc.delay(2000); // Wait for the data to load

      // Extract name
      const name = await page.evaluate(() => {
        const nameElement = document.querySelector(
          "h1.display-flex.align-items-center.t-24"
        );
        return nameElement
          ? nameElement.innerText.split("’s application")[0].trim()
          : null;
      });

      // Extract profile link, email, and phone from three li > ul 
      const { profileLink, email, phone } = await page.evaluate(() => {
        const dropdownItems = document.querySelectorAll('.artdeco-dropdown__content-inner ul li');
        const result = {};

        if (dropdownItems.length >= 3) {
          const profileElement = dropdownItems[0].querySelector('a');
          result.profileLink = profileElement ? profileElement.href : null;

          const emailElement = dropdownItems[1].querySelector('.hiring-applicant-header-actions__more-content-dropdown-item-text');
          result.email = emailElement ? emailElement.textContent.trim() : null;

          const phoneElement = dropdownItems[2].querySelector('.hiring-applicant-header-actions__more-content-dropdown-item-text');
          result.phone = phoneElement ? phoneElement.textContent.trim() : null;
        }

        return result;
      });

      // Download CV to the local folder 
      let cvPath = null;
      try {
        const cvDownloadElement = await page.$('.display-flex.justify-space-between.align-items-flex-start.pl5.pr5.pt5.pb3 a');
        if (cvDownloadElement) {
          await cvDownloadElement.click();
          await delayFunc.delay(5000); // Wait for the download to complete

          const fileName = `${name.replace(/\s+/g, '_')}.pdf`;
          cvPath = path.join(downloadDir, fileName);

          // set CV Name to the applicant's name
          const files = fs.readdirSync(downloadDir);
          const latestFile = files.map(file => ({
            name: file,
            time: fs.statSync(path.join(downloadDir, file)).mtime.getTime()
          }))
          .sort((a, b) => b.time - a.time)
          .map(file => file.name)[0];

          fs.renameSync(path.join(downloadDir, latestFile), cvPath);
        }
      } catch (cvError) {
        console.log(`No CV found in this url for ${name}: ${cvError.message}`);
      }

      if (name) {
        details.push({
          url,
          name,
          profileLink,
          email,
          phone,
          cvPath: cvPath ? `http://localhost:${PORT}/downloadedCV/${path.basename(cvPath)}` : null
        });
      }

      await delayFunc.delay(4000);
    } catch (error) {
      console.error(`Failed to extract details from ${url}:`, error);
    }
  }
  return details;
};

module.exports = { extractApplicantDetails };

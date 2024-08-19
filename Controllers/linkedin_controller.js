const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const delayFunc = require("../Utils/delay");
const jobPost = require('../post and get/postJob')
const candidatesInfo = require('../post and get/getCandidates')

const postJob = async(req , res) => {
  const {job_title, contract_type , skills } = req.body;
  if(!job_title || !contract_type || !skills)
  {
    res.status(500).json({ success: false, message:"missing val" });
  }
  try 
  {
    const result = await jobPost.postJob(job_title, contract_type , skills );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

const getApplicants = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });

  // Set download behavior in the roooooooooooooooooot of project 
  const downloadPath = path.resolve(__dirname, '../downloaded CV');
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
  }
  await page._client().send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: downloadPath,
  });

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
      return Array.from(anchors).slice(0, 2).map((anchor) => {
        let href = anchor.href;
        if (href.startsWith("/")) {
          href = `https://www.linkedin.com${href}`;
        }
        return href;
      });
    });

    console.log("Applicant URLs:", applicantURLs);

    const applicantDetails = await candidatesInfo.extractApplicantDetails(applicantURLs , page );

    return { applicantURLs, applicantDetails };
  } catch (error) {
    console.error("Error:", error);
    return error
  } finally {
    await browser.close();
  }
};

module.exports = {
  postJob,
  getApplicants
};
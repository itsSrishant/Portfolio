import puppeteer from 'puppeteer';

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // Set viewport to a good laptop size for screenshots
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  console.log("Navigating to https://seo-optimiz.vercel.app/ ...");
  await page.goto('https://seo-optimiz.vercel.app/', { waitUntil: 'networkidle2' });
  
  // Wait for the input field to be ready
  await page.waitForSelector('input[type="url"], input[type="text"]');
  
  console.log("Entering URL to test...");
  await page.type('input[type="url"], input[type="text"]', 'https://seo-optimiz.vercel.app/');
  
  // Press enter
  await page.keyboard.press('Enter');
  
  console.log("Waiting for analysis to complete (giving it 20 seconds)...");
  // Wait for some time or until a specific element appears. A 20 second timeout is safe.
  await new Promise(r => setTimeout(r, 20000));
  
  console.log("Taking main screenshot...");
  await page.screenshot({ path: './public/seo-main.png' });
  
  console.log("Scrolling and taking score screenshot...");
  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: './public/seo-score.png' });
  
  console.log("Scrolling and taking issues screenshot...");
  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: './public/seo-issues.png' });

  await browser.close();
  console.log("Done!");
})();

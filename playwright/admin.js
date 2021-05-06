const playwright = require('playwright');

(async () => {
  const browserType = 'chromium';
  const browser = await playwright[browserType].launch({headless: false});
  const context = await browser.newContext();
  const page = await context.newPage();

    await page.waitForTimeout(1000);

})();

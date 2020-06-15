const playwright = require('playwright');

(async () => {
  for (const browserType of ['chromium']) {
    const browser = await playwright[browserType].launch({headless: false});
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('http://localhost:18080/nulab-account-web');
    await page.fill('input[name="email"]', 'administrator@nulab-inc.com');
    await page.click('button[type="submit"]');

    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:18080/nulab-account-admin');

    await page.goto('http://localhost:18080/nulab-account-admin/spaces/create');
    await page.fill('input[name="planKey"]', 'backlog.starter');
    await page.fill('input[name="clientId"]', 'localhost.register.backlog');
    await page.click('input[type="submit"]');

    await page.waitForSelector('input[type="radio"][value="__NEW_ORGANIZATION__"]', { state: 'attached' });

    await page.click('input[type="radio"][value="__NEW_ORGANIZATION__"]');
    await page.fill('input[name="name"]', 'test3');
    await page.click('button[type="submit"]');

    //await page.screenshot({ path: `example-${browserType}.png` });
    await browser.close();
  }
})();

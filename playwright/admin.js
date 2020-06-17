const playwright = require('playwright');

(async () => {
  const browserType = 'chromium';
  const browser = await playwright[browserType].launch({headless: false});
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:18080/nulab-account-web');
  await page.fill('input[name="email"]', 'administrator@nulab-inc.com');
  await page.click('button[type="submit"]');

  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  await page.goto('http://localhost:18080/nulab-account-web');

  await page.goto('http://localhost:18080/nulab-account-web/api/v7/account/ADMINISTRATORACCOUNTXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/spaces');

  const aHandle = await page.evaluateHandle(() => document.body);
  const resultHandle = await page.evaluateHandle(body => body.innerText, aHandle);
  const spaceJson = JSON.parse(await resultHandle.jsonValue());
  await resultHandle.dispose();
  await aHandle.dispose();

  for (let i=1; i<=2; i++) {
    const spaceKey = spaceJson[i].key;
    console.log(spaceKey);

    await page.goto(`http://localhost:18080/nulab-account-payment/space/${spaceKey}/payment/change_billing_to`);

    await page.fill('input[id="business-postal-code"]', '810-0073');
    await page.fill('input[id="business-state"]', 'Fukuoka');
    await page.fill('input[id="business-city"]', 'Fukuoka');
    await page.fill('input[id="business-address1"]', 'Akasaka');

    await page.fill('input[id="business-representative-last-name"]', 'Murakami');

    await page.fill('input[id="business-representative-first-name"]', 'Takuya');
    
    await page.goto(`http://localhost:18080/nulab-account-payment/space/${spaceKey}/payment?upgradeFromTrial&productKey=backlog`);
    await page.click('button[class="src-components-atoms-Buttons-index__medium--10NNp src-components-atoms-Buttons-index__primaryButton--1dOof"]');

    await page.waitForTimeout(1000);
  }



  // for (const space of ['test1', 'test2', 'test3']) {

  //   await page.goto('http://localhost:18080/nulab-account-admin/spaces/create');
  //   await page.fill('input[name="planKey"]', 'backlog.starter');
  //   await page.fill('input[name="clientId"]', 'localhost.register.backlog');
  //   await page.click('input[type="submit"]');

  //   await page.waitForSelector('input[type="radio"][value="__NEW_ORGANIZATION__"]', { state: 'attached' });

  //   const span = await page.waitForSelector('//label[@for="newOrganizationRadio"]/span');
  //   await page.waitForTimeout(1000);
  //   await span.click();

  //   await page.fill('input[name="name"]', space);
  //   await page.click('button[type="submit"]');


  //   await page.screenshot({ path: `example-${browserType}.png` });
     await browser.close();
  // }


})();

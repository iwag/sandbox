const playwright = require('playwright');

(async () => {
   const browserType = 'chromium';
   const browser = await playwright[browserType].launch({headless: true, devtools: false});
   const context = await browser.newContext({viewport: {width:720, height:720}});
   const page = await context.newPage(); 

   await page.goto('https://www.youtube-nocookie.com/embed/kJdp-hJxrAk?start=' + (20*60+18));

    
   await page.click('[aria-label="Play"]');
   await page.waitForLoadState();

   await page.waitForSelector(':not(.unstarted-mode).playing-mode', {timeout:1000});

   const el = await page.$('video');
   await el.screenshot({path: 'screen.png'});

   return browser.close();
})();

console.log('done');
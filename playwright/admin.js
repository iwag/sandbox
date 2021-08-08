const playwright = require('playwright');

/**
 * 
 * @param {string} vid 
 * @param {string} time 
 */
const capture = async (vid, time) => {
   const browserType = 'chromium';
   const browser = await playwright[browserType].launch({headless: false, devtools: true});
   const context = await browser.newContext({viewport: {width:720, height:720}, locale: 'en-US'});
   const page = await context.newPage(); 

   const min = Number(time.split(":")[0]);
   const sec = Number(time.split(":")[1]);
   await page.goto('https://www.youtube-nocookie.com/embed/'+ vid+ '?start=' + (min*60+sec));

    
   await page.click('[aria-label="Play"]');
   await page.waitForLoadState();

   await page.waitForSelector(':not(.unstarted-mode).playing-mode', {timeout:1000});

   const el = await page.$('video');
   await el.screenshot({path: 'screen' + '.png'});
   console.log(await page.title());
   await browser.close();
};

const url = new URL("https://www.youtube.com/watch?v=kJdp-hJxrAk")
capture(url.searchParams.get("v"), "20:18");

console.log('done');
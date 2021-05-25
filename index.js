const playwright = require('playwright');
const sha1 = require('sha1');
const fs = require('fs');
const readLastLines = require('read-last-lines');
const notifier = require('node-notifier');


(async () => {
   for (const browserType of ['chromium']) {
      const browser = await playwright[browserType].launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto('https://www.impfzentrum-dueren.de/');
      // await page.screenshot({ path: `example-${browserType}.png` });
      const content = await page.content();
      const hash = sha1(content);
      // console.log(hash);

      const oldHash = await readLastLines.read('message.txt', 1)

      fs.appendFile('message.txt', hash + "\n", function (err) {
         if (err) throw err;
         //console.log('Saved!');
      });

      if(oldHash.trim() !== hash.trim()) {
         
         console.log("ALARM!");
         notifier.notify({
            title: 'Impfzentrum',
            message: 'Die Seite hat sich geändert!'
         });
      }
      


      await browser.close();
   }
})();
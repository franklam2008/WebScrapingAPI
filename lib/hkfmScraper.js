const puppeteer = require("puppeteer");

async function hkfmScraper(input) {
  const url =
    "https://www.hkfm.info/%E7%AF%80%E7%9B%AE/%e6%97%a9%e9%9c%b8%e7%8e%8b";
  // const url =
  //   "http://www.hkfm.info/%E7%AF%80%E7%9B%AE/%e5%9c%a8%e6%99%b4%e6%9c%97%e7%9a%84%e4%b8%80%e5%a4%a9%e5%87%ba%e7%99%bc";
  // const url ="http://www.hkfm.info/%E7%AF%80%E7%9B%AE/%e5%8f%a3%e6%b0%b4%e5%a4%9a%e9%81%8e%e6%b5%aa%e8%8a%b1";

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();
  await page.goto(url);
  //main-start

  const scrapedData = await page.$$eval("article.type-post", els =>
    els.map(el => {
      const data = {};
      data.id = el.id;
      data.name = el.getElementsByClassName(
        "entry-title"
      )[0].children[0].textContent;
      if (el.getElementsByTagName("audio")[0]) {
        data.fileURL = el.getElementsByTagName("audio")[0].src.replace("http://", "https://");
      }
      data.directLink = el.getElementsByClassName(
        "entry-title"
      )[0].children[0].href;
      return data;
    })
  );
  const scrapedDatas = scrapedData.slice(0, 10);
  console.log('hkfmDataRan');

  //main-end
  browser.close();

  return scrapedDatas;
}

module.exports = {
  hkfmScraper
};

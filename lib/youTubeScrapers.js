const puppeteer = require("puppeteer");

async function youTubeScrapers(input) {
  const url = "https://www.youtube.com/results?search_query=" + input;
  // const browser = await puppeteer.launch();
  console.log(url);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox"
    ]
  });

  const page = await browser.newPage();
  await page.goto(url);

  //name
  const [el] = await page.$x(
    "/html/body/ytd-app/div/ytd-page-manager/ytd-search/div[1]/ytd-two-column-search-results-renderer/div/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-video-renderer[1]/div[1]/div/div[1]/div/h3/a/yt-formatted-string"
  );
  const text = await el.getProperty("textContent");
  const name = await text.jsonValue();
  //fileURL
  const [el2] = await page.$x(
    "/html/body/ytd-app/div/ytd-page-manager/ytd-search/div[1]/ytd-two-column-search-results-renderer/div/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-video-renderer[1]/div[1]/ytd-thumbnail/a/yt-img-shadow/img"
  );
  const src = await el2.getProperty("src");
  const fileURL = await src.jsonValue();
  //link
  const [el3] = await page.$x(
    "/html/body/ytd-app/div/ytd-page-manager/ytd-search/div[1]/ytd-two-column-search-results-renderer/div/ytd-section-list-renderer/div[2]/ytd-item-section-renderer/div[3]/ytd-video-renderer[1]/div[1]/ytd-thumbnail/a"
  );
  const href = await el3.getProperty("href");
  const link = await href.jsonValue();

  browser.close();

  return { name, fileURL, link };
}

module.exports = {
  youTubeScrapers
};

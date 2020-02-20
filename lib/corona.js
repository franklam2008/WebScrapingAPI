const puppeteer = require("puppeteer");

async function corona() {
  const url =
    "https://www.worldometers.info/coronavirus/";


  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  });
  const page = await browser.newPage();
  await page.goto(url);
  //main-start
  
  //3 main number
  const mainNumbers = await page.$$eval("div.maincounter-number", els =>
    els.map(el =>  el.children[0].textContent)
  );
  //number_table
  const number_table = await page.$$eval("span.number-table", els =>
    els.map(el =>  el.textContent)
  );
  const number_table_main = await page.$$eval("div.number-table-main", els =>
  els.map(el =>  el.textContent)
);
 //insert into sample
 const coronaData={
  'Total Case':mainNumbers[0],
  'Deaths':mainNumbers[1],
  'Recovered':mainNumbers[2],
  'Mild Condition':number_table[0],
  'critical':number_table[1],
  'Currently Infected':number_table_main[0],
  'Case With Outcome':number_table_main[1],
 }

 console.log('coronaDataRan');
 console.log(coronaData);
 
browser.close();


return coronaData;
}

module.exports = {
  corona
};

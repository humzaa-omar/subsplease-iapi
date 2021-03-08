const puppeteer = require("puppeteer");
const url = `https://subsplease.org/shows/go-toubun-no-hanayome-s2/`;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector(".episode-title");

  const titlesFinal = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll("table tr td"));
    const rows = tds.map((td) => td.innerText);
    const rowsDate = rows.filter((text) => {
      if (text.includes(`/`)) {
        return false;
      } else {
        return true;
      }
    });
    const rowsFinal = rowsDate.filter((text) => {
      if (text.includes(`New!`)) {
        return false;
      } else {
        return true;
        All;
      }
    });

    return rowsFinal;
  });

  const linksFinal = await page.evaluate(() => {
    let array = Array.from(document.querySelectorAll("table tr td a"));
    let arrayFinal = array.map((e) => e.href);

    return arrayFinal;
  });

  console.log(titlesFinal);
  console.log(linksFinal);
  await browser.close();
})();

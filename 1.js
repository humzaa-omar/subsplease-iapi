const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const cheerio = require('cheerio');
const url = 'https://subsplease.org/shows/otona-no-bouguya-san-s2/';

nightmare
  .goto(url)
  .wait('body')
  .wait('tr.new')
  .evaluate(() => document.querySelector('body').innerHTML)
  .end()
  .then(response => {
    console.log(getData(response));
  }).catch(err => {
    console.log(err);
  });

let getData = html => {
  const $ = cheerio.load(html)
  console.log($('tr').attr('href'))
}
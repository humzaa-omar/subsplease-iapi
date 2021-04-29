var Parser = require("rss-parser");
const puppeteer = require("puppeteer");
var parser = new Parser();
var express = require("express");
var app = express();
var port = process.env.PORT || 80;
var help = require("./help.json");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.get("/api/v1", function (req, res) {
  res.json(help);
});
app.get("/api/v1/show/:show", function (req, res) {
  (async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`https://subsplease.org/shows/${req.params.show}`);
    await page.waitForSelector(".episode-title");

    const showName = await page.evaluate(() => {
      return document.querySelector("h1.entry-title").innerHTML;
    });

    const titles = await page.evaluate(() => {
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
        }
      });

      return rowsFinal;
    });

    const dates = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll("table tr td"));
      const rows = tds.map((td) => td.innerText);
      const filterDates = rows.filter((text) => {
        if (text.includes(`/`)) {
          return true;
        } else {
          return false;
        }
      });

      return filterDates;
    });

    const magnets = await page.evaluate(() => {
      let array = Array.from(document.querySelectorAll("table tr td a"));
      let arrayMapped = array.map((e) => e.href);
      const arrayFinal = arrayMapped.filter((text) => {
        if (text.includes(`magnet`)) {
          return true;
        } else {
          return false;
        }
      });

      let HD = arrayFinal.filter((text) => {
        if (text.includes(`1080p`)) {
          return true;
        } else {
          return false;
        }
      });

      let hd = arrayFinal.filter((text) => {
        if (text.includes(`720p`)) {
          return true;
        } else {
          return false;
        }
      });

      let SD = arrayFinal.filter((text) => {
        if (text.includes(`480p`) || text.includes(`540p`)) {
          return true;
        } else {
          return false;
        }
      });

      return {
        HD: HD,
        hd: hd,
        SD: SD,
      };
    });

    const XDCC = await page.evaluate(() => {
      let array = Array.from(document.querySelectorAll("table tr td a"));
      let arrayMapped = array.map((e) => e.href);
      const arrayFinal = arrayMapped.filter((text) => {
        if (text.includes(`xdcc`)) {
          return true;
        } else {
          return false;
        }
      });
      let HD = arrayFinal.filter((text) => {
        if (text.includes(`1080p`)) {
          return true;
        } else {
          return false;
        }
      });

      let hd = arrayFinal.filter((text) => {
        if (text.includes(`720p`)) {
          return true;
        } else {
          return false;
        }
      });

      let SD = arrayFinal.filter((text) => {
        if (text.includes(`480p`) || text.includes(`540p`)) {
          return true;
        } else {
          return false;
        }
      });

      return {
        HD: HD,
        hd: hd,
        SD: SD,
      };
    });
    const torrents = await page.evaluate(() => {
      let array = Array.from(document.querySelectorAll("table tr td a"));
      let arrayMapped = array.map((e) => e.href);
      const arrayFinal = arrayMapped.filter((text) => {
        if (text.includes(`https://nyaa.si/view`)) {
          return true;
        } else {
          return false;
        }
      });

      return arrayFinal;
    });
    `{"title":"${showName}","episodes":[]}`;
    const json = {
      title: showName,
      episodes: [],
    };

    titles.forEach((currentValue, index) => {
      let episodeNumber = currentValue.split("— " || "- ").pop();
      let date = dates[index];
      let magnet = {
        1080: magnets.HD[index],
        720: magnets.hd[index],
        480: magnets.SD[index],
      };
      let torrent = {};
      let xdcc = {
        1080: XDCC.HD[index],
        720: XDCC.hd[index],
        480: XDCC.SD[index],
      };
      let obj = {
        episode: episodeNumber,
        dateReleased: date,
        links: {
          "1080p": {
            magnet: magnet[1080],
            //torrent: torrent,
            XDCC: xdcc[1080],
          },
          "720p": {
            magnet: magnet[720],
            //torrent: torrent,
            XDCC: xdcc[720],
          },
          "480p": {
            magnet: magnet[480],
            //torrent: torrent,
            XDCC: xdcc[480],
          },
        },
      };
      json.episodes[index] = obj;
    });
    res.json(json);
    await browser.close();
  })();
});

app.get("/api/v1/feed/magnet/1080p", function (req, res) {
  parser.parseURL("https://subsplease.org/rss/?r=1080", function (err, feed) {
    res.json(feed);
  });
});
app.get("/api/v1/feed/magnet/720p", function (req, res) {
  parser.parseURL("https://subsplease.org/rss/?r=720", function (err, feed) {
    res.json(feed);
  });
});
app.get("/api/v1/feed/magnet/sd", function (req, res) {
  parser.parseURL("https://subsplease.org/rss/?r=sd", function (err, feed) {
    res.json(feed);
  });
});
app.get("/api/v1/feed/magnet/all", function (req, res) {
  parser.parseURL("https://subsplease.org/rss", function (err, feed) {
    res.json(feed);
  });
});
app.get("/api/v1/feed/torrent/1080p", function (req, res) {
  parser.parseURL("https://subsplease.org/rss/?t&r=1080", function (err, feed) {
    res.json(feed);
  });
});
app.get("/api/v1/feed/torrent/720p", function (req, res) {
  parser.parseURL("https://subsplease.org/rss/?t&r=720", function (err, feed) {
    res.json(feed);
  });
});
app.get("/api/v1/feed/torrent/sd", function (req, res) {
  parser.parseURL("https://subsplease.org/rss/?t&r=sd", function (err, feed) {
    res.json(feed);
  });
});
app.get("/api/v1/feed/torrent/all", function (req, res) {
  parser.parseURL("https://subsplease.org/rss?t", function (err, feed) {
    res.json(feed);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

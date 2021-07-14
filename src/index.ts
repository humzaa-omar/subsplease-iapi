import Parser from "rss-parser";
import express, { response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { prettyPrintJson } from "pretty-print-json";
let app = express();
let parser = new Parser();
let port = process.env.PORT ? process.env.PORT : 3000;

interface basePathJSON {
  version: number | string;
  status: number | string;
  creator: string;
  endpoints: {
    torrent: {
      "1080p": string;
      "720p": string;
      "480p": string;
      any: string;
    };
    magnet: {
      "1080p": string;
      "720p": string;
      "480p": string;
      any: string;
    };
    show: string;
  };
}

const basePathJSON = (c: any) => {
  return {
    version: 2,
    status: c,
    name: "Intermediate SubsPlease API",
    creator: "Humzaa Omar",
    endpoints: {
      feeds: {
        torrent: {
          "1080p": "/api/v2/feed/torrent/1080",
          "720p": "/api/v2/feed/torrent/720",
          "480p": "/api/v2/feed/torrent/480",
          all: "/api/v2/feed/torrent/all",
        },
        magnet: {
          "1080p": "/api/v2/feed/magnet/1080",
          "720p": "/api/v2/feed/magnet/720",
          "480p": "/api/v2/feed/magnet/480",
          all: "/api/v2/feed/magnet/all",
        },
      },
      show: "/api/v2/show/<SubsPlease Show Path>",
    },
  };
};

const fancy = (i: any, dark?: any) => {
  return `
  <style>
  /*! pretty-print-json ~ github.com/center-key/pretty-print-json ~ MIT License */
  body                { background: #282C34 }
  .json-key           { color: indianred; }
  .json-string        { color: darkkhaki; }
  .json-number        { color: deepskyblue; }
  .json-boolean       { color: mediumseagreen; }
  .json-null          { color: darkorange; }
  .json-mark          { color: silver; }
  a.json-link         { color: mediumorchid; transition: all 400ms; }
  a.json-link:visited { color: slategray; }
  a.json-link:hover   { color: violet; }
  a.json-link:active  { color: silver; }
  </style>
  <pre id="json">${prettyPrintJson.toHtml(i, {
    linkUrls: true,
  })}</pre>`;
};

app.set("json spaces", 2);
app.get("/", (req, res) => {
  res.redirect("/api/v2");
});
app.get("/api/v2", (req, res) => {
  req.query.fancy
    ? res.send(fancy(basePathJSON(res.statusCode), req.query.color))
    : res.type("json").json(basePathJSON(res.statusCode));
});
app.get("/api/v2/show/:show", async (req, res) => {
  try {
    const ipInfo: any = await axios.get(`http://ipinfo.io/json?ip="${req.ip}"`);
    const tz: string = ipInfo.data.timezone;
    const pageSrc: any = await axios.get(
      `https://subsplease.org/shows/${req.params.show}`
    );
    const $ = cheerio.load(pageSrc.data);
    const sid: number | string | any = $("#show-release-table").attr("sid");
    const data: any = await axios.get(
      `https://subsplease.org/api/?f=show&tz=${tz}&sid=${sid}`
    );
    req.query.fancy
      ? res.send(fancy(data.data))
      : res.type("json").json(data.data);
  } catch (err) {
    res.sendStatus(500);
    console.error(err);
  }
});
app.get("/api/v2/feed/magnet/1080", (req, res) => {
  parser.parseURL("https://subsplease.org/rss/?r=1080", (err, feed) => {
    err
      ? res.json(err)
      : req.query.fancy
      ? res.send(fancy(feed))
      : res.type("json").json(feed);
  });
});
app.get("/api/v2/feed/magnet/720", (req, res) => {
  parser.parseURL("https://subsplease.org/rss/?r=720", (err, feed) => {
    err
      ? res.json(err)
      : req.query.fancy
      ? res.send(fancy(feed))
      : res.type("json").json(feed);
  });
});
app.get("/api/v2/feed/magnet/480", (req, res) => {
  parser.parseURL("https://subsplease.org/rss/?r=sd", (err, feed) => {
    err
      ? res.json(err)
      : req.query.fancy
      ? res.send(fancy(feed))
      : res.type("json").json(feed);
  });
});
app.get("/api/v2/feed/magnet/all", (req, res) => {
  parser.parseURL("https://subsplease.org/rss", (err, feed) => {
    err
      ? res.json(err)
      : req.query.fancy
      ? res.send(fancy(feed))
      : res.type("json").json(feed);
  });
});
app.get("/api/v2/feed/torrent/1080", (req, res) => {
  parser.parseURL("https://subsplease.org/rss/?t&r=1080", (err, feed) => {
    err
      ? res.json(err)
      : req.query.fancy
      ? res.send(fancy(feed))
      : res.type("json").json(feed);
  });
});
app.get("/api/v2/feed/torrent/720", (req, res) => {
  parser.parseURL("https://subsplease.org/rss/?t&r=720", (err, feed) => {
    err
      ? res.json(err)
      : req.query.fancy
      ? res.send(fancy(feed))
      : res.type("json").json(feed);
  });
});
app.get("/api/v2/feed/torrent/480", (req, res) => {
  parser.parseURL("https://subsplease.org/rss/?t&r=sd", (err, feed) => {
    err
      ? res.json(err)
      : req.query.fancy
      ? res.send(fancy(feed))
      : res.type("json").json(feed);
  });
});
app.get("/api/v2/feed/torrent/all", (req, res) => {
  parser.parseURL("https://subsplease.org/rss?t", (err, feed) => {
    err
      ? res.json(err)
      : req.query.fancy
      ? res.send(fancy(feed))
      : res.type("json").json(feed);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/*
          _____                    _____                    _____                    _____                            _____                _____
         /\    \                  /\    \                  /\    \                  /\    \                          /\    \              |\    \
        /::\____\                /::\    \                /::\    \                /::\    \                        /::\    \             |:\____\
       /::::|   |               /::::\    \              /::::\    \              /::::\    \                      /::::\    \            |::|   |
      /:::::|   |              /::::::\    \            /::::::\    \            /::::::\    \                    /::::::\    \           |::|   |
     /::::::|   |             /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \                  /:::/\:::\    \          |::|   |
    /:::/|::|   |            /:::/__\:::\    \        /:::/  \:::\    \        /:::/__\:::\    \                /:::/__\:::\    \         |::|   |
   /:::/ |::|   |           /::::\   \:::\    \      /:::/    \:::\    \      /::::\   \:::\    \              /::::\   \:::\    \        |::|   |
  /:::/  |::|___|______    /::::::\   \:::\    \    /:::/    / \:::\    \    /::::::\   \:::\    \            /::::::\   \:::\    \       |::|___|______
 /:::/   |::::::::\    \  /:::/\:::\   \:::\    \  /:::/    /   \:::\ ___\  /:::/\:::\   \:::\    \          /:::/\:::\   \:::\ ___\      /::::::::\    \
/:::/    |:::::::::\____\/:::/  \:::\   \:::\____\/:::/____/     \:::|    |/:::/__\:::\   \:::\____\        /:::/__\:::\   \:::|    |    /::::::::::\____\
\::/    / ~~~~~/:::/    /\::/    \:::\  /:::/    /\:::\    \     /:::|____|\:::\   \:::\   \::/    /        \:::\   \:::\  /:::|____|   /:::/~~~~/~~
 \/____/      /:::/    /  \/____/ \:::\/:::/    /  \:::\    \   /:::/    /  \:::\   \:::\   \/____/          \:::\   \:::\/:::/    /   /:::/    /
             /:::/    /            \::::::/    /    \:::\    \ /:::/    /    \:::\   \:::\    \               \:::\   \::::::/    /   /:::/    /
            /:::/    /              \::::/    /      \:::\    /:::/    /      \:::\   \:::\____\               \:::\   \::::/    /   /:::/    /
           /:::/    /               /:::/    /        \:::\  /:::/    /        \:::\   \::/    /                \:::\  /:::/    /    \::/    /
          /:::/    /               /:::/    /          \:::\/:::/    /          \:::\   \/____/                  \:::\/:::/    /      \/____/
         /:::/    /               /:::/    /            \::::::/    /            \:::\    \                       \::::::/    /
        /:::/    /               /:::/    /              \::::/    /              \:::\____\                       \::::/    /
        \::/    /                \::/    /                \::/____/                \::/    /                        \::/____/
         \/____/                  \/____/                  ~~                       \/____/                          ~~

          _____                    _____                    _____                    _____                    _____                    _____
         /\    \                  /\    \                  /\    \                  /\    \                  /\    \                  /\    \
        /::\____\                /::\____\                /::\____\                /::\    \                /::\    \                /::\    \
       /:::/    /               /:::/    /               /::::|   |                \:::\    \              /::::\    \              /::::\    \
      /:::/    /               /:::/    /               /:::::|   |                 \:::\    \            /::::::\    \            /::::::\    \
     /:::/    /               /:::/    /               /::::::|   |                  \:::\    \          /:::/\:::\    \          /:::/\:::\    \
    /:::/____/               /:::/    /               /:::/|::|   |                   \:::\    \        /:::/__\:::\    \        /:::/__\:::\    \
   /::::\    \              /:::/    /               /:::/ |::|   |                    \:::\    \      /::::\   \:::\    \      /::::\   \:::\    \
  /::::::\    \   _____    /:::/    /      _____    /:::/  |::|___|______               \:::\    \    /::::::\   \:::\    \    /::::::\   \:::\    \
 /:::/\:::\    \ /\    \  /:::/____/      /\    \  /:::/   |::::::::\    \               \:::\    \  /:::/\:::\   \:::\    \  /:::/\:::\   \:::\    \
/:::/  \:::\    /::\____\|:::|    /      /::\____\/:::/    |:::::::::\____\_______________\:::\____\/:::/  \:::\   \:::\____\/:::/  \:::\   \:::\____\
\::/    \:::\  /:::/    /|:::|____\     /:::/    /\::/    / ~~~~~/:::/    /\::::::::::::::::::/    /\::/    \:::\  /:::/    /\::/    \:::\  /:::/    /
 \/____/ \:::\/:::/    /  \:::\    \   /:::/    /  \/____/      /:::/    /  \::::::::::::::::/____/  \/____/ \:::\/:::/    /  \/____/ \:::\/:::/    /
          \::::::/    /    \:::\    \ /:::/    /               /:::/    /    \:::\~~~~\~~~~~~                 \::::::/    /            \::::::/    /
           \::::/    /      \:::\    /:::/    /               /:::/    /      \:::\    \                       \::::/    /              \::::/    /
           /:::/    /        \:::\__/:::/    /               /:::/    /        \:::\    \                      /:::/    /               /:::/    /
          /:::/    /          \::::::::/    /               /:::/    /          \:::\    \                    /:::/    /               /:::/    /
         /:::/    /            \::::::/    /               /:::/    /            \:::\    \                  /:::/    /               /:::/    /
        /:::/    /              \::::/    /               /:::/    /              \:::\____\                /:::/    /               /:::/    /
        \::/    /                \::/____/                \::/    /                \::/    /                \::/    /                \::/    /
         \/____/                  ~~                       \/____/                  \/____/                  \/____/                  \/____/

*/

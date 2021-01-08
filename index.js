#!/usr/bin/env node

var Parser = require("rss-parser");
var parser = new Parser();
var express = require("express");
var app = express();
var port = process.env.PORT || 80;
var syntax = require("./syntax.json");

app.get("/api/v1", function (req, res) {
  res.json(syntax);
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

#!/usr/bin/env node

var Parser = require('rss-parser');
var parser = new Parser();
var express = require("express");
var app = express();
var port = process.env.PORT || 80
var syntax = `{ "API Version": "v1.0.0", "API Creator": "Humzaa Omar", "Feeds": { "Torrent": { "1080p": "/api/v1/torrent/1080p", "720p": "/api/v1/torrent/720p", "SD": "/api/v1/torrent/sd", "All": "/api/v1/torrent/all" }, "Magnet": { "1080p": "/api/v1/magnet/1080p", "720p": "/api/v1/magnet/720p", "SD": "/api/v1/magnet/sd", "All": "/api/v1/magnet/all" } } }`

app.get('/api/v1',function(req,res){
    res.json(syntax); 
    })
app.get('/api/v1/magnet/1080p',function(req,res){
    parser.parseURL('https://subsplease.org/rss/?r=1080',   function(err, feed) {
      res.json(feed); 
      })
    })
app.get('/api/v1/magnet/720p',function(req,res){
    parser.parseURL('https://subsplease.org/rss/?r=720',   function(err, feed) {
      res.json(feed); 
      })
    })
app.get('/api/v1/magnet/sd',function(req,res){
    parser.parseURL('https://subsplease.org/rss/?r=sd',   function(err, feed) {
      res.json(feed); 
      })
    })
app.get('/api/v1/magnet/all',function(req,res){
    parser.parseURL('https://subsplease.org/rss',   function(err, feed) {
      res.json(feed); 
      })
    })
app.get('/api/v1/torrent/1080p',function(req,res){
    parser.parseURL('https://subsplease.org/rss/?t&r=1080',   function(err, feed) {
      res.json(feed); 
      })
    })
app.get('/api/v1/torrent/720p',function(req,res){
    parser.parseURL('https://subsplease.org/rss/?t&r=720',   function(err, feed) {
      res.json(feed); 
      })
    })
app.get('/api/v1/torrent/sd',function(req,res){
    parser.parseURL('https://subsplease.org/rss/?t&r=sd',   function(err, feed) {
      res.json(feed); 
      })
    })
app.get('/api/v1/torrent/all',function(req,res){
    parser.parseURL('https://subsplease.org/rss?t',   function(err, feed) {
      res.json(feed); 
      })
    })







    
app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});


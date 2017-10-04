'use strict';

const express = require('express');
const config = require('./configuration.json');
const TokenProvider = require('./js/token-provider');
const bodyParser = require('body-parser');
const ngrok = require('ngrok');


const app = express();

app.set('json spaces', 2);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/chat-client-configuration.json', function(req, res) {
  if (config.chatClient) {
    res.json(config.chatClient);
  } else {
    res.json({});
  }
});

app.get('/configuration', function(req, res) {
  if (config) {
    res.json(config);
  } else {
    res.json({});
  }
});

app.get('/token', function(req, res) {
  if (req.query.identity) {
    res.send(TokenProvider.getToken(req.query.identity, req.query.pushChannel));
  } else {
    throw new Error('no `identity` query parameter is provided');
  }
});

app.listen(3002, function() {
  console.log('Token provider listening on port 3002!');

  let ngrokOptions = {
    proto: 'http',
    addr: 3002
  };
  if (config.ngrokSubdomain) {
    ngrokOptions.subdomain = config.ngrokSubdomain
  }

  ngrok.once('connect', function(url) {
    console.log('ngrok url is ' + url);
  });

  ngrok.connect(ngrokOptions);
});




'use strict';

const express = require('express');
const config = require('./configuration.json');
const TokenProvider = require('./js/token-provider');
const bodyParser = require('body-parser');
const ngrok = require('ngrok');
const basicAuth = require('basic-auth-connect');


const app = express();

app.set('json spaces', 2);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
if (config.ngrok.basicAuth && config.ngrok.basicAuth.username && config.ngrok.basicAuth.password) {
  app.use(basicAuth(config.ngrok.basicAuth.username, config.ngrok.basicAuth.password));
}

app.get('/chat-client-configuration.json', function(req, res) {
  if (config.chatClient) {
    res.json(config.chatClient);
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
  if (config.ngrok.subdomain) {
    ngrokOptions.subdomain = config.ngrok.subdomain
  }

  ngrok.connect(ngrokOptions).then(url=> {
    console.log('ngrok url is ' + url);
  });
});




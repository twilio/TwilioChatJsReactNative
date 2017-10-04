/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { AppRegistry } from "react-native";
import Login from "./js/components/Login";
import EventsLog from "./js/components/EventsLog";
import ChatClientHelper from "./js/chat-client-helper";
import Log from "./js/logging";
import FirebaseSupport from "./js/FirebaseSupportModule";

ngrokSubdomainName = require('./configuration.json').ngrokSubdomain;
const host = 'http://' + ngrokSubdomainName + '.ngrok.io';

export default class TwilioChatJsReactNative extends Component {

  state = {
    chatClientHelper: null,
    log: []
  };

  login(username, host) {
    let log = new Log(this.addNewLog.bind(this));
    let chatClientHelper = new ChatClientHelper(host, log);
    chatClientHelper.login(
      username, 'fcm', FirebaseSupport.registerForPushCallback, FirebaseSupport.showPushCallback);
    this.setState({ chatClientHelper });
  }

  addNewLog(string) {
    let log = this.state.log;
    log.push(string + "\n");
    this.setState({ log });
  }

  render() {
    if (this.state.chatClientHelper === null) {
      return (
        <Login host={ host } login={ this.login.bind(this) }/>
      );
    } else {
      return (
        <EventsLog eventslog={ this.state.log } />
      );
    }
  }
}

AppRegistry.registerComponent('TwilioChatJsReactNative', () => TwilioChatJsReactNative);

// if you want to send the raw push to the JS library to reparse
// (while app is not running), you can use this react native pattern to call static JS method
// AppRegistry.registerHeadlessTask('FCMParsePush', () => require('./js/FCMParsePush'));

import 'react-native';
import React from 'react';
import { Client as TwilioChatClient } from "twilio-chat";

const TokenProvider = require('../js/token-provider');

const clientOptions = { logLevel: 'silent' };

describe('Messages', function() {
  let clientAlice : TwilioChatClient = null;
  let clientBob : TwilioChatClient = null;

  beforeAll(async () => {
    let aliceToken = TokenProvider.getToken('alicetestuser', null);
    clientAlice = await TwilioChatClient.create(aliceToken, clientOptions);

    let bobToken = TokenProvider.getToken('bobtestuser', null);
    clientBob = await TwilioChatClient.create(bobToken, clientOptions);
  });

  afterAll(async () => {
    await clientAlice.shutdown();
    await clientBob.shutdown();
  });

  describe('Rapid message send', function() {

    describe('Same client', function() {

      const messagesToSend = 5;

      let channel = null;

      beforeAll(async () => {
        channel = await clientAlice.createChannel().then(channel => channel.join());
      });

      afterAll(async () => {
        await channel.delete();
      });

      let receivedMessageIndexes = Array.from(Array(messagesToSend).keys());
      let sentMessageIndexes = Array.from(Array(messagesToSend).keys());

      it('Send and receive ' + messagesToSend + ' messages', async () => {
        jest.setTimeout(10000);

        let promises : Promise[] = [
          new Promise(resolve => {
            let messageCount = 0;
            channel.on('messageAdded', message => {
              let index = receivedMessageIndexes.indexOf(message.index);
              if (index !== -1) {
                receivedMessageIndexes.splice(index, 1);
              } else {
                throw new Error('Got duplicate messageAdded with index ' + message.index);
              }
              messageCount++;

              if (messageCount === messagesToSend) {
                resolve();
              }
            });
          })
        ];

        for (let i = 0; i < messagesToSend; i++) {
          promises.push(channel.sendMessage('message' + i).then(messageIndex => {
            let index = sentMessageIndexes.indexOf(messageIndex);
            if (index !== -1) {
              sentMessageIndexes.splice(index, 1);
            } else {
              throw new Error(
                'Got unexpected message index ' + messageIndex + ' when sending message (duplicate or out of range)');
            }
          }));
        }

        await Promise.all(promises);
      });

      it('Verify message indexes left to receive', async () => {
        if (receivedMessageIndexes.length > 0) {
          throw new Error(
            'Expected received messages indexes array to be empty. Indexes left: ' + receivedMessageIndexes.join(' '));
        }
      });

      it('Verify message indexes left to send', async () => {
        if (sentMessageIndexes.length > 0) {
          throw new Error(
            'Expected sent messages indexes array to be empty. Indexes left: ' + sentMessageIndexes.join(' '));
        }
      });
    });

    describe('Different clients', function() {

      const messagesToSend = 5;

      let aliceChannel = null;
      let bobChannel = null;

      beforeAll(async () => {
        aliceChannel = await clientAlice.createChannel().then(channel => channel.join());
        bobChannel = await clientBob.getChannelBySid(aliceChannel.sid).then(channel => channel.join());
      });

      afterAll(async () => {
        await aliceChannel.delete();
      });

      let receivedMessageIndexes = Array.from(Array(messagesToSend).keys());
      let sentMessageIndexes = Array.from(Array(messagesToSend).keys());

      it('Send and receive ' + messagesToSend + ' messages', async () => {
        jest.setTimeout(10000);

        let promises : Promise[] = [
          new Promise(resolve => {
            let messageCount = 0;
            bobChannel.on('messageAdded', message => {
              let index = receivedMessageIndexes.indexOf(message.index);
              if (index !== -1) {
                receivedMessageIndexes.splice(index, 1);
              } else {
                throw new Error('Got duplicate messageAdded with index ' + message.index);
              }
              messageCount++;

              if (messageCount === messagesToSend) {
                resolve();
              }
            });
          })
        ];

        for (let i = 0; i < messagesToSend; i++) {
          promises.push(aliceChannel.sendMessage('message' + i).then(messageIndex => {
            let index = sentMessageIndexes.indexOf(messageIndex);
            if (index !== -1) {
              sentMessageIndexes.splice(index, 1);
            } else {
              throw new Error(
                'Got unexpected message index ' + messageIndex + ' when sending message (duplicate or out of range)');
            }
          }));
        }

        await Promise.all(promises);
      });

      it('Verify message indexes left to receive', async () => {
        if (receivedMessageIndexes.length > 0) {
          throw new Error(
            'Expected received messages indexes array to be empty. Indexes left: ' + receivedMessageIndexes.join(' '));
        }
      });

      it('Verify message indexes left to send', async () => {
        if (sentMessageIndexes.length > 0) {
          throw new Error(
            'Expected sent messages indexes array to be empty. Indexes left: ' + sentMessageIndexes.join(' '));
        }
      });
    });
  });
});



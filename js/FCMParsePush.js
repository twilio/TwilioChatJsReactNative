import { Client as TwilioChatClient} from "twilio-chat";

// if you want to send the raw push to the JS library to reparse
// (while app is not running), you can use this react native pattern to call static JS method
module.exports = async (taskData) => {
  let push = TwilioChatClient.parsePushNotification(taskData);
  // do anything with parsed push from JS code
};
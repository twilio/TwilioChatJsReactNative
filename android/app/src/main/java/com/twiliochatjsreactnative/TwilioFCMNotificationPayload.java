package com.twiliochatjsreactnative;

import android.os.Bundle;

/**
 * Helper accessor for notification data payload bundle as received from Twilio Notifications.
 * Use to retrieve Twilio-generated payload fields safely.
 */
public class TwilioFCMNotificationPayload {
    /**
     * Represents payload type.
     * Payload types are defined by Twilio Chat. When you receive a new push notification
     * you could check if it is coming from Twilio Chat.
     */
    public enum Type {
        /**
         * Not a Twilio payload.
         */
        UNKNOWN(0),
        /**
         * New message notification.
         */
        NEW_MESSAGE(1),
        /**
         * Channel invite notification.
         */
        INVITED_TO_CHANNEL(2),
        /**
         * Channel add notification.
         */
        ADDED_TO_CHANNEL(3),
        /**
         * Channel remove notification.
         */
        REMOVED_FROM_CHANNEL(4);

        private final int value;

        private Type(int value) {
            this.value = value;
        }

        public static Type fromString(String in) {
            if (in.contentEquals("twilio.channel.new_message"))
                return NEW_MESSAGE;
            if (in.contentEquals("twilio.channel.added_to_channel"))
                return ADDED_TO_CHANNEL;
            if (in.contentEquals("twilio.channel.invited_to_channel"))
                return INVITED_TO_CHANNEL;
            if (in.contentEquals("twilio.channel.removed_from_channel"))
                return REMOVED_FROM_CHANNEL;
            return UNKNOWN;
        }
    }

    /**
     * Create notification payload from the received map.
     *
     * @param remoteMessage Android FCM RemoteMessage with push notification data as received
     *                      from the system.
     */
    public TwilioFCMNotificationPayload(Bundle data) {
        if (data.getBundle("data") != null) {
            payload = data.getBundle("data");
        } else {
            payload = new Bundle();
        }
    }

    /**
     * Get notification type.
     *
     * @return received notification type as a {@link Type} enum.
     */
    public Type getType() {
        if (payload.containsKey("twi_message_type")) {
            return Type.fromString(payload.getString("twi_message_type"));
        }
        return Type.UNKNOWN;
    }

    /**
     * Get notification author.
     *
     * @return Message author for NEW_MESSAGE notification type, null otherwise.
     */
    public String getAuthor() {
        if (payload.containsKey("author")) {
            return payload.getString("author");
        }
        return null;
    }

    /**
     * Get notification body.
     *
     * @return Message body as configured by the push notification configuration in service.
     */
    public String getBody() {
        if (payload.containsKey("twi_body")) {
            return payload.getString("twi_body");
        }
        return null;
    }

    /**
     * Get notification channel title.
     *
     * @return Channel title for NEW_MESSAGE notification type, null otherwise.
     */
    public String getChannelTitle() {
        if (payload.containsKey("channel_title")) {
            return payload.getString("channel_title");
        }
        return null;
    }

    /**
     * Get notification channel SID.
     *
     * @return Channel SID for NEW_MESSAGE notification type, null otherwise.
     */
    public String getChannelSid() {
        if (payload.containsKey("channel_sid")) {
            return payload.getString("channel_sid");
        }
        return null;
    }

    /**
     * Get notification message SID.
     *
     * @return Message SID for NEW_MESSAGE notification type, null otherwise.
     */
    public String getMessageSid() {
        if (payload.containsKey("message_sid")) {
            return payload.getString("message_sid");
        }
        return null;
    }

    /**
     * Get notification message index.
     *
     * @return Message Index for NEW_MESSAGE notification type, null otherwise.
     */
    public String getMessageIndex() {
        if (payload.containsKey("message_index")) {
            return payload.getString("message_index");
        }
        return null;
    }

    /**
     * Get notification sound.
     *
     * @return Sound name as configured by the push notification configuration in service,
     * null if not configured.
     */
    public String getSound() {
        if (payload.containsKey("twi_sound")) {
            return payload.getString("twi_sound");
        }
        return null;
    }

    Bundle payload;

    @Override
    public String toString() {
        return "[TwilioFCMNotificationPayload] [Type: " + this.getType() + "] [Author: " + this.getAuthor() + "] " +
                "[Body: " + this.getBody() + "] [Channel SID: " + this.getChannelSid() + "] " +
                "[Channel title: " + this.getChannelTitle() + "] [Message SID: " + this.getMessageSid() + "] " +
                "[Message index: " + this.getMessageIndex() + "] [Sound: " + this.getSound() + "]";
    }
}
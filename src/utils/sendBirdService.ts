import SendBird from 'sendbird';

const APP_ID = "1190CFD1-1481-4C58-B4BF-47DF8CE02AFC";

let sb: SendBird.SendBirdInstance;

export const initializeSendBird = () => {
  if (!sb) {
    sb = new SendBird({ appId: APP_ID });
  }
  return sb;
};

export const connectUser = (userId: string, accessToken: string) => {
  return new Promise<SendBird.User>((resolve, reject) => {
    if (!sb) {
      reject(new Error("SendBird instance is not initialized."));
      return;
    }

    sb.connect(userId, accessToken, (user, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
};

export const createChannel = (channelUrl: string) => {
  return new Promise<SendBird.GroupChannel>((resolve, reject) => {
    if (!sb) {
      reject(new Error("SendBird instance is not initialized."));
      return;
    }

    sb.GroupChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(channel);
      }
    });
  });
};

export const sendMessage = (channel: SendBird.GroupChannel, message: string) => {
  return new Promise<SendBird.UserMessage>((resolve, reject) => {
    if (!sb) {
      reject(new Error("SendBird instance is not initialized."));
      return;
    }

    channel.sendUserMessage(message, (msg, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(msg);
      }
    });
  });
};

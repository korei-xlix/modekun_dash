import { ISource } from "./source";
import { IChat } from "../chat";
import { Streamer } from "../streamer";

const chatSelector = {
  chatBlock: "#message-list-container .text-message",
};

const streamerSelector = {
  streamer: ".content .right .name",
};

export const Mildom: ISource = {
  name: "mildom",
  extractChats(lookNum: number): IChat[] {
    const chatBlocks = [
      ...document.querySelectorAll<HTMLElement>(chatSelector.chatBlock),
    ].slice(-lookNum);

    const chats: IChat[] = [];
    for (const chatBlock of chatBlocks) {
      if (!chatBlock.textContent) continue;
      let parsedChat: IMildomChat;
      try {
        parsedChat = parseChat(chatBlock.textContent);
      } catch (e) {
        continue;
      }
      chats.push({
        key: parsedChat.author + parsedChat.message,
        author: parsedChat.author,
        message: parsedChat.message,
        element: chatBlock,
        other: {
          isCard : false,
          isOwner : false,
          isMember : false,
          isModer : false,
          amount : "",
          img_nums : 0,
        },
      });
    }
    return chats;
  },
  extractStreamer(): Streamer {
    const streamer = document.querySelector<HTMLElement>(
      streamerSelector.streamer
    );
    const streamerName = streamer?.textContent ?? "NONE";
    return {
      name: streamerName,
    };
  },
};

interface IMildomChat {
  author: string;
  message: string;
}

const chatRegex = /^(.+)\u00A0:\u00A0(.+)/;
const parseChat = (chatBlock: string): IMildomChat => {
  const chatMatch = chatBlock.match(chatRegex);
  if (chatMatch?.length === 3) {
    return {
      author: chatMatch[1],
      message: chatMatch[2],
    };
  }
  throw "format error";
};

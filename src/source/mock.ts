import { ISource } from "./source";
import { IChat } from "../chat";
import { Streamer } from "../streamer";

export const Mock: ISource = {
  name: "mock",
  extractChats(lookNum: number): IChat[] {
    return [
      {
        key: "test1こんにちは",
        author: "test1",
        message: "こんにちは",
        element: document.createElement("div"),
        other: {
          isCard : false,
          isOwner : false,
          isMember : false,
          isModer : false,
          amount : "",
          img_nums : 0,
        },
      },
    ];
  },
  extractStreamer() {
    const streamer: Streamer = {
      name: document.title,
    };
    return streamer;
  },
};

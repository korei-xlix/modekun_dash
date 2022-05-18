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
        htmlcode: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test1ab",
        author: "test1",
        message: "ab",
        htmlcode: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test1最強最強最強",
        author: "test1",
        message: "最強最強最強",
        htmlcode: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test2こんにちは",
        author: "test2",
        message: "こんにちは",
        htmlcode: "こんにちは",
        element: document.createElement("div"),
      },
    ];
  },
  extractStreamer() {
    const streamer: Streamer = {
      name: "hello",
    };
    return streamer;
  },
};

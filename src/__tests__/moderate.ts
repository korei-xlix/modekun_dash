import { IChat } from "../chat";
import {
  hideByLength,
  hideNgWords,
  hidePostFlood,
  hideRepeatThrow,
  hideRepeatWords,
} from "../moderate";
import { IKuromojiWorker } from "../kuromoji.worker";
import { IParameter } from "../config";
import { KuromojiToken } from "kuromojin";

describe("moderate", () => {
  const params: IParameter = {
    repeat_throw_threshold: 2,
    repeat_word_threshold: 2,
    post_flood_threshold: 2,
    length_threshold: 3,
    look_chats: 10,
    execution_interval: 1000,
    ng_words: ["なう"],
    is_show_reason: false,
    is_activate_modekun: true,
    consider_author_length: false,
    consider_author_ngword: false,
  };
  describe("hideRepeatWords", () => {
    const chats: IChat[] = [
      {
        key: "test1こんにちは",
        author: "test1",
        message: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test2最高最高最高",
        author: "test2",
        message: "最高最高最高",
        element: document.createElement("div"),
      },
    ];
    const apiMock: IKuromojiWorker = {
      bulkTokenize: (texts: string[]) =>
        new Promise<KuromojiToken[][]>((resolve) => {
          resolve([]);
        }),
      getMaxRepeatWordCounts: (texts: string[]) =>
        new Promise<number[]>((resolve) => {
          resolve([1, 3]);
        }),
    };
    test("can hide", async () => {
      await hideRepeatWords(params, apiMock, chats);
      expect(chats[0].element.style.opacity).toBe("");
      expect(chats[1].element.style.opacity).toBe("0");
    });
  });

  describe("hideRepeatThrow", () => {
    const chats: IChat[] = [
      {
        key: "test1こんにちは",
        author: "test1",
        message: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test2連投",
        author: "test2",
        message: "連投",
        element: document.createElement("div"),
      },
      {
        key: "test2連投",
        author: "test2",
        message: "連投",
        element: document.createElement("div"),
      },
      {
        key: "test2連投",
        author: "test2",
        message: "連投",
        element: document.createElement("div"),
      },
    ];
    test("can hide", () => {
      hideRepeatThrow(params, chats);
      expect(chats[0].element.style.opacity).toBe("");
      expect(chats[1].element.style.opacity).toBe("0");
      expect(chats[2].element.style.opacity).toBe("0");
      expect(chats[3].element.style.opacity).toBe("0");
    });
  });

  describe("hideNgWords", () => {
    test("can hide", () => {
      const chats: IChat[] = [
        {
          key: "test1こんにちは",
          author: "test1",
          message: "こんにちは",
          element: document.createElement("div"),
        },
        {
          key: "test2なう",
          author: "test2",
          message: "なう",
          element: document.createElement("div"),
        },
        {
          key: "test3なうい",
          author: "test3",
          message: "なうい",
          element: document.createElement("div"),
        },
        {
          key: "test4ないた",
          author: "test4",
          message: "ないた",
          element: document.createElement("div"),
        },
      ];
      hideNgWords(params, chats);
      expect(chats[0].element.style.opacity).toBe("");
      expect(chats[1].element.style.opacity).toBe("0");
      expect(chats[2].element.style.opacity).toBe("0");
      expect(chats[3].element.style.opacity).toBe("");
    });
    test("can hide by author", () => {
      const chats: IChat[] = [
        {
          key: "こんにちはtest",
          author: "こんにちは",
          message: "test",
          element: document.createElement("div"),
        },
        {
          key: "なうtest",
          author: "なう",
          message: "test",
          element: document.createElement("div"),
        },
      ];
      const param: IParameter = {
        ...params,
        consider_author_ngword: true,
      };
      hideNgWords(param, chats);
      expect(chats[0].element.style.opacity).toBe("");
      expect(chats[1].element.style.opacity).toBe("0");
    });
  });

  describe("hidePostFlood", () => {
    const chats: IChat[] = [
      {
        key: "test1こんにちは",
        author: "test1",
        message: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test1こんにち",
        author: "test1",
        message: "こんにち",
        element: document.createElement("div"),
      },
      {
        key: "test2こんにちは",
        author: "test2",
        message: "こんにちは",
        element: document.createElement("div"),
      },
    ];

    test("can hide", () => {
      hidePostFlood(params, chats);
      expect(chats[0].element.style.opacity).toBe("0");
      expect(chats[1].element.style.opacity).toBe("0");
      expect(chats[2].element.style.opacity).toBe("");
    });
  });

  describe("hideByLength", () => {
    test("can hide", () => {
      const chats: IChat[] = [
        {
          key: "test1ab",
          author: "test1",
          message: "ab",
          element: document.createElement("div"),
        },
        {
          key: "test1あい",
          author: "test1",
          message: "あい",
          element: document.createElement("div"),
        },
        {
          key: "test1吉吉",
          author: "test1",
          message: "吉吉",
          element: document.createElement("div"),
        },
        {
          key: "test123🔥",
          author: "test123",
          message: "🔥",
          element: document.createElement("div"),
        },
        {
          key: "test1😇😇",
          author: "test1",
          message: "😇😇",
          element: document.createElement("div"),
        },
        {
          key: "test1文字数オーバー",
          author: "test1",
          message: "文字数オーバー",
          element: document.createElement("div"),
        },
      ];
      hideByLength(params, chats);
      expect(chats[0].element.style.opacity).toBe("");
      expect(chats[1].element.style.opacity).toBe("");
      expect(chats[2].element.style.opacity).toBe("");
      expect(chats[3].element.style.opacity).toBe("");
      expect(chats[4].element.style.opacity).toBe("0");
      expect(chats[5].element.style.opacity).toBe("0");
    });

    test("can hide by author", () => {
      const chats: IChat[] = [
        {
          key: "test123ab",
          author: "test123",
          message: "ab",
          element: document.createElement("div"),
        },
        {
          key: "testab",
          author: "test",
          message: "ab",
          element: document.createElement("div"),
        },
      ];
      const param: IParameter = {
        ...params,
        length_threshold: 5,
        consider_author_length: true,
      };
      hideByLength(param, chats);
      expect(chats[0].element.style.opacity).toBe("0");
      expect(chats[1].element.style.opacity).toBe("");
    });
  });
  describe("repeat post and repeat frequency", () => {
    const chats: IChat[] = [
      {
        key: "test1aaa",
        author: "test1",
        message: "aaa",
        element: document.createElement("div"),
      },
      {
        key: "test1aaa",
        author: "test1",
        message: "aaa",
        element: document.createElement("div"),
      },
      {
        key: "test1bbb",
        author: "test1",
        message: "bbb",
        element: document.createElement("div"),
      },
    ];
    const param: IParameter = {
      ...params,
      repeat_throw_threshold: 2,
      post_flood_threshold: 3,
    };
    test("can hide by both filter", () => {
      hideRepeatThrow(param, chats);
      hidePostFlood(param, chats);
      expect(chats[0].element.style.opacity).toBe("0");
      expect(chats[1].element.style.opacity).toBe("0");
      expect(chats[2].element.style.opacity).toBe("0");
    });
  });
});

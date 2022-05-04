import {
  createKuromojiWorker,
  createKuromojiWorkerApi,
  moderate,
  terminateWorker,
} from "./moderate";
import {
  defaultParamsV2,
  DEFAULT_EXECUTION_INTERVAL_MS,
  IParameterV2,
  keyStreamer,
  OBSERVATION_INTERVAL_MS,
} from "./config";
import { selectSource } from "./source/source";
import { IKuromojiWorker } from "./kuromoji";
import { Message, sendRequest } from "./message";

let worker: Worker | null;
let api: IKuromojiWorker | null;
let lookChats = 0;
let param = defaultParamsV2;
let timerId: number;

const getDicPath = () => {
  const isFireFox = window.navigator.userAgent
    .toLowerCase()
    .includes("firefox");

  return isFireFox
    ? "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict"
    : chrome.extension.getURL("kuromoji/dict/");
};

/*
 * set param managed in content_script
 */
const initParam = (key: string) => {
  sendRequest({
    type: "GET_PARAM",
    from: "CONTENT_SCRIPT",
    to: "BACKGROUND",
    data: {
      key,
    },
  });
};

chrome.runtime.onMessage.addListener((req: Message, sender, sendResponse) => {
  if (req.from === "CONTENT_SCRIPT" || req.to !== "CONTENT_SCRIPT") return;
  if (req.type === "UPDATE_PARAM" && req.from === "BACKGROUND") {
    if (!req.data || !req.data.param) throw new Error("no param");
    param = req.data.param;
    sendRequest({
      type: "UPDATE_PARAM",
      from: "CONTENT_SCRIPT",
      to: "POPUP",
      data: {
        param,
      },
    });
  } else if (req.type === "UPDATE_PARAM" && req.from === "POPUP") {
    if (!req.data || !req.data.param) throw new Error("no param");
    param = req.data.param;
  }
});

window.addEventListener("load", async () => {
  try {
    const source = selectSource(window.location.href);
    const paramKey = keyStreamer(source.name, source.extractStreamer());
    initParam(paramKey);

    worker = await createKuromojiWorker();
    api = await createKuromojiWorkerApi(worker, getDicPath());

    const modekun = async () => {
      // sendRequest({
      //   type: "UPDATE_PARAM",
      //   from: "CONTENT_SCRIPT",
      //   to: "POPUP",
      //   data: {
      //     param,
      //   },
      // });
      window.clearTimeout(timerId);

      const chats = source.extractChats(lookChats);
      if (chats.length < 1) {
        // NOTE: Don't terminate worker here.
        // Because an archive video may be able to open a chat section which was closed at first.
        timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
        return;
      }

      if (!api) {
        timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
        return;
      }

      if (!param.isActivateModekun) {
        return;
      }

      lookChats = param.lookChats;

      await moderate(api, param, chats);

      timerId = window.setTimeout(modekun, param.executionInterval);
    };
    timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
  } catch (e) {
    console.error(e);
  }
});

let previousLocation = window.location.href;
const observeLocation = async () => {
  const currentLocation = window.location.href;
  if (currentLocation !== previousLocation) {
    const source = selectSource(currentLocation);
    const paramKey = keyStreamer(source.name, source.extractStreamer());
    initParam(paramKey);

    worker && terminateWorker(worker);
    // avoid memory leak, worker allocates a lot of memory
    worker = null;
    api = null;
    worker = await createKuromojiWorker();
    api = await createKuromojiWorkerApi(worker, getDicPath());
    previousLocation = currentLocation;
  }
  window.setTimeout(observeLocation, OBSERVATION_INTERVAL_MS);
};
window.setTimeout(observeLocation, OBSERVATION_INTERVAL_MS);

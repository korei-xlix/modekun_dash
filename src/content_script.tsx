import {
  createKuromojiWorker,
  createKuromojiWorkerApi,
  moderate,
  terminateWorker,
} from "./moderate";
import { Youtube } from "./source/youtube";
import { Mock } from "./source/mock";
import {
  DEFAULT_EXECUTION_INTERVAL_MS,
  defaultParams,
  serializedParams,
  getParams,
  OBSERVATION_INTERVAL_MS,
  YOUTUBE_REGEX,
  MILDOM_REGEX,
} from "./config";
import { setItem } from "./storage";
import { IKuromojiWorker } from "./kuromoji.worker";
import { Mildom } from "./source/mildom";
import { ISource } from "./source/source";

let worker: Worker | null;
let api: IKuromojiWorker | null;
let source: ISource | null;
let timerId: number;

window.addEventListener("load", async () => {
  const modekun = async () => {
    console.log("modekun");

  const modekun = async () => {
    window.clearTimeout(timerId);
    if (!source || !api) {
      timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
      return;
    }

    const chats = source.extractChats();
    if (chats.length < 1) {
      // NOTE: Don't terminate worker here.
      // Because an archive video may be able to open a chat section which was closed at first.
      timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
      return;
    }

    const params = await getParams().catch(
      async () => await setItem(serializedParams(defaultParams))
    );
    if (!params) {
      timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
      return;
    }

    await moderate(api, params, chats);

    timerId = window.setTimeout(modekun, params.execution_interval);
  };
  timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
});

let previousLocation = window.location.href;
const observeLocation = async () => {
  source = null;
  const currentLocation = window.location.href;
  if (YOUTUBE_REGEX.test(currentLocation)) {
    source = new Youtube();
  } else if (MILDOM_REGEX.test(currentLocation)) {
    source = new Mildom();
  } else {
    source = new Mock();
  }
  if (currentLocation !== previousLocation) {
    worker && terminateWorker(worker);
    // avoid memory leak, worker allocates a lot of memory
    worker = null;
    api = null;
    worker = await createKuromojiWorker();
    api = await createKuromojiWorkerApi(worker);
    previousLocation = currentLocation;
  }
  window.setTimeout(observeLocation, OBSERVATION_INTERVAL_MS);
};
window.setTimeout(observeLocation, OBSERVATION_INTERVAL_MS);

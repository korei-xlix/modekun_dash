import {
  createKuromojiWorker,
  createKuromojiWorkerApi,
  moderate,
  terminateWorker,
} from "./moderate";
import { Youtube } from "./source/youtube";
import {
  DEFAULT_EXECUTION_INTERVAL_MS,
  getParams,
  OBSERVATION_INTERVAL_MS,
  YOUTUBE_REGEX,
  MILDOM_REGEX,
} from "./config";
import { IKuromojiWorker } from "./kuromoji.worker";
import { Mildom } from "./source/mildom";
import { setItem } from "./storage";

let worker: Worker | null;
let api: IKuromojiWorker | null;

let lookChats = 0;

let timerId: number;

window.addEventListener("load", async () => {
  const params = await getParams().catch((e) => console.error(e));
  params && (await setItem(params));

  const currentLocation = window.location.href;
  const source = YOUTUBE_REGEX.test(currentLocation)
    ? Youtube
    : MILDOM_REGEX.test(currentLocation)
    ? Mildom
    : null;

  worker = await createKuromojiWorker();
  api = await createKuromojiWorkerApi(worker);

  const modekun = async () => {
    window.clearTimeout(timerId);
    if (!source) return;

    if (!api) {
      timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
      return;
    }

    const chats = source.extractChats(lookChats);
    if (chats.length < 1) {
      // NOTE: Don't terminate worker here.
      // Because an archive video may be able to open a chat section which was closed at first.
      timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
      return;
    }

    const params = await getParams().catch((e) => console.error(e));
    if (!params) {
      timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
      return;
    }

    if (!params.is_activate_modekun) {
      return;
    }

    lookChats = params.look_chats;

    await moderate(api, params, chats);

    timerId = window.setTimeout(modekun, params.execution_interval);
  };
  timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
});

let previousLocation = window.location.href;
const observeLocation = async () => {
  const currentLocation = window.location.href;
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

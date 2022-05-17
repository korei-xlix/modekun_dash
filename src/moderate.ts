import { IChat } from "./chat";
import { wrap } from "comlink";
import { IParameterV2 } from "./config";
import { IKuromojiWorker } from "./kuromoji";

export const createKuromojiWorker = async (): Promise<Worker> => {
  const worker = await fetch(chrome.runtime.getURL("js/worker.js"));
  const js = await worker.text();
  const blob = new Blob([js], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);

  return new Worker(url);
};

export const createKuromojiWorkerApi = async (
  worker: Worker,
  dicPath: string
): Promise<IKuromojiWorker> => {
  const workerClass: any = wrap<IKuromojiWorker>(worker);
  const instance = await new workerClass(dicPath);
  return instance;
};

export const terminateWorker = (worker: Worker | undefined) => {
  worker && worker.terminate();
};

export const hideRepeatThrow = (param: IParameterV2, chats: IChat[]) => {
  const duplicateCount: { [key: string]: number } = {};
  for (const chat of chats) {
    if (!duplicateCount[chat.key]) {
      duplicateCount[chat.key] = 0;
    }
    duplicateCount[chat.key]++;
  }
  for (const chat of chats) {
    if (duplicateCount[chat.key] >= param.repeatPostThreshold) {
      hide(param, chrome.i18n.getMessage("repeatPost"), chat);
    }
  }
};

export const hideNgWords = (param: IParameterV2, chats: IChat[]) => {
  for (const chat of chats) {
    for (const ngWord of param.ngWords) {
      const isHideMessage = chat.message.includes(ngWord);
      const isHideAuthor =
        param.considerAuthorNgWord && chat.author.includes(ngWord);

      if (isHideMessage || isHideAuthor) {
        hide(param, chrome.i18n.getMessage("ngWord"), chat);
      }
    }
  }
};

export const hideRepeatWords = async (
  param: IParameterV2,
  api: IKuromojiWorker,
  chats: IChat[]
) => {
  const counts = await api.getMaxRepeatWordCounts(chats.map((c) => c.message));
  chats.forEach((chat, i) => {
    if (param.repeatWordThreshold>0) {
      if (counts[i] >= param.repeatWordThreshold) {
        hide(param, chrome.i18n.getMessage("repeatWords"), chat);
      }
    }
  });
};

export const hidePostFlood = (param: IParameterV2, chats: IChat[]) => {
  const authorCount: { [author: string]: number } = {};
  const authorToChats: { [author: string]: IChat[] } = {};

  for (const chat of chats) {
    if (!authorCount[chat.author]) {
      authorCount[chat.author] = 1;
    } else {
      authorCount[chat.author]++;
    }
    if (!authorToChats[chat.author]) {
      authorToChats[chat.author] = [chat];
    } else {
      authorToChats[chat.author].push(chat);
    }
  }

  for (const [author, count] of Object.entries(authorCount)) {
    if (count >= param.postFrequencyThreshold) {
      for (const c of authorToChats[author]) {
        hide(param, chrome.i18n.getMessage("repeatFrequency"), c);
      }
    }
  }
};


export const hideByLength = (param: IParameterV2, chats: IChat[]) => {

  const locale_desu = new Intl.Locale('ja-JP') ;
  const it_desu = new Intl.v8BreakIterator(locale_desu, {type: 'character'});

  for (const chat of chats) {
    const isHideMessage = chat.message.length >= param.lengthThreshold;
    const isHideAuthor =
      param.considerAuthorLength && chat.author.length >= param.lengthUserThreshold;
    const isHideEmoji = param.considerHiddenEmoji;

    param.isHideEmojiComment = false ;
    if (isHideMessage || isHideAuthor ) {
      hide(param, chrome.i18n.getMessage("maxNumOfCharacters"), chat);
    }
    else if (isHideEmoji ) {

      it_desu.adoptText( chat.message ) ;
      const len_desu = 0;
      const previous = 0;
      const curr_desu = it.first();
      while (curr_desu !== -1) {
        const curr_desu = it.next();
        if (curr_desu === -1) {
          break;
        }
        const previous = curr_desu;
        const len_desu = len_desu + 1;
      }
      if( len_desu>2 ) {
        hide(param, chrome.i18n.getMessage("hiddeEmojiComment"), chat);
      }

    }

  }
};

export const moderate = async (
  kuromojiWorkerApi: IKuromojiWorker,
  param: IParameterV2,
  chats: IChat[]
): Promise<void> => {
  hideByLength(param, chats);
  hideNgWords(param, chats);
  hideRepeatWords(param, kuromojiWorkerApi, chats);
  hideRepeatThrow(param, chats);
  hidePostFlood(param, chats);
};

export const hide = (param: IParameterV2, reason: string, chat: IChat) => {
  if (chat.element.dataset.isHiddenByModekun) return;

  chat.element.dataset.isHiddenByModekun = "1";

  if (param.isHideCompletely || param.isHideEmojiComment) {
    chat.element.style.display = "none";
    if (chat.associatedElements) {
      for (const element of chat.associatedElements) {
        element.style.display = "none";
      }
    }
  } else {
    chat.element.style.opacity = "0";

    const reasonLabel = param.isShowReason
      ? document.createElement("span")
      : null;
    if (reasonLabel) {
      reasonLabel.innerText = reason;
      reasonLabel.style.color = "grey";
      reasonLabel.style.position = "absolute";
      reasonLabel.style.left = "50%";
      chat.element.insertAdjacentElement("beforebegin", reasonLabel);
    }

    chat.element.addEventListener("mouseenter", () => {
      chat.element.style.opacity = "1";
      if (reasonLabel) reasonLabel.style.display = "none";
    });
    chat.element.addEventListener("mouseleave", () => {
      chat.element.style.opacity = "0";
      if (reasonLabel) reasonLabel.style.display = "inline";
    });
  }
};

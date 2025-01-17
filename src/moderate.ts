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
    if( chat.other.isCard ) continue;

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


const strReason1 = chrome.i18n.getMessage("maxNumOfCharacters") ;
const strReason2 = chrome.i18n.getMessage("hiddeEmojiComment") ;

export const hideByLength = (param: IParameterV2, chats: IChat[]) => {

  let strReason, isHidden ;

  for (const chat of chats) {
    const isHideMessage = chat.message.length >= param.lengthThreshold;
    const isHideAuthor =
      param.considerAuthorLength && chat.author.length >= param.lengthUserThreshold;
    const isHideSuperChat =
      param.considerHiddenSuperChat && chat.other.isCard;
    const isHideNotMember =
      param.considerMemberOnly && !chat.other.isOwner && !chat.other.isMember;
    param.isForceHide = false;

    if( param.outputDebugLog ) {
      console.error( "recive: " + chat.author + ": " + chat.message + ": len=" + chat.message.length);
      console.error( "object: " + JSON.stringify(chat) );
    }

    strReason = strReason1 ;
    isHidden = false;
    if (isHideMessage || isHideAuthor ) {
      isHidden = true;

    } else if (isHideSuperChat || isHideNotMember ) {
      param.isForceHide = true;
      isHidden = true;
    } else if( param.considerHiddenEmoji ) {
      if( chat.other.img_nums >= 2 ) {
        param.isForceHide = true;
        strReason = strReason2 ;
        isHidden = true;
      }
    }
    if( isHidden ) {
      hide(param, strReason, chat);
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

  if (param.isHideCompletely || param.isForceHide ) {
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


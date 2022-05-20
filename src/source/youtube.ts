import { IChat } from "../chat";
import { kanaToHiragana, removeSymbols } from "../util";
import { ISource } from "./source";
import { NONE_STREAMER, Streamer } from "../streamer";

const chatSelector = {
  chatSection: "#chatframe",
  chatBlock: "#content",
  message: "#message",
  author: "#author-name",
  badge: "#chat-badges",
  cardBlock: "#card",
  amount: "#purchase-amount",
};

const streamerSelector = {
  streamer: "#upload-info #channel-name #text-container",
};

export const Youtube: ISource = {
  name: "youtube",
  extractChats(lookNum: number): IChat[] {
    const chatSection = document.querySelector<HTMLIFrameElement>(
      chatSelector.chatSection
    );
    if (!chatSection || !chatSection.contentWindow) return [];

    const chatBlocks = [
      ...chatSection.contentWindow.document.querySelectorAll<HTMLElement>(
        chatSelector.chatBlock
      ),
    ].slice(-lookNum);

    const cardBlocks = [
      ...chatSection.contentWindow.document.querySelectorAll<HTMLElement>(
        chatSelector.cardBlock
      ),
    ].slice(-lookNum);

    const chats: IChat[] = [];

/*    chatBlocks.forEach((chatBlock) => {*/
    for ( const chatBlock of chatBlocks ) {
      const messageElement = chatBlock.querySelector<HTMLElement>(
        chatSelector.message
      );
/*      if (!messageElement) return;*/
      if (!messageElement) break;

      let isOwner = false;
      let isMember = false;
      let isModer = false;
      const badgeElement = chatBlock.querySelector<HTMLElement>(
        chatSelector.badge
      );
      if (!badgeElement) break;

      let badgeHTML = badgeElement.innerHTML ;
      isOwner  = badgeHTML.match('type=\"owner\"') ? true : false ;
      isMember = badgeHTML.match('type=\"member\"') ? true : false ;
      isModer  = badgeHTML.match('type=\"moderator\"') ? true : false ;
      const authorElement = chatBlock.querySelector<HTMLElement>(
        chatSelector.author
      );
/*      if (!authorElement) return;*/
      if (!authorElement) break;
      const author = authorElement.innerText;
      const message = messageElement.innerText;
      const key = removeSymbols(kanaToHiragana(author + message));
      let strPattern = /\<img/g;
      let img_nums = ( messageElement.innerHTML.match(/\<img/g) || [] ).length;
      chats.push({
        key: key,
        author: author,
        message: message,
        element: chatBlock,
        associatedElements: chatBlock.parentElement
          ? [chatBlock.parentElement]
          : [],
        other: {
          isCard : false,
          isOwner : isOwner,
          isMember : isMember,
          isModer : isModer,
          amount : "",
          img_nums : img_nums,
        }
      });
/*    });*/
    }

/*    cardBlocks.forEach((cardBlock) => {*/
    for ( const cardBlock of cardBlocks ) {
      const authorElement = cardBlock.querySelector<HTMLElement>(
        chatSelector.author
      );
/*      if (!authorElement) return;*/
      if (!authorElement) break;
      const author = authorElement.innerText;

      const amountElement = cardBlock.querySelector<HTMLElement>(
        chatSelector.amount
      );
      let amount = "";
      if (amountElement) {
        amount = amountElement.innerText;
      }
      chats.push({
        key: "",
        author: author,
        message: "",
        element: cardBlock,
        associatedElements: [],
        other: {
          isCard : true,
          isOwner : false,
          isMember : false,
          isModer : false,
          amount : amount,
          img_nums : 0,
        }
      });
/*    });*/
    }

    return chats;
  },
  extractStreamer(): Streamer {
    // youtube keeps the information you saw last time even if you return to home
    const isHome = window.location.href === "https://www.youtube.com/";
    if (isHome) return NONE_STREAMER;

    const streamerElement = document.querySelector<HTMLElement>(
      streamerSelector.streamer
    );
    const streamerName = streamerElement?.innerText ?? "NONE";

    return {
      name: streamerName,
    };
  },
};

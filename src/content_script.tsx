import { Chat } from "./chat";

window.addEventListener("load", () => {
  const modekun = () => {
    console.log('hello modekun');
    const chatSection = document.querySelector<HTMLIFrameElement>("iframe");
    if (!chatSection || !chatSection.contentWindow) return;
    const chatBlocks = chatSection.contentWindow.document.querySelectorAll<HTMLElement>(
        ".yt-live-chat-text-message-renderer"
    );
    const chats: Chat[] = [];
    chatBlocks.forEach((chatBlock) => {
      const messageElement = chatBlock.querySelector<HTMLElement>("#message");
      if (!messageElement) return;
      const authorElement = chatBlock.querySelector<HTMLElement>("#author-name");
      const author = authorElement?.innerText;
      chats.push({
        author: author,
        message: messageElement.innerText,
        element: chatBlock,
      });
    });
    console.log(chats);
  };
  window.setInterval(modekun, 5000);
});

import { DOMMessage, DOMMessageResponse } from './../../types/DOMMessages';




// Function called when a new message is received
const messagesFromReactAppListener = async (
   msg: DOMMessage,
   sender: chrome.runtime.MessageSender,
   sendResponse: (response: DOMMessageResponse) => void) => {


   const headlines = Array.from(document.getElementsByTagName<"h1">("h1"))
      .map(h1 => h1.innerText);
   const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
   const metaOGDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
   const metaOGImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
   const websiteName = window.location.hostname

   const response: DOMMessageResponse = {
      title: msg.title,
      url: msg.url,
      description: metaDescription?.content ?? metaOGDescription?.content ?? (headlines.length === 0 ? msg.title : headlines.join("\n ")), // 🤓
      headlines: headlines.join("\n "),
      websiteName,
      favicon: metaOGImage?.content ?? msg.favIconUrl,
   };
   sendResponse(response);
}

/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);


export { }
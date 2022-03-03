import { DOMMessage, DOMMessageResponse } from './../../types/DOMMessages';

// Function called when a new message is received
const messagesFromReactAppListener = (
   msg: DOMMessage,
   sender: chrome.runtime.MessageSender,
   sendResponse: (response: DOMMessageResponse) => void) => {
   console.log('[content.js]. Message received', msg);
   const headlines = Array.from(document.getElementsByTagName<"h1">("h1"))
      .map(h1 => h1.innerText);
   const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
   const websiteName = window.location.hostname
   const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
   // Prepare the response object with information about the site
   const response: DOMMessageResponse = {
      title: document?.title,
      url: document.URL,
      description: metaDescription.content,
      headlines: headlines,
      websiteName,
      favicon: favicon.href
   };
   console.log('[content.js]. Message response', response);
   sendResponse(response);
}

/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

export { }
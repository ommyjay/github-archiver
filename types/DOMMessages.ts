export type DOMMessage = {
   type: 'GET_DOM',
   title: string;
   url: string;
   favIconUrl: string;
}

export type DOMMessageResponse = {
   title: string;
   url: string;
   websiteName: string;
   description: string;
   headlines: string;
   favicon: string;
}
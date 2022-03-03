export type DOMMessage = {
   type: 'GET_DOM'
}

export type DOMMessageResponse = {
   title: string;
   url: string;
   websiteName: string;
   description: string;
   headlines: string[];
   favicon: string;
}
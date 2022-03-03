/**
  * Append data in the front
  * @param dataToAppend
  * @param content
  * @returns {String}
  */
const appendDataBefore = (dataToAppend: any, content: any) => {
   // If the file is empty
   if (content.trim().length === 0) {
      content +=
         "# today-i-liked \nContent that I liked. Saved using https://goo.gl/Wj595G \n";
   }
   const arr = content.split("###");
   // if the length of arr is 1, then it is the first time to append data
   if (arr.length === 1) {
      arr[0] += getDateHeader();
      arr[0] += dataToAppend;
      content = arr.join("");
   } else {
      // if has not append data of currentDate, then append DateHeader
      if (isCurrentDateExists(content)) {
         arr[0] += getDateHeader();
         arr[0] += dataToAppend;
      } else {
         // if already have date then append to that
         arr[1] += dataToAppend;
      }
      content = arr.join("###");
   }
   return content;
}

/**
 * Return date header
 *
 * @returns {string}
 */
const getDateHeader = () => {
   return `\n### ${getCurrentDate()} \n`;
}

/**
 * Check if current date already exists in the content
 *
 * @param content
 * @returns {boolean}
 */
const isCurrentDateExists = (content: any) => {
   return content.indexOf(getCurrentDate()) !== -1;
}

/**
 * Return current
 *
 * @returns {string}
 */
const getCurrentDate = () => {
   const date = new Date();
   return `${monthNames()[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Return month names
 *
 * @returns {string[]}
 */
const monthNames = () => {
   return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];
}

export { appendDataBefore }
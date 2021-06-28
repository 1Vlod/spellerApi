import { spellerResponse } from "./types";

export const parseChunk = (chunk: Buffer): string[] => {
  return chunk
    .toString()
    .replace(/\r\n|\n\r|\n|\r/g, "\n")
    .split("\n");
};

export const createQueryFromArray = (
  textLines: string[],
  startLine: number
): string => {
  let result: string = "";
  for (let i = startLine; i < textLines.length; i++) {
    const line: string = textLines[i];

    if (line.length) {
      result += "text=" + line.split(" ").join("+") + "&";
    }
  }

  return result;
};

export const fixText = (
  initialTextLines: string[],
  fixedData: spellerResponse[][],
  startLine: number
) => {
  for (let j = 0; j < fixedData.length; j++) {
    if (fixedData[j].length) {
      fixedData[j].forEach((el: spellerResponse) => {
        initialTextLines[j + startLine] = initialTextLines[j + startLine].replace(
          el.word,
          el.s[0] || el.word
        );
      });
    }
  }

  return initialTextLines;
};

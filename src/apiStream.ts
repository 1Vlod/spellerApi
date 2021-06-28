import { StreamOptions, Transform } from "stream";
import axios from "axios";

import { spellerResponse } from "./types";
import { createQueryFromArray, fixText, parseChunk } from "./utils";

export class spellerTransform extends Transform {
  private index: number;

  constructor(opt?: StreamOptions<Transform>) {
    super(opt);
    this.index = 0;
  }

  async _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: (err: Error | null, data?: any) => any
  ) {
    const textLines: string[] = parseChunk(chunk);
    const startLine: number = this.index === 0 ? 4 : 0; // т.к первые 4 строчки имеют информацию из header.
    const queryString = createQueryFromArray(textLines, startLine);

    const url = encodeURI(
      "https://speller.yandex.net/services/spellservice.json/checkTexts?" +
        queryString
    );

    try {
      const { data } = await axios.post<spellerResponse[][]>(url);
      const fixedText = fixText(textLines, data, startLine);
      this.index++;
      callback(null, fixedText.join("\n"));
    } catch (err) {
      callback(err);
    }
  }
}

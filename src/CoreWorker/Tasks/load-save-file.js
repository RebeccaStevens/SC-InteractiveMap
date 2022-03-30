/// <reference lib="webworker" />

import { parse } from "../../SaveParser/Read.js";

export function loadSaveFile(fileName, rawData) {
    const result = parse(self, rawData);
}
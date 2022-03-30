/// <reference lib="webworker" />

import { setConfigData } from "../../Config/worker-set.js";

export function syncConfig(values) {
    setConfigData(values);
}
/**
 * @file
 * This is only to be used by the core worker to keep it's config data in sync with the main thread.
 * Note: It shouldn't be used by the main thead.
 */

/**
 * @typedef { import("./types").ConfigValues } ConfigValues
 */

import { state } from "./state.js";

/**
 * Used for syncing config data between threads.
 *
 * @param {ConfigValues} data
 */
 export function setConfigData(data) {
    state.debugMode = data.debugMode;
    state.language = data.language;
}

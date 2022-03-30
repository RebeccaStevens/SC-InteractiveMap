/**
 * @file
 * These functions are for changing the config values.
 * Note: They shouldn't be used by workers.
 */

/**
 * @typedef { import("./types").DebugMode } DebugMode
 * @typedef { import("./types").Language } Language
 *
 * @typedef { import("../CoreWorker/types").CoreWorker } CoreWorker
 * @typedef { import("../CoreWorker/types").TaskTalkback } TaskTalkback
 */

import * as coreWorker from "../CoreWorker/WorkerManager.js";

import { state } from "./state.js";

/**
 * Turn on or off debug mode.
 *
 * @param {DebugMode} debugMode
 * @param {TaskTalkback | false} [sync]
 */
export function setDebugMode(debugMode, sync) {
    state.debugMode = debugMode;
    if (sync !== false) {
        syncData(sync);
    }
}

/**
 * Change the language.
 *
 * @param {Language} language
 * @param {TaskTalkback | false} [sync]
 */
export function setLanguage(language, sync) {
    state.language = language;
    if (sync !== false) {
        syncData(sync);
    }
}

/**
 * Override the config data in the core worker with this config data.
 *
 * @param {TaskTalkback} [talkback]
 */
export function syncData(talkback) {
    const task = coreWorker.createTask({
        command: "sync-config",
        values: state,
    });

    coreWorker.startTask(task, talkback);
}

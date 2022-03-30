/// <reference lib="webworker" />

/**
 * @typedef { import("./types").TransactionReceived } TransactionReceived
 */

import * as tasks from "./Tasks/index.js";
import * as taskManager from "./TaskManager.js"

debugger;

/**
 * Listen for message events.
 */
self.addEventListener("message", action);

/**
 * Handle the message events.
 *
 * @param {MessageEvent<TransactionReceived>} event
 */
function action({ data }) {
    try {
        switch (data.command) {
            case "sync-config":
                tasks.syncConfig(data.values);
                break;

            case "load-save-file":
                tasks.loadSaveFile(data.fileName, data.rawData);
                break;
        }

        taskManager.reportSuccess(data.id);
    } catch (error) {
        console.error(error);
        taskManager.reportFailure(data.id, error.message);
    }
}


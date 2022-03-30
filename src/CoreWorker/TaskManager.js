/// <reference lib="webworker" />

/**
 * @typedef { import("./types").CoreWorkerThread } CoreWorkerThread
 * @typedef { import("./types").TransactionId } TransactionId
 * @typedef { import("./types").TaskReportData } TaskReportData
 */

/**
 * @type {CoreWorkerThread["postMessage"]}
 */
 const post = self.postMessage;

export function reportSuccess(taskId) {
    post({ command: "task-complete", id: taskId });
}

export function reportFailure(taskId, errorMessage) {
    post({ command: "task-failed", id: taskId, errorMessage: errorMessage });
}

/**
 *
 * @param {TransactionId} taskId
 * @param {TaskReportData} data
 */
export function reportProgress(taskId, data) {
    post({ command: "task-progress", id: taskId, data });
}
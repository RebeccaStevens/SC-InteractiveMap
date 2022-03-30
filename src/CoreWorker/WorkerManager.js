/**
 * @typedef { import("./types").CoreWorker } CoreWorker
 * @typedef { import("./types").DataReceived } DataReceived
 * @typedef { import("./types").Task } Task
 * @typedef { import("./types").TaskTalkback } TaskTalkback
 * @typedef { import("./types").TransactionId } TransactionId
 * @typedef { import("./types").TransactionSentSource } TransactionSentSource
 * @typedef { import("./types").UpdatedTaskData } UpdatedTaskData
 * @typedef { import("./types").StartTaskData } StartTaskData
 */

import * as config from "../Config/index.js";

/** @type {CoreWorker} */
const worker = new Worker(config.getCoreWorkerUrl());

/**
 * The id of the next worker transaction.
 *
 * @type {TransactionId}
 */
let transactionId = 0;

/**
 * Get a new transaction id.
 *
 * @returns {TransactionId}
 */
function getNewTransactionId() {
    return transactionId++;
}

/**
 * Create a task that will run on the core worker.
 *
 * Returns a callbag that can used to comunicate with the task.
 *
 * @param {StartTaskData} data
 * @param {StructuredSerializeOptions} [options]
 * @returns {Task}
 */
export function createTask(data, options) {
    return (callbagSignal, callbagData) => {
        /** @type {TaskTalkback | undefined} */
        let talkback = undefined;

        /** @type {TransactionSentSource} */
        let source = undefined;

        /** @type {TransactionId} */
        let id = undefined;

        /** @type {boolean} */
        let started = false;

        /** @type {boolean} */
        let complete = false;

        /** @type {() => void} */
        const done = () => {
            // Mark the task as complete.
            complete = true;
            // Tell the source we are done listening.
            source(2);
        };

        switch (callbagSignal) {
            // Start the task.
            case 0: {
                if (started) {
                    throw Error("Task already started.");
                }
                started = true;

                // Save the passed talkback.
                talkback = callbagData;

                // Allowing the talkback to be undefined isn't spec compliant but it allows us to
                // skip unnessassery stuff if we don't care about the result.
                if (talkback !== undefined) {
                    // Get a unique id for this task.
                    id = getNewTransactionId();

                    // Setup a source for the worker message events.
                    source = callbags.fromEvent(worker, "message", { passive: true });

                    // Start listing and processing the worker message events.
                    callbags.pipe(
                        source,
                        callbags.forEach(({ data }) => {
                            // Don't do anything if we are done.
                            if (complete === true) {
                                return;
                            }
                            // Only process events for this task.
                            if (data.id !== id) {
                                return;
                            }
                            switch (data.command) {
                                case "task-progress":
                                    // Pass the talkback the data.
                                    talkback(1, data.data);
                                    break;

                                case "task-complete":
                                    done();
                                    // Tell the talkback that we are done.
                                    talkback(2);
                                    break;

                                case "task-failed":
                                    done();
                                    // Tell the talkback that there was an error.
                                    talkback(2, new Error(data.errorMessage));
                                    break;
                            }
                        })
                    );

                    worker.postMessage(
                        {
                            ...data,
                            id,
                        },
                        options
                    );
                }
                break;
            }

            // Data was sent to the task.
            case 1: {
                if (!started) {
                    throw Error(
                        "Task not started. It must be started before additional data can be sent to it."
                    );
                }
                if (complete) {
                    throw Error("Task already complete.");
                }
                worker.postMessage(
                    {
                        ...callbagData,
                        id,
                    },
                    options
                );
                break;
            }

            // The user doesn't care about this task anymore.
            case 2: {
                if (!started) {
                    throw Error("Task not started. It must be started before it can be completed.");
                }
                if (complete) {
                    throw Error("Task already complete.");
                }
                done();
                break;
            }
        }
    };
}

/**
 * Start the given task.
 *
 * @param {Task} task
 * @param {TaskTalkback} [talkback]
 */
export function startTask(task, talkback) {
    task(0, talkback);
}

/**
 * Send data to the given task.
 *
 * @param {Task} task
 * @param {UpdatedTaskData} data
 */
export function updateTask(task, data) {
    task(1, data);
}

/**
 * End the given task.
 *
 * @param {Task} task
 */
export function endTask(task) {
    task(2);
}

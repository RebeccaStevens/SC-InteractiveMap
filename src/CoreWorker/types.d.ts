import type * as CallbagArgs from "../types/callbag-args";
import type { GenericThread, GenericWorker, NonDiscriminatedUnion } from "../types/utils";

import type { ConfigValues } from "../Config/types";

/**
 * The window's thread.
 */
export type MainThread = GenericThread<TransactionReceived, TransactionSent>;

/**
 * The core worker's thread.
 */
export type CoreWorkerThread = GenericThread<TransactionSent, TransactionReceived>;

/**
 * The core worker (as accessed from the main thread).
 */
export type CoreWorker = GenericWorker<TransactionReceived, TransactionSent>;

/**
 * A message send to or from the core worker.
 */
export type Transaction = {
  id: TransactionId;
};

/**
 * An id of a transaction.
 */
export type TransactionId = number;

/**
 * The messages that can be sent by the core worker.
 */
export type DataSent =
  | Readonly<{
      command: "task-progress";
      data: TaskReportData;
    }>
  | Readonly<{
      command: "task-complete";
    }>
  | Readonly<{
      command: "task-failed";
      errorMessage: string;
    }>;

/**
 * The messages that can be sent to the core worker.
 */
export type DataReceived = StartTaskData | UpdatedTaskData;

/**
 * The messages that can be sent to the core worker to start a task.
 */
export type StartTaskData =
  | Readonly<{
      command: "sync-config";
      values: Partial<ConfigValues>;
    }>
  | Readonly<{
      command: "load-save-file";
      fileName: string;
      rawData: ArrayBuffer;
    }>;

/**
 * The messages that can be sent to the core worker to talk to a running task.
 * TODO: Figure out if this is wanted.
 */
export type UpdatedTaskData = Readonly<{
  command: "update-task-data";
  data: never;
}>;

/**
 * A callbag that represents a task that will be run on the core worker.
 */
export interface Task {
  (
    ...args:
      | CallbagArgs.Start<UpdatedTaskData, TaskReportData>
      | CallbagArgs.Push<UpdatedTaskData>
      | CallbagArgs.End
      | CallbagArgs.EndWithError
  ): void;
}

/**
 * A callbag to talk to a task.
 */
export interface TaskTalkback {
  (...args: CallbagArgs.Push<TaskReportData> | CallbagArgs.End | CallbagArgs.EndWithError): void;
}

/**
 * The data a task may report back as it's running.
 */
export type TaskReportData = NonDiscriminatedUnion<
  | {
      progress: number;
    }
  | {
      message: string;
      messageReplace?: string | string[];
    }
>;

/**
 * A transaction that is sent by the core worker.
 */
export type TransactionSent = Transaction & DataSent;

/**
 * A transaction that is sent to the core worker.
 */
export type TransactionReceived = Transaction & DataReceived;

/**
 * A callbag source for transactions received from the core worker.
 */
export interface TransactionSentSource {
  (
    ...args:
      | CallbagArgs.Start<never, MessageEvent<TransactionSent>>
      | CallbagArgs.Pull
      | CallbagArgs.End
      | CallbagArgs.EndWithError
  ): void;
}

// Override the callbag `fromEvent` type to work with the core worker's events.
declare module "../Lib/callbags.esm.js" {
  export function fromEvent(
    node: CoreWorker,
    type: "message",
    options?: AddEventListenerOptions
  ): TransactionSentSource;
}

import type { UnionToIntersection } from "type-fest";

export type NonDiscriminatedUnion<Union> = Union | UnionToIntersection<Union>;

/**
 * Create a typed thread.
 */
export type GenericThread<Receive = any, Send = any> = Omit<Window, "postMessage"> &
  MessagePoster<Receive, Send>;

/**
 * Create a typed worker.
 */
export type GenericWorker<Receive = any, Send = any> = Omit<Worker, "postMessage"> &
  MessagePoster<Receive, Send>;

/**
 * Something that can post messages.
 */
type MessagePoster<Receive = any, Send = any> = {
  postMessage(message: Receive, options?: StructuredSerializeOptions): void;

  addEventListener(
    type: "message",
    listener: (this: MessagePoster<Receive, Send>, ev: MessageEvent<Send>) => any,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener(
    type: "message",
    listener: (this: MessagePoster<Receive, Send>, ev: MessageEvent<Send>) => any,
    options?: boolean | EventListenerOptions
  ): void;
};

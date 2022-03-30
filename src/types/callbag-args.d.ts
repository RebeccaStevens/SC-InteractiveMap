import { Callbag, DATA, END, START } from "callbag";

export type Start<I, O> = [signal: START, talkback: Callbag<O, I>];

export type Pull = [signal: DATA];

export type Push<I> = [signal: DATA, data: I];

export type End = [signal: END];

export type EndWithError = [signal: END, error: unknown];

import { Source, UnwrapSource } from 'callbag';

export function combine<T1>(s1: Source<T1>): Source<[T1]>;
export function combine<T1, T2>(s1: Source<T1>, s2: Source<T2>): Source<[T1, T2]>;
export function combine<T1, T2, T3>(s1: Source<T1>, s2: Source<T2>, s3: Source<T3>): Source<[T1, T2, T3]>;
export function combine<T1, T2, T3, T4>(s1: Source<T1>, s2: Source<T2>, s3: Source<T3>, s4: Source<T4>): Source<[T1, T2, T3, T4]>;
export function combine<T1, T2, T3, T4, T5>(s1: Source<T1>, s2: Source<T2>, s3: Source<T3>, s4: Source<T4>, s5: Source<T5>): Source<[T1, T2, T3, T4, T5]>;
export function combine<T1, T2, T3, T4, T5, T6>(s1: Source<T1>, s2: Source<T2>, s3: Source<T3>, s4: Source<T4>, s5: Source<T5>, s6: Source<T6>): Source<[T1, T2, T3, T4, T5, T6]>;
export function combine<T1, T2, T3, T4, T5, T6, T7>(s1: Source<T1>, s2: Source<T2>, s3: Source<T3>, s4: Source<T4>, s5: Source<T5>, s6: Source<T6>, s7: Source<T7>): Source<[T1, T2, T3, T4, T5, T6, T7]>;
export function combine<T1, T2, T3, T4, T5, T6, T7, T8>(s1: Source<T1>, s2: Source<T2>, s3: Source<T3>, s4: Source<T4>, s5: Source<T5>, s6: Source<T6>, s7: Source<T7>, s8: Source<T8>): Source<[T1, T2, T3, T4, T5, T6, T7, T8]>;
export function combine<T1, T2, T3, T4, T5, T6, T7, T8, T9>(s1: Source<T1>, s2: Source<T2>, s3: Source<T3>, s4: Source<T4>, s5: Source<T5>, s6: Source<T6>, s7: Source<T7>, s8: Source<T8>, s9: Source<T9>): Source<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
export function combine<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(s1: Source<T1>, s2: Source<T2>, s3: Source<T3>, s4: Source<T4>, s5: Source<T5>, s6: Source<T6>, s7: Source<T7>, s8: Source<T8>, s9: Source<T9>, s10: Source<T10>): Source<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;

export function concat<T extends Source<any>[]>(...sources: T): Source<UnwrapSource<T[number]>>;

export function filter<I>(condition: (d: I) => boolean): (source: Source<I>) => Source<I>;

export function flatten<T>(source: Source<Source<T>>): Source<T>;

export function forEach<T>(operation: (data: T) => void): (source: Source<T>) => void;

export function fromEvent<T extends keyof HTMLElementEventMap>(node: EventTarget, name: T, options?: boolean | AddEventListenerOptions): Source<HTMLElementEventMap[T]>;

export function fromIter<T>(iter: Iterator<T> | Iterable<T>): Source<T>;

export function fromObs<T>(observable: Observable<T>): Source<T>;

export function fromPromise<T>(promise: PromiseLike<T>): Source<T>;

export function interval(period: number): Source<number>;

export function map<I, O>(f: (d: I) => O): (source: Source<I>) => Source<O>;

export function merge<T extends Source<any>[]>(...sources: T): Source<UnwrapSource<T[number]>>;

export function pipe<T1, T2>(first: T1, second: (a: T1) => T2): T2
export function pipe<T1, T2, T3>(first: T1, second: (a: T1) => T2, third: (a: T2) => T3): T3
export function pipe<T1, T2, T3, T4>(first: T1, second: (a: T1) => T2, third: (a: T2) => T3, fourth: (a: T3) => T4): T4
export function pipe<T1, T2, T3, T4, T5>(first: T1, second: (a: T1) => T2, third: (a: T2) => T3, fourth: (a: T3) => T4, fifth: (a: T4) => T5): T5
export function pipe<T1, T2, T3, T4, T5, T6>(first: T1, second: (a: T1) => T2, third: (a: T2) => T3, fourth: (a: T3) => T4, fifth: (a: T4) => T5, sixth: (a: T5) => T6): T6
export function pipe<T1, T2, T3, T4, T5, T6, T7>(first: T1, second: (a: T1) => T2, third: (a: T2) => T3, fourth: (a: T3) => T4, fifth: (a: T4) => T5, sixth: (a: T5) => T6, seventh: (a: T6) => T7): T7
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8>(first: T1, second: (a: T1) => T2, third: (a: T2) => T3, fourth: (a: T3) => T4, fifth: (a: T4) => T5, sixth: (a: T5) => T6, seventh: (a: T6) => T7, eigth: (a: T7) => T8): T8
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(first: T1, second: (a: T1) => T2, third: (a: T2) => T3, fourth: (a: T3) => T4, fifth: (a: T4) => T5, sixth: (a: T5) => T6, seventh: (a: T6) => T7, eigth: (a: T7) => T8, ninth: (a: T8) => T9): T9
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(first: T1, second: (a: T1) => T2, third: (a: T2) => T3, fourth: (a: T3) => T4, fifth: (a: T4) => T5, sixth: (a: T5) => T6, seventh: (a: T6) => T7, eigth: (a: T7) => T8, ninth: (a: T8) => T9, tenth: (a: T9) => T10): T10

export function scan<I, O>(reducer: (acc: O, d: I) => O, seed?: O): (source: Source<I>) => Source<O>;

export function share<T extends Source<any>>(source: T): T;

export function skip<T>(max: number): (source: Source<T>) => Source<T>;

export function take<T>(max: number): (source: Source<T>) => Source<T>;


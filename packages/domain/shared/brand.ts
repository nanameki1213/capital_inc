// ID などを素の string / number と混ぜないための「ブランド型」（coding-rules 1章）。
// 実行時には何も足さないので、GameState をそのまま JSON にできる。
declare const brand: unique symbol;

export type Brand<T, B extends string> = T & { readonly [brand]: B };

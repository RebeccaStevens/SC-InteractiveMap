/**
 * @typedef { import("./types").DebugMode } DebugMode
 * @typedef { import("./types").Language } Language
 */

/**
 * The dynamic config data.
 */
export const state = {
    /** @type {DebugMode} */
    debugMode: false,

    /** @type {Language} */
    language: "en",
};

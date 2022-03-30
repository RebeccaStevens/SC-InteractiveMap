import { state} from "./state.js"

const siteUri = "https://satisfactory-calculator.com";
const staticAssetsUri = "https://static.satisfactory-calculator.com";

const build = "EarlyAccess";

/**
 * Get the version identifier.
 */
 export function getBuild() {
    return build;
}

/**
 * Is debug mode on?
 */
export function isDebugMode() {
    return state.debugMode;
}

/**
 * Get the current language.
 */
export function getLanguage() {
    return state.language;
}

/**
 * Get the uri for static assets.
 */
export function getStaticAssetsUri() {
    return staticAssetsUri;
}

/**
 * Get the url for the map data.
 */
export function getMapDataUrl() {
    return `${siteUri}/${getLanguage()}/interactive-map/index/json`;
}

/**
 * Get the url for the game data.
 */
export function getGameDataUrl() {
    return `${siteUri}/${getLanguage()}/api/game`;
}

/**
 * Get the url for the mods data.
 */
export function getModsDataUrl() {
    return `${siteUri}/${getLanguage()}/mods/index/json`;
}

/**
 * Get the url for the translation data.
 */
export function getTranslationDataUrl() {
    return `${siteUri}/${getLanguage()}/api/map/translation`;
}

/**
 * Get the url for the tetromino data.
 */
export function getTetrominoUrl() {
    return `${siteUri}/${getLanguage()}/api/tetromino`;
}

/**
 * Get the url for the users data.
 */
export function getUsersUrl() {
    return `${siteUri}/${getLanguage()}/api/users`;
}

/**
 * Get the url of the Save Parser Read worker.
 */
export function getSaveParserReadWorkerUrl() {
    return `${siteUri}/js/InteractiveMap/build/Worker/SaveParser/ReadWorker.js`;
}

/**
 * Get the url of the Save Parser Write worker.
 */
export function getSaveParserWriteWorkerUrl() {
    return `${siteUri}/js/InteractiveMap/build/Worker/SaveParser/Write.js`;
}

/**
 * Get the url of the Save Parser Write worker.
 */
export function getCoreWorkerUrl() {
    return `${siteUri}/js/InteractiveMap/build/Worker/Core.js`;
}

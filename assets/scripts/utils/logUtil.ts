import { DEBUG } from "cc/env";

enum LogType {
    INFO = 1 << 1,
    DEBUG = 1 << 2,
    WARN = 1 << 3,
    ERROR = 1 << 4
}

// development
const LOG_FLAGS_DEV = LogType.INFO | LogType.WARN | LogType.ERROR | LogType.DEBUG;
// release
const LOG_FLAGS_RELEASE = 0;

function LogFlags() {
    if (DEBUG)
        return LOG_FLAGS_DEV;
    return LOG_FLAGS_RELEASE;
}

export namespace logUtil {
    /**
     * used to log major events, mostly for monitoring
     */
    export function debug (message?: any, ...params: any[]) {
        if (LogFlags() & LogType.DEBUG) {
            console.debug(message, ...params);
        }
    }
    /**
     * used for general message logs
     */
    export function log (message?: any, ...params: any[]) {
        if (LogFlags() & LogType.INFO) {
            console.log(message, ...params);
        }
    }
    /**
     * used to log errors
     */
    export function error (message?: any, ...params: any[]) {
        if (LogFlags() & LogType.ERROR) {
            console.error(message, ...params);
        }
    }
    /**
     * used to log warning messages
     */
    export function warn (message?: any, ...params: any[]) {
        if (LogFlags() & LogType.WARN) {
            console.warn(message, ...params);
        }
    }
}
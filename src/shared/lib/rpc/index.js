/**
 * Universal
 *  register(name, callback)
 *  unregister(name)
 *  call(name, args)
 *  callServer(name, args)
 *  on(name, callback)
 *  off(name, callback)
 *  trigger(name, args)
 *  triggerServer(name, args)
 * Server-side
 *  callClient(player, name, args)
 *  callBrowsers(player, name, args)
 *  triggerClient(player, name, args)
 *  triggerBrowsers(player, name, args)
 *  Client-side
 *  callBrowser(browser, name, args)
 *  triggerBrowser(browser, name, args)
 * CEF or Client-side
 *  callBrowsers(name, args)
 *  callClient(name, args)
 *  triggerBrowsers(name, args)
 *  triggerClient(name, args)
 */

import * as cef from './cef';
import * as client from './client';
import * as server from './server';

const ENV_SERVER = 'server';
const ENV_CLIENT = 'client';
const ENV_CEF = 'cef';

// Current environment
const env =
    typeof process !== 'undefined'
        ? ENV_SERVER
    : typeof window === 'undefined'
        ? ENV_CLIENT
        : ENV_CEF;

let _exports;

switch (env) {
    case ENV_CEF:
        _exports = cef;
        break;
    case ENV_CLIENT:
        _exports = client;
        break;
    case ENV_SERVER:
        _exports = server;
        break;
    default:
        throw new Error('Unknown environment');
}

export default _exports;

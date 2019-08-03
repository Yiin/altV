import alt from 'alt/client';
import { uuid, serialize, deserialize, serializeError } from './utils';

const webViews = [];
const rpcs = {};
const awaitingResponses = {};

export function register(rpc, handler) {
    if (typeof handler !== 'function') {
        throw new Error('RPC handler must be a function');
    }
    rpcs[rpc] = handler;
}

export function unregister(rpc) {
    delete rpcs[rpc];
}

function promiseResponse(id) {
    return new Promise((resolve, reject) => {
        awaitingResponses[id] = { resolve, reject };
    });
}

alt.WebView = class WebView extends alt.WebView {
    constructor(...args) {
        super(...args);

        webViews.push(this);

        this.on(`rpc:call-server`, async (data) => {
            const { rpc, id, args } = deserialize(data);

            try {
                const result = await callServer(rpc, ...args);
                this.emit('rpc:response', serialize({ error: false, id, result }));
            } catch (e) {
                this.emit('rpc:response', serialize({ error: serializeError(e), id }));
            }
        });

        this.on('rpc:call', async (data) => {
            const { rpc, id, args } = deserialize(data);

            if (rpc in rpcs) {
                try {
                    const result = await rpcs[rpc](...args);
                    this.emit('rpc:response', serialize({ error: false, id, result }));
                } catch (e) {
                    this.emit('rpc:response', serialize({ error: serializeError(e), id }));
                }
            } else {
                alt.logError(`Unknown RPC: ${rpc}`);
            }
        });

        this.on('rpc:response', (data) => {
            const { error, id, result } = deserialize(data);
        
            if (id in awaitingResponses) {
                if (error) {
                    awaitingResponses[id].reject(error);
                } else {
                    awaitingResponses[id].resolve(result);
                }
                delete awaitingResponses[id];
            }
        });
    }

    destroy() {
        super.destroy();

        if (webViews.includes(this)) {
            webViews.splice(webViews.indexOf(this), 1);
        }
    }

    call(rpc, ...args) {
        const id = uuid();
        this.emit('rpc:call', serialize({ rpc, id, args }));
        return promiseResponse(id);
    }
}

alt.onServer('rpc:call', async (data) => {
    alt.log(`onServer: ${data}`);
    const { rpc, id, args } = deserialize(data);

    if (rpc in rpcs) {
        try {
            const result = await rpcs[rpc](...args);
            alt.emitServer('rpc:response', serialize({ error: false, id, result }));
        } catch (e) {
            alt.emitServer('rpc:response', serialize({ error: serializeError(e), id }));
        }
    } else {
        alt.logError(`Unknown RPC: ${rpc}`);
    }
});

alt.onServer('rpc:response', async (data) => {
    const { error, id, result } = deserialize(data);

    if (id in awaitingResponses) {
        if (error) {
            awaitingResponses[id].reject(error);
        } else {
            awaitingResponses[id].resolve(result);
        }
        delete awaitingResponses[id];
    }
});

export async function call(rpc, ...args) {
    if (rpc in rpcs) {
        return rpcs[rpc](...args);
    }
    throw new Error(`Unknown RPC: ${rpc}`);
}

export async function callServer(rpc, ...args) {
    const id = uuid();
    alt.emitServer('rpc:call', serialize({ rpc, id, args }));
    return promiseResponse(id);
}

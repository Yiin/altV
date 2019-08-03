import { uuid, serialize, deserialize, serializeError } from './utils';

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

alt.on('rpc:call', async (data) => {
    const { rpc, id, args } = deserialize(data);

    if (rpc in rpcs) {
        try {
            const result = await rpcs[rpc](...args);
            alt.emit('rpc:response', serialize({ error: false, id, result }));
        } catch (e) {
            alt.emit('rpc:response', serialize({ error: serializeError(e), id }));
        }
    }
});

alt.on('rpc:response', (data) => {
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

export async function callServer(rpc, ...args) {
    const id = uuid();
    alt.emit('rpc:call-server', serialize({ rpc, id, args }));
    return promiseResponse(id);
}

export async function callClient(rpc, ...args) {
    const id = uuid();
    alt.emit('rpc:call', serialize({ rpc, id, args }));
    return promiseResponse(id);
}

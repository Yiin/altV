import alt from 'alt/server';
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

alt.onClient('rpc:call', async (player, data) => {
    const { rpc, id, args } = deserialize(data);

    if (rpc in rpcs) {
        try {
            const result = await rpcs[rpc](...args);
            alt.emitClient(player, 'rpc:response', serialize({ error: false, id, result }));
        } catch (e) {
            alt.emitClient(player, 'rpc:response', serialize({ error: serializeError(e), id }));
        }
    } else {
        alt.logError(`Unknown RPC: ${rpc}`);
    }
});

alt.onClient('rpc:response', (player, data) => {
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

export async function callClient(player, rpc, ...args) {
    const id = uuid();
    alt.log('emitClient', 'rpc:call', serialize({ rpc, id, args }));
    alt.emitClient(player, 'rpc:call', serialize({ rpc, id, args }));
    return promiseResponse(id);
}

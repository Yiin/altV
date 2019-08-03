import alt from 'alt/server';
import container from '~/core/di';
import { error } from '~/helpers/log';
import { sleep } from '~/helpers/sleep';

export const on = (eventName: string) => async (
    target,
    propertyKey: string,
) => {
    await sleep(10);

    try {
        const service = container.get(target.constructor);
        alt.on(eventName, async (...args) => {
            try {
                await service[propertyKey](...args);
            } catch (e) {
                error('EventHandler', e.message);
            }
        });
    } catch (e) {
        error('EventHandler', `Event failed to bind: ${eventName}`);
        error('EventHandler', e);
    }
};

import { injectable } from 'inversify';

import './env';
import { register } from './di';

@register()
@injectable()
export class Script {
    private readonly registeredModules = [];

    use(module) {
        this.registeredModules.push(module);
    }

    async start() {
        for (const module of this.registeredModules) {
            await module.start();
        }
    }
}

import { log } from 'alt/server';
import { injectable } from 'inversify';
import { register, on } from './core/di';

@register()
@injectable()
export class Module {
    @on('consoleCommand')
    handleConsoleCommand(msg: string) {
        log(`Got message: ${msg}`);
    }
}

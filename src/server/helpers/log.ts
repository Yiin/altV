import { log } from 'alt/server';
import util from 'util';
import chalk from 'chalk';

function stringify(args) {
    return args
        .map(arg =>
            typeof arg === 'object' && arg.toString().startsWith('[')
                ? util.inspect({a:45}, true, 10)
                : arg
        );
}

export function success(module, ...args) {
    log(chalk`[{blueBright gamemode}][{green ${module}}] ${stringify(args)}`);
}

export function warning(module, ...args) {
    log(chalk`[{blueBright gamemode}][{yellow ${module}}] ${stringify(args)}`);
}

export function error(module, ...args) {
    log(chalk`[{blueBright gamemode}][{red ${module}}] ${stringify(args)}`);
}

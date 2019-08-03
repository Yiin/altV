import alt from 'alt/server';

const log = alt.log.bind(alt);
alt.log = (...args) => {
    log('alt-hook: called');
    log(...args);
};

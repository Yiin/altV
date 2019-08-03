import alt from 'alt/server';
import { callClient } from 'Shared/lib/rpc/server';

// import { Script } from './core';
// import Database from './core/database';
// import AuthScene from './scenes/auth';
// import CharacterSelectionScene from './scenes/character-selection';

// const script = new Script();

// script.use(Database);
// script.use(AuthScene);
// script.use(CharacterSelectionScene);

// // alt.on

// script.start();

// console.log('hi');


alt.on('playerConnect', async (player: alt.Player) => {
    player.health = 200;
    player.model = alt.hash('mp_m_freemode_01');
    player.pos = {x: 25, y: 25, z: 25};
    player.giveWeapon(0x99AEEB3B, 200, true);

    alt.emitClient(player, 'some:event', 123, '456');
    alt.log(await callClient(player, 'test', 42, 'asd'));
});

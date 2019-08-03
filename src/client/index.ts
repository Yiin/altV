import alt from 'alt/client';
import natives from 'natives';
import { register } from 'Shared/lib/rpc/client';

natives.freezeEntityPosition(alt.Player.local.scriptID, false);
natives.setPedDefaultComponentVariation(alt.Player.local.scriptID);

alt.log(JSON.stringify({ a: 42 }));

alt.onServer('some:event', (arg1, arg2) => {
    alt.log('omg, some event', arg1, arg2);
});

register('test', async (arg1, arg2) => {
    alt.log(arg1, arg2);
    return 'ALL GOOD!';
});

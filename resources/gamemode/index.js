const alt = require('alt');

alt.on('playerConnect', (player) => {
  player.spawn(0, 0, 72, 0);
  alt.createVehicle('adder', 0, 5, 72, 0, 0, 0);
});

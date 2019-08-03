import alt, { Player } from 'alt/server';
import { injectable, inject } from 'inversify';
import { register, on } from 'core/di';
import { PlayerRepository } from '~/repositories/player/player.repository';

@register()
@injectable()
export class AuthScene {
    constructor(
        @inject(PlayerRepository) private readonly playerRepository: PlayerRepository,
    ) {}

    @on('playerConnect')
    async welcome(player: alt.Player) {
        const { characters } = await this.playerRepository.findOrCreate(player);
        const [character] = await characters;

        if (character) {
            const { x, y, z } = character;
            player.spawn(x, y, z, 0);
        } else {
            player.spawn(0, 0, 73, 0);
        }
    }

    @on('playerDisconnect')
    savePosition(player: alt.Player) {
        this.playerRepository.save(player);
    }
}

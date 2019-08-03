import alt from 'alt/server';
import { DeepPartial } from 'typeorm';
import { injectable, inject } from 'inversify';
import { register } from 'core/di';
import { UserEntityRepository, CharacterEntityRepository } from './bindings';
import { User, Character } from 'Shared/models';

@register()
@injectable()
export class PlayerRepository {
    constructor(
        @inject(UserEntityRepository)
        private readonly userEntityRepository: UserEntityRepository,

        @inject(CharacterEntityRepository)
        private readonly characterEntityRepository: CharacterEntityRepository,
    ) {}

    async findOrCreate(player: alt.Player | string) {
        const username = typeof player === 'string' ? player : player.name;
        const user = this.userEntityRepository.findOne({
            username,
        });

        if (user) {
            return user;
        }

        return this.create({
            username,
        });
    }

    async create(userModel: DeepPartial<User>) {
        const user = await this.userEntityRepository.save(
            User.create(userModel)
        );

        await this.characterEntityRepository.save(
            Character.create({
                user,
                name: user.username,
                appearance: JSON.stringify({}),
            })
        );

        return user;
    }

    async save(player: alt.Player) {
        const user = await this.findOrCreate(player);

        const [character] = await user.characters;

        if (character) {
            const { x, y, z } = player.pos;

            alt.log('Saving character...', JSON.stringify(character, null, 4));
            this.characterEntityRepository.save({
                id: character.id,
                x,
                y,
                z,
                heading: 0,
            });
        }
    }
}

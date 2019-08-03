import { Repository, getRepository } from 'typeorm';
import { User, Character } from 'Shared/models';
import container from '~/core/di';

export class UserEntityRepository extends Repository<User> {}
export class CharacterEntityRepository extends Repository<Character> {}

container.bind<Repository<User>>(UserEntityRepository)
    .toDynamicValue(() => getRepository(User))
    .inRequestScope();

container.bind<Repository<Character>>(CharacterEntityRepository)
    .toDynamicValue(() => getRepository(Character))
    .inRequestScope();

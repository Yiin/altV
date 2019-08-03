import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeepPartial } from 'typeorm';

import { Character } from './Character';
import { BaseModel } from './BaseModel';

@Entity('Users')
export class User extends BaseModel {
    static create(entity: DeepPartial<User>) {
        return super.createEntity(this, entity) as User;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ default: null })
    password?: string;

    @Column({ nullable: true })
    authToken: string;

    @Column({ nullable: true })
    email: string;

    @OneToMany(type => Character, character => character.user)
    characters: Promise<Character[]>;
}

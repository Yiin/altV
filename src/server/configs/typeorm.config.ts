import * as Models from 'Shared/models';
import { ConnectionOptions } from 'typeorm';
import { log } from 'alt/server';

export const TYPE_ORM_CONFIG: ConnectionOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: Object.values(Models),
    synchronize: true,
    logging: false
};

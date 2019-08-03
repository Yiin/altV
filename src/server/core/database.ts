import { createConnection } from 'typeorm';
import { TYPE_ORM_CONFIG } from '../configs/typeorm.config';
import { success, warning, error } from '~/helpers/log';

const database = {
    connection: null,

    async start(tries = 0) {
        try {
            database.connection = await createConnection(TYPE_ORM_CONFIG)
            success('Database', 'Connected successfully!');
        } catch (e) {
            if (tries < 3) {
                warning('Database', 'Trying to reconnect...');
                await database.start(tries + 1);
            } else {
                error('Database', e.message);
                process.exit();
            }
        }
    },
};

export default database;

import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { success, error } from '~/helpers/log';

const container = new Container();
// Create new DI container

interface Target extends interfaces.Newable<any> {
    name: string;
}

export const register = () => (target: Target) => {
    try {
        container.bind(target).to(target).inSingletonScope();
        success('Loaded', target.name);
    } catch {
        error('Module failed to load', target.name);
    }
};

export default container;

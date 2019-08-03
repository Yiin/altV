import { DeepPartial } from 'typeorm';

export class BaseModel {
    static createEntity<T extends BaseModel>(
        modelClass: { new (...args: any[]): T },
        partialModel: DeepPartial<T>,
    ) {
        const model = new modelClass();
        for (const key in partialModel) {
            model[key] = partialModel[key] as any;
        }
        return model;
    }
}

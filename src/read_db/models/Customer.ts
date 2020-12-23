import { model, Model, Schema } from "mongoose";
import {ICustomer} from "./ICustomer";

export interface ICustomerModel extends Model<ICustomer> {}

export class Customer {
    // tslint:disable-next-line:variable-name
    private _model: Model<ICustomer>;

    constructor() {
        const schema = new Schema({
            email: {
                type: String,
                unique: true,
                // tslint:disable-next-line:object-literal-sort-keys
                index: true,
                required: true,
            },
            firstName: {type: String, required: true},
            lastName: {type: String, required: true},
            orders: [{
                id: {type: String, required: true},
                // tslint:disable-next-line:object-literal-sort-keys
                description: {type: String, required: true},
                count: {type: Number, required: true},
            }],
            // tslint:disable-next-line:object-literal-sort-keys
            created: {
                type: Date,
                // tslint:disable-next-line:object-literal-sort-keys
                default: Date.now,
            },
        });

        this._model = model<ICustomer>("Customer", schema);
    }

    public get model(): Model<ICustomer> {
        return this._model;
    }
}

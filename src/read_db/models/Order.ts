import { model, Model, Schema } from "mongoose";
import {ICustomer} from "./ICustomer";
import {IOrder} from "./IOrder";

export interface IOrderModel extends Model<IOrder> {}

export class Order {
    // tslint:disable-next-line:variable-name
    private _model: Model<IOrder>;

    constructor() {
        const schema = new Schema( {
            _id: { type: String, required: true },
            // tslint:disable-next-line:object-literal-sort-keys
            description: { type: String, required: true },
            quantity: { type: Number, required: true },
            // tslint:disable-next-line:object-literal-sort-keys
            customer: {
                email: { type: String, required: true, index: true },
                firstName: { type: String, required: true },
                lastName: { type: String, required: true },
            },
            created: {
                created: {
                    default: Date.now,
                    type: Date,
                },
            },
        }, { _id: false });

        // Handler **must** take 3 parameters: the error that occurred, the document
// in question, and the `next()` function
        // tslint:disable-next-line:only-arrow-functions
        schema.post("save", (error: Error, doc: any, next: any) => {
            // tslint:disable-next-line:no-console
            console.log(error);
            if (error.name === "MongoError") {
                next(new Error("There was a duplicate key error"));
            } else {
                next(error);
            }
        });

        this._model = model<IOrder>("Order", schema);
    }

    public get model(): Model<IOrder> {
        return this._model;
    }
}

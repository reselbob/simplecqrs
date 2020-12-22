import { model, Model, Schema } from "mongoose";
import {ICustomer} from "./ICustomer";
import {Order} from "./Order";

const CustomerSchema: Schema = new Schema({
    email: {
        type: String,
        unique: true,
        // tslint:disable-next-line:object-literal-sort-keys
        index: true,
        required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    orders: {type: [Order]},
    // tslint:disable-next-line:object-literal-sort-keys
    created: {
        type: Date,
        // tslint:disable-next-line:object-literal-sort-keys
        default: Date.now,
    },
});

export const Customer: Model<ICustomer> = model("Customer", CustomerSchema);

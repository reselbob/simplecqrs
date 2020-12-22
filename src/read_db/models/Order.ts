import { Document, model, Model, Schema } from "mongoose";
import {Customer} from "./Customer";
import {IOrder} from "./IOrder";

const OrderSchema: Schema = new Schema({
    _id: { type: String, required: true },
    // tslint:disable-next-line:object-literal-sort-keys
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    // tslint:disable-next-line:object-literal-sort-keys
    customer: { type: Customer, required: true },
    created: {
        type: Date,
        // tslint:disable-next-line:object-literal-sort-keys
        default: Date.now,
    },
});

export const Order: Model<IOrder> = model("Order", OrderSchema);

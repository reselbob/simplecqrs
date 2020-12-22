import {Document} from "mongoose";
import {ICustomer} from "./ICustomer";

export interface IOrder extends Document {
    id: string;
    description: string;
    quantity: number;
    customer: ICustomer;
    created: Date;
}

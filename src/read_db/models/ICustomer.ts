import {Document} from "mongoose";

export interface ICustomer extends Document {
    email: string;
    firstName: string;
    lastName: string;
    created: Date;
}

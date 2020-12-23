import {Connection} from "mongoose";
import {IOrderInput} from "./inputs/Inputs";
import {ICustomer} from "./models/ICustomer";
import {IOrder} from "./models/IOrder";
import {ReadDataController} from "./ReadDataController";

export class ReadDataManager {

    public getDBReadyState(): number {
        return ReadDataController.getReadyStateSync();
    }

    public async connect(): Promise<Connection> {
        const conn = await ReadDataController.connect();
        // tslint:disable-next-line:no-console
        console.log("connected");
        return conn;
    }

    public async setOrder(orderInput: IOrderInput): Promise<any> {
        const order = new ReadDataController.Models.Order();
        order._id = orderInput._id;
        order.description = orderInput.description;
        order.quantity = orderInput.quantity;
        order.customer.email = orderInput.customer.email;
        order.customer.firstName = orderInput.customer.firstName;
        order.customer.lastName = orderInput.customer.lastName;
        const result = await order.save()
            .catch((e: Error) => {
                // tslint:disable-next-line:no-console
                console.error(e);
            });

        const query = {email: orderInput.customer.email};
        // Upsert upsert the customer in the customer collection
        await ReadDataController.Models.Customer.findOneAndUpdate(query, orderInput.customer, {upsert: true});
        // tslint:disable-next-line:no-console
        return result;
    }

    public async getOrders(): Promise<IOrder[]> {
        return await ReadDataController.Models.Order.find();
    }

    public async getOrder(id: string): Promise<any> {
        return ReadDataController.Models.Order.findOne({_id: id});
    }

    public async getCustomers(): Promise<ICustomer[]> {

        return await ReadDataController.Models.Customer.find();
    }

    public async getCustomer(email: string): Promise<any> {
        return await ReadDataController.Models.Customer.findOne({email});
    }

}

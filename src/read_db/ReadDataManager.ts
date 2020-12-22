import {mongoose} from "mongoose";
import {Customer} from "./models/Customer";
import {ICustomer} from "./models/ICustomer";
import {IOrder} from "./models/IOrder";
import {Order} from "./models/Order";

export class ReadDataManager {
    private connectionUrl = "";
    private connection: any;

    private dboptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        if (!process.env.MONGODB_URL) {
            throw new Error("The required environment variable, MONGODB_URL does not exist or has no value");
        }
        this.connectionUrl = process.env.MONGODB_URL;
    }

    /*
   This method is a fast hack to add the order as well as
   upsert the customer
     */
    public async setOrders(orderInput: IOrder): Promise<void> {
        await this.initConnection();
        const order = new Order(orderInput);
        // use the order.id passed in from the input parameter
        order._id = orderInput.id;
        await order.save();
        const query = {email: orderInput.customer.email};
        // Upsert upsert the customer in the customer collection
        Customer.findOneAndUpdate(query, orderInput.customer, {upsert: true});
    }

    public async getOrders(): Promise<IOrder[]> {
        await this.initConnection();
        return await Order.find();
    }

    public async getOrder(id: string): Promise<any> {
        await this.initConnection();
        return await Order.findOne({id});
    }

    public async getCustomers(): Promise<ICustomer[]> {
        await this.initConnection();
        return await Customer.find();
    }

    public async getCustomer(email: string): Promise<any> {
        await this.initConnection();
        return await Customer.findOne({email});
    }

    private async initConnection() {
        if (!this.connection) {
            this.connection = await mongoose.connect(this.connectionUrl, this.dboptions);
        }
    }
}

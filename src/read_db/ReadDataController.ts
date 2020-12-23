import { connect, connection, Connection, model } from "mongoose";
import {Customer, ICustomerModel} from "./models/Customer";
import {ICustomer} from "./models/ICustomer";
import {IOrder} from "./models/IOrder";
import {IOrderModel, Order} from "./models/Order";

declare interface IModels {
    Customer: ICustomerModel;
    Order: IOrderModel;
}

export class ReadDataManager {

    private static instance: ReadDataManager;

    private db: Connection | undefined;
    private models: IModels;

    private dboptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        if (!process.env.MONGODB_URL) {
            throw new Error("The required environment variable, MONGODB_URL does not exist or has no value");
        }
        connect(process.env.MONGODB_URL, { useNewUrlParser: true });
        this.db = connection;
        this.db.on("open", this.connected);
        this.db.on("error", this.error);

        this.models = {
            Customer: new Customer().model,
            Order: new Order().model,
        };
    }

    public static get Models() {
        if (!ReadDataManager.instance) {
            ReadDataManager.instance = new ReadDataManager();
        }
        return ReadDataManager.instance.models;
    }
    private connected() {
        // tslint:disable-next-line:no-console
        console.log("Mongoose has connected");
    }

    private error(error: Error)  {
        // tslint:disable-next-line:no-console
        console.log("Mongoose has errored", error);
    }
}

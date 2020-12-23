import { connect, connection, Connection, model } from "mongoose";
import {Customer, ICustomerModel} from "./models/Customer";
import {IOrderModel, Order} from "./models/Order";

declare interface IModels {
    Customer: ICustomerModel;
    Order: IOrderModel;
}

export class ReadDataController {
    public static get Models() {
        if (!ReadDataController.instance) {
            ReadDataController.instance = new ReadDataController();
        }
        return ReadDataController.instance.models;
    }

    public static getReadyStateSync(): number {
        // @ts-ignore
        return this.db.readyState || 0;
    }

    public static async connect(): Promise<Connection> {
        if (!process.env.MONGODB_URL) {
            throw new Error("The required environment variable, MONGODB_URL does not exist or has no value");
        }
        if (!this.db) {
            // tslint:disable-next-line:max-line-length
            const opts = {useNewUrlParser:  true, useUnifiedTopology:  true, useFindAndModify:  false, useCreateIndex:  true };
            const conn = await connect(process.env.MONGODB_URL, opts );
            this.db = connection;
        }
        this.db.on("open", this.connected);
        this.db.on("error", this.error);

        return connection;
    }
    private static db: Connection | undefined;

    private static instance: ReadDataController;

    private static connected() {
        // tslint:disable-next-line:no-console
        console.log("Mongoose has connected");
    }

    private static error(error: Error)  {
        // tslint:disable-next-line:no-console
        console.log("Mongoose has errored", error);
    }

    public models: IModels;

    constructor() {
        this.models = {
            Customer: new Customer().model,
            Order: new Order().model,
        };
    }

}

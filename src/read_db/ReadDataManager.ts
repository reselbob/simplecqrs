import {Connection} from "mongoose";
import {IBrokerMessage} from "../broker/interfaces/IBrokerMessage";
import {IOrderEvent} from "../broker/interfaces/IOnNewOrderEvent";
import {MessageBroker} from "../broker/MessageBroker";
import {IOrderInput} from "./inputs/Inputs";
import {ICustomer} from "./models/ICustomer";
import {IOrder} from "./models/IOrder";
import {IReadDataManagerOptions} from "./options/IReadDataManagerOptions";
import {ReadDataController} from "./ReadDataController";

export class ReadDataManager {

    private messageBroker: MessageBroker;

    constructor(options: IReadDataManagerOptions) {
        this.messageBroker = options.messageBroker;
        this.messageBroker.addSubscriber(options.groupId, options.topic, this.handler)
            .then((result) => {
                // tslint:disable-next-line:no-console
                console.log(`ReadDataManager Subscriber wired in at ${new Date()}`);
            });
    }

    public getDBReadyState(): number {
        return ReadDataController.getReadyStateSync();
    }

    public async connect(): Promise<Connection> {
        const conn = await ReadDataController.connect();
        // tslint:disable-next-line:no-console
        console.log(`Read database connected at ${new Date()}`);
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
        const orders = await ReadDataController.Models.Order.find();
        return orders;
    }

    public async getOrder(id: string): Promise<any> {
        return ReadDataController.Models.Order.findOne({_id: id});
    }

    public async getCustomers(): Promise<ICustomer[]> {

        return ReadDataController.Models.Customer.find();
    }

    public async getCustomer(email: string): Promise<any> {
        return ReadDataController.Models.Customer.findOne({email});
    }

    public async handler(event: IBrokerMessage): Promise<void> {
        // Yes, using setOrder this way is redundant. But the Typescript
        // is inot respecting the members of the class when compiling. strange.
        // @ts-ignore
        const setOrder =  async (orderInput) => {
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
        };

        if (event.topic === "OnNewOrder") {
            const data: IOrderEvent = JSON.parse(event.message.value.toString());
            const input: IOrderInput = {
                _id: data.orderId,
                customer: {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                },
                description: data.description,
                quantity: data.quantity,
            };

            // tslint:disable-next-line:no-console
            console.log(`Setting order: ${JSON.stringify(input)}`);
            await setOrder(input);
        }
    }

}

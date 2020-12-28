import {IOrderEvent} from "../broker/interfaces/IOnNewOrderEvent";
import {MessageBroker} from "../broker/MessageBroker";
import {IGenericOrderInput} from "../interfaces/inputs";
import {ICustomer} from "../read_db/models/ICustomer";
import {IOrder} from "../read_db/models/IOrder";
import {IReadDataManagerOptions} from "../read_db/options/IReadDataManagerOptions";
import {ReadDataManager} from "../read_db/ReadDataManager";
import {Order} from "../write_db/entity/Order";
import {WriteDataManager} from "../write_db/WriteDataManager";

export class Mediator {
    private messageBroker: MessageBroker;
    private readDataManager: ReadDataManager;
    private writeDataManager: WriteDataManager;

    constructor() {
        this.messageBroker = new MessageBroker();
        const options: IReadDataManagerOptions = {
            groupId: process.env.SIMPLECQRS_GROUPID || "simplecqrs",
            messageBroker: this.messageBroker,
            topic: this.getOnNewOrderTopicSync(),
        };

        this.readDataManager = new ReadDataManager(options);
        this.writeDataManager = new WriteDataManager();

    }

    public async connect(): Promise<void> {
        await this.readDataManager.connect();
    }

    public async getOrders(): Promise<IOrder[]> {
        return  await this.readDataManager.getOrders();
    }

    public async getOrder(id: string): Promise<IOrder> {
        return  await this.readDataManager.getOrder(id);
    }
    /*
    returns the UUID of the new order
     */
    public async setOrder(order: IGenericOrderInput): Promise<string> {
        // save the order
        const result: Order  = await this.writeDataManager.setOrder(order);
        const eventName = this.getOnNewOrderTopicSync();

        // send OnNewOrder event
        const event: IOrderEvent = {
            description: order.description,
            email: order.email,
            eventName,
            firstName: order.firstName,
            lastName: order.lastName,
            orderId: result.id,
            quantity: order.quantity,
        };
        const topic = this.getOnNewOrderTopicSync();
        await this.messageBroker.publish(event, topic);
        return result.id;
    }

    public getOnNewOrderTopicSync(): string {
        return "OnNewOrder";
    }

    public async getCustomer(email: string): Promise<ICustomer> {
        return  await this.readDataManager.getCustomer(email);
    }

    public async getCustomers(): Promise<ICustomer[]> {
        return  await this.readDataManager.getCustomers();
    }
}

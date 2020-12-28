import { Kafka } from "kafkajs";
import { v4 as uuidv4 } from "uuid";
import {IOrderEvent} from "./interfaces/IOnNewOrderEvent";

export class MessageBroker {
    public subscriber: any;
    public publisher: any;

    private  client = new Kafka({
        // tslint:disable-next-line:max-line-length
        brokers: [`${process.env.MESSAGE_BROKER_HOST || "localhost"}:${Number(process.env.MESSAGE_BROKER_PORT) || "9092"}`],
        clientId: `simplecqrs-${uuidv4()}`,
    });

    public async publish(event: IOrderEvent, topic: string): Promise<void> {
        await this.createPublisher();
        await this.publisher.send({
            messages: [
                {   key: event.orderId,
                    value: JSON.stringify(event) },
            ],
            topic,
        });
    }

    public async addSubscriber(groupId: string, topic: string, handler: any): Promise<void> {
        await this.createSubscriber(groupId, topic);
        await this.subscriber.run({
            eachMessage: async (obj: any) => {
                await handler(obj);
            },
        });
    }

    private async createPublisher(): Promise<void> {
        if (!this.publisher) {
            this.publisher = this.client.producer();
            await this.publisher.connect();
        }
    }

    private async createSubscriber(groupId: string, topic: string): Promise<void> {
        if (!this.subscriber) {
            this.subscriber =  this.client.consumer({ groupId});
            await this.subscriber.subscribe({ topic, fromBeginning: false });
        }
    }

}

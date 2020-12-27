import kafka from "kafka-node";
import {IGenericInput} from "../read_db/inputs/Inputs";

export class MessageBroker {
    public static subscribers: kafka.Consumer[];
    public static subscriber: kafka.Consumer;
    public static publisher: kafka.Producer;

    public static async close(): Promise<void> {
        this.subscribers.forEach(async (subscriber)  => {
            subscriber.close(true, (err) => {
                // tslint:disable-next-line:no-console
                console.log(`Message Broker Subscriber is closing at ${new Date()}`);
                // tslint:disable-next-line:no-console
                if (err) { console.error(err); }
            });
        });
    }

    public static async publish(order: IGenericInput, topic: string): Promise<any> {
        this.createPublisherSync();
        const km = new kafka.KeyedMessage("key", "message");
        const payloads = [
            { topic, messages: order, partition: 0 },
        ];
        return this.publisher.send(payloads, (err, data) => {
            if (err) {
                // tslint:disable-next-line:no-console
                console.error(err);
            }
            // tslint:disable-next-line:no-console
            console.log(data);

        });
    }
    public static async addSubscriber(topic: string, handler: any): Promise<any> {
        if (! this.subscribers) {
            this.subscribers = new Array<kafka.Consumer>();
        }
        const subscriber = new kafka.Consumer(
                    this.client,
                    [
                        {topic, partition: 0},
                    ],
                    {
                        autoCommit: false,
                        encoding: "utf8",
                        keyEncoding: "utf8",
                    },
                );
        subscriber.on("message", async (message: any) => {
                await handler(message);
            });
        this.subscriber = subscriber;
    }

    private static client = new kafka.KafkaClient(
        // tslint:disable-next-line:max-line-length
        {kafkaHost: `${process.env.MESSAGE_BROKER_HOST || "localhost"}:${Number(process.env.MESSAGE_BROKER_PORT) || "9092"}`});
    private static instance: MessageBroker;

    private static createPublisherSync(): void {
        if (!this.publisher) {
            const options = {
                // The amount of time in milliseconds to wait for all acks before considered, default 100ms
                ackTimeoutMs: 100,
                // Configuration for when to consider a message as acknowledged, default 1
                requireAcks: 0,
            };
            this.publisher = new kafka.Producer(this.client, options);
        }
    }

    constructor() {
        MessageBroker.instance = new MessageBroker();
    }

}

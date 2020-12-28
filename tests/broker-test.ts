import {expect} from "chai";
import {before, describe, it} from "mocha";
import {v4 as uuidv4} from "uuid";
import {IOrderEvent} from "../src/broker/interfaces/IOnNewOrderEvent";
import {MessageBroker} from "../src/broker/MessageBroker";
import {IGenericOrderInput} from "../src/interfaces/inputs";
import {WriteDataManager} from "../src/write_db/WriteDataManager";

import Faker from "faker";

let messageBroker: MessageBroker;

const topic = "test_topic";
describe("Basic Broker Tests", () => {

    const groupId = "test-group";

    before(async () => {
        // tslint:disable-next-line:no-console
        console.log("Starting Broker Tests");
        messageBroker = new MessageBroker();
    });

    after(async () => {
        // tslint:disable-next-line:no-console
        console.log("Ending Broker Tests");
    });

    it("Can send and receive messsage from Broker", async () => {
        const firstName = Faker.name.firstName();
        const lastName = Faker.name.lastName();
        const email = `${lastName}.${lastName}@${Faker.internet.domainName()}`;
        const quantity = Faker.random.number(10);
        const description = Faker.lorem.words(6);
        const orderId = uuidv4();
        const eventName = "OnNewOrder";

        const message: IOrderEvent = {
            description,
            email,
            eventName,
            firstName,
            lastName,
            orderId,
            quantity,
        };
        await messageBroker.publish(message, topic);

        let counter: number = 4;

        const handler = async (result: any) => {
            expect(JSON.parse(result.message.value.toString())).to.be.an("object");
            expect(result.message.key.toString()).to.be.a("string");
            // tslint:disable-next-line:no-console
            const obj = { message: JSON.parse(result.message.value.toString())};
            // tslint:disable-next-line:no-console
            console.log(result);
            counter++;
        };
        await messageBroker.addSubscriber(groupId, topic, handler);
    }).timeout(20000);
}).timeout(20000);

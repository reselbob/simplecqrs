import {expect} from "chai";
import {before, describe, it} from "mocha";
import {v4 as uuidv4} from "uuid";
import {MessageBroker} from "../src/broker/MessageBroker";
import {IGenericInput} from "../src/read_db/inputs/Inputs";
import {Customer} from "../src/write_db/entity/Customer";
import {WriteDataManager} from "../src/write_db/WriteDataManager";

import Faker from "faker";

const writeDataManager: WriteDataManager = new WriteDataManager();
const handler = async (message: any) => {
    // tslint:disable-next-line:no-console
    console.log(message);
    expect(message).to.be.a("string");
};

const topic = "test_topic";
describe("Basic Broker Tests", () => {

    before(async () => {
        await MessageBroker.addSubscriber(topic, handler);
    });

    after(async () => {
        await MessageBroker.close();
    });

    it("Can send and receive messsage from Broker", async () => {
        const firstName = Faker.name.firstName();
        const lastName = Faker.name.lastName();
        const email = `${lastName}.${lastName}@${Faker.internet.domainName()}`;
        const quantity = Faker.random.number(10);
        const description = Faker.lorem.words(6);

        const message: IGenericInput = {
            description,
            email,
            firstName,
            lastName,
            quantity,
        };
        const result = await MessageBroker.publish(message, topic);
        expect(MessageBroker.subscribers).to.be.an("array");
    }).timeout(10000);
});

import {expect} from "chai";
import env from "dotenv";
env.config();

import Faker from "faker";
import {before, describe, it} from "mocha";
import {Connection} from "mongoose";
import { v4 as uuidv4 } from "uuid";
import {MessageBroker} from "../src/broker/MessageBroker";
import {Mediator} from "../src/mediator/Mediator";
import {IReadDataManagerOptions} from "../src/read_db/options/IReadDataManagerOptions";
import {ReadDataManager} from "../src/read_db/ReadDataManager";
import {WriteDataManager} from "../src/write_db/WriteDataManager";

const messageBroker = new MessageBroker();
const mediator = new Mediator();

const options: IReadDataManagerOptions = {
    groupId: process.env.SIMPLECQRS_GROUPID || "simplecqrs",
    messageBroker,
    topic: mediator.getOnNewOrderTopicSync(),
};

const readDataManager: ReadDataManager = new ReadDataManager(options);
let connection: Connection | undefined;

describe("ReadWrite Tests", () => {

    before(async () => {
        connection = await readDataManager.connect();
        // tslint:disable-next-line:no-console
        console.log("Connected");
    });
    it("Can Read Orders from DB", async () => {
        const result = await readDataManager.getOrders();
        expect(result).to.be.an("array");
        expect(result.length).to.be.greaterThan(0, `Array length is ${result.length}`);
    }).timeout(1000);

    it("Can Write Orders to Read DB", async () => {
        expect(connection).to.be.an("object");
        // @ts-ignore
        expect(connection.readyState).to.be.greaterThan(0);
        const firstName = Faker.name.firstName();
        const lastName = Faker.name.lastName();
        const email = `${lastName}.${lastName}@${Faker.internet.domainName()}`;
        const id = uuidv4();
        const quantity =  Faker.random.number(10);
        const description =  Faker.lorem.words(6);
        // tslint:disable-next-line:variable-name
        const _id = uuidv4();
        // @ts-ignore
        const orderInput: any = {
            _id,
            // tslint:disable-next-line:object-literal-sort-keys
            customer: {
                firstName,
                lastName,
                // tslint:disable-next-line:object-literal-sort-keys
                email,
            },
            description,
            quantity,
        };
        let result = await readDataManager.setOrder(orderInput);
        expect(result._doc).to.be.an("object");
        result = await readDataManager.getOrder(_id);
        expect(result._doc).to.be.an("object");
        expect(result._id).to.equal(orderInput._id);
        expect(result.description).to.equal(orderInput.description);
        expect(result.quantity).to.equal(orderInput.quantity);
        expect(result.customer.firstName).to.equal(orderInput.customer.firstName);
        expect(result.customer.lastName).to.equal(orderInput.customer.lastName);
        expect(result.customer.email).to.equal(orderInput.customer.email);
    }).timeout(1000);
});

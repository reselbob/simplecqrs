import {expect} from "chai";
import env from "dotenv";
env.config();

import Faker from "faker";
import {before, describe, it} from "mocha";
import {Connection} from "mongoose";
import { v4 as uuidv4 } from "uuid";
import {ReadDataManager} from "../src/read_db/ReadDataManager";

const readDataManager: ReadDataManager = new ReadDataManager();
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
    });

    it("Can Write Orders to DB", async () => {
        expect(connection).to.be.an("object");
        // @ts-ignore
        expect(connection.readyState).to.be.greaterThan(0);
        const firstName = Faker.name.firstName();
        const lastName = Faker.name.lastName();
        const email = `${lastName}.${lastName}@${Faker.internet.domainName()}`;
        const id = uuidv4();
        const quantity =  Faker.random.number(10);
        const description =  Faker.lorem.words(6);

        // @ts-ignore
        const orderInput: any = {
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
        const result = await readDataManager.setOrder(orderInput);
        expect(result._doc).to.be.an("object");

    });
}).timeout(5000);

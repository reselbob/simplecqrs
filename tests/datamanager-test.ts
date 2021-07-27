import {expect} from "chai";
import {before, describe, it} from "mocha";
import {IGenericOrderInput} from "../src/interfaces/inputs";
import {Customer} from "../src/write_db/entity/Customer";
import {WriteDataManager} from "../src/write_db/WriteDataManager";

import {CustomerInput} from "../src/write_db/inputs/CustomerInput";
import {OrderInput} from "../src/write_db/inputs/OrderInput";

import Faker from "faker";

const writeDataManager: WriteDataManager = new WriteDataManager();

describe("WriteDataManager Tests", () => {
    after(async () => {
        await writeDataManager.close();
    });
    it("Can Save Order", async () => {
        const data = createOrderSync();
        const result = await writeDataManager.setOrder(data);

        expect(result).to.be.an("object");
        expect(result.customer).to.be.an("object");

        const order = await writeDataManager.getOrder(result.id);
        expect(order).to.be.an("object");
        expect(order.customer).to.be.an("object");

        const customer = await writeDataManager.getCustomer(order.customer.email);
        expect(order.customer.firstName).to.equal(customer.firstName);
        expect(order.customer.lastName).to.equal(customer.lastName);
        expect(order.customer.email).to.equal(customer.email);
    }).timeout(10000);

    const createOrderSync = () => {
        const firstName = Faker.name.firstName();
        const lastName = Faker.name.lastName();
        const email =  `${firstName}.${lastName }@${Faker.internet.domainName()}`;
        const description =  Faker.lorem.words(4);
        const quantity = Faker.datatype.number(10);
        const input: IGenericOrderInput = {
            description,
            email,
            firstName,
            lastName,
            quantity,
        };
        return input;
    };

    const createOrders = async (count: number) => {
        const results = [];
        let i;
        for (i = 0; i < count; i++) {
            const input = createOrderSync();
            results.push(await writeDataManager.setOrder(input));
        }
        return results;
    };

    it("Can get Orders", async () => {
        // create some orders
        const orders   = await createOrders(10);
        expect(orders).to.be.an("array");

        const result = await writeDataManager.getOrders();
        result.forEach((order) => {
            expect(order.customer).to.be.an("object");
        });

    }).timeout(10000);

    it("Can get customers", async () => {
        const result = await writeDataManager.getCustomers();
        result.forEach((customer: Customer) => {
            expect(customer.orders).to.be.an("array");
        });

    }).timeout(10000);
});

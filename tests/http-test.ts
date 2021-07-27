import {expect} from "chai";
import {before, describe, it} from "mocha";
import request from "supertest";
import {DataManager} from "../src/mariadb/DataManager";
import {Customer} from "../src/mariadb/entity/Customer";
import {Order} from "../src/mariadb/entity/Order";
import {CustomerInput} from "../src/mariadb/inputs/CustomerInput";
import {OrderInput} from "../src/mariadb/inputs/OrderInput";

import {server, shutdown} from "../src/app";

import Faker from "faker";

const dataManager: DataManager = new DataManager();

describe("HTTP Test", () => {

    before(async () => {
        // tslint:disable-next-line:no-console
        console.log("starting HTTP Test");
    });

    after(async () => {
        // tslint:disable-next-line:no-console
        console.log("finished HTTP Test");
        await shutdown("TESTOVER");
    });

    it("Can POST order via HTTP", async () => {
        const data: any = {};
        data.customerFirstName = Faker.name.firstName();
        data.customerLastName = Faker.name.lastName();
        data.customerEmail = `${data.customerFirstName}.${data.customerLastName }@${Faker.internet.domainName()}`;
        data.description = Faker.lorem.words(4);
        data.count = Faker.datatype.number(10);

        let orderId: string = "";
        await request(server)
            .post("/orders")
            .set("Content-type", "application/json")
            .send({data})
            .expect(200)
            .then( (res: any) => {
                const order = res.body;
                expect(order.description).to.equal(data.description );
                expect(order.count).to.equal(data.count );
                expect(order.customer.email).to.equal(data.customerEmail );
                expect(order.customer.firstName).to.equal(data.customerFirstName );
                expect(order.customer.lastName).to.equal(data.customerLastName );
                // tslint:disable-next-line:no-console
                console.log(order);

                orderId = order.id;
            });
    });

    it("Can GET Customers via HTTP", async () => {
        let firstCustomer = new Customer();

        // Go get all the lists
        await request(server)
            .get("/customers")
            .set("Accept", "application/json")
            .expect(200)
            .then((res: any) => {
                firstCustomer = res.body[0];
                // await expect(res.body[0].email).to.be.a("string", "Customers are good");
                expect(res.body.length).to.be.greaterThan(0);
                // tslint:disable-next-line:no-console
                console.log(res.body.length);
                // tslint:disable-next-line:no-console
                // await console.log(res.body);
            });
        // @ts-ignore
        await request(server)
            .get(`/customers/${firstCustomer.email}`)
            .set("Accept", "application/json")
            .expect(200)
            .then((res: any) => {
                const customer = res.body;
                expect(customer.email).to.equal(firstCustomer.email );
                expect(customer.firstName).to.equal(firstCustomer.firstName );
                expect(customer.lastName).to.equal(firstCustomer.lastName);

                // tslint:disable-next-line:no-console
                console.log(customer);
            });
    });

    it("Can GET Orders via HTTP", async () => {
        let firstOrder: Order = new Order();
        // Go get all the lists
        await request(server)
            .get("/orders")
            .set("Accept", "application/json")
            .expect(200)
            .then((res: any) => {
                firstOrder = res.body[0];
                expect(res.body[0].id).to.be.a("string", "Users are good");
                // await expect(res.body.length).to.be.greaterThan(0);
            });

        // @ts-ignore
        await request(server)
            .get(`/orders/${firstOrder.id}`)
            .set("Accept", "application/json")
            .expect(200)
            .then((res: any) => {
                const order = res.body;
                expect(order.description).to.equal(firstOrder.description );
                expect(order.count).to.equal(firstOrder.count );
                expect(order.customer.email).to.equal(firstOrder.customer.email );
                expect(order.customer.firstName).to.equal(firstOrder.customer.firstName );
                expect(order.customer.lastName).to.equal(firstOrder.customer.lastName);

                // tslint:disable-next-line:no-console
                console.log(order);
            });
    });

}).timeout(20000);

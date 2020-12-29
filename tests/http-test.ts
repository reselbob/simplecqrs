import {expect} from "chai";
import {before, describe, it} from "mocha";
import request from "supertest";
import {Customer} from "../src/write_db/entity/Customer";
import {Order} from "../src/write_db/entity/Order";
import {WriteDataManager} from "../src/write_db/WriteDataManager";

import {server, shutdown} from "../src/app";

import Faker from "faker";
import {TestUtility} from "../utilities/testUtility/TestUtility";

const dataManager: WriteDataManager = new WriteDataManager();

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

        const genericOrder = TestUtility.createGenericOrderSync();

        await request(server)
            .post("/orders")
            .set("Content-type", "application/json")
            .send({
                    description: genericOrder.description,
                    email: genericOrder.email,
                    firstName: genericOrder.firstName,
                    lastName: genericOrder.lastName,
                    quantity: genericOrder.quantity,
                },
            )
            .expect(200)
            .then((res: any) => {
                const order = res.body;
                expect(order.id).to.be.a("string");
                // tslint:disable-next-line:no-console
                console.log(order);
            })
            .catch((err: Error) => {
                // tslint:disable-next-line:no-console
                console.log(err);
            });
    }).timeout(5000);

    it("Can GET Customers via HTTP", async () => {
        let firstCustomer = new Customer();

        // Go get all the lists
        await request(server)
            .get("/customers")
            .set("Accept", "application/json")
            .expect(200)
            .then((res: any) => {
                firstCustomer = res.body[0];
                expect(res.body.length).to.be.greaterThan(0);
            })
            .then((res: any) => {
                // @ts-ignore
                request(server)
                    .get(`/customers/${firstCustomer.email}`)
                    .set("Accept", "application/json")
                    .expect(200)
                    .then((res2: any) => {
                        const customer = res2.body;
                        expect(customer.email).to.equal(firstCustomer.email);
                        expect(customer.firstName).to.equal(firstCustomer.firstName);
                        expect(customer.lastName).to.equal(firstCustomer.lastName);
                    });
            });

    }).timeout(5000);

    it("Can GET Orders via HTTP", async () => {
        let firstOrder: Order = new Order();
        // Go get all the lists
        await request(server)
            .get("/orders")
            .set("Accept", "application/json")
            .expect(200)
            .then((res: any) => {
                firstOrder = res.body[0];
                expect(res.body[0]._id).to.be.a("string");
                // tslint:disable-next-line:no-console
                console.log(res.body[0]._id);
            })
            .then((res2: any) => {
                request(server)
                    .get(`/orders/${firstOrder.id}`)
                    .set("Accept", "application/json")
                    .expect(200)
                    // tslint:disable-next-line:no-shadowed-variable
                    .then((res2: any) => {
                        const order = res2.body;
                        expect(order.description).to.equal(firstOrder.description);
                        expect(order.count).to.equal(firstOrder.count);
                        expect(order.customer.email).to.equal(firstOrder.customer.email);
                        expect(order.customer.firstName).to.equal(firstOrder.customer.firstName);
                        expect(order.customer.lastName).to.equal(firstOrder.customer.lastName);

                        // tslint:disable-next-line:no-console
                        console.log(order);
                    });
            });
    }).timeout(5000);
});

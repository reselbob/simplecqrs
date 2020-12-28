import {expect} from "chai";
import {before, describe, it} from "mocha";
import {v4 as uuidv4} from "uuid";
import {IOrderEvent} from "../src/broker/interfaces/IOnNewOrderEvent";
import {MessageBroker} from "../src/broker/MessageBroker";
import {IGenericOrderInput} from "../src/interfaces/inputs";
import {Mediator} from "../src/mediator/Mediator";
import {WriteDataManager} from "../src/write_db/WriteDataManager";

import Faker from "faker";
import {TestUtility} from "../utilities/TestUtility";

let mediator: Mediator;

describe("Basic Mediator Tests", () => {
    before(async () => {
        // tslint:disable-next-line:no-console
        console.log("Starting Mediator Tests");
        mediator = new Mediator();
    });

    after(async () => {
        // tslint:disable-next-line:no-console
        console.log("Ending Mediator Tests");
    });

    it("Can save order in Mediator", async () => {
        const genericOrder = TestUtility.createGenericOrderSync();
        const id = await mediator.setOrder(genericOrder);
        // tslint:disable-next-line:no-console
        console.log("almost waiting"),
        // tslint:disable-next-line:no-console
        // @ts-ignore
        setTimeout(() => {
            // tslint:disable-next-line:no-console
            console.log("waiting");
        }, 10000);
        expect(id).to.be.a("string");
    });
});

import axios from "axios";
import {OrderInput} from "../../src/mariadb/inputs/OrderInput";
import {TestUtility} from "../testUtility/TestUtility";

export class Seeder {
    private targetUrl: string;

    constructor(targetUrl: string) {
        this.targetUrl = targetUrl;
    }

    public async seed(numberOfItems: number): Promise<void> {
        if (! numberOfItems ) {
            throw new Error("Seeder.seed(numberOfItems) is missing a value for the numberOfItems parameter");
        }
        // tslint:disable-next-line:no-console
        console.log(`Starting seeding for ${numberOfItems} orders at ${new Date()}`);
        for (let i = 0; i < numberOfItems; i++) {
            const order: OrderInput = TestUtility.createGenericOrderSync();
            await axios.post(this.targetUrl, order);
            // tslint:disable-next-line:no-console
            console.log(`Seeded ${JSON.stringify(order)}  at ${new Date()}`);

        }
        // tslint:disable-next-line:no-console
        console.log(`Finished seeding at ${new Date()}`);

    }
}

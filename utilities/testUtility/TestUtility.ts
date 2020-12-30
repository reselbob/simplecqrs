import Faker from "faker";
import {OrderInput} from "../../src/write_db/inputs/OrderInput";

export class TestUtility {
    public static createGenericOrderSync(): OrderInput {
        const customerFirstName = Faker.name.firstName();
        const customerLastName = Faker.name.lastName();
        const customerEmail =  `${customerFirstName}.${customerLastName }@${Faker.internet.domainName()}`;
        const description =  Faker.lorem.words(4);
        const count = Faker.random.number(10);
        const input: OrderInput = {
            count,
            customerEmail,
            customerFirstName,
            customerLastName,
            description,
        };
        return input;
    }
}

import Faker from "faker";
import {IGenericOrderInput} from "../../src/interfaces/inputs";

export class TestUtility {
    public static createGenericOrderSync(): IGenericOrderInput {
        const firstName = Faker.name.firstName();
        const lastName = Faker.name.lastName();
        const email =  `${firstName}.${lastName }@${Faker.internet.domainName()}`;
        const description =  Faker.lorem.words(4);
        const quantity = Faker.random.number(10);
        const input: IGenericOrderInput = {
            description,
            email,
            firstName,
            lastName,
            quantity,
        };
        return input;
    }
}

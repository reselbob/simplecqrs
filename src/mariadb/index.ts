import Faker from "faker";
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Customer} from "./entity/Customer";

createConnection(
    {
        cli: {
            entitiesDir: "src/mariadb/entity",
            migrationsDir: "src/mariadb/migration",
            subscribersDir: "src/mariadb/subscriber",
        },
        database: "simplecqrs",
        entities: [
            `${__dirname}/src/mariadb/entity/**/*{.ts,.js}`,
        ],
        host: "127.0.0.1",
        logging: false,
        migrations: [
            `${__dirname}/src/mariadb/migration/**/*{.ts,.js}`,
        ],
        password: "password",
        port: 3306,
        subscribers: [
            `${__dirname}/src/mariadb/subscriber/**/*{.ts,.js}`,
        ],
        synchronize: true,
        type: "mariadb",
        username: "root",
    },
).then(async (connection) => {
/*
    console.log("Inserting a new user into the database...");
    const customer = Customer User();
    Customer.firstName = Faker.name.firstName();
    Customer.lastName = Faker.name.lastName();
    Customer.email = ` ${user.firstName}.${user.lastName}@example.com `
    await connection.manager.save(Customer);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

 */

}).catch((error) => {
    // tslint:disable-next-line:no-console
    console.log(error);
});

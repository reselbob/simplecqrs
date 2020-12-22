export const dbconfig = {
    cli: {
        entitiesDir: "src/mariadb/entity",
        migrationsDir: "src/mariadb/migration",
        subscribersDir: "src/mariadb/subscriber",
    },
    database: "simplecqrs",
    entities: [
        `${__dirname}/entity/**/*{.ts,.js}`,
    ],
    host: "127.0.0.1",
    logging: false,
    migrations: [
        `${__dirname}/migration/**/*{.ts,.js}`,
    ],
    password: "password",
    port: 3306,
    subscribers: [
        `${__dirname}/subscriber/**/*{.ts,.js}`,
    ],
    synchronize: true,
    type: "mysql",
    username: "root",
};

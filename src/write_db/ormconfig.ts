export const getDBConfig = () => {
    const obj = {
    cli: {
        entitiesDir: "src/write_db/entity",
        migrationsDir: "src/write_db/migration",
        subscribersDir: "src/write_db/subscriber",
    },
    database: "simplecqrs_w",
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
    return obj;
};

import {Seeder} from "./Seeder";

const targetUrl = process.argv[2].split("=")[1];

// tslint:disable-next-line:no-console
console.log(targetUrl);

const seeder = new Seeder(targetUrl);

seeder.seed(10)
    .then(() => {
        // tslint:disable-next-line:no-console
        console.log("seeding complete");
        process.exit(0);
    });

import env from "dotenv";
env.config();

import express from "express";
import {Mediator} from "./mediator/Mediator";
// let's put the check here, for how. When we move the ReadDB into its own service thing will change.
if (!process.env.MONGODB_URL) {
    throw new Error("The required environment variable, MONGODB_URL does not exist or has no value");
}

// const writeDataManager: WriteDataManager = new WriteDataManager();
// const readDataManager: ReadDataManager = new ReadDataManager();

const mediator = new Mediator();

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());

// tslint:disable-next-line:max-line-length
app.use((err: { stack: any; }, req: any, res: { status: (arg0: number) => { send: (arg0: string) => void; }; }, next: any) => {
    // tslint:disable-next-line:no-console
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.get("/customers", async (req, res) => {
    const customers = await mediator.getCustomers()
        .catch((err: Error) => {
            res.status(500).send(JSON.stringify(err));
        });
    res.send(customers);
});

app.get("/customers/:id", async (req, res) => {
    const customer = await mediator.getCustomer(req.params.id)
        .catch((err: Error) => {
            res.status(500).send(err);
        });
    res.send(customer);
});

app.get("/orders", async (req, res) => {
  const orders = await mediator.getOrders()
      .catch((err: Error) => {
        res.status(500).send(err);
      });
  res.send(orders);
});

app.get("/orders/:id", async (req, res) => {
    const order = await mediator.getOrder(req.params.id)
        .catch((err: Error) => {
            res.status(500).send(err);
        });
    res.send(order);
});

app.post("/orders", async (req, res) => {
    const orderInput = req.body;
    const id: string = await mediator.setOrder(orderInput);
    res.send({id});
});

// @ts-ignore
export const server = app.listen(port, async (err) => {
    await mediator.connect();
    // tslint:disable-next-line:no-console
    console.log(`Read database connected at ${new Date()}`);
    // @ts-ignore
    if (err) {
        // tslint:disable-next-line:no-console
        return console.error(err);
    }
    // tslint:disable-next-line:no-console
    return console.log(`server is listening on ${port}`);
});

export const shutdown = async (signal: string) => {
    let shutdownMessage;

    if (!signal) {
        shutdownMessage = (`API Server shutting down at ${new Date()}`);
    } else {
        shutdownMessage = (`Signal ${signal} : API Server shutting down at ${new Date()}`);
    }
    const obj = {status: "SHUTDOWN", shutdownMessage, pid: process.pid};
    await server.close(() => {
        // tslint:disable-next-line:no-console
        console.log(obj);
        process.exit(0);
    });

};

process.on("SIGTERM", () => {
    shutdown("SIGTERM");
});

process.on("SIGINT", () => {
    shutdown("SIGINT");
});

module.exports = {server, shutdown};

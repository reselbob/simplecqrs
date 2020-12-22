import "reflect-metadata";
import {Connection} from "typeorm";
import {ConnectionOptions, createConnection, getConnectionManager} from "typeorm";
import {Customer} from "./entity/Customer";
import {Order} from "./entity/Order";
import {CustomerInput} from "./inputs/CustomerInput";
import {OrderInput} from "./inputs/OrderInput";
import {dbconfig} from "./ormconfig";

export class WriteDataManager {
    public connection!: Connection;
    public async connectToDb(): Promise<Connection> {
        if (getConnectionManager().has("default")) {
            // await getConnectionManager().get().close();
        }

        if (!this.connection) {
            this.connection = await createConnection(dbconfig as ConnectionOptions);
            // tslint:disable-next-line:no-console
            console.log(`Database connected at ${new Date()}`);
        }
        return this.connection;
    }

    public async setOrder(data: OrderInput): Promise<Order> {
        // confirm the customer exists
        const input = data as OrderInput;
        let customer = await this.getCustomer(input.customerEmail);
        if (!customer) {
            if (!input.customerFirstName && !input.customerFirstName) {
                throw new Error("Email for customer does not exist nor is full customer information provided.");
            }
        }
        if (!customer) {
            const obj = {
                email: input.customerEmail,
                firstName: input.customerFirstName,
                lastName: input.customerLastName,
            };
            customer = await this.setCustomer(obj as CustomerInput);
        }
        const order = new Order();
        order.description = input.description;
        order.count = input.count;
        order.customer = customer;
        const conn = await this.connectToDb();
        const result = await conn.manager.save(order);
        return result;
    }

    public async getOrders(): Promise<Order[]> {
        const conn = await this.connectToDb();
        const repo = conn.getRepository(Order);
        const orders = await repo.find({ relations: ["customer"] });
        return orders;
    }

    public async getOrder(id: string): Promise<any> {
        const conn = await this.connectToDb();
        const order = await conn
            .getRepository(Order)
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.customer", "customer")
            .where("order.id = :id", { id})
            .getOne();
        return order;
    }

    public async setCustomer(input: CustomerInput): Promise<Customer> {
        const customer = new Customer();
        customer.firstName = input.firstName;
        customer.lastName = input.lastName;
        customer.email = input.email;
        const conn = await this.connectToDb();
        return await conn.manager.save(customer);
    }

    public async getCustomers(): Promise<any> {
        const conn = await this.connectToDb();
        const customers = await conn
            .getRepository(Customer)
            .createQueryBuilder("customer")
            .leftJoinAndSelect("customer.orders", "order")
            .getMany();
        return customers;
    }

    public async getCustomer(email: string): Promise<any> {
        const conn = await this.connectToDb();
        const customer = await conn
            .getRepository(Customer)
            .createQueryBuilder("customer")
            .leftJoinAndSelect("customer.orders", "order")
            .where("customer.email = :email", { email})
            .getOne();
        return customer;
    }

    public async close() {
        await this.connection.close();
    }
}

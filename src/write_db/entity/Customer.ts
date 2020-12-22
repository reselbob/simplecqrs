import {Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import {Order} from "./Order";
@Entity()
export class Customer {
    @PrimaryColumn()
    public email!: string;

    @Column()
    public firstName!: string;

    @Column()
    public lastName!: string;

    @CreateDateColumn()
    public createdAt!: Date;

    @UpdateDateColumn()
    public updatedAt: Date | undefined;

    @OneToMany(() => Order, (order) => order.customer)
    public orders!: Order[];

}

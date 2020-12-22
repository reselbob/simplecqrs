import {Column, CreateDateColumn, Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn,
    UpdateDateColumn} from "typeorm";
import {Customer} from "./Customer";
@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    public id!: string;

    @Column()
    public description!: string;

    @Column()
    public count!: number;

    @CreateDateColumn()
    public createdAt!: Date;

    @UpdateDateColumn()
    public updatedAt: Date | undefined;

    @ManyToOne(() => Customer, (customer) => customer.orders)
    public customer!: Customer;

}

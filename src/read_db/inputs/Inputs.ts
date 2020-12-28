export interface IOrderInput {
    _id: string;
    description: string;
    quantity: number;
    customer: ICustomerInput;
}

export interface ICustomerInput {
    email: string;
    firstName: string;
    lastName: string;
}

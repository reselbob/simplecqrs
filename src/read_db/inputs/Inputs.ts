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

export interface IGenericInput {
    description: string;
    quantity: number;
    email: string;
    firstName: string;
    lastName: string;
}


export class OrderInput {
    public customerEmail!: string;
    public customerFirstName: string | undefined;
    public customerLastName: string | undefined;
    public description!: string;
    public count!: number;
}

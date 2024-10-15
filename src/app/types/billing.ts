export interface Price {
    product_id: string;
    price_id: string;
    description: string;
}

export type PriceResponse = Price[];

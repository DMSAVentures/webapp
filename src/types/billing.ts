export interface Price {
    product_id: string;
    price_id: string;
    description: string;
}

export type PriceResponse = Price[];


export interface GetCurrentSubscriptionResponse {
    id: string;
    status: string;
    price_id: string;
    start_date: Date;
    end_date: Date;
    next_billing_date: Date
}


export interface CancelSubscriptionResponse {
    message: string;
}

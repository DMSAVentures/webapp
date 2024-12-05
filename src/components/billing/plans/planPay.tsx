'use client'

import {Price} from "@/app/types/billing";
import {useRouter} from "next/navigation";
import {Button} from "@/components/simpleui/Button/button";

export default function PlanToPay(props: Price) {
    const router = useRouter();
    const handlePay = (price_id: string) => {
        router.push(`/billing/pay?plan=${price_id}`)
    }
    return (
        <div>
            <p>{props.description}</p>
            <Button onClick={() => handlePay(props.price_id)}>Pay</Button>
        </div>
    );
}

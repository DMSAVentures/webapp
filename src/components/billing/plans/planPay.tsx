'use client'

import {Price} from "@/types/billing";
import {Button} from "@/components/simpleui/Button/button";
import { useNavigate } from '@tanstack/react-router'

export default function PlanToPay(props: Price) {
    const navigate = useNavigate();
    const handlePay = (price_id: string) => {
        navigate({
            to: 'billing/pay',
            search: { plan: price_id },
        })
    }
    return (
        <div>
            <p>{props.description}</p>
            <Button onClick={() => handlePay(props.price_id)}>Pay</Button>
        </div>
    );
}

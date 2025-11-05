"use client";

import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/proto-design-system/Button/button";
import { Price } from "@/types/billing";

export default function PlanToPay(props: Price) {
	const navigate = useNavigate();
	const handlePay = (price_id: string) => {
		navigate({
			to: "/billing/pay",
			search: { plan: price_id },
		});
	};
	return (
		<div>
			<p>{props.description}</p>
			<Button onClick={() => handlePay(props.price_id)}>Pay</Button>
		</div>
	);
}

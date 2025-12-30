"use client";

import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Price } from "@/types/billing";

export default function PlanToPay(props: Price) {
	const navigate = useNavigate();
	const handlePay = (priceId: string) => {
		navigate({
			to: "/billing/pay",
			search: { plan: priceId },
		});
	};
	return (
		<div>
			<p>{props.description}</p>
			<Button onClick={() => handlePay(props.priceId)}>Pay</Button>
		</div>
	);
}

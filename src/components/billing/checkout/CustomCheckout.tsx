import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "./checkout.scss";
import { Column } from "@/components/simpleui/UIShell/Column/Column";

// Load stripe outside of component to avoid recreating Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
	clientSecret: string;
}

const CustomCheckout = ({ clientSecret }: CheckoutFormProps) => {
	return (
		<Column
			sm={{ span: 8, start: 1 }}
			md={{ start: 1, span: 7 }}
			lg={{ start: 1, span: 11 }}
			xlg={{ start: 1, span: 13 }}
		>
			<div className="checkout-container">
				<h2>Complete Your Payment</h2>
				<EmbeddedCheckoutProvider
					stripe={stripePromise}
					options={{ clientSecret }}
				>
					<EmbeddedCheckout />
				</EmbeddedCheckoutProvider>
			</div>
		</Column>
	);
};

export default CustomCheckout;

import React, { useState } from 'react';
import { loadStripe, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements, EmbeddedCheckoutProvider, EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import './checkout.scss';

// Import your UI components
import { TextInput } from '@/components/simpleui/TextInput/textInput';
import { Button } from '@/components/simpleui/Button/button';
import Banner from '@/components/simpleui/banner/banner';
import LoadingSpinner from '@/components/loading/loadingSpinner';
import { Column } from '@/components/simpleui/UIShell/Column/Column';

// Load stripe outside of component to avoid recreating Stripe object on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  clientSecret: string;

}

const CustomCheckout = ({ clientSecret }: CheckoutFormProps) => {
  // Debug logging
  console.log("Stripe Key Available:", !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  console.log("Stripe Key:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  console.log("Environment:", process.env.NODE_ENV);
  
  return (
    <Column
      sm={{span: 8, start: 1}}
      md={{start: 1, span: 7}}
      lg={{start: 1, span: 11}}
      xlg={{start: 1, span: 13}}
    >
      <div className="checkout-container">
        <h2>Complete Your Payment</h2>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
          <EmbeddedCheckout/>
        </EmbeddedCheckoutProvider>
      </div>
    </Column>
  );
};

export default CustomCheckout;

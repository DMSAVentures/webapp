'use client'
import {loadStripe, StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {AddressElement, CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import {useCreatePaymentMethodUpdateIntent} from "@/hooks/useCreatePaymentMethodUpdateIntent";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import Button from "@/components/simpleui/Button/button";
import {Column} from "@/components/simpleui/UIShell/Column/Column";
import "./page.scss"
import {TextInput} from "@/components/simpleui/TextInput/textInput";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const UpdatePaymentMethod = () => {
    const {handlePaymentUpdate, loading, error} = useCreatePaymentMethodUpdateIntent();


    if (loading) {
        return <LoadingSpinner/>
    }

    if (error) {
        return <div>{error}</div>
    }






    const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
        style: {
            base: {
                fontFamily: '"Inter", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                backgroundColor: "#f9fafb",
                padding: "20px",
                "::placeholder": {
                    color: "#aab7c4",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    };

    return(
        <Column sm={{span: 7, start: 1}} md={{start: 1, span: 4}} lg={{start: 1, span: 4}}>

            <div className={"update-payment-element"}>
                <h3>Update Payment Method</h3>
                <div className={"card-element"}>
                <   CardElement options={CARD_ELEMENT_OPTIONS}/>
                </div>
                {/*<AddressElement options={CARD_ELEMENT_OPTIONS}/>*/}
                <Button onClick={handlePaymentUpdate}>Update Card</Button>
            </div>
        </Column>
    );
}

export default function Page() {

    const CARD_ELEMENT_OPTIONS: StripeElementsOptions = {

        appearance: {
            variables: {
                borderRadius: "4px",
                colorBackground: "red",
            }
        }
    };
    return (
        <Elements stripe={stripePromise} options={CARD_ELEMENT_OPTIONS}>
            <UpdatePaymentMethod/>
        </Elements>
    );
}

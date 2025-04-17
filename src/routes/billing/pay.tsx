import { createFileRoute } from '@tanstack/react-router'
import CustomCheckout from "@/components/billing/checkout/CustomCheckout";
import {useCreateCheckoutSession} from "@/hooks/useCreateCheckoutSession";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import {ErrorState} from "@/components/error/error";
import Banner from "@/components/simpleui/banner/banner";

export const Route = createFileRoute('/billing/pay')({
  component: RouteComponent,
})

interface Props {
    plan: string;
}


 function PaymentPage(props: Props) {
    const {clientSecret, loading, error} = useCreateCheckoutSession({priceId: props.plan})

    if (loading) {
        return <LoadingSpinner/>
    }

    if (error) {
        return <ErrorState message={`Something went wrong: ${error.error}`}/>
    }

    if (!clientSecret) {
        return (
            <Banner
                bannerType="error"
                variant="filled"
                alertTitle="Error"
                alertDescription="Unable to initiate payment process"
            />
        );
    }

    return (
        <CustomCheckout
            clientSecret={clientSecret}
        />
    );
}

function RouteComponent({ search }: { search: Record<string, string> })  {
  return <PaymentPage plan={search.plan} />
}

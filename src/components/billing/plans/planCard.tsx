import { useGetAllPrices} from "@/hooks/useGetAllPrices";

interface PlanCardProps {
    priceId: string;
}
export default function PlanCard(props: PlanCardProps) {
    const {loading, error, prices} = useGetAllPrices();
    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    const price = prices?.find(price => price.price_id === props.priceId);

    if (!price) {
        return <p>Price not found</p>
    }

    return (
        <div>
            <p>Plan: {price.description}</p>
        </div>
    );
}

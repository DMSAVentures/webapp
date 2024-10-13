'use client'
import {useGetAllPrices} from "@/hooks/useGetAllPrices";
import { useRouter } from 'next/navigation';


export default function Page() {
    const router = useRouter();
    const {prices, loading, error} = useGetAllPrices()

    const handlePay = (price_id: string) => {
        router.push(`/pay?plan=${price_id}`)
    }

    if (loading) {
        return "Loading..."
    }

    if (error) {
        return <div>{error}</div>
    }

    if (!prices) {
        return <div>No prices found</div>
    }

    return (
        <div>
            <h1>Plans</h1>
            <ul>
                {prices.map((price) => (
                    <li key={price.price_id}>
                        <button onClick={() => handlePay(price.price_id)}> Pay - {price.description}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

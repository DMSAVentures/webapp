import {fetcher} from "@/hooks/fetcher";
import {UserResponse} from "@/types/user";



export async function getUser(): Promise<UserResponse> {
    const response = await fetcher<UserResponse>(`${import.meta.env.VITE_API_URL}/api/protected/user`, {
        method: "GET",
    });
    return response;
}

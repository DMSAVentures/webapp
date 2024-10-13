import Router from 'next/router';
import {redirect} from "next/navigation";
import {RedirectType} from "next/dist/client/components/redirect";

interface FetcherOptions extends RequestInit {
    headers?: Record<string, string>;
}

export interface ApiError {
    error: string;
}

export const fetcher = async <T>(url: string, options: FetcherOptions = {}): Promise<T> => {
    try {
        // Retrieve token from local storage
        const token = localStorage.getItem('token');

        // Add token to headers if it exists
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const response = await fetch(url, {
            ...options,
            headers,
            // credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            // For 2xx responses, return the data as T
            return data as T;
        }

        // For non-2xx responses, throw an error with the message
        throw new Error(data.error || 'An error occurred');
    } catch (error: any) {
        // Handle abort signal
        if (error.name === 'AbortError') {
            console.debug('Fetch request was aborted');
            return Promise.reject(error); // Reject with the abort error or handle it accordingly
        }
        // Handle token expiration
        if (error instanceof Error && error.message === 'expired jwt token') {
            localStorage.removeItem('token');
        }
        console.log('Error fetching request', error);

        // Throw error for the calling function to catch
        throw new Error('An error occurred');
    }
};

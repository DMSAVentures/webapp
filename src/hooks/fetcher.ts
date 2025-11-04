interface FetcherOptions extends RequestInit {
	headers?: HeadersInit;
}

export interface ApiError {
	error: string;
}

export const fetcher = async <T>(
	url: string,
	options: FetcherOptions = {},
): Promise<T> => {
	try {
		// Add token to headers if it exists
		const headers = new Headers({
			"Content-Type": "application/json",
			...options.headers,
		});

		// Remove the 'connection' header if it exists
		if (headers.has("connection")) {
			headers.delete("connection");
		}

		const response = await fetch(url, {
			...options,
			headers,
			credentials: "include",
		});

		const data = await response.json();

		// Check if response is not OK (not a 2xx status)
		if (!response.ok) {
			// Throw the API error object
			const apiError: ApiError = data;
			throw new Error(apiError.error || "An unknown error occurred");
		}

		// Return the parsed data if response is OK
		return data as T;
	} catch (error: any) {
		// Handle abort signal
		if (error.name === "AbortError") {
			console.debug("Fetch request was aborted");
			return Promise.reject(error); // Reject with the abort error or handle it accordingly
		}

		console.log("Error fetching request", error);
		// Throw error for the calling function to catch
		throw error;
	}
};

/**
 * Fetcher Options Interface
 * Defines the options for making HTTP requests
 */
export interface IFetcherOptions extends RequestInit {
	headers?: HeadersInit;
}

/**
 * Fetcher Interface
 * Defines the contract for HTTP request utilities
 * This allows for dependency injection and easier testing
 */
export interface IFetcher {
	/**
	 * Make an HTTP request
	 * @param url - The URL to fetch
	 * @param options - Fetch options (method, headers, body, etc.)
	 * @returns Promise with the typed response data
	 */
	fetch<T>(url: string, options?: IFetcherOptions): Promise<T>;
}

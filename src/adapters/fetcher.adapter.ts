/**
 * Fetcher Adapter
 * Adapts the existing fetcher utility to implement the IFetcher interface
 * This provides the default implementation for production use
 */

import { fetcher as fetcherUtil } from "@/hooks/fetcher";
import type { IFetcher, IFetcherOptions } from "@/interfaces";

/**
 * Default Fetcher Implementation
 * Wraps the existing fetcher utility to conform to the IFetcher interface
 */
export class FetcherAdapter implements IFetcher {
	/**
	 * Make an HTTP request using the existing fetcher utility
	 * @param url - The URL to fetch
	 * @param options - Fetch options
	 * @returns Promise with the typed response data
	 */
	async fetch<T>(url: string, options?: IFetcherOptions): Promise<T> {
		return fetcherUtil<T>(url, options);
	}
}

/**
 * Default fetcher instance
 * Use this in production code
 */
export const defaultFetcher: IFetcher = new FetcherAdapter();

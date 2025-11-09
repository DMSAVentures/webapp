/**
 * Mock Fetcher Implementation
 * Use this for testing services with dependency injection
 */

import type { IFetcher, IFetcherOptions } from "@/interfaces";

/**
 * Mock Fetcher Class
 * Provides a testable implementation of IFetcher
 *
 * @example
 * const mockFetcher = new MockFetcher();
 * mockFetcher.mockResponse({ id: '1', name: 'Test' });
 * const service = createCampaignsService({ fetcher: mockFetcher });
 */
export class MockFetcher implements IFetcher {
	private responses: Map<string, any> = new Map();
	private errors: Map<string, Error> = new Map();
	public callHistory: Array<{ url: string; options?: IFetcherOptions }> = [];

	/**
	 * Mock implementation of fetch
	 * Returns predefined responses or throws predefined errors
	 */
	async fetch<T>(url: string, options?: IFetcherOptions): Promise<T> {
		// Record the call for testing assertions
		this.callHistory.push({ url, options });

		// Check if an error is configured for this URL
		if (this.errors.has(url)) {
			throw this.errors.get(url);
		}

		// Check if a response is configured for this URL
		if (this.responses.has(url)) {
			return this.responses.get(url) as T;
		}

		// Default behavior: return empty object
		return {} as T;
	}

	/**
	 * Configure a mock response for a specific URL
	 *
	 * @example
	 * mockFetcher.mockResponse('/api/campaigns', [{ id: '1', name: 'Campaign 1' }]);
	 */
	mockResponse<T>(url: string, response: T): void {
		this.responses.set(url, response);
	}

	/**
	 * Configure a mock error for a specific URL
	 *
	 * @example
	 * mockFetcher.mockError('/api/campaigns', new Error('Network error'));
	 */
	mockError(url: string, error: Error): void {
		this.errors.set(url, error);
	}

	/**
	 * Clear all mock data and call history
	 */
	reset(): void {
		this.responses.clear();
		this.errors.clear();
		this.callHistory = [];
	}

	/**
	 * Get the number of times fetch was called
	 */
	getCallCount(): number {
		return this.callHistory.length;
	}

	/**
	 * Get calls made to a specific URL
	 */
	getCallsForUrl(url: string): Array<{ url: string; options?: IFetcherOptions }> {
		return this.callHistory.filter((call) => call.url.includes(url));
	}

	/**
	 * Check if fetch was called with a specific URL
	 */
	wasCalledWith(url: string): boolean {
		return this.callHistory.some((call) => call.url.includes(url));
	}
}

/**
 * Create a simple mock fetcher for quick tests
 *
 * @example
 * const mockFetcher = createMockFetcher({
 *   '/api/campaigns': [{ id: '1', name: 'Test' }],
 *   '/api/team': [{ id: '1', email: 'test@example.com' }]
 * });
 */
export function createMockFetcher(
	responses?: Record<string, any>,
): MockFetcher {
	const mock = new MockFetcher();

	if (responses) {
		Object.entries(responses).forEach(([url, response]) => {
			mock.mockResponse(url, response);
		});
	}

	return mock;
}

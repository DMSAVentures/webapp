/**
 * Example Test File for Campaigns Service
 * This demonstrates how to test services with dependency injection
 *
 * To use this file:
 * 1. Set up your test framework (Jest, Vitest, etc.)
 * 2. Rename to campaigns.service.test.ts
 * 3. Run your tests
 */

import { describe, it, expect, beforeEach } from 'vitest'; // or 'jest'
import { createCampaignsService } from '../campaigns.service';
import { MockFetcher, createMockFetcher } from '@/mocks/fetcher.mock';
import type { Campaign } from '@/types/common.types';

describe('Campaigns Service', () => {
	let mockFetcher: MockFetcher;
	const API_BASE = 'http://localhost:3000';

	beforeEach(() => {
		mockFetcher = new MockFetcher();
	});

	describe('list', () => {
		it('should fetch all campaigns', async () => {
			// Arrange
			const mockCampaigns: Campaign[] = [
				{
					id: '1',
					name: 'Campaign 1',
					description: 'Test campaign',
					status: 'active',
					createdAt: new Date(),
					updatedAt: new Date(),
					settings: {
						emailVerificationRequired: true,
						duplicateHandling: 'block',
						enableReferrals: false,
						enableRewards: false,
					},
					stats: {
						totalParticipants: 100,
						activeParticipants: 50,
						conversionRate: 0.5,
					},
				},
			];

			mockFetcher.mockResponse(`${API_BASE}/api/campaigns`, mockCampaigns);

			const service = createCampaignsService({
				fetcher: mockFetcher,
				apiBase: API_BASE,
			});

			// Act
			const result = await service.list();

			// Assert
			expect(result).toEqual(mockCampaigns);
			expect(mockFetcher.wasCalledWith('/api/campaigns')).toBe(true);
		});

		it('should fetch campaigns with filters', async () => {
			// Arrange
			mockFetcher.mockResponse(
				`${API_BASE}/api/campaigns?status=active&search=test`,
				[],
			);

			const service = createCampaignsService({
				fetcher: mockFetcher,
				apiBase: API_BASE,
			});

			// Act
			await service.list({
				status: 'active',
				search: 'test',
			});

			// Assert
			const calls = mockFetcher.getCallsForUrl('/api/campaigns');
			expect(calls[0].url).toContain('status=active');
			expect(calls[0].url).toContain('search=test');
		});

		it('should handle errors when fetching campaigns', async () => {
			// Arrange
			mockFetcher.mockError(
				`${API_BASE}/api/campaigns`,
				new Error('Network error'),
			);

			const service = createCampaignsService({
				fetcher: mockFetcher,
				apiBase: API_BASE,
			});

			// Act & Assert
			await expect(service.list()).rejects.toThrow('Network error');
		});
	});

	describe('get', () => {
		it('should fetch a single campaign by id', async () => {
			// Arrange
			const mockCampaign: Campaign = {
				id: '123',
				name: 'Test Campaign',
				description: 'A test campaign',
				status: 'active',
				createdAt: new Date(),
				updatedAt: new Date(),
				settings: {
					emailVerificationRequired: true,
					duplicateHandling: 'block',
					enableReferrals: false,
					enableRewards: false,
				},
				stats: {
					totalParticipants: 0,
					activeParticipants: 0,
					conversionRate: 0,
				},
			};

			mockFetcher.mockResponse(
				`${API_BASE}/api/campaigns/123`,
				mockCampaign,
			);

			const service = createCampaignsService({
				fetcher: mockFetcher,
				apiBase: API_BASE,
			});

			// Act
			const result = await service.get('123');

			// Assert
			expect(result).toEqual(mockCampaign);
			expect(mockFetcher.wasCalledWith('/api/campaigns/123')).toBe(true);
		});
	});

	describe('create', () => {
		it('should create a new campaign', async () => {
			// Arrange
			const createRequest = {
				name: 'New Campaign',
				description: 'A new campaign',
				settings: {
					emailVerificationRequired: true,
					duplicateHandling: 'block' as const,
					enableReferrals: false,
					enableRewards: false,
				},
			};

			const mockResponse: Campaign = {
				id: '456',
				...createRequest,
				status: 'draft',
				createdAt: new Date(),
				updatedAt: new Date(),
				stats: {
					totalParticipants: 0,
					activeParticipants: 0,
					conversionRate: 0,
				},
			};

			mockFetcher.mockResponse(`${API_BASE}/api/campaigns`, mockResponse);

			const service = createCampaignsService({
				fetcher: mockFetcher,
				apiBase: API_BASE,
			});

			// Act
			const result = await service.create(createRequest);

			// Assert
			expect(result).toEqual(mockResponse);

			const calls = mockFetcher.getCallsForUrl('/api/campaigns');
			expect(calls[0].options?.method).toBe('POST');
			expect(calls[0].options?.body).toContain('New Campaign');
		});
	});

	describe('update', () => {
		it('should update an existing campaign', async () => {
			// Arrange
			const updateData = {
				name: 'Updated Name',
				status: 'active' as const,
			};

			const mockResponse: Campaign = {
				id: '123',
				name: 'Updated Name',
				description: 'Test',
				status: 'active',
				createdAt: new Date(),
				updatedAt: new Date(),
				settings: {
					emailVerificationRequired: true,
					duplicateHandling: 'block',
					enableReferrals: false,
					enableRewards: false,
				},
				stats: {
					totalParticipants: 0,
					activeParticipants: 0,
					conversionRate: 0,
				},
			};

			mockFetcher.mockResponse(
				`${API_BASE}/api/campaigns/123`,
				mockResponse,
			);

			const service = createCampaignsService({
				fetcher: mockFetcher,
				apiBase: API_BASE,
			});

			// Act
			const result = await service.update('123', updateData);

			// Assert
			expect(result.name).toBe('Updated Name');
			expect(result.status).toBe('active');

			const calls = mockFetcher.getCallsForUrl('/api/campaigns/123');
			expect(calls[0].options?.method).toBe('PATCH');
		});
	});

	describe('delete', () => {
		it('should delete a campaign', async () => {
			// Arrange
			mockFetcher.mockResponse(`${API_BASE}/api/campaigns/123`, undefined);

			const service = createCampaignsService({
				fetcher: mockFetcher,
				apiBase: API_BASE,
			});

			// Act
			await service.delete('123');

			// Assert
			const calls = mockFetcher.getCallsForUrl('/api/campaigns/123');
			expect(calls[0].options?.method).toBe('DELETE');
		});
	});

	describe('duplicate', () => {
		it('should duplicate a campaign', async () => {
			// Arrange
			const mockDuplicate: Campaign = {
				id: '789',
				name: 'Campaign 1 (Copy)',
				description: 'Duplicated campaign',
				status: 'draft',
				createdAt: new Date(),
				updatedAt: new Date(),
				settings: {
					emailVerificationRequired: true,
					duplicateHandling: 'block',
					enableReferrals: false,
					enableRewards: false,
				},
				stats: {
					totalParticipants: 0,
					activeParticipants: 0,
					conversionRate: 0,
				},
			};

			mockFetcher.mockResponse(
				`${API_BASE}/api/campaigns/123/duplicate`,
				mockDuplicate,
			);

			const service = createCampaignsService({
				fetcher: mockFetcher,
				apiBase: API_BASE,
			});

			// Act
			const result = await service.duplicate('123');

			// Assert
			expect(result).toEqual(mockDuplicate);

			const calls = mockFetcher.getCallsForUrl('/api/campaigns/123/duplicate');
			expect(calls[0].options?.method).toBe('POST');
		});
	});

	describe('getStats', () => {
		it('should fetch campaign statistics', async () => {
			// Arrange
			const mockCampaign: Campaign = {
				id: '123',
				name: 'Test Campaign',
				description: 'Test',
				status: 'active',
				createdAt: new Date(),
				updatedAt: new Date(),
				settings: {
					emailVerificationRequired: true,
					duplicateHandling: 'block',
					enableReferrals: false,
					enableRewards: false,
				},
				stats: {
					totalParticipants: 1000,
					activeParticipants: 750,
					conversionRate: 0.75,
				},
			};

			mockFetcher.mockResponse(
				`${API_BASE}/api/campaigns/123`,
				mockCampaign,
			);

			const service = createCampaignsService({
				fetcher: mockFetcher,
				apiBase: API_BASE,
			});

			// Act
			const result = await service.getStats('123');

			// Assert
			expect(result).toEqual(mockCampaign.stats);
			expect(result.totalParticipants).toBe(1000);
		});
	});

	describe('updateStatus', () => {
		it('should update campaign status', async () => {
			// Arrange
			const mockResponse: Campaign = {
				id: '123',
				name: 'Test Campaign',
				description: 'Test',
				status: 'paused',
				createdAt: new Date(),
				updatedAt: new Date(),
				settings: {
					emailVerificationRequired: true,
					duplicateHandling: 'block',
					enableReferrals: false,
					enableRewards: false,
				},
				stats: {
					totalParticipants: 0,
					activeParticipants: 0,
					conversionRate: 0,
				},
			};

			mockFetcher.mockResponse(
				`${API_BASE}/api/campaigns/123`,
				mockResponse,
			);

			const service = createCampaignsService({
				fetcher: mockFetcher,
				apiBase: API_BASE,
			});

			// Act
			const result = await service.updateStatus('123', 'paused');

			// Assert
			expect(result.status).toBe('paused');

			const calls = mockFetcher.getCallsForUrl('/api/campaigns/123');
			expect(calls[0].options?.method).toBe('PATCH');
			expect(calls[0].options?.body).toContain('"status":"paused"');
		});
	});

	describe('Quick mock setup example', () => {
		it('should work with createMockFetcher helper', async () => {
			// Arrange
			const quickMock = createMockFetcher({
				[`${API_BASE}/api/campaigns`]: [
					{
						id: '1',
						name: 'Quick Test',
						status: 'active',
					},
				],
			});

			const service = createCampaignsService({
				fetcher: quickMock,
				apiBase: API_BASE,
			});

			// Act
			const result = await service.list();

			// Assert
			expect(result).toHaveLength(1);
			expect(result[0].name).toBe('Quick Test');
		});
	});
});

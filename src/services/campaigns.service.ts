/**
 * Campaign Service
 * API calls for campaign management using the centralized fetcher
 */

import { fetcher } from '@/hooks/fetcher';
import type { Campaign, CampaignSettings } from '@/types/common.types';

const API_BASE = import.meta.env.VITE_API_URL;

/**
 * Request type for creating a campaign
 */
export interface CreateCampaignRequest {
  name: string;
  description?: string;
  settings: {
    emailVerificationRequired: boolean;
    duplicateHandling: 'block' | 'update' | 'allow';
    enableReferrals: boolean;
    enableRewards: boolean;
  };
}

/**
 * Request type for updating a campaign
 */
export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  status?: Campaign['status'];
  settings?: Partial<CampaignSettings>;
}

/**
 * Filters for listing campaigns
 */
export interface CampaignFilters {
  status?: Campaign['status'];
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Campaign service
 * All API operations for campaigns
 */
export const campaignsService = {
  /**
   * Get list of campaigns with optional filters
   */
  list: async (filters?: CampaignFilters): Promise<Campaign[]> => {
    const params = new URLSearchParams();

    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.page) {
      params.append('page', filters.page.toString());
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }

    const queryString = params.toString();
    const url = `${API_BASE}/api/campaigns${queryString ? `?${queryString}` : ''}`;

    return fetcher<Campaign[]>(url);
  },

  /**
   * Get single campaign by ID
   */
  get: async (id: string): Promise<Campaign> => {
    return fetcher<Campaign>(`${API_BASE}/api/campaigns/${id}`);
  },

  /**
   * Create new campaign
   */
  create: async (data: CreateCampaignRequest): Promise<Campaign> => {
    return fetcher<Campaign>(`${API_BASE}/api/campaigns`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update existing campaign
   */
  update: async (id: string, data: UpdateCampaignRequest): Promise<Campaign> => {
    return fetcher<Campaign>(`${API_BASE}/api/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete campaign
   */
  delete: async (id: string): Promise<void> => {
    return fetcher<void>(`${API_BASE}/api/campaigns/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Duplicate campaign
   */
  duplicate: async (id: string): Promise<Campaign> => {
    return fetcher<Campaign>(`${API_BASE}/api/campaigns/${id}/duplicate`, {
      method: 'POST',
    });
  },

  /**
   * Get campaign statistics
   */
  getStats: async (id: string): Promise<Campaign['stats']> => {
    const campaign = await fetcher<Campaign>(`${API_BASE}/api/campaigns/${id}`);
    return campaign.stats;
  },

  /**
   * Update campaign status
   */
  updateStatus: async (
    id: string,
    status: Campaign['status']
  ): Promise<Campaign> => {
    return fetcher<Campaign>(`${API_BASE}/api/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

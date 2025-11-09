# Dependency Injection & Testing Guide

## Overview

This codebase uses **dependency injection** for services (processors) to enable easy mocking and testing. All services are built using factory functions that accept their dependencies as parameters.

## Architecture

### Core Interfaces

All dependencies are defined through interfaces in `/src/interfaces/`:

- **IFetcher** - HTTP client interface
- **ICampaignsService** - Campaign operations interface
- **ITeamService** - Team operations interface

### Service Pattern

Services are created using factory functions:

```typescript
// Factory function - accepts dependencies
export function createCampaignsService(
  dependencies: CampaignsServiceDependencies
): ICampaignsService {
  const { fetcher, apiBase } = dependencies;

  return {
    list: async (filters) => {
      return fetcher.fetch('/api/campaigns');
    },
    // ... other methods
  };
}

// Default instance for production use
export const campaignsService = createCampaignsService({
  fetcher: defaultFetcher
});
```

## Production Usage

In production code, use the default exported instances:

```typescript
import { campaignsService } from '@/services/campaigns.service';
import { teamService } from '@/features/team/services/team.service';

// Use directly
const campaigns = await campaignsService.list();
const team = await teamService.list();
```

## Testing Usage

### 1. Basic Mock Testing

Create a service with a mock fetcher:

```typescript
import { createCampaignsService } from '@/services/campaigns.service';
import { MockFetcher } from '@/mocks/fetcher.mock';

describe('Campaign Service', () => {
  it('should fetch campaigns', async () => {
    // Arrange
    const mockFetcher = new MockFetcher();
    const mockData = [
      { id: '1', name: 'Campaign 1', status: 'active' }
    ];

    mockFetcher.mockResponse(
      'http://localhost:3000/api/campaigns',
      mockData
    );

    const service = createCampaignsService({
      fetcher: mockFetcher,
      apiBase: 'http://localhost:3000'
    });

    // Act
    const result = await service.list();

    // Assert
    expect(result).toEqual(mockData);
    expect(mockFetcher.wasCalledWith('/api/campaigns')).toBe(true);
  });
});
```

### 2. Testing Error Scenarios

```typescript
it('should handle errors correctly', async () => {
  const mockFetcher = new MockFetcher();

  // Configure error response
  mockFetcher.mockError(
    'http://localhost:3000/api/campaigns',
    new Error('Network error')
  );

  const service = createCampaignsService({
    fetcher: mockFetcher,
    apiBase: 'http://localhost:3000'
  });

  // Should throw error
  await expect(service.list()).rejects.toThrow('Network error');
});
```

### 3. Testing with Multiple Mock Responses

```typescript
it('should create and fetch a campaign', async () => {
  const mockFetcher = new MockFetcher();

  // Mock create response
  mockFetcher.mockResponse(
    'http://localhost:3000/api/campaigns',
    { id: '123', name: 'New Campaign', status: 'draft' }
  );

  // Mock get response
  mockFetcher.mockResponse(
    'http://localhost:3000/api/campaigns/123',
    { id: '123', name: 'New Campaign', status: 'active' }
  );

  const service = createCampaignsService({
    fetcher: mockFetcher,
    apiBase: 'http://localhost:3000'
  });

  // Create
  const created = await service.create({
    name: 'New Campaign',
    settings: {
      emailVerificationRequired: true,
      duplicateHandling: 'block',
      enableReferrals: false,
      enableRewards: false
    }
  });

  expect(created.id).toBe('123');

  // Fetch
  const fetched = await service.get('123');
  expect(fetched.status).toBe('active');
});
```

### 4. Asserting on Call History

```typescript
it('should make correct API calls', async () => {
  const mockFetcher = new MockFetcher();
  mockFetcher.mockResponse(
    'http://localhost:3000/api/campaigns/123',
    { id: '123', name: 'Test' }
  );

  const service = createCampaignsService({
    fetcher: mockFetcher,
    apiBase: 'http://localhost:3000'
  });

  await service.update('123', { name: 'Updated Name' });

  // Check call history
  const calls = mockFetcher.getCallsForUrl('/api/campaigns/123');
  expect(calls).toHaveLength(1);
  expect(calls[0].options?.method).toBe('PATCH');
  expect(calls[0].options?.body).toContain('Updated Name');
});
```

### 5. Quick Mock Setup

Use the helper function for simple tests:

```typescript
import { createMockFetcher } from '@/mocks/fetcher.mock';

it('should work with quick mock setup', async () => {
  const mockFetcher = createMockFetcher({
    'http://localhost:3000/api/campaigns': [
      { id: '1', name: 'Campaign 1' },
      { id: '2', name: 'Campaign 2' }
    ]
  });

  const service = createCampaignsService({
    fetcher: mockFetcher,
    apiBase: 'http://localhost:3000'
  });

  const campaigns = await service.list();
  expect(campaigns).toHaveLength(2);
});
```

## Testing Hooks That Use Services

Hooks can also be tested by injecting mock services:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useGetCampaigns } from '@/hooks/useGetCampaigns';

// If the hook needs to be refactored to accept a service:
const useGetCampaigns = (service = campaignsService) => {
  // ... hook implementation
};

// Test
it('should load campaigns', async () => {
  const mockFetcher = createMockFetcher({
    'http://localhost:3000/api/campaigns': [
      { id: '1', name: 'Test Campaign' }
    ]
  });

  const mockService = createCampaignsService({
    fetcher: mockFetcher,
    apiBase: 'http://localhost:3000'
  });

  const { result } = renderHook(() => useGetCampaigns(mockService));

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toHaveLength(1);
});
```

## Adding New Services

When creating a new service, follow this pattern:

### 1. Define the Interface

```typescript
// src/interfaces/services.interface.ts
export interface IMyService {
  doSomething(id: string): Promise<MyType>;
}
```

### 2. Create the Service

```typescript
// src/services/my.service.ts
import type { IMyService, IFetcher } from '@/interfaces';
import { defaultFetcher } from '@/adapters/fetcher.adapter';

export interface MyServiceDependencies {
  fetcher: IFetcher;
  apiBase?: string;
}

export function createMyService(
  dependencies: MyServiceDependencies
): IMyService {
  const { fetcher, apiBase = import.meta.env.VITE_API_URL } = dependencies;

  return {
    doSomething: async (id: string): Promise<MyType> => {
      return fetcher.fetch(`${apiBase}/api/my-endpoint/${id}`);
    }
  };
}

// Default instance
export const myService = createMyService({
  fetcher: defaultFetcher
});
```

### 3. Export from Interfaces

```typescript
// src/interfaces/index.ts
export type { IMyService } from './services.interface';
```

## Benefits

✅ **Testability** - Easy to mock dependencies for unit tests
✅ **Flexibility** - Swap implementations without changing code
✅ **Type Safety** - Interfaces ensure correct implementation
✅ **Maintainability** - Clear dependency contracts
✅ **Isolation** - Test services without network calls

## Mock Fetcher API Reference

### Methods

- `mockResponse<T>(url: string, response: T)` - Set response for a URL
- `mockError(url: string, error: Error)` - Set error for a URL
- `reset()` - Clear all mocks and history
- `getCallCount()` - Get total number of calls
- `getCallsForUrl(url: string)` - Get calls to specific URL
- `wasCalledWith(url: string)` - Check if URL was called

### Properties

- `callHistory` - Array of all fetch calls with URLs and options

## Common Patterns

### Spy on Real Implementation

```typescript
// Create a spy wrapper
class SpyFetcher implements IFetcher {
  public calls: any[] = [];

  constructor(private realFetcher: IFetcher) {}

  async fetch<T>(url: string, options?: IFetcherOptions): Promise<T> {
    this.calls.push({ url, options });
    return this.realFetcher.fetch<T>(url, options);
  }
}

const spy = new SpyFetcher(defaultFetcher);
const service = createCampaignsService({ fetcher: spy });

// Use service normally, but can inspect calls
await service.list();
expect(spy.calls).toHaveLength(1);
```

### Conditional Responses

```typescript
class ConditionalMockFetcher implements IFetcher {
  async fetch<T>(url: string, options?: IFetcherOptions): Promise<T> {
    if (url.includes('error')) {
      throw new Error('Mock error');
    }

    if (options?.method === 'POST') {
      return { id: 'new-id' } as T;
    }

    return [] as T;
  }
}
```

## Migration Guide

Existing code doesn't need to change! The default exports still work:

```typescript
// ✅ Still works (production code)
import { campaignsService } from '@/services/campaigns.service';
const data = await campaignsService.list();

// ✅ New way (testing)
import { createCampaignsService } from '@/services/campaigns.service';
const service = createCampaignsService({ fetcher: mockFetcher });
const data = await service.list();
```

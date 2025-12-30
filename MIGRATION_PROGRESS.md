# Proto Design System Migration Progress

## Overview
Comprehensive migration from old design system to the new proto design system.

## Migration Scope

### What We're Changing

1. **SCSS Files** - Replace old `@use "@/design-tokens/*"` with:
   - CSS custom properties: `var(--space-*)`, `var(--color-*)`, `var(--font-size-*)`, etc.
   - Proto mixins: `@use "../../../mixins" as *;`

2. **TSX Files** - Replace custom flex/grid layouts with proto layout components:
   - `Stack` - for flex layouts (direction, gap, align, justify)
   - `Grid` - for grid layouts (columns, gap)
   - `Container` - for constraining content width
   - `Card` - for content grouping

3. **Form Components** - Use proto form components:
   - `TextField`, `Input`, `TextArea`, `Select`, `Checkbox`, `Switch`, `Radio`

### Token Mapping (Old -> New)

| Old Token | New CSS Variable |
|-----------|------------------|
| `layout.$spacing-01` | `var(--space-0-5)` or `2px` |
| `layout.$spacing-02` | `var(--space-1)` |
| `layout.$spacing-03` | `var(--space-2)` |
| `layout.$spacing-04` | `var(--space-3)` |
| `layout.$spacing-05` | `var(--space-5)` |
| `layout.$spacing-06` | `var(--space-6)` |
| `layout.$spacing-07` | `var(--space-8)` |
| `layout.$spacing-08` | `var(--space-10)` |
| `typography.$font-size-xs` | `var(--font-size-xs)` |
| `typography.$font-size-sm` | `var(--font-size-sm)` |
| `typography.$font-size-md` | `var(--font-size-base)` |
| `typography.$font-size-lg` | `var(--font-size-lg)` |
| `border.$border-radius-small` | `var(--radius-sm)` |
| `border.$border-radius-medium` | `var(--radius-md)` |
| `motion.$duration-fast-01` | `var(--duration-fast)` |
| `motion.$duration-moderate-01` | `var(--duration-normal)` |

### Color Variables (Old -> New)

| Old Variable | New Variable |
|--------------|--------------|
| `--color-bg-primary-default` | `var(--color-surface)` |
| `--color-bg-primary-hover` | `var(--color-base-100)` |
| `--color-text-primary-default` | `var(--color-base-content)` |
| `--color-text-secondary-default` | `var(--color-muted)` |
| `--color-border-primary-default` | `var(--color-border)` |
| `--color-focus-ring-default` | `var(--focus-ring-color)` |

---

## Progress Tracking

### Phase 1: Components (9 files)
- [ ] GlobalBannerContainer/component.module.scss + component.tsx
- [ ] Layout/layout.module.scss
- [ ] TierBadge/component.module.scss + component.tsx
- [ ] UpgradePrompt/component.module.scss + component.tsx
- [ ] ai/chatbox.module.scss + component.tsx
- [ ] error/error.module.scss + component.tsx
- [ ] FeatureGate/component.module.scss + component.tsx
- [ ] gating/FeatureGate/component.module.scss + component.tsx
- [ ] navigation/routeguard.module.scss

### Phase 2: Features - Analytics (8 files)
- [ ] AnalyticsPage/component.module.scss + component.tsx
- [ ] AnalyticsDashboard/component.module.scss + component.tsx
- [ ] CampaignAnalyticsPage/component.module.scss + component.tsx
- [ ] ConversionFunnel/component.module.scss + component.tsx
- [ ] GrowthChart/component.module.scss + component.tsx
- [ ] SignupsChart/component.module.scss + component.tsx
- [ ] SourcesChart/component.module.scss + component.tsx
- [ ] TrafficSources/component.module.scss + component.tsx

### Phase 3: Features - Account & Billing (2 files)
- [ ] AccountPage/component.module.scss + component.tsx
- [ ] BillingPage/component.module.scss + component.tsx

### Phase 4: Features - Blasts (4 files)
- [ ] BlastDetail/component.module.scss + component.tsx
- [ ] BlastList/component.module.scss + component.tsx
- [ ] BlastWizard/component.module.scss + component.tsx
- [ ] BlastsPage/component.module.scss + component.tsx

### Phase 5: Features - Campaigns (14 files)
- [ ] CampaignCard/component.module.scss + component.tsx
- [ ] CampaignForm/component.module.scss + component.tsx
- [ ] CampaignFormPreview/component.module.scss + component.tsx
- [ ] CampaignList/component.module.scss + component.tsx
- [ ] CampaignOverview/component.module.scss + component.tsx
- [ ] CampaignSettings/component.module.scss + component.tsx
- [ ] CampaignStats/component.module.scss + component.tsx
- [ ] CampaignTabNav/component.module.scss + component.tsx
- [ ] CampaignsListPage/component.module.scss + component.tsx
- [ ] EmailPreview/component.module.scss + component.tsx
- [ ] EmailSettingsSection/component.module.scss + component.tsx
- [ ] EmailTemplateEditor/component.module.scss + component.tsx
- [ ] EmbedCodePage/component.module.scss + component.tsx
- [ ] NewCampaignPage/component.module.scss + component.tsx

### Phase 6: Features - Email Builder (7 files)
- [ ] BlockEditor/component.module.scss + component.tsx
- [ ] BlockItem/component.module.scss + component.tsx
- [ ] BlockPalette/component.module.scss + component.tsx
- [ ] EmailBuilder/component.module.scss + component.tsx
- [ ] EmailStyleEditor/component.module.scss + component.tsx
- [ ] VariableTextArea/component.module.scss + component.tsx
- [ ] VariableTextInput/component.module.scss + component.tsx

### Phase 7: Features - Emails (3 files)
- [ ] EmailCampaignForm/component.module.scss + component.tsx
- [ ] EmailEditor/component.module.scss + component.tsx
- [ ] EmailTemplateList/component.module.scss + component.tsx

### Phase 8: Features - Form Builder (16 files)
- [ ] DevicePreview/component.module.scss + component.tsx
- [ ] DropZone/component.module.scss + component.tsx
- [ ] FieldEditor/component.module.scss + component.tsx
- [ ] FieldItem/component.module.scss + component.tsx
- [ ] FieldPalette/component.module.scss + component.tsx
- [ ] FormBuilder/component.module.scss + component.tsx
- [ ] FormBuilderPage/component.module.scss + component.tsx
- [ ] FormCanvas/component.module.scss + component.tsx
- [ ] FormField/component.module.scss + component.tsx
- [ ] FormPreview/component.module.scss + component.tsx
- [ ] FormRenderer/component.module.scss + component.tsx
- [ ] FormStyleEditor/component.module.scss + component.tsx
- [ ] PublicFormEmbed/component.module.scss + component.tsx
- [ ] SuccessMessageEditor/component.module.scss + component.tsx
- [ ] SuccessScreenPreview/component.module.scss + component.tsx
- [ ] TemplateSelector/component.module.scss + component.tsx

### Phase 9: Features - Integrations & Webhooks (4 files)
- [ ] IntegrationList/component.module.scss + component.tsx
- [ ] WebhookManager/component.module.scss + component.tsx
- [ ] DeliveryList/component.module.scss + component.tsx
- [ ] WebhookForm/component.module.scss + component.tsx

### Phase 10: Features - Referrals (6 files)
- [ ] ChannelReferralLinks/component.module.scss + component.tsx
- [ ] LeaderboardWidget/component.module.scss + component.tsx
- [ ] PositionTracker/component.module.scss + component.tsx
- [ ] ReferralDashboard/component.module.scss + component.tsx
- [ ] ReferralLink/component.module.scss + component.tsx
- [ ] ShareButtons/component.module.scss + component.tsx

### Phase 11: Features - Rewards & Segments (5 files)
- [ ] RewardBuilder/component.module.scss + component.tsx
- [ ] RewardTiers/component.module.scss + component.tsx
- [ ] SegmentBuilder/component.module.scss + component.tsx
- [ ] SegmentList/component.module.scss + component.tsx
- [ ] SegmentsPage/component.module.scss + component.tsx

### Phase 12: Features - Team (2 files)
- [ ] TeamInviteModal/component.module.scss + component.tsx
- [ ] TeamMembers/component.module.scss + component.tsx

### Phase 13: Features - Users (6 files)
- [ ] BulkActions/component.module.scss + component.tsx
- [ ] FilterChips/component.module.scss + component.tsx
- [ ] LeadsPage/component.module.scss + component.tsx
- [ ] UserFilters/component.module.scss + component.tsx
- [ ] UserList/component.module.scss + component.tsx
- [ ] UserProfile/component.module.scss + component.tsx

### Phase 14: Routes (20 files)
- [ ] routes/account.module.scss + account.tsx
- [ ] routes/api-keys.module.scss + api-keys.tsx
- [ ] routes/dashboard.module.scss + dashboard.tsx
- [ ] routes/email-templates.module.scss
- [ ] routes/embed.module.scss
- [ ] routes/page.module.scss
- [ ] routes/campaigns/campaigns.module.scss
- [ ] routes/campaigns/$campaignId/analytics.module.scss
- [ ] routes/campaigns/$campaignId/campaignDetail.module.scss
- [ ] routes/campaigns/$campaignId/campaignEdit.module.scss
- [ ] routes/campaigns/$campaignId/campaignLayout.module.scss
- [ ] routes/campaigns/$campaignId/email-builder.module.scss
- [ ] routes/campaigns/$campaignId/embed.module.scss
- [ ] routes/campaigns/$campaignId/form-builder.module.scss
- [ ] routes/campaigns/$campaignId/leads.module.scss
- [ ] routes/campaigns/$campaignId/settings.module.scss
- [ ] routes/integrations/integrations.module.scss
- [ ] routes/webhooks/new.module.scss
- [ ] routes/webhooks/webhookDetail.module.scss
- [ ] routes/webhooks/webhooks.module.scss

---

## Commits Log

| Date | Commit | Phase | Files Changed | Description |
|------|--------|-------|---------------|-------------|
| | | | | |

---

## Summary
- **Total Files**: ~92 SCSS + corresponding TSX
- **Completed**: 0
- **Remaining**: 92

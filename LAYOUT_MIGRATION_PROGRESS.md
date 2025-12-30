# Layout Migration Progress - TSX to Proto Design System

This tracker monitors the migration of TSX files to use proto design system layout components (Stack, Grid, Card, Container, Text, etc.) instead of custom CSS classes.

## Available Layout Components
- `Stack` - Flex layouts with direction, gap, align, justify props
- `Grid` - CSS grid layouts with columns, gap props
- `Card` - Content containers with variant (elevated/outlined/filled), padding props
- `Container` - Width constraints with size (sm/md/lg/xl/full), centered, padded props
- `Divider` - Visual separators
- `Text` - Typography component
- `Badge` - Status indicators
- `Button`, `LinkButton` - Actions

## Migration Status

### Features (71 files)

#### Analytics (8 files) ✅ COMPLETED
- [x] AnalyticsDashboard/component.tsx
- [x] AnalyticsPage/component.tsx
- [x] CampaignAnalyticsPage/component.tsx
- [x] ConversionFunnel/component.tsx
- [x] GrowthChart/component.tsx
- [x] SignupsChart/component.tsx
- [x] SourcesChart/component.tsx
- [x] TrafficSources/component.tsx

#### Campaigns (14 files) ✅ COMPLETED
- [x] CampaignCard/component.tsx
- [x] CampaignForm/component.tsx
- [x] CampaignFormPreview/component.tsx
- [x] CampaignList/component.tsx
- [x] CampaignOverview/component.tsx
- [x] CampaignSettings/component.tsx
- [x] CampaignStats/component.tsx
- [x] CampaignTabNav/component.tsx
- [x] CampaignsListPage/component.tsx
- [x] EmailPreview/component.tsx
- [x] EmailSettingsSection/component.tsx
- [x] EmailTemplateEditor/component.tsx
- [x] EmbedCodePage/component.tsx
- [x] NewCampaignPage/component.tsx

#### Form Builder (17 files) ✅ COMPLETED
- [x] DevicePreview/component.tsx
- [x] DropZone/component.tsx (no icons needed)
- [x] FieldEditor/component.tsx
- [x] FieldItem/component.tsx
- [x] FieldPalette/component.tsx
- [x] FormBuilder/component.tsx
- [x] FormBuilderPage/component.tsx
- [x] FormCanvas/component.tsx
- [x] FormField/component.tsx (no icons needed)
- [x] FormField/TextField.tsx (no icons needed)
- [x] FormField/RadioField.tsx (no icons needed)
- [x] FormField/SelectField.tsx (no icons needed)
- [x] FormField/TextareaField.tsx (no icons needed)
- [x] FormField/CheckboxField.tsx (no icons needed)
- [x] FormPreview/component.tsx
- [x] FormRenderer/component.tsx
- [x] FormStyleEditor/component.tsx
- [x] PublicFormEmbed/component.tsx (already uses Spinner)
- [x] SuccessMessageEditor/component.tsx
- [x] SuccessScreenPreview/component.tsx
- [x] TemplateSelector/component.tsx

#### Email Builder (7 files)
- [ ] BlockEditor/component.tsx
- [ ] BlockItem/component.tsx
- [ ] BlockPalette/component.tsx
- [ ] EmailBuilder/component.tsx
- [ ] EmailStyleEditor/component.tsx
- [ ] VariableTextArea/component.tsx
- [ ] VariableTextInput/component.tsx

#### Emails (3 files)
- [ ] EmailCampaignForm/component.tsx
- [ ] EmailEditor/component.tsx
- [ ] EmailTemplateList/component.tsx

#### Blasts (4 files)
- [ ] BlastDetail/component.tsx
- [ ] BlastList/component.tsx
- [ ] BlastWizard/component.tsx
- [ ] BlastsPage/component.tsx

#### Users (7 files)
- [ ] BulkActions/component.tsx
- [ ] FilterChips/component.tsx
- [ ] LeadsPage/component.tsx
- [ ] UserFilters/component.tsx
- [ ] UserList/component.tsx
- [ ] UserProfile/component.tsx
- [ ] UtmSourceBadge/component.tsx

#### Segments (3 files)
- [ ] SegmentBuilder/component.tsx
- [ ] SegmentList/component.tsx
- [ ] SegmentsPage/component.tsx

#### Webhooks (2 files)
- [ ] DeliveryList/component.tsx
- [ ] WebhookForm/component.tsx

#### Referrals (6 files)
- [ ] ChannelReferralLinks/component.tsx
- [ ] LeaderboardWidget/component.tsx
- [ ] PositionTracker/component.tsx
- [ ] ReferralDashboard/component.tsx
- [ ] ReferralLink/component.tsx
- [ ] ShareButtons/component.tsx

#### Rewards (2 files)
- [ ] RewardBuilder/component.tsx
- [ ] RewardTiers/component.tsx

#### Integrations (2 files)
- [ ] IntegrationList/component.tsx
- [ ] WebhookManager/component.tsx

#### Team (2 files)
- [ ] TeamInviteModal/component.tsx
- [ ] TeamMembers/component.tsx

#### Account (1 file)
- [ ] AccountPage/component.tsx

#### Billing (1 file)
- [ ] BillingPage/component.tsx

### Components (15 files)

#### Layout & Navigation
- [ ] Layout/Layout.tsx
- [ ] navigation/RouteGuard.tsx

#### Gating & Upgrades
- [ ] gating/FeatureGate/component.tsx
- [ ] gating/LimitUpgradeModal/component.tsx
- [ ] FeatureGate/component.tsx
- [ ] UpgradePrompt/component.tsx
- [ ] TierBadge/component.tsx

#### Authentication
- [ ] authentication/email.tsx
- [ ] authentication/login.tsx
- [ ] authentication/googlesignin.tsx

#### Billing
- [ ] billing/plans/planCard.tsx
- [ ] billing/plans/planPay.tsx
- [ ] billing/checkout/CustomCheckout.tsx

#### Misc
- [ ] GlobalBannerContainer/component.tsx
- [ ] user/Username.tsx
- [ ] ai/chatbox.tsx
- [ ] ai/imagegenbox.tsx
- [ ] error/error.tsx

### Routes (30+ files)

#### Main Routes
- [ ] index.tsx
- [ ] main.tsx
- [ ] __root.tsx
- [ ] account.tsx
- [ ] analytics.tsx
- [ ] api-keys.tsx
- [ ] articles.tsx
- [ ] contacts.tsx
- [ ] deals.tsx
- [ ] email-templates.tsx
- [ ] integrations.tsx
- [ ] media.tsx
- [ ] signin.tsx
- [ ] webhooks.tsx
- [ ] about.tsx

#### Campaign Routes
- [ ] campaigns/index.tsx
- [ ] campaigns/new.tsx
- [ ] campaigns/$campaignId.tsx
- [ ] campaigns/$campaignId/index.tsx
- [ ] campaigns/$campaignId/analytics.tsx
- [ ] campaigns/$campaignId/blasts.tsx
- [ ] campaigns/$campaignId/blasts/index.tsx
- [ ] campaigns/$campaignId/blasts/new.tsx
- [ ] campaigns/$campaignId/blasts/$blastId.tsx
- [ ] campaigns/$campaignId/edit.tsx
- [ ] campaigns/$campaignId/email-builder.tsx
- [ ] campaigns/$campaignId/embed.tsx
- [ ] campaigns/$campaignId/form-builder.tsx
- [ ] campaigns/$campaignId/leads.tsx
- [ ] campaigns/$campaignId/segments.tsx
- [ ] campaigns/$campaignId/settings.tsx

#### Webhook Routes
- [ ] webhooks/index.tsx
- [ ] webhooks/new.tsx
- [ ] webhooks/$webhookId.tsx

#### Billing Routes
- [ ] billing/index.tsx
- [ ] billing/pay.tsx
- [ ] billing/plans.tsx
- [ ] billing/payment_attempt.tsx
- [ ] billing/payment_method.tsx

#### Other Routes
- [ ] embed.$campaignId.tsx
- [ ] integrations/index.tsx
- [ ] oauth/signedin.tsx
- [ ] test-variable-input.tsx

---

## Migration Pattern

### Before (Legacy)
```tsx
<div className={styles.page}>
  <div className={styles.header}>
    <h1 className={styles.title}>Title</h1>
  </div>
  <div className={styles.content}>
    <div className={styles.card}>Content</div>
  </div>
</div>
```

### After (Proto Design System)
```tsx
<Stack gap="lg" className={styles.page}>
  <Stack gap="sm">
    <Text as="h1" size="2xl" weight="semibold">Title</Text>
  </Stack>
  <Card padding="lg">
    Content
  </Card>
</Stack>
```

## Progress Summary
- Total Files: ~145
- Migrated: 0
- Remaining: ~145

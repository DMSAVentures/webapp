import { AlertTriangle, Check, CheckCircle, Copy, Plus, Sparkles, Trash2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { useCreateAPIKey } from "@/hooks/useCreateAPIKey";
import { useGetAPIKeys } from "@/hooks/useGetAPIKeys";
import { useRevokeAPIKey } from "@/hooks/useRevokeAPIKey";
import { Button, Checkbox, EmptyState, Icon, Spinner, Modal, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input } from "@/proto-design-system";
import type { APIKey, CreateAPIKeyResponse } from "@/types/apikey";
import { API_KEY_SCOPES } from "@/types/apikey";
import styles from "./api-keys.module.scss";

export const Route = createFileRoute("/api-keys")({
	component: RouteComponent,
});

function RouteComponent() {
	const { apiKeys, loading, error, refetch } = useGetAPIKeys();
	const {
		createAPIKey,
		loading: createLoading,
		error: createError,
	} = useCreateAPIKey();
	const { revokeAPIKey, loading: revokeLoading } = useRevokeAPIKey();

	// Modal states
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
	const [keyToRevoke, setKeyToRevoke] = useState<APIKey | null>(null);

	// Form state
	const [name, setName] = useState("");
	const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
	const [expiresInDays, setExpiresInDays] = useState<string>("");
	const [formError, setFormError] = useState<string | null>(null);

	// Created key (to display once)
	const [createdKey, setCreatedKey] = useState<CreateAPIKeyResponse | null>(
		null,
	);
	const [keyCopied, setKeyCopied] = useState(false);

	const resetForm = useCallback(() => {
		setName("");
		setSelectedScopes([]);
		setExpiresInDays("");
		setFormError(null);
	}, []);

	const handleCreateKey = useCallback(async () => {
		if (!name.trim()) {
			setFormError("Name is required");
			return;
		}
		if (selectedScopes.length === 0) {
			setFormError("At least one scope is required");
			return;
		}

		const result = await createAPIKey({
			name: name.trim(),
			scopes: selectedScopes,
			expires_in_days: expiresInDays ? parseInt(expiresInDays, 10) : undefined,
		});

		if (result) {
			setCreatedKey(result);
			setIsCreateModalOpen(false);
			setIsSuccessModalOpen(true);
			resetForm();
			refetch();
		}
	}, [name, selectedScopes, expiresInDays, createAPIKey, resetForm, refetch]);

	const handleRevokeKey = useCallback(async () => {
		if (!keyToRevoke) return;

		const success = await revokeAPIKey(keyToRevoke.id);
		if (success) {
			setIsRevokeModalOpen(false);
			setKeyToRevoke(null);
			refetch();
		}
	}, [keyToRevoke, revokeAPIKey, refetch]);

	const handleCopyKey = useCallback(() => {
		if (createdKey?.key) {
			navigator.clipboard.writeText(createdKey.key);
			setKeyCopied(true);
			setTimeout(() => setKeyCopied(false), 2000);
		}
	}, [createdKey]);

	const toggleScope = useCallback((scope: string) => {
		setSelectedScopes((prev) =>
			prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
		);
	}, []);

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const getStatusVariant = (
		status: string,
	): "success" | "warning" | "error" | "secondary" => {
		switch (status) {
			case "active":
				return "success";
			case "revoked":
				return "error";
			case "expired":
				return "secondary";
			default:
				return "warning";
		}
	};

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<Spinner size="lg" />
			</div>
		);
	}

	if (error) {
		return (
			<motion.div
				className={styles.page}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<div className={styles.errorContainer}>
					<p>Failed to load API keys: {error.error}</p>
					<Button onClick={() => refetch()}>Retry</Button>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			className={styles.page}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.pageHeader}>
				<div className={styles.headerContent}>
					<h1 className={styles.pageTitle}>API Keys</h1>
					<p className={styles.pageDescription}>
						Create and manage API keys for integrations like Zapier
					</p>
				</div>
				<Button leftIcon={<Plus size={16} />} onClick={() => setIsCreateModalOpen(true)}>
					Create API Key
				</Button>
			</div>

			<div className={styles.pageContent}>
				{!apiKeys || apiKeys.length === 0 ? (
					<EmptyState
						icon="key-2-line"
						title="No API keys yet"
						description="Create an API key to enable integrations with external services like Zapier."
						action={
							<Button onClick={() => setIsCreateModalOpen(true)}>
								Create API Key
							</Button>
						}
					/>
				) : (
					<Table minWidth="700px">
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Key</TableHead>
								<TableHead>Scopes</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Created</TableHead>
								<TableHead>Last Used</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{apiKeys.map((key) => (
								<TableRow key={key.id}>
									<TableCell>{key.name}</TableCell>
									<TableCell>
										<code className={styles.keyPrefix}>{key.keyPrefix}</code>
									</TableCell>
									<TableCell>
										<div className={styles.scopes}>
											{key.scopes.slice(0, 2).map((scope) => (
												<span key={scope} className={styles.scopeTag}>
													{scope}
												</span>
											))}
											{key.scopes.length > 2 && (
												<span className={styles.scopeMore}>
													+{key.scopes.length - 2}
												</span>
											)}
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={getStatusVariant(key.status)}>
											{key.status}
										</Badge>
									</TableCell>
									<TableCell>{formatDate(key.createdAt)}</TableCell>
									<TableCell>
										{key.lastUsedAt ? formatDate(key.lastUsedAt) : "Never"}
									</TableCell>
									<TableCell>
										{key.status === "active" && (
											<Button
												aria-label="Revoke API key"
												variant="secondary"
												size="sm"
												leftIcon={<Trash2 size={16} />}
												onClick={() => {
													setKeyToRevoke(key);
													setIsRevokeModalOpen(true);
												}}
											/>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			{/* Create API Key Modal */}
			<Modal
				isOpen={isCreateModalOpen}
				title="Create API Key"
				description="Generate a new API key for integrations"
				icon={<Sparkles />}
				iconVariant="info"
				onClose={() => {
					setIsCreateModalOpen(false);
					resetForm();
				}}
				footer={
					<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
						<Button variant="ghost" onClick={() => {
							setIsCreateModalOpen(false);
							resetForm();
						}}>Cancel</Button>
						<Button variant="primary" onClick={handleCreateKey}>{createLoading ? "Creating..." : "Create Key"}</Button>
					</div>
				}
			>
				<div className={styles.modalForm}>
					<Input
						placeholder="e.g., Zapier Integration"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>

					<div className={styles.formField}>
						<label className={styles.fieldLabel}>
							Scopes <span className={styles.required}>*</span>
						</label>
						<div className={styles.scopesList}>
							{Object.entries(API_KEY_SCOPES).map(([scope, description]) => (
								<div key={scope} className={styles.scopeOption}>
									<Checkbox
										checked={selectedScopes.includes(scope)}
										onChange={() => toggleScope(scope)}
									/>
									<div className={styles.scopeInfo}>
										<span className={styles.scopeName}>{scope}</span>
										<span className={styles.scopeDesc}>{description}</span>
									</div>
								</div>
							))}
						</div>
					</div>

					<Input
						placeholder="Leave empty for no expiration"
						type="number"
						min={1}
						value={expiresInDays}
						onChange={(e) => setExpiresInDays(e.target.value)}
					/>

					{(formError || createError) && (
						<p className={styles.errorMessage}>
							{formError || createError?.error}
						</p>
					)}
				</div>
			</Modal>

			{/* Success Modal - Show created key */}
			<Modal
				isOpen={isSuccessModalOpen}
				title="API Key Created"
				description="Make sure to copy your API key now. You won't be able to see it again!"
				icon={<CheckCircle />}
				iconVariant="success"
				onClose={() => {
					setIsSuccessModalOpen(false);
					setCreatedKey(null);
					setKeyCopied(false);
				}}
				footer={
					<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
						<Button variant="primary" onClick={() => {
							setIsSuccessModalOpen(false);
							setCreatedKey(null);
							setKeyCopied(false);
						}}>Done</Button>
					</div>
				}
			>
				<div className={styles.successContent}>
					<div className={styles.keyDisplay}>
						<code className={styles.apiKey}>{createdKey?.key}</code>
						<Button
							variant="secondary"
							leftIcon={keyCopied ? <Check size={16} /> : <Copy size={16} />}
							onClick={handleCopyKey}
						>
							{keyCopied ? "Copied!" : "Copy"}
						</Button>
					</div>
					<p className={styles.warningText}>
						<Icon icon={AlertTriangle} size="sm" />
						Store this key securely. It will only be shown once.
					</p>
				</div>
			</Modal>

			{/* Revoke Confirmation Modal */}
			<Modal
				isOpen={isRevokeModalOpen}
				title="Revoke API Key"
				description={`Are you sure you want to revoke "${keyToRevoke?.name}"? This action cannot be undone and any integrations using this key will stop working.`}
				icon={<AlertTriangle />}
				iconVariant="warning"
				onClose={() => {
					setIsRevokeModalOpen(false);
					setKeyToRevoke(null);
				}}
				footer={
					<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
						<Button variant="ghost" onClick={() => {
							setIsRevokeModalOpen(false);
							setKeyToRevoke(null);
						}}>Cancel</Button>
						<Button variant="primary" onClick={handleRevokeKey}>{revokeLoading ? "Revoking..." : "Revoke Key"}</Button>
					</div>
				}
			>
				{null}
			</Modal>
		</motion.div>
	);
}

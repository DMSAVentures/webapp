import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { useCreateAPIKey } from "@/hooks/useCreateAPIKey";
import { useGetAPIKeys } from "@/hooks/useGetAPIKeys";
import { useRevokeAPIKey } from "@/hooks/useRevokeAPIKey";
import { Button } from "@/proto-design-system/Button/button";
import { IconOnlyButton } from "@/proto-design-system/Button/IconOnlyButton";
import Checkbox from "@/proto-design-system/checkbox/checkbox";
import { EmptyState } from "@/proto-design-system/EmptyState/EmptyState";
import { LoadingSpinner } from "@/proto-design-system/LoadingSpinner/LoadingSpinner";
import Modal from "@/proto-design-system/modal/modal";
import StatusBadge from "@/proto-design-system/StatusBadge/statusBadge";
import { Table } from "@/proto-design-system/Table";
import { TextInput } from "@/proto-design-system/TextInput/textInput";
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
	): "completed" | "pending" | "failed" | "disabled" => {
		switch (status) {
			case "active":
				return "completed";
			case "revoked":
				return "failed";
			case "expired":
				return "disabled";
			default:
				return "pending";
		}
	};

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<LoadingSpinner size="large" />
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
				<Button leftIcon="add-line" onClick={() => setIsCreateModalOpen(true)}>
					Create API Key
				</Button>
			</div>

			<div className={styles.pageContent}>
				{!apiKeys || apiKeys.length === 0 ? (
					<EmptyState
						icon="key-2-line"
						title="No API keys yet"
						description="Create an API key to enable integrations with external services like Zapier."
						action={{
							label: "Create API Key",
							onClick: () => setIsCreateModalOpen(true),
						}}
					/>
				) : (
					<Table minWidth="700px">
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell>Name</Table.HeaderCell>
								<Table.HeaderCell>Key</Table.HeaderCell>
								<Table.HeaderCell>Scopes</Table.HeaderCell>
								<Table.HeaderCell>Status</Table.HeaderCell>
								<Table.HeaderCell>Created</Table.HeaderCell>
								<Table.HeaderCell>Last Used</Table.HeaderCell>
								<Table.HeaderCell>Actions</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{apiKeys.map((key) => (
								<Table.Row key={key.id}>
									<Table.Cell>{key.name}</Table.Cell>
									<Table.Cell>
										<code className={styles.keyPrefix}>{key.keyPrefix}</code>
									</Table.Cell>
									<Table.Cell>
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
									</Table.Cell>
									<Table.Cell>
										<StatusBadge
											text={key.status}
											variant={getStatusVariant(key.status)}
										/>
									</Table.Cell>
									<Table.Cell>{formatDate(key.createdAt)}</Table.Cell>
									<Table.Cell>
										{key.lastUsedAt ? formatDate(key.lastUsedAt) : "Never"}
									</Table.Cell>
									<Table.Cell>
										{key.status === "active" && (
											<IconOnlyButton
												ariaLabel="Revoke API key"
												variant="secondary"
												iconClass="delete-bin-line"
												onClick={() => {
													setKeyToRevoke(key);
													setIsRevokeModalOpen(true);
												}}
											/>
										)}
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				)}
			</div>

			{/* Create API Key Modal */}
			<Modal
				isOpen={isCreateModalOpen}
				title="Create API Key"
				description="Generate a new API key for integrations"
				icon="feature"
				onClose={() => {
					setIsCreateModalOpen(false);
					resetForm();
				}}
				proceedText={createLoading ? "Creating..." : "Create Key"}
				cancelText="Cancel"
				onProceed={handleCreateKey}
			>
				<div className={styles.modalForm}>
					<TextInput
						label="Name"
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
										checked={
											selectedScopes.includes(scope) ? "checked" : "unchecked"
										}
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

					<TextInput
						label="Expires in (days)"
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
				icon="success"
				onClose={() => {
					setIsSuccessModalOpen(false);
					setCreatedKey(null);
					setKeyCopied(false);
				}}
				proceedText="Done"
				onProceed={() => {
					setIsSuccessModalOpen(false);
					setCreatedKey(null);
					setKeyCopied(false);
				}}
			>
				<div className={styles.successContent}>
					<div className={styles.keyDisplay}>
						<code className={styles.apiKey}>{createdKey?.key}</code>
						<Button
							variant="secondary"
							leftIcon={keyCopied ? "check-line" : "file-copy-line"}
							onClick={handleCopyKey}
						>
							{keyCopied ? "Copied!" : "Copy"}
						</Button>
					</div>
					<p className={styles.warningText}>
						<i className="ri-error-warning-line" />
						Store this key securely. It will only be shown once.
					</p>
				</div>
			</Modal>

			{/* Revoke Confirmation Modal */}
			<Modal
				isOpen={isRevokeModalOpen}
				title="Revoke API Key"
				description={`Are you sure you want to revoke "${keyToRevoke?.name}"? This action cannot be undone and any integrations using this key will stop working.`}
				icon="warning"
				onClose={() => {
					setIsRevokeModalOpen(false);
					setKeyToRevoke(null);
				}}
				proceedText={revokeLoading ? "Revoking..." : "Revoke Key"}
				cancelText="Cancel"
				onProceed={handleRevokeKey}
			/>
		</motion.div>
	);
}

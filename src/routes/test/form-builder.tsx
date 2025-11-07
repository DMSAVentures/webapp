import { createFileRoute } from "@tanstack/react-router";
import { FormBuilder } from "@/features/form-builder/components/FormBuilder/component";
import type { FormConfig } from "@/types/common.types";
import { useState } from "react";

export const Route = createFileRoute("/test/form-builder")({
	component: RouteComponent,
});

function RouteComponent() {
	const [savedConfig, setSavedConfig] = useState<FormConfig | null>(null);
	const [saveCount, setSaveCount] = useState(0);

	const handleSave = async (config: FormConfig) => {
		// Simulate save delay
		await new Promise((resolve) => setTimeout(resolve, 500));
		setSavedConfig(config);
		setSaveCount((prev) => prev + 1);
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Form Builder Test</h1>

			<FormBuilder
				campaignId="test-campaign"
				onSave={handleSave}
				data-testid="form-builder"
			/>

			{saveCount > 0 && (
				<div data-testid="save-success">
					Form saved {saveCount} time{saveCount !== 1 ? "s" : ""}!
				</div>
			)}

			{savedConfig && (
				<div data-testid="saved-config">
					Fields count: {savedConfig.fields.length}
				</div>
			)}
		</div>
	);
}

/**
 * Test page for VariableTextInput and VariableTextArea components
 * Access at: /test-variable-input
 */

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { VariableTextArea } from "@/features/email-builder/components/VariableTextArea/component";
import { VariableTextInput } from "@/features/email-builder/components/VariableTextInput/component";

export const Route = createFileRoute("/test-variable-input")({
	component: VariableInputTestPage,
});

function VariableInputTestPage() {
	const [inputValue, setInputValue] = useState("");
	const [textareaValue, setTextareaValue] = useState("");

	return (
		<div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
			<h1>Variable Input Test Page</h1>

			<section style={{ marginBottom: "40px" }}>
				<h2>VariableTextInput</h2>
				<VariableTextInput
					label="Subject Line"
					placeholder="Type @ to insert variables..."
					value={inputValue}
					onChange={setInputValue}
					data-testid="variable-text-input"
				/>
				<div style={{ marginTop: "16px" }}>
					<strong>Raw value:</strong>
					<pre
						data-testid="input-raw-value"
						style={{
							background: "#f5f5f5",
							padding: "8px",
							borderRadius: "4px",
							whiteSpace: "pre-wrap",
							wordBreak: "break-all",
						}}
					>
						{inputValue || "(empty)"}
					</pre>
				</div>
			</section>

			<section>
				<h2>VariableTextArea</h2>
				<VariableTextArea
					label="Email Body"
					placeholder="Type @ to insert variables..."
					value={textareaValue}
					onChange={setTextareaValue}
					rows={5}
					data-testid="variable-text-area"
				/>
				<div style={{ marginTop: "16px" }}>
					<strong>Raw value:</strong>
					<pre
						data-testid="textarea-raw-value"
						style={{
							background: "#f5f5f5",
							padding: "8px",
							borderRadius: "4px",
							whiteSpace: "pre-wrap",
							wordBreak: "break-all",
						}}
					>
						{textareaValue || "(empty)"}
					</pre>
				</div>
			</section>
		</div>
	);
}

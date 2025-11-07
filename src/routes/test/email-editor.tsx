import { createFileRoute } from "@tanstack/react-router";
import { EmailEditor } from "@/features/emails/components/EmailEditor/component";
import { useState } from "react";

export const Route = createFileRoute("/test/email-editor")({
	component: RouteComponent,
});

function RouteComponent() {
	const [content, setContent] = useState("");
	const [changeCount, setChangeCount] = useState(0);

	const variables = [
		"first_name",
		"last_name",
		"email",
		"referral_code",
		"campaign_name",
	];

	const handleChange = (html: string) => {
		setContent(html);
		setChangeCount((prev) => prev + 1);
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Email Editor Test</h1>

			<EmailEditor
				initialContent="<p>Welcome to our campaign!</p>"
				variables={variables}
				onChange={handleChange}
				data-testid="email-editor"
			/>

			{changeCount > 0 && (
				<div data-testid="change-count">Changed {changeCount} times</div>
			)}

			<div data-testid="content-length">
				Content length: {content.length}
			</div>
		</div>
	);
}

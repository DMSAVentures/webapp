import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { EmailEditor } from "./component";

const meta = {
	title: "Features/Emails/EmailEditor",
	component: EmailEditor,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"WYSIWYG email editor with rich text editing, variable insertion, and preview functionality. Supports desktop and mobile preview modes.",
			},
		},
	},
	argTypes: {
		initialContent: {
			control: "text",
			description: "Initial HTML content for the editor",
		},
		variables: {
			control: "object",
			description: "Available variables that can be inserted into the email",
		},
		onChange: {
			action: "onChange",
			description: "Callback when the content changes",
		},
	},
} satisfies Meta<typeof EmailEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default email editor with common variables
 */
export const Default: Story = {
	args: {
		initialContent:
			"<h1>Welcome Email</h1><p>Hi, this is your welcome email template.</p>",
		variables: [
			"first_name",
			"last_name",
			"email",
			"campaign_name",
			"position",
			"referral_link",
		],
		onChange: (html) => {
			console.log("Content changed:", html);
		},
	},
};

/**
 * Empty editor for creating new templates
 */
export const Empty: Story = {
	args: {
		initialContent: "",
		variables: [
			"first_name",
			"last_name",
			"email",
			"campaign_name",
			"position",
			"referral_link",
		],
		onChange: (html) => {
			console.log("Content changed:", html);
		},
	},
};

/**
 * Editor with a rich welcome email template
 */
export const WelcomeEmailTemplate: Story = {
	args: {
		initialContent: `
      <h1>Welcome to {{campaign_name}}! 🎉</h1>
      <p>Hi {{first_name}},</p>
      <p>Thank you for joining our waitlist! We're thrilled to have you on board.</p>
      <p>You're currently at position <strong>#{{position}}</strong> in the waitlist.</p>
      <h3>Want to move up faster?</h3>
      <p>Share your unique referral link and move up the waitlist for every friend who joins!</p>
      <p><a href="{{referral_link}}">Share Your Link</a></p>
      <p>Best regards,<br>The {{campaign_name}} Team</p>
    `,
		variables: ["first_name", "campaign_name", "position", "referral_link"],
		onChange: (html) => {
			console.log("Content changed:", html);
		},
	},
};

/**
 * Editor with verification email template
 */
export const VerificationEmailTemplate: Story = {
	args: {
		initialContent: `
      <h1>Verify Your Email</h1>
      <p>Hi {{first_name}}, please verify your email address to secure your spot on the waitlist.</p>
      <p><a href="{{verification_link}}">Verify Email Address</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't sign up for {{campaign_name}}, you can safely ignore this email.</p>
    `,
		variables: ["first_name", "campaign_name", "verification_link"],
		onChange: (html) => {
			console.log("Content changed:", html);
		},
	},
};

/**
 * Editor with milestone celebration template
 */
export const MilestoneEmailTemplate: Story = {
	args: {
		initialContent: `
      <h1>Congrats, {{first_name}}! 🎉</h1>
      <p>You've moved up to position <strong>#{{position}}</strong>!</p>
      <p>That puts you in the top <strong>{{percentile}}%</strong> of all waitlist members.</p>
      <p><strong>{{referral_count}}</strong> people joined using your link!</p>
      <p>Keep sharing to move up even faster:</p>
      <p><a href="{{referral_link}}">Share Your Link</a></p>
    `,
		variables: [
			"first_name",
			"position",
			"percentile",
			"referral_count",
			"referral_link",
		],
		onChange: (html) => {
			console.log("Content changed:", html);
		},
	},
};

/**
 * Interactive example with state management
 */
export const Interactive: Story = {
	render: () => {
		const [content, setContent] = useState(
			"<h1>Start editing...</h1><p>Your email content goes here.</p>",
		);

		return (
			<div>
				<EmailEditor
					initialContent={content}
					variables={[
						"first_name",
						"last_name",
						"email",
						"campaign_name",
						"position",
						"referral_link",
						"verification_link",
					]}
					onChange={setContent}
				/>
				<div
					style={{
						marginTop: "20px",
						padding: "20px",
						background: "#f5f5f5",
						borderRadius: "8px",
					}}
				>
					<h3>Current HTML Content:</h3>
					<pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
						{content}
					</pre>
				</div>
			</div>
		);
	},
};

/**
 * Editor with extensive variable set
 */
export const WithManyVariables: Story = {
	args: {
		initialContent:
			'<h1>Email Template</h1><p>Click "Insert Variable" to see all available options.</p>',
		variables: [
			"first_name",
			"last_name",
			"email",
			"campaign_name",
			"position",
			"referral_link",
			"verification_link",
			"access_code",
			"launch_url",
			"beta_code",
			"ios_download_link",
			"android_download_link",
			"percentile",
			"referral_count",
			"unsubscribe_link",
		],
		onChange: (html) => {
			console.log("Content changed:", html);
		},
	},
};

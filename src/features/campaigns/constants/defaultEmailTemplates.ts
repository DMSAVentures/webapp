/**
 * Default Email Templates
 *
 * These templates are used as defaults when no custom template has been created.
 * Users can customize these templates via the email settings UI.
 */

export interface DefaultEmailTemplate {
	subject: string;
	htmlBody: string;
	textBody: string;
}

export const TEMPLATE_VARIABLES = [
	{ name: "first_name", description: "User's first name" },
	{ name: "email", description: "User's email address" },
	{ name: "position", description: "Waitlist position number" },
	{ name: "referral_link", description: "User's unique referral link" },
	{ name: "campaign_name", description: "Name of the campaign" },
	{
		name: "verification_link",
		description: "Email verification link (verification only)",
	},
] as const;

export const SAMPLE_TEMPLATE_DATA: Record<string, string | number> = {
	first_name: "John",
	email: "john@example.com",
	position: 42,
	referral_link: "https://example.com/ref/ABC123",
	campaign_name: "Product Launch",
	verification_link: "https://example.com/verify?token=xyz123",
};

export const DEFAULT_EMAIL_TEMPLATES: Record<
	"verification" | "welcome",
	DefaultEmailTemplate
> = {
	verification: {
		subject:
			"Verify your email - You're #{{.position}} on the {{.campaign_name}} waitlist",
		htmlBody: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f5f5f5;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; margin: 0 0 24px 0;">
      Verify Your Email
    </h1>

    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      Hi {{.first_name}},
    </p>

    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Thank you for joining the <strong>{{.campaign_name}}</strong> waitlist!
      You're currently at position <strong>#{{.position}}</strong>.
    </p>

    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Please verify your email address to secure your spot:
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{.verification_link}}"
         style="display: inline-block; background-color: #2563EB; color: #ffffff;
                padding: 14px 32px; text-decoration: none; border-radius: 6px;
                font-size: 16px; font-weight: 600;">
        Verify Email
      </a>
    </div>

    <div style="border-top: 1px solid #e5e5e5; margin-top: 32px; padding-top: 24px;">
      <p style="color: #6b6b6b; font-size: 14px; line-height: 1.5; margin: 0 0 12px 0;">
        <strong>Share to move up the waitlist:</strong>
      </p>
      <p style="color: #2563EB; font-size: 14px; margin: 0;">
        <a href="{{.referral_link}}" style="color: #2563EB;">{{.referral_link}}</a>
      </p>
    </div>
  </div>

  <p style="color: #9a9a9a; font-size: 12px; text-align: center; margin-top: 24px;">
    If you didn't sign up for this waitlist, you can safely ignore this email.
  </p>
</body>
</html>`,
		textBody: `Hi {{.first_name}},

Thank you for joining the {{.campaign_name}} waitlist! You're currently at position #{{.position}}.

Please verify your email address to secure your spot:
{{.verification_link}}

Share to move up the waitlist:
{{.referral_link}}

If you didn't sign up for this waitlist, you can safely ignore this email.`,
	},

	welcome: {
		subject: "Welcome to the {{.campaign_name}} waitlist!",
		htmlBody: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f5f5f5;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; margin: 0 0 24px 0;">
      Welcome to the Waitlist!
    </h1>

    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      Hi {{.first_name}},
    </p>

    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      You've successfully joined the <strong>{{.campaign_name}}</strong> waitlist!
    </p>

    <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="color: #6b6b6b; font-size: 14px; margin: 0 0 8px 0;">Your current position</p>
      <p style="color: #1a1a1a; font-size: 36px; font-weight: 700; margin: 0;">#{{.position}}</p>
    </div>

    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Want to move up? Share your unique referral link with friends:
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{{.referral_link}}"
         style="display: inline-block; background-color: #2563EB; color: #ffffff;
                padding: 14px 32px; text-decoration: none; border-radius: 6px;
                font-size: 16px; font-weight: 600;">
        Share Your Link
      </a>
    </div>

    <div style="background-color: #fafafa; border-radius: 6px; padding: 16px; margin-top: 24px;">
      <p style="color: #6b6b6b; font-size: 14px; margin: 0;">
        Your referral link:<br>
        <a href="{{.referral_link}}" style="color: #2563EB; word-break: break-all;">{{.referral_link}}</a>
      </p>
    </div>
  </div>

  <p style="color: #9a9a9a; font-size: 12px; text-align: center; margin-top: 24px;">
    We'll notify you when it's your turn. Stay tuned!
  </p>
</body>
</html>`,
		textBody: `Hi {{.first_name}},

You've successfully joined the {{.campaign_name}} waitlist!

Your current position: #{{.position}}

Want to move up? Share your unique referral link with friends:
{{.referral_link}}

We'll notify you when it's your turn. Stay tuned!`,
	},
};

/**
 * Renders a template string by replacing {{variable}} placeholders with actual values
 */
export function renderTemplate(
	template: string,
	data: Record<string, string | number>,
): string {
	return template.replace(/\{\{\.(\w+)\}\}/g, (match, variable) => {
		return String(data[variable] ?? match);
	});
}

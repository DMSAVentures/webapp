import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Megaphone } from "lucide-react";
import { motion } from "motion/react";
import { NewBlastEmailTemplatePage } from "@/features/email-builder/components/NewBlastEmailTemplatePage/component";
import { NewEmailTemplatePage } from "@/features/email-builder/components/NewEmailTemplatePage/component";
import { Card } from "@/proto-design-system/components/layout/Card";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Text } from "@/proto-design-system/components/primitives/Text";
import styles from "../email-templates.module.scss";

interface EmailTemplateNewSearch {
	type?: "campaign" | "blast";
}

export const Route = createFileRoute("/email-templates/new")({
	component: RouteComponent,
	validateSearch: (
		search: Record<string, unknown>,
	): EmailTemplateNewSearch => ({
		type:
			search.type === "campaign" || search.type === "blast"
				? search.type
				: undefined,
	}),
});

function RouteComponent() {
	const { type } = Route.useSearch();
	const navigate = useNavigate();

	const handleSelectType = (selectedType: "campaign" | "blast") => {
		navigate({
			to: "/email-templates/new",
			search: { type: selectedType },
		});
	};

	if (type === "campaign") {
		return <NewEmailTemplatePage />;
	}

	if (type === "blast") {
		return <NewBlastEmailTemplatePage />;
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
					<h1 className={styles.pageTitle}>Create Email Template</h1>
					<p className={styles.pageDescription}>
						Choose the type of email template you want to create
					</p>
				</div>
			</div>

			<div className={styles.pageContent}>
				<Stack direction="row" gap="lg" wrap>
					<Card
						variant="outlined"
						padding="lg"
						interactive
						onClick={() => handleSelectType("campaign")}
						className={styles.typeSelectionCard}
					>
						<Stack gap="md" align="center">
							<Icon icon={Mail} size="xl" color="primary" />
							<Stack gap="xs" align="center">
								<Text size="lg" weight="semibold">
									Campaign Template
								</Text>
								<Text size="sm" color="muted" align="center">
									For automated emails like welcome, verification, etc. Tied to
									a specific campaign.
								</Text>
							</Stack>
						</Stack>
					</Card>

					<Card
						variant="outlined"
						padding="lg"
						interactive
						onClick={() => handleSelectType("blast")}
						className={styles.typeSelectionCard}
					>
						<Stack gap="md" align="center">
							<Icon icon={Megaphone} size="xl" color="primary" />
							<Stack gap="xs" align="center">
								<Text size="lg" weight="semibold">
									Blast Template
								</Text>
								<Text size="sm" color="muted" align="center">
									For manual email blasts to segments. Account-wide, reusable.
								</Text>
							</Stack>
						</Stack>
					</Card>
				</Stack>
			</div>
		</motion.div>
	);
}

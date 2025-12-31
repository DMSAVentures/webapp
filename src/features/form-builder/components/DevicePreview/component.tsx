/**
 * DevicePreview Component
 * Reusable device frame wrapper for previewing content in different device sizes
 */

import { type HTMLAttributes, memo, type ReactNode } from "react";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Text } from "@/proto-design-system/components/primitives/Text";
import styles from "./component.module.scss";

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface DevicePreviewProps extends HTMLAttributes<HTMLDivElement> {
	/** Device type for responsive preview */
	device?: DeviceType;
	/** Content to render inside the device frame */
	children: ReactNode;
	/** Optional empty state when no content */
	emptyState?: ReactNode;
	/** Whether to show empty state */
	isEmpty?: boolean;
	/** Additional CSS class name */
	className?: string;
}

/**
 * DevicePreview renders content inside a device frame with browser chrome
 */
export const DevicePreview = memo<DevicePreviewProps>(function DevicePreview({
	device = "desktop",
	children,
	emptyState,
	isEmpty = false,
	className: customClassName,
	...props
}) {
	const classNames = [styles.root, styles[`device_${device}`], customClassName]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={classNames} {...props}>
			<div className={styles.deviceFrame}>
				<Stack direction="row" align="center" className={styles.deviceHeader}>
					<Stack direction="row" gap="xs" className={styles.deviceControls}>
						<span className={styles.deviceDot} />
						<span className={styles.deviceDot} />
						<span className={styles.deviceDot} />
					</Stack>
					<Text size="xs" color="muted" className={styles.deviceTitle}>
						{device} Preview
					</Text>
				</Stack>

				<div className={styles.previewContent}>
					{isEmpty && emptyState ? emptyState : children}
				</div>
			</div>
		</div>
	);
});

DevicePreview.displayName = "DevicePreview";

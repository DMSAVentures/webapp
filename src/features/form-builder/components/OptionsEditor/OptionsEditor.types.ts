import type { HTMLAttributes } from "react";

export interface OptionsEditorProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Current options list */
	options: string[];
	/** Callback when options change */
	onChange: (options: string[]) => void;
	/** Label for the options section */
	label?: string;
	/** Whether options are required */
	required?: boolean;
	/** Minimum number of options allowed (default: 1) */
	minOptions?: number;
}

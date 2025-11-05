import React from "react";
import { Column } from "@/proto-design-system/UIShell/Column/Column";

interface ErrorStateProps {
	message: string;
}
export const ErrorState: React.FC<ErrorStateProps> = (
	props: ErrorStateProps,
) => {
	return (
		<Column
			sm={{ span: 7, start: 1 }}
			md={{ start: 1, span: 7 }}
			lg={{ start: 1, span: 11 }}
			xlg={{ start: 1, span: 13 }}
		>
			<p>{props.message}</p>
		</Column>
	);
};

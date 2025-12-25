import React from "react";

export interface SidebarUsernameProps {
	firstName: string;
	lastName: string;
}
export const SidebarUsername: React.FC<SidebarUsernameProps> = (
	props: SidebarUsernameProps,
) => {
	return (
		<p className="sidebar-username__text">
			{props.firstName + " " + props.lastName}
		</p>
	);
};

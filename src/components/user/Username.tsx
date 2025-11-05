"use client";
import { useContext } from "react";
import { SidebarUsername } from "@/proto-design-system/UIShell/Sidebar/sidebarUsername";
import { AuthContext } from "@/contexts/auth";

export default function UserName() {
	const auth = useContext(AuthContext);
	if (!auth.user) {
		return null;
	}

	return (
		<SidebarUsername
			first_name={auth.user.first_name}
			last_name={auth.user.last_name}
		/>
	);
}

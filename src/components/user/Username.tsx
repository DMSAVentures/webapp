"use client";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";
import { Avatar, Text } from "@/proto-design-system";

export default function UserName() {
	const auth = useContext(AuthContext);
	if (!auth.user) {
		return null;
	}

	const initials = `${auth.user.firstName?.charAt(0) || ""}${auth.user.lastName?.charAt(0) || ""}`.toUpperCase();
	const fullName = `${auth.user.firstName || ""} ${auth.user.lastName || ""}`.trim();

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
			<Avatar size="sm" fallback={initials} />
			<Text size="sm" weight="medium">{fullName}</Text>
		</div>
	);
}

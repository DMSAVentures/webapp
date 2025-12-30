"use client";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";
import { Avatar } from "@/proto-design-system/components/primitives/Avatar";
import { Text } from "@/proto-design-system/components/primitives/Text";

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

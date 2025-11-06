"use client";
import React from "react";
import { SidebarProvider } from "@/contexts/sidebar";
import { PersonaProvider } from "@/contexts/persona";
import { useAuth } from "@/contexts/auth";

export function Providers({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();

	// Default to 'viewer' persona if not set
	const persona = user?.persona ?? 'viewer';

	return (
		<PersonaProvider persona={persona}>
			<SidebarProvider>{children}</SidebarProvider>
		</PersonaProvider>
	);
}

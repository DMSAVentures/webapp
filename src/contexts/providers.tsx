"use client";
import React from "react";
import { useAuth } from "@/contexts/auth";
import { PersonaProvider } from "@/contexts/persona";
import { SidebarProvider } from "@/contexts/sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();

	// Default to 'admin' persona for development
	const persona = user?.persona ?? "admin";

	return (
		<PersonaProvider persona={persona}>
			<SidebarProvider>{children}</SidebarProvider>
		</PersonaProvider>
	);
}

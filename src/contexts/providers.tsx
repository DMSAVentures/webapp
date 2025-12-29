"use client";
import React from "react";
import { useAuth } from "@/contexts/auth";
import { GlobalBannerProvider } from "@/contexts/globalBanner";
import { PersonaProvider } from "@/contexts/persona";
import { SidebarProvider } from "@/contexts/sidebar";
import { TierProvider } from "@/contexts/tier";

export function Providers({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();

	// Default to 'admin' persona for development
	const persona = user?.persona ?? "admin";

	return (
		<GlobalBannerProvider>
			<TierProvider>
				<PersonaProvider persona={persona}>
					<SidebarProvider>{children}</SidebarProvider>
				</PersonaProvider>
			</TierProvider>
		</GlobalBannerProvider>
	);
}

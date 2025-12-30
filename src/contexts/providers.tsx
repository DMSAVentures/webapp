"use client";
import React from "react";
import { useAuth } from "@/contexts/auth";
import { GlobalBannerProvider } from "@/contexts/globalBanner";
import { PersonaProvider } from "@/contexts/persona";
import { SidebarProvider } from "@/contexts/sidebar";
import { TierProvider } from "@/contexts/tier";
import { ThemeProvider } from "@/proto-design-system";

export function Providers({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();

	// Default to 'admin' persona for development
	const persona = user?.persona ?? "admin";

	return (
		<ThemeProvider defaultTheme="neon">
			<GlobalBannerProvider>
				<TierProvider>
					<PersonaProvider persona={persona}>
						<SidebarProvider>{children}</SidebarProvider>
					</PersonaProvider>
				</TierProvider>
			</GlobalBannerProvider>
		</ThemeProvider>
	);
}

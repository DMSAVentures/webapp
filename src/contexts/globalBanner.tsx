import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";

export interface GlobalBannerItem {
	id: string;
	type: "success" | "error" | "warning" | "info" | "feature";
	title: string;
	description?: string;
	dismissible?: boolean;
	duration?: number; // Auto-dismiss after ms, 0 = no auto-dismiss
}

interface GlobalBannerContextValue {
	banners: GlobalBannerItem[];
	showBanner: (banner: Omit<GlobalBannerItem, "id">) => string;
	showBannerOnce: (
		key: string,
		banner: Omit<GlobalBannerItem, "id">,
	) => string | null;
	dismissBanner: (id: string) => void;
	clearAllBanners: () => void;
	resetShownBanners: (keyPrefix?: string) => void;
}

const GlobalBannerContext = createContext<GlobalBannerContextValue | null>(
	null,
);

let bannerId = 0;
const generateId = () => `banner-${++bannerId}`;

export function GlobalBannerProvider({ children }: { children: ReactNode }) {
	const [banners, setBanners] = useState<GlobalBannerItem[]>([]);
	const shownBannersRef = useRef<Set<string>>(new Set());

	const dismissBanner = useCallback((id: string) => {
		setBanners((prev) => prev.filter((b) => b.id !== id));
	}, []);

	const showBanner = useCallback(
		(banner: Omit<GlobalBannerItem, "id">) => {
			const id = generateId();
			const newBanner: GlobalBannerItem = {
				...banner,
				id,
				dismissible: banner.dismissible ?? true,
				duration: banner.duration ?? 5000, // Default 5 seconds
			};

			setBanners((prev) => [...prev, newBanner]);

			// Auto-dismiss after duration (if duration > 0)
			if (newBanner.duration && newBanner.duration > 0) {
				setTimeout(() => {
					dismissBanner(id);
				}, newBanner.duration);
			}

			return id;
		},
		[dismissBanner],
	);

	const showBannerOnce = useCallback(
		(key: string, banner: Omit<GlobalBannerItem, "id">) => {
			if (shownBannersRef.current.has(key)) {
				return null;
			}
			shownBannersRef.current.add(key);
			return showBanner(banner);
		},
		[showBanner],
	);

	const clearAllBanners = useCallback(() => {
		setBanners([]);
	}, []);

	const resetShownBanners = useCallback((keyPrefix?: string) => {
		if (keyPrefix) {
			const keysToRemove = Array.from(shownBannersRef.current).filter((k) =>
				k.startsWith(keyPrefix),
			);
			for (const key of keysToRemove) {
				shownBannersRef.current.delete(key);
			}
		} else {
			shownBannersRef.current.clear();
		}
	}, []);

	return (
		<GlobalBannerContext.Provider
			value={{
				banners,
				showBanner,
				showBannerOnce,
				dismissBanner,
				clearAllBanners,
				resetShownBanners,
			}}
		>
			{children}
		</GlobalBannerContext.Provider>
	);
}

export function useGlobalBanner() {
	const context = useContext(GlobalBannerContext);
	if (!context) {
		throw new Error(
			"useGlobalBanner must be used within a GlobalBannerProvider",
		);
	}
	return context;
}

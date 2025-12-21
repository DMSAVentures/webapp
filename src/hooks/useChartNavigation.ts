import { useCallback, useMemo, useState } from "react";
import type { AnalyticsPeriod } from "@/types/api.types";

export interface DateRange {
	from: Date;
	to: Date;
}

export interface ChartNavigationParams {
	period: AnalyticsPeriod;
	from: string;
	to: string;
}

export interface UseChartNavigationReturn {
	period: AnalyticsPeriod;
	dateRange: DateRange;
	params: ChartNavigationParams;
	canGoForward: boolean;
	handlePeriodChange: (newPeriod: AnalyticsPeriod) => void;
	handleNavigate: (direction: "back" | "forward") => void;
}

/**
 * Get the default date range based on period
 */
const getDefaultDateRange = (period: AnalyticsPeriod): DateRange => {
	const now = new Date();
	const to = new Date(now);
	to.setHours(23, 59, 59, 999);

	const from = new Date(now);
	switch (period) {
		case "hour":
			from.setHours(0, 0, 0, 0);
			break;
		case "day":
			from.setDate(from.getDate() - 30);
			from.setHours(0, 0, 0, 0);
			break;
		case "week":
			from.setDate(from.getDate() - 12 * 7);
			from.setHours(0, 0, 0, 0);
			break;
		case "month":
			from.setMonth(from.getMonth() - 12);
			from.setDate(1);
			from.setHours(0, 0, 0, 0);
			break;
	}
	return { from, to };
};

/**
 * Navigate date range based on period and direction
 */
const navigateDateRange = (
	current: DateRange,
	period: AnalyticsPeriod,
	direction: "back" | "forward",
): DateRange => {
	const multiplier = direction === "back" ? -1 : 1;
	const from = new Date(current.from);
	const to = new Date(current.to);

	switch (period) {
		case "hour":
			from.setDate(from.getDate() + multiplier);
			to.setDate(to.getDate() + multiplier);
			break;
		case "day":
			from.setDate(from.getDate() + 30 * multiplier);
			to.setDate(to.getDate() + 30 * multiplier);
			break;
		case "week":
			from.setDate(from.getDate() + 12 * 7 * multiplier);
			to.setDate(to.getDate() + 12 * 7 * multiplier);
			break;
		case "month":
			from.setMonth(from.getMonth() + 12 * multiplier);
			to.setMonth(to.getMonth() + 12 * multiplier);
			break;
	}
	return { from, to };
};

/**
 * Hook for managing chart navigation state (period, date range, navigation)
 */
export const useChartNavigation = (
	initialPeriod: AnalyticsPeriod = "day",
): UseChartNavigationReturn => {
	const [period, setPeriod] = useState<AnalyticsPeriod>(initialPeriod);
	const [dateRange, setDateRange] = useState<DateRange>(() =>
		getDefaultDateRange(initialPeriod),
	);

	const params = useMemo(
		() => ({
			period,
			from: dateRange.from.toISOString(),
			to: dateRange.to.toISOString(),
		}),
		[period, dateRange],
	);

	const handlePeriodChange = useCallback((newPeriod: AnalyticsPeriod) => {
		setPeriod(newPeriod);
		setDateRange(getDefaultDateRange(newPeriod));
	}, []);

	const handleNavigate = useCallback(
		(direction: "back" | "forward") => {
			setDateRange((current) => navigateDateRange(current, period, direction));
		},
		[period],
	);

	const canGoForward = useMemo(() => {
		const now = new Date();
		now.setHours(23, 59, 59, 999);
		return dateRange.to < now;
	}, [dateRange.to]);

	return {
		period,
		dateRange,
		params,
		canGoForward,
		handlePeriodChange,
		handleNavigate,
	};
};

import { X } from "lucide-react";
import { memo } from "react";
import { Badge } from "@/proto-design-system/components/primitives/Badge";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Icon } from "@/proto-design-system/components/primitives/Icon";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import type { ActiveFilter } from "@/types/users.types";
import styles from "./component.module.scss";

export interface FilterChipsProps {
	activeFilters: ActiveFilter[];
	onRemoveFilter: (filterId: string) => void;
	onClearAll: () => void;
}

export const FilterChips = memo<FilterChipsProps>(function FilterChips({
	activeFilters,
	onRemoveFilter,
	onClearAll,
}) {
	if (activeFilters.length === 0) {
		return null;
	}

	return (
		<Stack direction="row" gap="sm" align="center" wrap className={styles.root}>
			<Stack direction="row" gap="xs" wrap>
				{activeFilters.map((filter) => (
					<Stack key={filter.id} direction="row" gap="0" align="center" className={styles.chip}>
						<Badge variant="secondary" size="sm">
							{`${filter.label}: ${filter.value}`}
						</Badge>
						<button
							type="button"
							className={styles.chipRemove}
							onClick={() => onRemoveFilter(filter.id)}
							aria-label={`Remove ${filter.label} filter`}
						>
							<Icon icon={X} size="xs" />
						</button>
					</Stack>
				))}
			</Stack>
			{activeFilters.length > 1 && (
				<Button variant="secondary" size="sm" onClick={onClearAll}>
					Clear all
				</Button>
			)}
		</Stack>
	);
});

FilterChips.displayName = "FilterChips";

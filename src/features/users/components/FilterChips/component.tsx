import { memo } from "react";
import { Button } from "@/proto-design-system/components/primitives/Button";
import { Stack } from "@/proto-design-system/components/layout/Stack";
import { Tag } from "@/proto-design-system/components/primitives/Tag/Tag";
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
					<Tag
						key={filter.id}
						variant="secondary"
						size="sm"
						removable
						onRemove={() => onRemoveFilter(filter.id)}
					>
						{`${filter.label}: ${filter.value}`}
					</Tag>
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

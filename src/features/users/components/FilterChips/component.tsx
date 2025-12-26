import { memo } from "react";
import { Button } from "@/proto-design-system/Button/button";
import { Tag } from "@/proto-design-system/Tag/tag";
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
		<div className={styles.root}>
			<div className={styles.chips}>
				{activeFilters.map((filter) => (
					<Tag
						key={filter.id}
						state="active"
						removeable
						onRemove={() => onRemoveFilter(filter.id)}
					>
						{`${filter.label}: ${filter.value}`}
					</Tag>
				))}
			</div>
			{activeFilters.length > 1 && (
				<Button variant="secondary" size="small" onClick={onClearAll}>
					Clear all
				</Button>
			)}
		</div>
	);
});

FilterChips.displayName = "FilterChips";

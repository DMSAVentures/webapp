import { memo } from "react";
import { Button, Badge } from "@/proto-design-system";
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
					<span key={filter.id} className={styles.chip}>
						<Badge variant="secondary" size="sm">
							{`${filter.label}: ${filter.value}`}
						</Badge>
						<button
							type="button"
							className={styles.chipRemove}
							onClick={() => onRemoveFilter(filter.id)}
							aria-label={`Remove ${filter.label} filter`}
						>
							<i className="ri-close-line" aria-hidden="true" />
						</button>
					</span>
				))}
			</div>
			{activeFilters.length > 1 && (
				<Button variant="secondary" size="sm" onClick={onClearAll}>
					Clear all
				</Button>
			)}
		</div>
	);
});

FilterChips.displayName = "FilterChips";

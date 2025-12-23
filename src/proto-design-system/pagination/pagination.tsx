import React, { useState } from "react";
import styles from "./pagination.module.scss";

export interface PaginationProps {
	totalPages: number;
	itemsPerPage: number;
	currentPage: number;
	style: "rounded" | "squared" | "row";
	onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = (props) => {
	const { totalPages, currentPage, style, onPageChange } = props;

	const [pageWindow, setPageWindow] = useState(1);
	const pagesToShow = 5; // Number of pages to display in the pagination control
	const maxPageWindow = Math.ceil(totalPages / pagesToShow);

	const getPageNumbers = () => {
		const start = (pageWindow - 1) * pagesToShow + 1;
		const end = Math.min(start + pagesToShow - 1, totalPages);
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	};

	const handleNextPageRange = () => {
		if (pageWindow < maxPageWindow) {
			setPageWindow(pageWindow + 1);
		}
	};

	const handlePreviousPageRange = () => {
		if (pageWindow > 1) {
			setPageWindow(pageWindow - 1);
		}
	};

	const handleToFirst = () => {
		setPageWindow(1);
		onPageChange(1);
	};

	const handleToLast = () => {
		setPageWindow(maxPageWindow);
		onPageChange(totalPages);
	};

	return (
		<div className={`${styles.pagination} ${styles[`pagination--${style}`]}`}>
			{/* First Page Button */}

			<button
				className={styles["pagination__button"]}
				disabled={currentPage === 1}
				onClick={handleToFirst}
				title="First Page"
			>
				<i
					className={`${styles["pagination__pagenumber"]} ri-arrow-left-double-fill`}
				/>
			</button>

			{/* Previous Page Range Button */}
			<button
				className={styles["pagination__button"]}
				onClick={handlePreviousPageRange}
				disabled={pageWindow === 1}
				title="Previous Page Range"
			>
				<i
					className={`${styles["pagination__pagenumber"]} ri-arrow-left-s-line`}
				/>
			</button>

			{/* Page Numbers */}

			{getPageNumbers().map((page) => (
				<button
					key={page}
					className={`${styles["pagination__button"]} ${currentPage === page ? styles["pagination__button--active"] : ""}`}
					onClick={() => onPageChange(page)}
				>
					<span className={styles["pagination__pagenumber"]}>{page}</span>
				</button>
			))}
			{/* Ellipsis for Next Page Range */}
			{pageWindow < maxPageWindow && (
				<button
					className={styles["pagination__button"]}
					onClick={handleNextPageRange}
					title="Next Page Range"
				>
					<span className={styles["pagination__pagenumber"]}>...</span>
				</button>
			)}

			{/* Next Page Range Button */}
			<button
				className={styles["pagination__button"]}
				onClick={handleNextPageRange}
				disabled={pageWindow === maxPageWindow}
				title="Next Page Range"
			>
				<i
					className={`${styles["pagination__pagenumber"]} ri-arrow-right-s-line`}
				/>
			</button>

			{/* Last Page Button */}

			<button
				className={styles["pagination__button"]}
				disabled={currentPage === totalPages}
				onClick={handleToLast}
				title="Last Page"
			>
				<i
					className={`${styles["pagination__pagenumber"]} ri-arrow-right-double-fill`}
				/>
			</button>
		</div>
	);
};

export default Pagination;

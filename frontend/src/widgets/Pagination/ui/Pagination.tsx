import { classNames as cn } from 'shared/lib';
import classes from './Pagination.module.css';
import { NavLink } from 'react-router-dom';
import { memo } from 'react';

type Props = {
	currentPage: number;
	itemsCount: number;
	pageSize: number;
	onPageChange?: (page: number) => void;
	href?: string;
};

const Pagination = ({
	currentPage,
	itemsCount,
	pageSize,
	onPageChange,
	href,
}: Props) => {
	return (
		<nav>
			<ul className={classes.pagination}>
				{Math.ceil(itemsCount / pageSize) > 1 &&
					new Array(Math.ceil(itemsCount / pageSize))
						.fill(0)
						.map((_, index) => index + 1)
						.map((pageNum) => (
							<li
								key={pageNum}
								className={cn(
									classes.page_item,
									{
										[classes.active_page]: pageNum === currentPage,
									},
									[],
								)}
							>
								{href ? (
									<NavLink
										aria-label={`Go to page number ${pageNum}`}
										to={`${href}?page=${pageNum}`}
										onClick={(e) => {
											if (onPageChange) {
												e.preventDefault();
												onPageChange(pageNum);
											}
										}}
									>
										{pageNum}
									</NavLink>
								) : (
									<button
										onClick={() => {
											if (onPageChange && !href) {
												onPageChange(pageNum);
											}
										}}
										onKeyDown={(e) => {
											if (e.key === ' ' || e.code === 'Space') {
												if (onPageChange && !href) {
													onPageChange(pageNum);
												}
											}
										}}
									>
										pageNum
									</button>
								)}
							</li>
						))}
			</ul>
		</nav>
	);
};

export default memo(Pagination);

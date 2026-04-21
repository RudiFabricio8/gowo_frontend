import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.wrapper} id="pagination">
      <button
        className={styles.btn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        id="pagination-prev"
      >
        ←
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`${styles.btn} ${page === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(page)}
          id={`pagination-page-${page}`}
        >
          {page}
        </button>
      ))}
      <button
        className={styles.btn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        id="pagination-next"
      >
        →
      </button>
    </div>
  );
}

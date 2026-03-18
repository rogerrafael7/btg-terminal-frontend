import Link from "next/link";

type PaginationProps = {
  page: number;
  totalPages: number;
  createHref: (page: number) => string;
};

export function Pagination({ page, totalPages, createHref }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-[28px] border border-zinc-200 bg-white px-6 py-4 shadow-sm">
      <p className="text-sm text-zinc-600">
        Pagina {page} de {totalPages}
      </p>
      <div className="flex gap-3">
        <Link
          aria-disabled={page <= 1}
          className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 aria-disabled:pointer-events-none aria-disabled:opacity-40"
          href={createHref(page - 1)}
        >
          Anterior
        </Link>
        <Link
          aria-disabled={page >= totalPages}
          className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 aria-disabled:pointer-events-none aria-disabled:opacity-40"
          href={createHref(page + 1)}
        >
          Proxima
        </Link>
      </div>
    </div>
  );
}

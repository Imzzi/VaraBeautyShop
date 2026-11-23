import { refreshCatalog, type CatalogSnapshot } from '../lib/db';

export function CatalogNotice({ catalog }: { catalog: CatalogSnapshot }) {
  if (catalog.status === 'current') return null;
  if (catalog.status === 'loading') return <p role="status" className="vara-status">در حال دریافت کاتالوگ…</p>;
  return (
    <div className="vara-status" data-tone="warning" role="status">
      <span>{catalog.status === 'stale' && catalog.products.length
        ? 'ارتباط برقرار نشد. قیمت و موجودی نمایش‌داده‌شده ممکن است تغییر کرده باشد.'
        : 'در حال حاضر به فهرست محصولات دسترسی نداریم.'}</span>
      {catalog.updatedAt && <time dateTime={new Date(catalog.updatedAt).toISOString()}>
        آخرین دریافت {new Date(catalog.updatedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
      </time>}
      <button type="button" className="vara-button" onClick={refreshCatalog}>تلاش دوباره</button>
    </div>
  );
}

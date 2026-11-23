import { BRANDS_DATA, BrandItem } from '../data/brands';
import { getAdminAuthHeaders } from './adminAuth';

const BRANDS_LOCAL_STORAGE_KEY = 'vara_brands_catalog';
const BRANDS_MAX_AGE_MS = 60_000;
let brandsFreshUntil = 0;
let cachedBrands: BrandItem[] | null = null;
let brandsRevision = 0;
let pendingBrands: Promise<BrandItem[]> | null = null;

/**
 * Reads local cached brands or default list
 */
export function getLocalBrands(): BrandItem[] {
  if (cachedBrands) return cachedBrands;
  if (typeof window === 'undefined') return BRANDS_DATA;
  try {
    const raw = localStorage.getItem(BRANDS_LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading brands from localStorage:', err);
  }
  return BRANDS_DATA;
}

/**
 * Cache brands to localStorage and notify all window listeners
 */
export function cacheBrandsLocally(brands: BrandItem[]): void {
  cachedBrands = brands;
  brandsRevision++;
  brandsFreshUntil = Date.now() + BRANDS_MAX_AGE_MS;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BRANDS_LOCAL_STORAGE_KEY, JSON.stringify(brands));
  } catch (err) {
    console.warn('Error caching brands to localStorage:', err);
  }
  window.dispatchEvent(new CustomEvent('vara-brands-updated', { detail: brands }));
}

/**
 * Fetch brands from SQLite database with fallback to local cache
 */
export function getBrandsFromDb(): Promise<BrandItem[]> {
  if (pendingBrands) return pendingBrands;
  if (Date.now() < brandsFreshUntil) return Promise.resolve(getLocalBrands());

  const revision = brandsRevision;
  pendingBrands = fetch('/api/db/settings/brands')
    .then(async (res) => {
      if (!res.ok) return getLocalBrands();
      const data = await res.json();
      if (revision === brandsRevision && data.success && Array.isArray(data.brands) && data.brands.length > 0) {
        cacheBrandsLocally(data.brands);
        return data.brands as BrandItem[];
      }
      return getLocalBrands();
    })
    .catch(() => getLocalBrands())
    .finally(() => { pendingBrands = null; });
  return pendingBrands;
}

export function subscribeToBrands(callback: (brands: BrandItem[]) => void): () => void {
  callback(getLocalBrands());
  if (typeof window === 'undefined') return () => {};

  const handleLocalUpdate = (event: Event) => {
    const brands = (event as CustomEvent<BrandItem[]>).detail;
    callback(Array.isArray(brands) ? brands : getLocalBrands());
  };
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== BRANDS_LOCAL_STORAGE_KEY) return;
    cachedBrands = null;
    brandsRevision++;
    brandsFreshUntil = Date.now() + BRANDS_MAX_AGE_MS;
    callback(getLocalBrands());
  };
  const refreshIfVisible = () => {
    if (document.visibilityState !== 'hidden') void getBrandsFromDb();
  };

  window.addEventListener('vara-brands-updated', handleLocalUpdate);
  window.addEventListener('storage', handleStorage);
  document.addEventListener('visibilitychange', refreshIfVisible);
  void getBrandsFromDb();
  return () => {
    window.removeEventListener('vara-brands-updated', handleLocalUpdate);
    window.removeEventListener('storage', handleStorage);
    document.removeEventListener('visibilitychange', refreshIfVisible);
  };
}

/**
 * Add a new brand to both SQLite and local storage
 */
export async function addBrandToDb(newBrand: BrandItem): Promise<{ success: boolean; error?: string; brands: BrandItem[] }> {
  const currentBrands = getLocalBrands();

  const trimmedId = newBrand.id.trim();
  const trimmedEn = newBrand.labelEn.trim();
  const trimmedFa = newBrand.labelFa.trim();

  if (!trimmedEn || !trimmedFa) {
    return { success: false, error: 'لطفاً نام فارسی و انگلیسی برند را وارد کنید.', brands: currentBrands };
  }

  const isDuplicate = currentBrands.some(
    b => b.id.toLowerCase() === trimmedId.toLowerCase() ||
         b.labelEn.toLowerCase() === trimmedEn.toLowerCase() ||
         b.labelFa.trim() === trimmedFa
  );

  if (isDuplicate) {
    return { success: false, error: `برند با نام «${trimmedEn} / ${trimmedFa}» قبلاً در سیستم ثبت شده است.`, brands: currentBrands };
  }

  const brandToInsert: BrandItem = {
    id: trimmedId || trimmedEn,
    labelFa: trimmedFa,
    labelEn: trimmedEn
  };

  const updatedBrands = [...currentBrands, brandToInsert].sort((a, b) => 
    a.labelFa.localeCompare(b.labelFa, 'fa')
  );

  return saveBrandChanges(currentBrands, updatedBrands);
}

/**
 * Delete a brand from SQLite and local storage
 */
export async function deleteBrandFromDb(brandId: string): Promise<{ success: boolean; error?: string; brands: BrandItem[] }> {
  const currentBrands = getLocalBrands();
  const targetIndex = currentBrands.findIndex(b => b.id === brandId);

  if (targetIndex === -1) {
    return { success: false, error: 'برند مورد نظر در سیستم یافت نشد.', brands: currentBrands };
  }

  const updatedBrands = currentBrands.filter(b => b.id !== brandId);
  return saveBrandChanges(currentBrands, updatedBrands);
}

/**
 * Update an existing brand in SQLite and local storage
 */
export async function updateBrandInDb(updatedBrand: BrandItem): Promise<{ success: boolean; error?: string; brands: BrandItem[] }> {
  const currentBrands = getLocalBrands();
  const targetIndex = currentBrands.findIndex(b => b.id === updatedBrand.id);

  if (targetIndex === -1) {
    return { success: false, error: 'برند مورد نظر در سیستم یافت نشد.', brands: currentBrands };
  }

  const updatedBrands = [...currentBrands];
  updatedBrands[targetIndex] = updatedBrand;

  return saveBrandChanges(currentBrands, updatedBrands);
}

/**
 * Reset brands to default curated catalog in SQLite and local storage
 */
export async function resetBrandsToDefaultDb(): Promise<BrandItem[]> {
  return persistBrands(BRANDS_DATA);
}

async function saveBrandChanges(currentBrands: BrandItem[], updatedBrands: BrandItem[]) {
  try {
    return { success: true, brands: await persistBrands(updatedBrands) };
  } catch (error) {
    return {
      success: false, brands: currentBrands,
      error: error instanceof Error ? error.message : 'ذخیره برندها انجام نشد.',
    };
  }
}

async function persistBrands(brands: BrandItem[]): Promise<BrandItem[]> {
  const res = await fetch('/api/db/settings/brands', {
    method: 'POST',
    headers: getAdminAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ brands }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.success !== true || !Array.isArray(data.brands)) {
    if (res.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vara-admin-session-expired'));
    }
    throw new Error(data?.error || 'ذخیره برندها انجام نشد.');
  }
  cacheBrandsLocally(data.brands);
  return data.brands;
}

import fs from 'node:fs';
import path from 'node:path';
import type { Express, Request, Response } from 'express';
import { ProductsDb, SettingsDb } from './serverDb';
import { escapeHtml } from './serverSecurity';
import { BRANDS_DATA } from './src/data/brands';
import { POLICY_DOCUMENTS } from './src/data/policies';
import { BUILT_INDEX_HTML } from './src/generated/indexHtmlTemplate';
import {
  CANONICAL_ORIGIN,
  buildCalculatorSeo,
  buildOrganizationSchema,
  buildProductSeo,
  parseShopFilterFromSearch,
  resolveShopSeo,
} from './src/lib/seoMetadata';
import type { Product } from './src/types';

let cachedTemplateHtml: string | null = null;

function isServerlessOrProd(): boolean {
  return Boolean(
    process.env.NODE_ENV === 'production' ||
      process.env.VERCEL ||
      process.env.VERCEL_ENV ||
      process.env.AWS_LAMBDA_FUNCTION_NAME
  );
}

function getTemplateHtml(): string | null {
  if (cachedTemplateHtml) return cachedTemplateHtml;
  const distHtml = path.join(process.cwd(), 'dist', 'index.html');
  const rootHtml = path.join(process.cwd(), 'index.html');

  let html: string | null = null;
  if (fs.existsSync(distHtml)) {
    html = fs.readFileSync(distHtml, 'utf8');
  } else if (BUILT_INDEX_HTML && BUILT_INDEX_HTML.trim().length > 0) {
    html = BUILT_INDEX_HTML;
  } else if (fs.existsSync(rootHtml)) {
    html = fs.readFileSync(rootHtml, 'utf8');
  }

  if (!html) return null;
  if (isServerlessOrProd() && (fs.existsSync(distHtml) || Boolean(BUILT_INDEX_HTML))) {
    cachedTemplateHtml = html;
  }
  return html;
}

function extractSearchString(req: Request): string {
  const rawUrl = req.originalUrl || req.url || '';
  const queryIdx = rawUrl.indexOf('?');
  if (queryIdx >= 0) {
    return rawUrl.slice(queryIdx);
  }
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(req.query || {})) {
    if (Array.isArray(val)) {
      for (const item of val) {
        if (typeof item === 'string') params.append(key, item);
      }
    } else if (typeof val === 'string') {
      params.set(key, val);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function safeJsonScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}

interface SeoRenderOptions {
  title: string;
  description: string;
  canonical: string | null;
  ogType?: string;
  ogImage?: string;
  noIndex?: boolean;
  schemaJson?: unknown;
  initialProduct?: Product | null;
  noscriptHtml?: string;
}

function upsertMetaByName(html: string, name: string, content: string): string {
  const escaped = escapeHtml(content);
  const re = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'][^"']*["']\\s*/?>`, 'i');
  const tag = `<meta name="${name}" content="${escaped}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}

function upsertMetaByProperty(html: string, prop: string, content: string): string {
  const escaped = escapeHtml(content);
  const re = new RegExp(`<meta\\s+property=["']${prop}["']\\s+content=["'][^"']*["']\\s*/?>`, 'i');
  const tag = `<meta property="${prop}" content="${escaped}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}

export function injectSeoIntoHtml(template: string, opts: SeoRenderOptions): string {
  const safeTitle = escapeHtml(opts.title);
  const safeRobots = opts.noIndex ? 'noindex, nofollow, noarchive, nosnippet' : 'index, follow';
  const ogType = opts.ogType || 'website';
  const ogImage = opts.ogImage || `${CANONICAL_ORIGIN}/og-image.jpg`;

  let html = template;

  html = /<title>[\s\S]*?<\/title>/i.test(html)
    ? html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`)
    : html.replace('</head>', `  <title>${safeTitle}</title>\n  </head>`);

  html = upsertMetaByName(html, 'description', opts.description);

  if (opts.canonical) {
    const safeCanonical = escapeHtml(opts.canonical);
    if (/<link\s+rel="canonical"[^>]*>/i.test(html)) {
      html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${safeCanonical}" />`);
    } else {
      html = html.replace('</head>', `  <link rel="canonical" href="${safeCanonical}" />\n  </head>`);
    }
    html = upsertMetaByProperty(html, 'og:url', opts.canonical);
  } else {
    html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/i, '');
    html = html.replace(/<meta\s+property="og:url"[^>]*>\s*/i, '');
  }

  html = upsertMetaByName(html, 'robots', safeRobots);
  html = upsertMetaByName(html, 'googlebot', safeRobots);
  html = upsertMetaByProperty(html, 'og:type', ogType);
  html = upsertMetaByProperty(html, 'og:title', opts.title);
  html = upsertMetaByProperty(html, 'og:description', opts.description);
  html = upsertMetaByProperty(html, 'og:image', ogImage);
  html = upsertMetaByName(html, 'twitter:card', 'summary_large_image');
  html = upsertMetaByName(html, 'twitter:title', opts.title);
  html = upsertMetaByName(html, 'twitter:description', opts.description);
  html = upsertMetaByName(html, 'twitter:image', ogImage);

  const schemaTag =
    !opts.noIndex && opts.schemaJson
      ? `<script id="vara-ssr-jsonld" type="application/ld+json">${safeJsonScript(opts.schemaJson)}</script>`
      : '';
  if (/<script\s+id="vara-ssr-jsonld"[^>]*>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script\s+id="vara-ssr-jsonld"[^>]*>[\s\S]*?<\/script>/i, schemaTag);
  } else if (schemaTag) {
    html = html.replace('</head>', `  ${schemaTag}\n  </head>`);
  }

  if (opts.initialProduct) {
    html = html.replace(
      '</head>',
      `  <script id="vara-initial-product" type="application/json">${safeJsonScript(opts.initialProduct)}</script>\n  </head>`
    );
  }

  if (opts.noscriptHtml) {
    html = html.replace('</body>', `  <noscript>${opts.noscriptHtml}</noscript>\n  </body>`);
  }

  return html;
}

function getOrigin(req: Request): string {
  const configured = (process.env.CANONICAL_URL || process.env.SITE_URL || '').trim().replace(/\/+$/, '');
  if (configured) return configured;
  const host = (req.get('x-forwarded-host') || req.get('host') || '').trim().toLowerCase();
  if (host && (host === 'varabeauty.ir' || host.endsWith('.varabeauty.ir'))) {
    return CANONICAL_ORIGIN;
  }
  return CANONICAL_ORIGIN;
}

function sendHtml(res: Response, status: number, html: string, cacheControl: string) {
  res.status(status);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', cacheControl);
  return res.send(html);
}

export function registerSeoRoutes(app: Express) {
  // 1. Product detail page SSR SEO + real 404 for unknown IDs
  app.get('/product/:id', async (req, res, next) => {
    const template = getTemplateHtml();
    if (!template) return next();

    const origin = getOrigin(req);
    const id = String(req.params.id || '').trim();
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id)) {
      const notFoundHtml = injectSeoIntoHtml(template, {
        title: 'محصول یافت نشد | ورا بیوتی',
        description: 'محصول مورد نظر در فروشگاه ورا بیوتی یافت نشد.',
        canonical: null,
        noIndex: true,
      });
      return sendHtml(res, 404, notFoundHtml, 'public, s-maxage=30, stale-while-revalidate=60');
    }

    try {
      const product = await ProductsDb.getById(id);
      if (!product) {
        const notFoundHtml = injectSeoIntoHtml(template, {
          title: 'محصول یافت نشد | ورا بیوتی',
          description: 'محصول مورد نظر در فروشگاه ورا بیوتی یافت نشد یا ناموجود است.',
          canonical: null,
          noIndex: true,
        });
        return sendHtml(res, 404, notFoundHtml, 'public, s-maxage=30, stale-while-revalidate=60');
      }

      const productSeo = buildProductSeo(product, origin);
      const schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          buildOrganizationSchema(origin),
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: `${origin}/` },
              { '@type': 'ListItem', position: 2, name: 'فروشگاه', item: `${origin}/shop` },
              { '@type': 'ListItem', position: 3, name: product.nameFa, item: productSeo.canonical },
            ],
          },
          productSeo.productSchema,
        ],
      };

      const noscriptHtml = `<main dir="rtl"><h1>${escapeHtml(product.nameFa)}</h1>${
        product.brand ? `<p>برند: ${escapeHtml(product.brand)}</p>` : ''
      }<p>قیمت: ${escapeHtml((product.price || 0).toLocaleString('fa-IR'))} تومان</p><p>${escapeHtml(
        product.descriptionFa || productSeo.description
      )}</p></main>`;

      const html = injectSeoIntoHtml(template, {
        title: productSeo.title,
        description: productSeo.description,
        canonical: productSeo.canonical,
        ogType: 'product',
        ogImage: productSeo.ogImage,
        schemaJson,
        initialProduct: product,
        noscriptHtml,
      });
      return sendHtml(res, 200, html, 'public, s-maxage=60, stale-while-revalidate=300');
    } catch {
      return next();
    }
  });

  // 2. Shop & indexable Category / Department / Brand landing pages
  app.get('/shop', async (req, res, next) => {
    const template = getTemplateHtml();
    if (!template) return next();

    try {
      const origin = getOrigin(req);
      const search = extractSearchString(req);
      const preset = parseShopFilterFromSearch(search);
      const brands = await SettingsDb.get('brands', BRANDS_DATA).catch(() => BRANDS_DATA);
      const shopSeo = resolveShopSeo(preset, Array.isArray(brands) ? brands : BRANDS_DATA, origin);

      const breadcrumbItems = [
        { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'فروشگاه محصولات', item: `${origin}/shop` },
      ];
      if (shopSeo.canonical !== `${origin}/shop`) {
        breadcrumbItems.push({ '@type': 'ListItem', position: 3, name: shopSeo.breadcrumbLabel, item: shopSeo.canonical });
      }

      const schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          buildOrganizationSchema(origin),
          { '@type': 'BreadcrumbList', itemListElement: breadcrumbItems },
          {
            '@type': 'CollectionPage',
            name: shopSeo.h1,
            description: shopSeo.description,
            url: shopSeo.canonical,
          },
        ],
      };

      const html = injectSeoIntoHtml(template, {
        title: shopSeo.title,
        description: shopSeo.description,
        canonical: shopSeo.canonical,
        schemaJson,
        noscriptHtml: `<main dir="rtl"><h1>${escapeHtml(shopSeo.h1)}</h1><p>${escapeHtml(shopSeo.subtitle)}</p></main>`,
      });
      return sendHtml(res, 200, html, 'public, s-maxage=60, stale-while-revalidate=300');
    } catch {
      return next();
    }
  });

  // 3. International Price Calculator with FAQPage schema
  app.get('/calculator', (req, res, next) => {
    const template = getTemplateHtml();
    if (!template) return next();

    const origin = getOrigin(req);
    const calcSeo = buildCalculatorSeo(origin);
    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        buildOrganizationSchema(origin),
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'محاسبه‌گر قیمت خرید خارجی', item: calcSeo.canonical },
          ],
        },
        calcSeo.faqSchema,
      ],
    };

    const html = injectSeoIntoHtml(template, {
      title: calcSeo.title,
      description: calcSeo.description,
      canonical: calcSeo.canonical,
      schemaJson,
      noscriptHtml: `<main dir="rtl"><h1>محاسبه‌گر قیمت خرید از سفورا دبی، آمازون امارات و ترندیول</h1><p>${escapeHtml(
        calcSeo.description
      )}</p></main>`,
    });
    return sendHtml(res, 200, html, 'public, s-maxage=300, stale-while-revalidate=600');
  });

  // 4. Static informational pages (/contact, /return-policy, /terms)
  const staticSeoRoutes: Array<{ path: string; title: string; description: string; breadcrumb: string }> = [
    {
      path: '/contact',
      title: 'تماس با ما | پشتیبانی و مشاوره تخصصی ورا بیوتی',
      description: 'ارتباط مستقیم با پشتیبانی ورا بیوتی، مشاوره تخصصی خرید محصولات مراقبت از پوست از امارات و پیگیری سفارشات.',
      breadcrumb: 'تماس با ما',
    },
    {
      path: '/return-policy',
      title: POLICY_DOCUMENTS['return-policy'].pageTitle,
      description: POLICY_DOCUMENTS['return-policy'].metaDescription,
      breadcrumb: 'شرایط بازگشت و استرداد وجه',
    },
    {
      path: '/terms',
      title: POLICY_DOCUMENTS.terms.pageTitle,
      description: POLICY_DOCUMENTS.terms.metaDescription,
      breadcrumb: 'قوانین و مقررات خرید',
    },
  ];

  for (const route of staticSeoRoutes) {
    app.get(route.path, (req, res, next) => {
      const template = getTemplateHtml();
      if (!template) return next();
      const origin = getOrigin(req);
      const canonical = `${origin}${route.path}`;
      const schemaJson = {
        '@context': 'https://schema.org',
        '@graph': [
          buildOrganizationSchema(origin),
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'صفحه اصلی', item: `${origin}/` },
              { '@type': 'ListItem', position: 2, name: route.breadcrumb, item: canonical },
            ],
          },
        ],
      };
      const html = injectSeoIntoHtml(template, {
        title: route.title,
        description: route.description,
        canonical,
        schemaJson,
      });
      return sendHtml(res, 200, html, 'public, s-maxage=3600, stale-while-revalidate=86400');
    });
  }
}

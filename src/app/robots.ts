import type { MetadataRoute } from "next";
import { INDEXABLE, SITE } from "@/content/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // prévia: nada é indexado (evita que o Google veja o domínio de prévia e depois o oficial como duplicado)
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE.url}sitemap.xml` };
}

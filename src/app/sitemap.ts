import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { SERVICES } from "@/content/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "servicos/",
    ...SERVICES.map((s) => `servicos/${s.slug}/`),
    "o-salao/",
    "avaliacoes/",
    "agendar/",
    "contato/",
  ];
  return paths.map((p) => ({ url: `${SITE.url}${p}`, lastModified: new Date() }));
}

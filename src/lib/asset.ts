const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Aplica o basePath a caminhos de public/ (imagens, vídeo, logo). */
export function asset(path: string): string {
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

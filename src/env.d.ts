/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** "true" para mostrar las etiquetas TODO en un build de revisión. */
  readonly PUBLIC_SHOW_TODOS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

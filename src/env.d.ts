/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FORM_ENDPOINT?: string;
  /** Web3Forms access key (public by design). */
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
  /** Older name for the same key; still honoured. */
  readonly PUBLIC_FORM_ACCESS_KEY?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

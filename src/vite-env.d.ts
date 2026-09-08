/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the ArtisanAI voice microservice. Defaults to http://localhost:8000. */
  readonly VITE_AI_SERVICE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

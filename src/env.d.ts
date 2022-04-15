// env.d.ts
interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_API_HOST: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

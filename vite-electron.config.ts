import {join} from 'path'
import {defineConfig} from 'vite-plugin-electron'

export default defineConfig({
  main: {
    entry: 'electron/main/index.ts',
    vite: {
      build: {
        outDir: 'app/dist/electron/main'
      }
    }
  },
  preload: {
    // Must be use absolute path, this is the limit of rollup
    input: join(__dirname, 'electron/preload/index.ts'),
    vite: {
      build: {
        outDir: 'app/dist/electron/preload'
      }
    }
  },
})

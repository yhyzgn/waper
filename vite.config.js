import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import {createStyleImportPlugin, ElementPlusResolve} from 'vite-plugin-style-import'

import electron from 'vite-plugin-electron'
import electronRenderer from 'vite-plugin-electron/renderer'
import electronConfig from './vite-electron.config'

// https://github.com/vuejs/rfcs/pull/227
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      refTransform: true,
      reactivityTransform: true
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      // 配置文件生成位置
      dts: '.gen/auto-import.d.ts',
      // ui库解析器
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ]
    }),
    Components({
      // 指定组件位置，默认是src/components
      dirs: ['src/components'],
      // 搜索子目录
      deep: true,
      // 组件的有效文件扩展名
      extensions: ['vue'],
      // 配置文件生成位置
      dts: '.gen/components.d.ts',
      // 需要 Babel 来为 Vue 2 进行转换，出于性能考虑，它默认处于禁用状态。
      directives: true,
      // ui库解析器
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ]
    }),
    createStyleImportPlugin({
      // ui库解析器
      resolvers: [
        ElementPlusResolve()
      ],
      // 自定义规则
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          ensureStyleFile: true,
          resolveStyle: (name) => {
            name = name.substring(3, name.length)
            return `element-plus/theme-chalk/src/${name}.scss`
          }
        }
      ]
    }),
    electron(electronConfig),
    electronRenderer()
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.json', '.sass', '.scss', '.less'],
    alias: {
      '@': resolve(__dirname, '.', 'src'),
      '~': resolve(__dirname, 'src', 'assets')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        // 导入全局 scss
        additionalData: `@use "~/css/theme.scss" as *;`
      }
    }
  },
  optimizeDeps: {
    include: ['element-plus', '@element-plus/icons-vue']
  },
  build: {
    outDir: 'app/dist',
    minify: 'esbuild',
    emptyOutDir: false,
    rollupOptions: {
      output: {}
    }
  },
  // https://github.com/vitejs/vite/issues/3369
  server: {
    port: 3004,
    proxy: {
      '/api': {
        target: 'https://wallhaven.cc',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
})

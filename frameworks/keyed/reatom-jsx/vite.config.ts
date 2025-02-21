import { defineConfig } from 'vite'

export default defineConfig({
  base: '/frameworks/keyed/reatom-jsx/dist/',
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'hf',
    jsxInject: `import { h, hf } from '@reatom/jsx'`,
  },
})

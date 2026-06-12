import js from '@eslint/js'
import globals from 'globals'
import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

const nodeFiles = [
  'eslint.config.mjs',
  'vite.config.ts',
  'prerender.ts',
  'scripts/**/*.mjs',
]

export default tseslint.config(
  {
    ignores       : [
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'tmp/**',
    ],
    linterOptions : {
      reportUnusedDisableDirectives : 'error',
    },
  },
  {
    files   : ['src/**/*.{ts,vue}'],
    extends : [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...vue.configs['flat/essential'],
    ],
    languageOptions : {
      ecmaVersion   : 'latest',
      sourceType    : 'module',
      globals       : globals.browser,
      parserOptions : {
        parser : tseslint.parser,
      },
    },
    rules : {
      '@typescript-eslint/consistent-type-imports' : [
        'error',
        { prefer : 'type-imports' },
      ],
      'no-debugger'                    : 'error',
      'prefer-const'                   : 'error',
      'vue/multi-word-component-names' : 'off',
    },
  },
  {
    files   : nodeFiles,
    extends : [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions : {
      ecmaVersion : 'latest',
      sourceType  : 'module',
      globals     : globals.node,
    },
    rules : {
      '@typescript-eslint/consistent-type-imports' : [
        'error',
        { prefer : 'type-imports' },
      ],
      'no-debugger'  : 'error',
      'prefer-const' : 'error',
    },
  },
)

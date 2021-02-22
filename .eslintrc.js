module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true
  },
  extends: [
    "plugin:vue/essential",
    // bit full on for me - trying base
    //"plugin:vue/recommended",
    "eslint:recommended",
    "prettier/vue",
    "plugin:prettier/recommended"
  ],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module"
  },
  plugins: ["vue"],
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-unused-vars": ["error", { args: "none" }],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "max-len": [
      2,
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignorePattern: 'd="([\\s\\S]*?)"'
      }
    ]
  },
  globals: {
    gtag: "readonly",
    PIXI: "readonly",
    gsap: "readonly",
    lottie: "readonly"
  }
};

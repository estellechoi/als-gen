module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      "eslint:recommended",
    ],
    plugins: ["prettier"],
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2020,
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      // https://github.com/prettier/eslint-plugin-prettier#options
      "prettier/prettier": [
        "error", 
        {}, 
        { usePrettierrc: true, }
      ],
    },
  };
export default {
  "roots": [
    "<rootDir>"
  ],
  "testMatch": [
    "<rootDir>/__tests__/**/*.+(ts|tsx|js)",
    "<rootDir>/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}

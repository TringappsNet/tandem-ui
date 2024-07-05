import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageReporters: ['text', 'lcov', 'clover'],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
};

export default config;

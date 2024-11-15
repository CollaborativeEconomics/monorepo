export let collectCoverage: boolean;
export let coverageProvider: string;
export let rootDir: string;
export let coverageReporters: string[];
export let moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": string;
    "^.+\\.(css|sass|scss)$": string;
    "^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$": string;
    "^@/components/(.*)$": string;
    "server-only": string;
};
export let testPathIgnorePatterns: string[];
export let testEnvironment: string;
export let transform: {
    "^.+\\.(js|jsx|ts|tsx)$": (string | {
        presets: string[];
    })[];
};
export let transformIgnorePatterns: string[];
export let silent: boolean;
//# sourceMappingURL=jest.config.d.ts.map
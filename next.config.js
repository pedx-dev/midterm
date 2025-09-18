/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    typescript: {
        // Set to true to skip type checking during the build
        ignoreBuildErrors:  true
    },

    eslint: {
        // Set to true to skip linting during the build
        ignoreDuringBuilds: true
    },
};

export default config;

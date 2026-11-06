// ** Config
/**
 * Path prefix the site is served under: "" on the dev server, "/Hong" in a
 * production build (GitHub Pages serves the site at /Hong — keep this in sync
 * with `basePath` in `next.config.ts`).
 *
 * It is derived from `process.env.NODE_ENV`, which Next.js inlines as a
 * literal in both the server and client bundles, so it is identical on both
 * sides (no hydration mismatch) and does not depend on any `env` entry in
 * the Next config being honoured by the build environment. It must be
 * written exactly as `process.env.NODE_ENV` (no optional chaining) for that
 * inlining to apply.
 */
const basePath = process.env.NODE_ENV === "development" ? "" : "/Hong";

export { basePath };

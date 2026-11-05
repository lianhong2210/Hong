// ** Config
/**
 * `BASE_PATH` is injected by `next.config.ts` (`env.BASE_PATH`) — "" in dev,
 * "/Hong" in production. Next.js only inlines the exact expression
 * `process.env.BASE_PATH` into the client bundle, so it must not be written
 * with optional chaining (`process?.env?.BASE_PATH`): that form is left
 * untouched on the client, evaluates to `undefined` there, and causes a
 * server/client hydration mismatch.
 */
const basePath = process.env.BASE_PATH ?? "";

export { basePath };

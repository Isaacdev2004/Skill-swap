import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

function getBackendDir() {
  const cwd = process.cwd();
  const nested = resolve(cwd, "backend");

  if (existsSync(resolve(nested, "package.json"))) {
    return nested;
  }

  if (existsSync(resolve(cwd, "package.json")) && existsSync(resolve(cwd, "src/index.ts"))) {
    return cwd;
  }

  return nested;
}

function run(command, cwd = process.cwd()) {
  execSync(command, {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
      // Render sets NODE_ENV=production which skips devDependencies (typescript, @types/*)
      NPM_CONFIG_PRODUCTION: "false",
      NODE_ENV: "development",
    },
  });
}

if (process.env.RENDER) {
  const backendDir = getBackendDir();
  console.log(`Render detected — building backend at ${backendDir}`);
  run("npm install --include=dev", backendDir);
  run("npm run build", backendDir);
} else {
  run("pnpm run typecheck && pnpm -r --if-present run build");
}

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

if (process.env.RENDER) {
  const backendDir = getBackendDir();
  console.log(`Render detected — starting backend at ${backendDir}`);
  execSync("npm start", {
    cwd: backendDir,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });
} else {
  console.error("Start the backend locally with: cd backend && npm run dev");
  process.exit(1);
}

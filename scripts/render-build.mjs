import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const backendDir = resolve(process.cwd(), "backend");

function run(command: string, cwd = process.cwd()) {
  execSync(command, { cwd, stdio: "inherit", env: process.env });
}

if (process.env.RENDER && existsSync(backendDir)) {
  console.log("Render detected — building SkillSwap backend only");
  run("npm install", backendDir);
  run("npm run build", backendDir);
} else {
  run("pnpm run typecheck && pnpm -r --if-present run build");
}

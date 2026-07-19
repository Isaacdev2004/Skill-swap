import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const backendDir = resolve(process.cwd(), "backend");

if (process.env.RENDER && existsSync(backendDir)) {
  console.log("Render detected — starting SkillSwap backend");
  execSync("npm start", { cwd: backendDir, stdio: "inherit", env: process.env });
} else {
  console.error("Start the backend locally with: cd backend && npm run dev");
  process.exit(1);
}

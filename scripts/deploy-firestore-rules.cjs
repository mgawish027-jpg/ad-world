const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT_JSON in the Vercel production environment.");
  process.exit(1);
}

let credentials;
try {
  credentials = JSON.parse(raw);
} catch {
  console.error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.");
  process.exit(1);
}

if (
  credentials.type !== "service_account" ||
  credentials.project_id !== "souq-2db97" ||
  !credentials.client_email ||
  !credentials.private_key
) {
  console.error("Firebase service account credentials are incomplete or for the wrong project.");
  process.exit(1);
}

const credentialsPath = path.join(os.tmpdir(), "souq-firebase-service-account.json");
try {
  fs.writeFileSync(credentialsPath, JSON.stringify(credentials), { mode: 0o600 });
  const result = spawnSync(
    "npx",
    ["--yes", "firebase-tools", "deploy", "--only", "firestore:rules", "--project", "souq-2db97", "--non-interactive"],
    {
      stdio: "inherit",
      env: { ...process.env, GOOGLE_APPLICATION_CREDENTIALS: credentialsPath },
    }
  );
  if (result.error) throw result.error;
  process.exitCode = result.status === null ? 1 : result.status;
} finally {
  try { fs.rmSync(credentialsPath, { force: true }); } catch {}
}

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const PROJECT_ID = "souq-2db97";

function getAdminAuth() {
  if (getApps().length) return getAuth();
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  const serviceAccount = JSON.parse(raw);
  if (serviceAccount.project_id !== PROJECT_ID) {
    throw new Error("Firebase service account project mismatch");
  }
  initializeApp({
    credential: cert(serviceAccount),
    projectId: PROJECT_ID
  });
  return getAuth();
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: "Missing Firebase ID token" });

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(match[1]);
    if (!decoded.uid || decoded.firebase?.sign_in_provider === "anonymous") {
      return res.status(403).json({ error: "A registered account is required" });
    }

    const userRecord = await auth.getUser(decoded.uid);
    const existingClaims = userRecord.customClaims || {};
    if (existingClaims.role === "authenticated") {
      return res.status(200).json({ ok: true, changed: false });
    }

    await auth.setCustomUserClaims(decoded.uid, {
      ...existingClaims,
      role: "authenticated"
    });
    return res.status(200).json({ ok: true, changed: true });
  } catch (error) {
    console.error("Supabase role claim sync failed:", error.message);
    return res.status(500).json({ error: "Could not sync account permissions" });
  }
};

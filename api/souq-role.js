const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

function firebaseAdmin() {
  if (getApps().length) return getApps()[0];
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Firebase Admin credentials are not configured.");
  const serviceAccount = JSON.parse(raw);
  return initializeApp({ credential: cert(serviceAccount) });
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Missing Firebase ID token." });

  try {
    const auth = getAuth(firebaseAdmin());
    const decoded = await auth.verifyIdToken(token, true);
    const user = await auth.getUser(decoded.uid);
    const claims = user.customClaims || {};
    if (claims.role === "authenticated") {
      return res.status(200).json({ ok: true, refreshToken: false });
    }
    await auth.setCustomUserClaims(decoded.uid, {
      ...claims,
      role: "authenticated"
    });
    return res.status(200).json({ ok: true, refreshToken: true });
  } catch (error) {
    console.error("SouQ role bridge failed:", error && error.code ? error.code : "unknown");
    return res.status(401).json({ error: "Firebase token could not be verified." });
  }
};

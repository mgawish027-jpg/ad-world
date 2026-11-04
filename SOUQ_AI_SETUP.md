# SouQ Gemini AI setup

This change is isolated to the `souq/` web app. It does not change Firestore rules, Authentication, or the ad publishing functions.

## Before enabling AI for users

1. In Google Cloud Console, select project `souq-2db97` and create a **Web** reCAPTCHA Enterprise score-based key. Add the deployed SouQ domains (for example `souq-2db97.web.app` and `souq-2db97.firebaseapp.com`, plus any real custom domain). Do not enable checkbox challenges.
2. In Firebase Console for project `souq-2db97`, open **App Check → Apps**, register the SouQ Web app with **reCAPTCHA Enterprise**, and enter the key created above.
3. Copy the **site key / key ID** (public key, not a secret) into `SOUQ_APP_CHECK_SITE_KEY` in `souq/index.html`. Never commit a reCAPTCHA secret or a Gemini API key.
4. Test the four assistant actions on the deployed HTTPS site while signed in: write description, improve description, analyze image, and price estimate.

The guided Firebase AI Logic setup may already enforce App Check for AI Logic. Do not turn off enforcement to work around missing attestation; register the app and configure its provider.

## Deploy only the SouQ Hosting site

This repository's root `.firebaserc` points to a different Firebase project. To avoid deploying the wrong app, use the separate SouQ config and explicitly name the project:

```bash
npm install -g firebase-tools
firebase deploy --only hosting --project souq-2db97 --config firebase.souq.json
```

The config publishes only the `souq/` directory to Hosting site `souq-2db97`. It does not deploy Firestore or Storage rules.

## Android note

The repository's existing root Capacitor config is branded AD WORLD (`com.adworld.app`) and is not a SouQ-native Android build. If the Android app is the installed SouQ PWA that opens the hosted site, the Hosting update will be picked up by the PWA after its service worker refreshes. If it is a separate APK/native Android project, it needs its own SouQ Android app registration and Firebase AI Logic/App Check setup before shipping.

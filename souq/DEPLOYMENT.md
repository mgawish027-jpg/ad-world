# SouQ test deployment

This project uses the Firebase project `souq-2db97`. Keep SouQ deployment separate from the repository-root AD WORLD Firebase configuration.

## Before deploying

1. In Firebase Console, open project `souq-2db97`.
2. Confirm **Storage** is initialized and a default bucket exists. The app currently expects `souq-2db97.firebasestorage.app`.
3. Confirm **Authentication → Sign-in method → Email/Password** is enabled.
4. Confirm **Authentication → Settings → Authorized domains** contains the domain used for the test site.
5. Check the Firestore rules currently deployed to `souq-2db97`. Do not deploy the repository-root `firestore.rules`: that file is documented for the separate AD WORLD project `ad-world-37f9b`.

## Deploy only SouQ Storage rules

From the repository root, after installing Firebase CLI and signing in with an account that has access to `souq-2db97`:

```sh
firebase deploy --only storage --project souq-2db97 --config firebase.souq.json
```

This command deploys only `souq/storage.rules`. It does not deploy Hosting or Firestore rules.

## Deploy the SouQ website after Storage is ready

```sh
firebase deploy --only hosting --project souq-2db97 --config firebase.souq.json
```

## Smoke test

- Sign in with a normal Email/Password account.
- Publish a listing with one small image.
- Open the same listing in a second browser/device and confirm the image loads.
- Edit the listing without selecting a new image; confirm its existing image remains.
- Try uploading an image while signed out; it must fail.
- Confirm a normal user cannot overwrite another user's Storage path.

## Still needs separate verification

The admin UI currently reads `users/{uid}.role` from Firestore. This repository does not contain the Firestore rules deployed to `souq-2db97`, so admin access must not be changed or treated as secure until those exact project rules are inspected. The root `firestore.rules` belongs to AD WORLD and must not be deployed to SouQ.

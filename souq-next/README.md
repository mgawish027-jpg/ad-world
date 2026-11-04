# SouQ Next

New isolated rebuild of SouQ. The existing production app in `souq/` is intentionally untouched.

## Stack
- React 19.3.1 + TypeScript 7
- Vite 8
- Firebase modular SDK 13.2.0 (integration is not enabled until configuration and security review)
- Arabic-first RTL responsive UI

## Local development
Requires Node.js 22.12+.
1. Copy `.env.example` to `.env.local`.
2. Fill Firebase web-app configuration from the SouQ Firebase project.
3. Run `npm install`, then `npm run dev`.

## Safety status
This is a UI foundation only. Authentication, database access, uploads, AI, admin tools and Android packaging are not connected yet. No production Firebase rules or hosting deployment are triggered by this project. Never put service-account credentials or private API keys in `VITE_*` variables.

## Architecture direction
Feature modules will be added behind typed service boundaries. Privileged operations belong in server-side Cloud Functions; Firestore and Storage access must be denied by default and covered by emulator-based rules tests before production use.

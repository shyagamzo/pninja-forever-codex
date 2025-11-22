# Memorial Site

An Nx-powered Angular memorial site to celebrate Mom's life, with Google Photos album integration and a virtual candle tribute.

## Getting started

1. Install dependencies (requires internet access):
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm start
   ```

## Google Photos album

Provide a Google Photos API key and album id in the page controls to load images. The request uses the Google Photos Library API `mediaItems:search` endpoint.

## Virtual candle

Visitors can light a candle and leave a personal message. The state is saved to local storage so it remains lit when the page reloads.

## Deploying to Firebase Hosting

1. Update `.firebaserc` with your Firebase project id under `projects.default`.
2. Authenticate with Firebase (only required once per machine):
   ```bash
   npx firebase login
   ```
3. Build and deploy the production bundle to Firebase Hosting:
   ```bash
   npm run deploy
   ```
   The command builds the app to `dist/apps/memorial` and deploys it, serving `index.html` for all routes.

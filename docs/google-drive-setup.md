# Preparing Google Drive sync for FORGE

This is a **one-time developer setup for the app owner**, not a step for every FORGE user. Once the app is registered, users will connect with their own Google accounts from inside FORGE.

FORGE currently stores your information on your device. **Automatic Google Drive sync is not enabled yet.** You can export a backup and manually save it in Google Drive, iCloud Drive, or OneDrive using Settings → Your data & backups.

The following setup prepares the Google project needed to connect a browser app. An OAuth client ID is a public identifier; it is not the client secret. Do not paste a client secret into FORGE, its repository, or a chat.

1. Open [Google Cloud Console](https://console.cloud.google.com/) and sign in to the Google account that will own the project.
2. Create a project for FORGE or select an existing project.
3. In **APIs & Services → Library**, enable the **Google Drive API** for that project.
4. Open **Google Auth Platform** (or the OAuth consent screen in APIs & Services), configure the app name and support contact, and choose an audience. For a personal project, an external app in testing can be used with your Google account added as a test user. Google may show an unverified-app warning during testing.
5. In **Clients** (or **Credentials → Create Credentials → OAuth client ID**), choose **Web application**.
6. Under **Authorized JavaScript origins**, add `https://mobiiin.github.io`. The origin does not include `/mobin_gym_app/`. For local development, add the precise `http://localhost:PORT` origin you use, such as `http://localhost:8000`.
7. Create the client. Copy the **client ID** ending in `.apps.googleusercontent.com`; keep the client secret private. The app uses this same public client ID on every device; users do not create or enter their own client IDs.

When the integration is ready, FORGE will request only the permissions necessary to identify the connected account and use its application data folder. That folder is hidden from normal Drive browsing, so a single FORGE backup there will not clutter My Drive. Google allows users to delete app data or disconnect the app; retain an independent export as well.

## Why sync is not active yet

One cloud file cannot safely resolve simultaneous writes by simply selecting the newest timestamp. Google Drive's media-update documentation does not establish the atomic conditional-write behavior needed to guarantee conflict-free overwrite prevention for this design. Before enabling automatic uploads, the integration needs authenticated end-to-end testing, a clear conflict-resolution flow, and a reliable concurrency strategy. A browser app can also be suspended or closed before a final sync runs, and Google browser access tokens expire, so background and close-time sync cannot be guaranteed.

References: [Google Drive application data folder](https://developers.google.com/workspace/drive/api/guides/appdata), [Google Identity token model](https://developers.google.com/identity/oauth2/web/guides/use-token-model), [Drive file updates](https://developers.google.com/workspace/drive/api/reference/rest/v3/files/update), and [Google Drive JavaScript quickstart](https://developers.google.com/workspace/drive/api/quickstart/js).

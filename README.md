# FORGE

A personal workout and nutrition tracker designed for iPhone. This is a static progressive web app: exercise and food entries are stored locally on your device. Export backups from Settings regularly; clearing website data or changing devices can remove local data. No cloud sync is configured.

## Host on GitHub Pages

In this repository, open Settings → Pages, choose “Deploy from a branch”, select `main` and `/ (root)`, and save. Open the resulting HTTPS URL in Safari, tap Share → Add to Home Screen, and choose Open as Web App when available.

The public repository contains app code and the initial workout template. Your personal logged entries stay on your device and are not committed to the repository.

## Local development

Serve the repository over HTTP (for example, `python3 -m http.server`) and open it in a browser. Service workers and Home Screen installation require a supported secure context (HTTPS or localhost). To publish updates to the app shell, update the service worker cache version in `sw.js`.

## Exercise library

The offline library adapts the 876-exercise JSON dataset from [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), distributed under the Unlicense; see `EXERCISE_DATA_LICENSE.txt`. Additional cardio activities are included in the app. Exercise muscle labels are approximate and the analysis counts only each set's assigned primary muscle.

# FORGE

A personal workout and nutrition tracker designed for iPhone. This is a static progressive web app: exercise and food entries are stored locally on your device. Export backups from Settings regularly; clearing website data or changing devices can remove local data. No cloud sync is configured.

## Host on GitHub Pages

In this repository, open Settings → Pages, choose “Deploy from a branch”, select `main` and `/ (root)`, and save. Open the resulting HTTPS URL in Safari, tap Share → Add to Home Screen, and choose Open as Web App when available.

The public repository contains app code and the initial workout template. Your personal logged entries stay on your device and are not committed to the repository.

## Local development

Serve the repository over HTTP (for example, `python3 -m http.server`) and open it in a browser. Service workers and Home Screen installation require a supported secure context (HTTPS or localhost). To publish updates to the app shell, update the service worker cache version in `sw.js`.

## Exercise library

The offline library adapts the 876-exercise JSON dataset from [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), distributed under the Unlicense; see `EXERCISE_DATA_LICENSE.txt`. Additional cardio activities are included in the app. Exercise muscle labels are approximate and the analysis counts only each set's assigned primary muscle.

## Nutrition estimator

FORGE uses the [Mifflin–St Jeor equations](https://pubmed.ncbi.nlm.nih.gov/2305711/) and an activity multiplier to estimate maintenance. It approximates the requested weight-change energy difference using 7,700 kcal/kg; actual changes are nonlinear ([NIDDK](https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/nih-body-weight-planner)). Macros use 1.6 g protein/kg, 25% of calories from fat, and the remaining calories from carbohydrate. They are starting estimates, not medical advice. Entries, profile and goals remain on-device, and a calculation must be explicitly applied.

The original affirmation bank was written for this app, informed by [Cleveland Clinic's explanation of positive affirmations](https://health.clevelandclinic.org/do-positive-affirmations-work). It is not a collection of attributed quotations.

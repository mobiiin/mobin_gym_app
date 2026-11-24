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

FORGE uses the [Mifflin–St Jeor equations](https://pubmed.ncbi.nlm.nih.gov/2305711/) and an activity multiplier to estimate maintenance. It approximates the requested weight-change energy difference using 7,700 kcal/kg; actual changes are nonlinear ([NIDDK](https://www.niddk.nih.gov/health-information/professionals/diabetes-discoveries-practice/nih-body-weight-planner)). Default protein targets use 1.8 g/kg for maintenance, 2.0 g/kg for a bulk, and 2.2 g/kg for a cut, with optional 1.6–2.2 g/kg settings. Fat defaults to 30% of calories (choice of 25%, 30%, or 35%) with a 0.6 g/kg floor; carbohydrates use the remaining energy. These are practical starting choices rather than proven optimal amounts. They are starting estimates, not medical advice. Entries, profile and goals remain on-device, and a calculation must be explicitly applied.

The original affirmation bank was written for this app, informed by [Cleveland Clinic's explanation of positive affirmations](https://health.clevelandclinic.org/do-positive-affirmations-work). It is not a collection of attributed quotations.

### Nutrition evidence

- [Morton et al. (2018): protein and resistance-training meta-analysis](https://pubmed.ncbi.nlm.nih.gov/28698222/).
- [Longland et al. (2016): protein during a short energy deficit and intense training](https://pubmed.ncbi.nlm.nih.gov/26817506/).
- [Garthe et al. (2011): slower versus faster weight loss in athletes](https://pubmed.ncbi.nlm.nih.gov/21558571/).
- [Helms et al. (2023): energy surplus size during resistance training](https://pubmed.ncbi.nlm.nih.gov/37914977/).

Protein needs vary, especially with high body fat, kidney disease, and other health factors. Calculations do not guarantee muscle gain, muscle retention, fat loss, or a target date. A large carbohydrate value is a consequence of the calorie target and selected protein/fat values, not a prediction that an exact amount is required.

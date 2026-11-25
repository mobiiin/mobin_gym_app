# FORGE

**Your training. Your fuel. Your progress.**

FORGE is a personal fitness tracker designed for iPhone. It combines a flexible workout planner, exercise library, progress analysis, food log, and calorie and macro planner in a dark, mobile-first app. It is a progressive web app (PWA), hosted as a static website, so you can add it to your Home Screen without an App Store subscription.

**[Open FORGE](https://mobiiin.github.io/mobin_gym_app/)** · [Browse the affirmation and quotation bank](quotes.txt)

## Inside the app

| Today | Training |
|:---:|:---:|
| ![Today dashboard with affirmation and nutrition summary](assets/screenshots/today.png) | ![Training overview with workout actions and rest timer](assets/screenshots/training.png) |
| Exercise library | Muscle analysis |
| ![Exercise library and search filters](assets/screenshots/exercises.png) | ![Muscle analysis and progress overview](assets/screenshots/analysis.png) |

Screenshots show an empty demonstration state; your own entries appear after you start logging.

- **Today:** Daily food and training summaries, a random affirmation, quick logging, and a shareable text preview. You choose which details to include before sharing.
- **Training:** Start a timed workout by choosing a routine and day, log individual sets as you train, resume an unfinished session on the same device, and finish to save it to history. Log cardio, track body weight, use a rest timer, and explore the overview, routine, exercise library, analysis, and history tabs.
- **Routines:** Create and switch between routines, add or remove training days and exercises, reorder or move exercises, and set optional targets and notes. The starting template uses the owner's five-day split, and Explore templates offers editable 2–5 day gym and home options.
- **Exercise library:** Browse 876 exercises from Free Exercise DB plus additional cardio activities and your own custom exercises. Filter by body region, muscle, or equipment. Exercise reference photos require an internet connection.
- **Analysis:** Inspect training history by assigned primary muscle, including set counts and weighted exercise trends. These describe logged training, not measured muscle growth.
- **Fuel and goals:** Log food and macros manually. The optional calorie and macro planner estimates a starting target using your profile, activity level, weight goal, and preferences; review the result before applying it.
- **Inspiration:** The local [affirmation bank](quotes.txt) contains 1,500 original FORGE messages, including affirmations about relationships, self-worth, and mutual respect. Many messages are composed from combinations of original phrases. The refresh button chooses another message.

## Install on iPhone

1. Open [FORGE](https://mobiiin.github.io/mobin_gym_app/) in Safari.
2. Tap **Share** → **Add to Home Screen**. Choose **Open as Web App** if offered, then tap **Add**.
3. Launch FORGE from the Home Screen. The app shell and core data files are cached for offline use after a successful first load.

## Your data and backups

Workout history, meals, routines, settings, and profile information are stored locally in the app's browser storage on that device. There is no account, backend, or automatic cloud sync yet. See the [Google Drive setup guide](docs/google-drive-setup.md) for the next stage. Export a JSON backup from **Settings → Your data & backups** regularly, especially before changing devices or clearing browser/app data. You can share the file to iCloud Drive, Google Drive, or OneDrive and replace the prior file. Choose a file to preview its entry counts before restoring; restoring replaces the data on that device. Your personal logs are not stored in this repository.

Sharing is optional: the Today button shows a preview and lets you select what to include. The device share sheet or copy action is used only when you choose to share.

## Development

The user-facing screens and dialogs are implemented as React components. Existing JavaScript storage, nutrition calculations, and delegated actions remain behind a compatibility layer so existing data continues to work. This is a static app with no build step or server requirement.

```text
index.html                 App shell and script loading order
src/components/today.js    React Today screen and reusable UI components
src/components/fuel.js     React food history screen
src/components/training-overview.js  React training overview and tabs
src/components/training-details.js   React analysis and history screens
src/components/navigation.js         React bottom navigation
src/components/training-plan.js       React routine and exercise library
src/components/settings-v18.js        React nutrition planner and wheels
src/components/backup.js              Backup export, preview, and restore
src/data/backup.js                    Versioned backup validation
src/cloud/sync-decision.js            Conflict decision rules (not connected yet)
src/components/cloud-setup-v19.js    Cloud setup status
src/components/entry-dialogs.js       React logging and share dialogs
src/components/edit-dialogs.js        React routine and exercise dialogs
src/legacy/core-v18.js     Existing storage, navigation, and entry handling
src/legacy/workout-v17.js  Workout state, timer, and initial plan
src/legacy/training-v17.js Training state and delegated actions
src/legacy/training-v16.js Previous script retained for cached older app shells
src/legacy/training.js     Previous script retained for cached older app shells
src/legacy/routine.js      Routine editor
src/legacy/library-v17.js  Exercise filtering and reference photos
src/legacy/library.js      Previous script retained for cached older app shells
src/legacy/nutrition-v18.js Affirmations, nutrition calculations, and React bridge
src/legacy/nutrition-v16.js Previous bridge retained for cached older app shells
src/legacy/nutrition-v14.js Previous bridge retained for cached older app shells
src/legacy/nutrition.js     Previous bridge retained for cached older app shells
src/legacy/dialogs-v17.js  Dialog actions and state compatibility
src/legacy/sharing-v17.js  Share data, zoom handling, and startup
src/styles-v15.css         Shared app styles and fixed navigation stacking
src/styles.css             Previous stylesheet retained for cached older app shells
vendor/                    Locally hosted React 18.2.0 and React DOM (MIT)
quotes.txt                 One JSON object per line; original FORGE affirmations
sw.js                      Offline app shell cache
```

Serve from the repository root instead of opening `index.html` directly:

```sh
python3 -m http.server 8000
# Open http://localhost:8000
```

Run the dependency-free smoke checks with Node.js:

```sh
node tests/modular.cjs
node tests/backup.cjs
node tests/sync-decision.cjs
node tests/routine-templates.cjs
```

The static site can be deployed from the repository root on GitHub Pages. The service worker caches the scripts, style sheet, and data files; increment its cache name when changing cached assets. React's production files are vendored locally so the core app does not depend on a third-party CDN. The compatibility layer still contains older helpers and event handlers; it can be simplified as those actions are moved into React. Older versioned files remain available to previously cached app shells.

The [routine template research notes](docs/routine-research.md) describe the evidence and limitations behind these starting plans.

## Sources and limitations

The exercise catalogue adapts [Free Exercise DB](https://github.com/yuhonas/free-exercise-db), distributed under the Unlicense; see [EXERCISE_DATA_LICENSE.txt](EXERCISE_DATA_LICENSE.txt). Muscle labels are approximate. Some exercise images are loaded from the internet.

The nutrition planner uses the [Mifflin–St Jeor equations](https://pubmed.ncbi.nlm.nih.gov/2305711/) and an activity multiplier. It approximates requested weight change using 7,700 kcal/kg; real changes are not linear. Default protein targets are 1.8 g/kg for maintenance, 2.0 g/kg for a bulk, and 2.2 g/kg for a cut, with adjustable protein and fat preferences. Carbohydrates fill remaining calories. These are starting estimates, not guarantees or medical advice.

Research includes [Morton et al. on protein and resistance training](https://pubmed.ncbi.nlm.nih.gov/28698222/), [Longland et al. on protein during a deficit](https://pubmed.ncbi.nlm.nih.gov/26817506/), and [Helms et al. on surplus size](https://pubmed.ncbi.nlm.nih.gov/37914977/). Individual needs vary, and the planner does not predict exactly how much weight change will be muscle or fat.


## Training workspace (v23)

- Guided sessions with editable set rows, previous performance, persistent inputs, automatic rest countdowns, warm-up/working/drop/failure tags and optional RPE.
- Exercise notes can be pinned for future sessions or kept with one workout. Superset groups guide you to the next exercise and rest after the final member.
- Add, remove, reorder and change tracking type during a workout. Timed holds and cardio have appropriate duration fields.
- A finish review saves session notes and results, and can optionally update the routine's exercises, rest times, groups and working-set targets. A concurrent routine edit prevents overwriting it.
- Records and charts compare weights in a common unit. Warm-ups are excluded from working volume and records. Estimated 1RM uses Epley for 2–10 reps and actual load for 1 rep; it is not a tested maximum and does not adjust for RPE.
- Schedule dated sessions once or weekly. Export `.ics` events to a calendar for reminders; FORGE itself does not provide reliable background alarms. Calendar handling depends on the receiving app.
- Track waist, chest, hips, neck, bilateral arms/forearms/thighs/calves and body fat, with editable entries and trends. Body weight remains in Overview.
- Plate calculations respect available pairs. Warm-up percentages and reps are editable calculation examples, not individualized training advice.
- Training CSV exports are for analysis; the full Settings JSON backup preserves routines, drafts, sessions, notes, schedule and measurements and can be restored.

All new data remains on the device in the same existing storage and backup system. The update does not establish cloud sync. Older logs without session IDs are grouped by date in recent-performance views. Changing an exercise's name creates a separate history match.

Run `node tests/training-v23.cjs` for calculation, migration and persistence model checks. The UI stays within FORGE's React components; no code, graphics or protected assets from the reference APK are included.

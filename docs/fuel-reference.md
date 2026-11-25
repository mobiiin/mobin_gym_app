# Fuel workspace reference and design

The supplied MyFitnessPal APK was inspected statically as a ZIP and Android resource string pools. It was not installed or executed. Resource names provide evidence of intended screens and features, not a complete verified walkthrough of the app.

Examples observed included `diary_fragment`, `material_diary_date_bar`, `activity_create_food`, `edit_food_entry_serving`, `activity_managed_recipes`, `fragment_recipe_nutrition_facts`, `meal_items`, `edit_diary_note`, `copy_meal`, `copy_previous_meal`, and `empty_state_frequent_foods`. The package also contains barcode and meal-scanning layouts. Those features depend on additional data/services and are not replicated in this release.

FORGE's implementation is original code and uses no extracted graphics, proprietary nutrition database, or code from the APK.

## Implemented

- Diary: date navigation, meal sections, calories and macro totals against existing Settings targets, manual food entry, serving calculations, entry editing, repeat food, and removal with undo.
- My Foods: reusable label values, favorites, local search, recent foods and frequently logged foods. This is the user's own food library, not an online product database.
- Meals & Recipes: save a diary meal, log it again with a portion multiplier, rename/remove it, and build/edit recipes from saved ingredients with a configurable serving yield.
- Nutrition: optional fiber, sugar, sodium and saturated fat, explicit nutrient coverage and approximate macro-energy distribution. No new health targets are prescribed.
- Trends: 7/14/30-day charts and averages. Days without logs or without the chosen nutrient are excluded from averages. Partial totals are identified.
- Water: quick additions in ml or US fluid ounces, custom amounts, optional personal target, dated history and undoable deletion.
- Diary notes and copying meals or whole days, with a preview before copying.

## Data integrity

`state.foods` remains the shared ledger used by Today and exports. New entries preserve a nutrition basis and portion amount; changing the consumed portion scales calories and nutrients without compounding earlier rounding. Legacy entries are interpreted as one logged portion. Food and recipe changes never rewrite historical entries.

Unknown nutrient values are `null`, distinct from measured zero. Recipe nutrients are unknown if any ingredient lacks that value. Diary totals count recorded values and show coverage. The water target starts unset. Exercise calories are not automatically added to the calorie target.

New state arrays: `foodLibrary`, `savedMeals`, `fuelRecipes`, `waterEntries`, and `fuelNotes`; optional `waterGoalML`. All are included in the existing portable JSON backup. Saves roll back in memory on a failed storage write. No account or subscription is required for these features, and no external food queries are sent.

Tests: `node tests/fuel-v26.cjs` and `node tests/modular-v26.cjs`. Reference APK inspection is not evidence of functional parity with MyFitnessPal.

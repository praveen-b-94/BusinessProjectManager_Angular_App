# RubyFlow — Business Project Manager

A small enterprise task-management app (Jira-style ALM) originally built as a grad-school
project in 2022 on Angular 14/15, rebuilt in 2026 on **Angular 22** with current best
practices. 

## Features

- **Task Board** — kanban with four status columns and drag-and-drop (Angular CDK),
  plus a dialog to create, edit, and delete tasks with validation and date pickers.
- **People** — team member directory with add/edit/remove. Removing a person
  unassigns their tasks and removes them from project rosters.
- **Projects** — drag people between the available pool and project rosters;
  assignments are reversible and persisted.
- **Home** — live workspace stats driven by the same signal stores.

All state persists to `localStorage` and reseeds with demo data on first run.

## Architecture notes (what changed from the 2022 version)

| 2022 version | This version |
| --- | --- |
| NgModules, mixed Angular 14/15 deps | Standalone components, Angular 22, zoneless change detection |
| Services mutating shared mock arrays | Signal stores (`src/app/core/*-store.ts`) with `computed` views and `effect`-based persistence |
| Four separate arrays for task states | One `Task` list with a `status` field |
| Hand-rolled HTML5 drag/drop + `innerHTML` DOM writes | CDK `DragDrop` with data-driven templates |
| `any` types, buggy id increment, unused `body-parser` import | Strict typed models, max+1 ids |
| Template-driven forms, no validation | Typed reactive forms with validators |
| `*ngFor`/`*ngIf` | Built-in control flow (`@for`/`@if`) |
| Hash routing, eager components | Path routing, lazy `loadComponent` routes with titles |
| Material 14 (M2) | Material 22 with an M3 `mat.theme` (rose/violet) and system tokens |

## Development

```bash
npm install
npm start        # dev server on http://localhost:4200
npm test         # unit tests (vitest)
npm run build    # production build to dist/
```

> Note: if your C: drive is low on space, point the npm cache elsewhere first, e.g.
> `$env:npm_config_cache='F:\bacho\npm-cache'`.

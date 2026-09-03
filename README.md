# Vue + Electron App

A public engineering showcase based on a real production desktop application built with Vue 3, TypeScript and Electron.

The original product is a specialized desktop editor for working with Russian dialect texts. It includes a typed document model, synchronized text layers, morphological analysis, metadata workflows, XHTML import/export, desktop file-system integration and a feature-rich Vue interface.

## Public showcase notice

This repository is a **sanitized public extraction of a real production codebase**, not the complete distributable product.

It is published to demonstrate engineering decisions from the original application: Vue + TypeScript structure, Electron process boundaries, typed IPC contracts, domain-oriented document models, tokenization, desktop file handling and complex text-processing workflows.

Several production features are intentionally removed or replaced because they depend on third-party intellectual property and linguistic assets that cannot be redistributed publicly.

### What is intentionally excluded

The original repository contains a `resources/` directory that is **not present at all** in this public repository. It includes, among other things:

- an external morphological analyzer executable;
- linguistic dictionaries and analyzer configuration files;
- semantic and dialect datasets;
- metadata dictionaries and schemas;
- legacy compatibility tables used by the production editor.

The public repository also does not contain generated application builds (`build/`, `dist-electron/`) or the private repository history.

A large production-specific detranscription ruleset has additionally been replaced by a public-safe adapter. The exported API is preserved so the architecture and document pipeline remain understandable, but the original linguistic transformation rules are not redistributed here.

### Effect on functionality

The production application supports full morphological analysis, metadata dictionaries, domain-specific detranscription, rich XHTML round-tripping and additional linguistic editing workflows.

In this public version:

- `.txt` files can be opened through Electron;
- the application builds the typed working document and tokenized text layers;
- the Electron → preload → renderer boundary remains visible in code;
- protected morphology and metadata endpoints return an explicit `unavailable-in-public-showcase` result instead of trying to load missing assets;
- the production detranscription rules are replaced by normalization-only public adapters;
- the renderer is reduced to a small showcase screen focused on the document/tokenization flow.

This keeps the repository safe to publish while preserving the architectural parts that are most relevant for engineering review.

## Original product capabilities

The production application provides a desktop workflow for editing and annotating dialect texts:

- imports raw `.txt` text and annotated `.xhtml` / `.html` documents;
- maintains synchronized text layers and word-level document state;
- supports word editing, splitting and merging word forms, stress marks and layer editing;
- runs morphological analysis for individual words and full documents;
- provides tools for reviewing analyses, grammatical properties and dialect features;
- manages address, phonetic, dialect-text and geographic metadata;
- exports metadata to legacy-compatible spreadsheet files;
- saves annotated documents as dialect XHTML while preserving morphology and metadata;
- handles desktop file operations, application menus, loading states and structured errors.

## Architecture

The production project separates framework-independent domain logic from the Electron desktop layer and the Vue renderer.

```text
src/
├── core/       # document model, tokenization and domain contracts
├── main/       # Electron main process and IPC
└── renderer/   # Vue UI
```

A typical desktop flow is:

```text
Vue renderer
    ↓
preload API
    ↓
Electron IPC
    ↓
main process
    ↓
filesystem / domain services / external runtime integrations
```

The public extraction keeps the same process boundary and the core working-document model while replacing protected runtime integrations with controlled showcase responses.

## Engineering highlights

- Vue 3 + TypeScript renderer inside an Electron desktop application.
- Explicit preload bridge instead of exposing Node/Electron APIs directly to the renderer.
- Typed IPC request/response contracts shared across process boundaries.
- Framework-independent `WorkingDialectDocument` domain model.
- Multi-layer tokenization with word, paragraph, sentence and punctuation state.
- Desktop file selection and reading through the Electron main process.
- Clear separation between public application code and private runtime assets.
- Production-only integrations replaced by explicit public-safe adapters rather than silently failing on missing files.

## Tech stack

- Vue 3
- TypeScript
- Electron
- Vite
- Pinia
- Sass
- Motion for Vue
- SheetJS (`xlsx`)
- electron-builder

## Development

Install dependencies:

```bash
npm install
```

Start the Electron application in development mode:

```bash
npm run dev
```

Create a production package:

```bash
npm run build
```

Build specifically for Windows:

```bash
npm run build:win
```

No private `resources/` directory is required by the public build configuration. Features that use those assets in production are intentionally disabled in this repository.

## Purpose of this repository

This repository is intended as an engineering portfolio example rather than a redistributable copy of the original product. It shows how a real desktop application was structured and implemented while deliberately excluding code and assets that should not be published because of third-party copyright or licensing constraints.

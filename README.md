# Vue + Electron App

A public engineering showcase based on a real production desktop application built with Vue 3, TypeScript and Electron.

The original product is a specialized editor for working with Russian dialect texts. It includes a complex document model, multi-layer text editing, morphological analysis, metadata workflows, XHTML import/export, desktop file-system integration and a Vue-based editing interface.

## Public showcase notice

This repository is a sanitized public version of a real production codebase. It is published to demonstrate frontend and desktop application architecture, TypeScript practices, state management, Electron IPC, complex UI workflows and domain-oriented data processing.

Some parts of the original application are intentionally **not included** because they contain third-party intellectual property and runtime data that cannot be redistributed publicly.

The omitted `resources/` directory contains, among other things:

- an external morphological analyzer executable used by the production application;
- linguistic dictionaries and analyzer configuration files;
- semantic and dialect datasets;
- metadata dictionaries, schemas and legacy compatibility tables.

As a result, functionality that depends on those assets — primarily production morphological analysis and parts of metadata/dictionary loading — cannot work exactly as it does in the original product without the private resources.

The application source code, architecture and UI flows are preserved here to show how those systems are integrated. Generated build artifacts are also intentionally omitted from the public repository.

## What the application does

The original application provides a desktop workflow for editing and annotating dialect texts:

- imports raw `.txt` text and previously annotated `.xhtml` / `.html` documents;
- maintains synchronized text layers and word-level document state;
- supports word editing, splitting and merging word forms, stress marks and layer editing;
- runs morphological analysis for individual words and full documents;
- provides tools for reviewing and editing morphological analyses, grammatical properties and dialect features;
- manages document metadata, including address, phonetic, dialect-text and geographic data;
- exports metadata to legacy-compatible spreadsheet files;
- saves annotated documents as dialect XHTML while preserving morphology and metadata;
- handles desktop file operations, application menus, IPC communication, loading states, warnings and recoverable/critical errors.

## Architecture

The project separates framework-independent domain logic from the Electron desktop layer and Vue renderer.

```text
src/
├── core/       # document model, tokenization, morphology, metadata, serialization
├── main/       # Electron main process, IPC, filesystem and morphology integration
├── renderer/   # Vue UI, feature modules, Pinia stores and shared components
└── shared/     # shared errors, IPC result types and logging
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

Most document transformations and text-processing logic live in `src/core`, keeping them independent from Vue and Electron-specific APIs.

## Engineering highlights

- Feature-oriented Vue renderer with reusable shared UI components.
- Complex editor state managed through Pinia and typed domain models.
- Explicit Electron security boundary using preload APIs and IPC contracts.
- Domain logic separated from renderer concerns.
- Typed success/error IPC result model and centralized error handling.
- XHTML parsing and serialization with round-trip checks.
- Multi-layer tokenized text model with word-level editing operations.
- Adapter-based morphology pipeline designed around replaceable engines.
- Desktop-specific file handling, application menu integration and unsaved-change state.

## Morphology integration

In the production version, morphological analysis runs outside the renderer:

```text
Renderer → preload API → IPC → MorphologyPipeline → LemmerEngine
```

The TypeScript pipeline is responsible for preprocessing, parsing analyzer output, applying transformation rules, semantic enrichment, grammar normalization and converting results into editor state.

The codebase contains adapters for native Windows execution, Wine-based execution on macOS/Linux and a deterministic mock engine for development. The actual production analyzer binary and its datasets are intentionally excluded from this public repository.

## Document model and serialization

The working model is a `WorkingDialectDocument` containing tokenized text, synchronized layers, morphology, selection state and metadata.

The primary durable format in the production application is dialect XHTML. Import/export logic is located in:

```text
src/core/document/serialization/xhtml/
```

Morphological analyses are serialized into annotation nodes, while application metadata is stored alongside the document in a structured payload.

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

Start the application in development mode:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Build specifically for Windows:

```bash
npm run build:win
```

> **Note:** this public version does not include the private `resources/` directory. Resource-dependent production features require the proprietary/third-party runtime assets from the original project and therefore may report missing-resource errors in this showcase repository.

## Documentation

The `docs/` directory contains implementation notes for major parts of the application, including file workflows, metadata, morphology, XHTML serialization, word editing and error handling.

## Purpose of this repository

This repository is intended as an engineering portfolio example rather than a redistributable version of the original product. It demonstrates the code structure and implementation approach used in a real-world desktop application while deliberately excluding assets and functionality that cannot be published due to third-party copyright and licensing constraints.

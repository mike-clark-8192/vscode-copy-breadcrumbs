# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a VSCode extension that copies breadcrumbs from the editor to clipboard and/or terminal. The extension is written in TypeScript, bundled with webpack, and uses pnpm as the package manager.

## Build and Development Commands

Note: there may be some references to yarn in the project. We are no longer using yarn. Use pnpm instead.

```bash
# Install dependencies
pnpm install

# Development - watch mode
pnpm run watch

# Build for production
pnpm run package

# Run linting
pnpm run lint

# Run tests
pnpm run test

# Compile tests
pnpm run compile-tests

# Publish extension (requires VSCE_PAT environment variable)
pnpm run publish
```

## Architecture

The extension has a simple architecture:
- **Main entry point**: `src/extension.ts` - Contains the activation/deactivation logic and all command implementations
- **Commands**: Two commands are registered:
  - `cunneen-copy-breadcrumbs.copy` - Copies full breadcrumb path
  - `cunneen-copy-breadcrumbs.copy-last` - Copies only the last part of breadcrumb
- **Build output**: Webpack bundles everything into `dist/extension.js`

## Key Implementation Details

The extension uses VSCode's `vscode.executeDocumentSymbolProvider` command to get document symbols and constructs the breadcrumb path by:
1. Getting the relative file path from workspace root
2. Finding symbols that contain the current cursor line
3. Joining path components with a configurable separator (default: " > ")

## Configuration Settings

The extension provides these configuration settings under `cunneen-copy-breadcrumbs`:
- `pasteToTerminal` (boolean, default: false) - Auto-paste to active terminal
- `copyToClipboard` (boolean, default: true) - Copy to clipboard
- `showAlert` (boolean, default: true) - Show notification on copy
- `separationString` (string, default: " > ") - Path separator string

## Testing and Quality

- ESLint configuration enforces TypeScript naming conventions and code style
- Tests use VSCode's test framework (@vscode/test-electron)
- TypeScript strict mode is enabled in `tsconfig.json`
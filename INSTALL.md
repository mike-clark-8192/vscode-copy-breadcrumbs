# Installation Instructions

## Building from Source

### Prerequisites
- Node.js (version 18 or higher recommended)
- pnpm package manager
- VSCode

### Build Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/cunneen/vscode-copy-breadcrumbs.git
   cd vscode-copy-breadcrumbs
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the extension package**
   ```bash
   pnpm run vsix
   ```
   
   This will create a `.vsix` file in the `dist/` directory (e.g., `dist/cunneen-copy-breadcrumbs-1.2.0.vsix`)

## Installing the Extension

After building, you can install the extension using one of these methods:

### Method 1: Command Line
```bash
code --install-extension dist/cunneen-copy-breadcrumbs-1.2.0.vsix
```

### Method 2: VSCode UI
1. Open VSCode
2. Open the Extensions view (Ctrl+Shift+X or Cmd+Shift+X on Mac)
3. Click the "..." menu at the top of the Extensions sidebar
4. Select "Install from VSIX..."
5. Navigate to the `dist/` folder and select the `.vsix` file
6. Click "Install"

## Verifying Installation

1. Restart VSCode after installation
2. Open any code file
3. Place your cursor in a function or class
4. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on Mac)
5. Search for "Copy Breadcrumb" - you should see two commands:
   - **Copy Breadcrumb**: Copies the full breadcrumb path
   - **Copy Breadcrumb - Last Part Only**: Copies only the last part

## Configuration

After installation, you can customize the extension settings:

1. Open VSCode Settings (Ctrl+, or Cmd+, on Mac)
2. Search for "breadcrumb copier"
3. Configure these options:
   - **Path Part Sep**: Separator for file path parts (default: `/`)
   - **Path Crumb Sep**: Separator between file path and symbols (default: `#`)
   - **Crumb Part Sep**: Separator for symbol parts (default: `.`)
   - **Paste To Terminal**: Auto-paste to active terminal (default: false)
   - **Copy To Clipboard**: Copy to clipboard (default: true)
   - **Show Alert**: Show notification on copy (default: true)

## Example Output

With default settings, copying a breadcrumb from a nested function will produce:
```
myproj/src/pkg/index.js#fooFunction.innerFunction
```

## Troubleshooting

- **Extension not appearing**: Make sure to restart VSCode after installation
- **Build errors**: Ensure you have the correct Node.js version and pnpm installed
- **VSIX installation fails**: Check that the file path is correct and the file exists in the `dist/` directory

## Development Mode

For development with hot reload:
```bash
pnpm run watch
```
Then press F5 in VSCode to launch a new Extension Development Host window.
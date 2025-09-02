// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const allCommandNames: CommandNameType[] = ["cunneen-copy-breadcrumbs.copy", "cunneen-copy-breadcrumbs.copy-last"];
  for (const commandName of allCommandNames) {
    const registeredCommand = vscode.commands.registerCommand(
      commandName as string,
      getCommandFnForVSCodeRegistration(commandName)
    );

    context.subscriptions.push(registeredCommand);
  }
}

// This method is called when your extension is deactivated
export function deactivate() { /* placeholder; gets called when extension is deactivated. */ }

type CommandNameType = "cunneen-copy-breadcrumbs.copy" | "cunneen-copy-breadcrumbs.copy-last";

/**
 * Performs the action based on the command name
 * @param config - The configuration object
 * @param symbols - The symbols to perform the action on
 * @param relative - The relative path of the active editor
 * @param commandName - The command name
 * @returns a function that can be registered via `vscode.commands.registerCommand`
 */
function getCommandFnForVSCodeRegistration(commandName: CommandNameType) {
  const commandFn = function () {
    let activeEditor = vscode.window.activeTextEditor;
    const config = vscode.workspace.getConfiguration(
      "cunneen-copy-breadcrumbs"
    );
    const pathPartSep = config.pathPartSep ?? "/";
    const pathCrumbSep = config.pathCrumbSep ?? "#";
    const crumbPartSep = config.crumbPartSep ?? ".";

    if (activeEditor) {
      const currentLine = activeEditor.selection.active.line;
      const relative = getRelativeParts(activeEditor, pathPartSep);

      getSymbols(activeEditor, currentLine).then((symbols) => {
        const typedSymbols = symbols as (
          | vscode.SymbolInformation
          | vscode.DocumentSymbol
        )[];
        performActionWithBreadcrumbSymbols(config, typedSymbols, relative, commandName, pathCrumbSep, crumbPartSep);
      });
    } else {
      vscode.window.showErrorMessage("No active editor open.");
    }
  };
  return commandFn;
}

/**
 * Grabs the path of the active editor
 * @param activeEditor
 * @param pathPartSep - The string to use to separate file path components
 * @returns The paths
 */
function getRelativeParts(activeEditor: vscode.TextEditor, pathPartSep: string) {
  const relative = vscode.workspace.asRelativePath(
    activeEditor.document.uri.path
  );
  const relative_parts = relative.split("/");

  // push the the individual parts to the list.
  let parts: string[] = [];
  for (const part of relative_parts) {
    parts.push(part);
  }

  // Return the parts separated by the pathPartSep
  return parts.join(pathPartSep);
}

/**
 * recursively descent
 * @param {*} symbols - an array of SymbolInformation and DocumentSymbol instances
 * @param {number} currentLine
 * @param {string[]} levels - an array of parent symbols
 * @returns
 */
function getLevels(
  symbols: (vscode.SymbolInformation | vscode.DocumentSymbol)[],
  currentLine: number,
  levels: string[]
) {
  const symbolsUntyped = symbols as any[];
  for (let child of symbolsUntyped) {
    // if the current line is within the range of this child, add it to the breadcrumb path and examine its children
    const start = child.location?.range.start.line;
    const end = child.location?.range.end.line;
    if (start <= currentLine && end >= currentLine) {
      console.debug(
        `${child.name} includes the current line ${currentLine} (i.e. ${start} <= ${currentLine} <= ${end})`
      );
      levels.push(child.name);
      getLevels(child.children, currentLine, levels);
      break;
    } else {
      console.debug(
        `${child.name} DOES NOT include the current line ${currentLine} (i.e. !(${start} <= ${currentLine} <= ${end}))`
      );
    }
  }

  return levels;
}

/**
 * This actually gets the breadcrumbs for the current editor and line from VSCode
 * @param {TextEditor} activeEditor
 * @param {number} currentLine
 * @returns an array of strings representing symbols in the path to the current editor
 */
function getSymbols(activeEditor: vscode.TextEditor, currentLine: number) {
  return new Promise((resolve, reject) => {
    vscode.commands
      .executeCommand(
        "vscode.executeDocumentSymbolProvider",
        activeEditor.document.uri
      )
      .then((symbols) => {
        if (symbols) {
          const symbolArray = symbols as (
            | vscode.SymbolInformation
            | vscode.DocumentSymbol
          )[];
          resolve(getLevels(symbolArray, currentLine, []));
        } else {
          resolve([]);
        }
      });
  });
}

/**
 * Perform the configured action, either pasting to the active terminal or copying to the clipboard.
 */
function performActionWithBreadcrumbSymbols(
  config: vscode.WorkspaceConfiguration,
  symbols: (vscode.SymbolInformation | vscode.DocumentSymbol)[],
  relative: string,
  commandName: CommandNameType,
  pathCrumbSep: string,
  crumbPartSep: string
) {
  let breadcrumbs: string;

  if (symbols.length === 0) {
    breadcrumbs = relative;
  } else {
    switch (commandName) {
      case "cunneen-copy-breadcrumbs.copy-last":
        breadcrumbs = `${symbols[symbols.length - 1]}`;
        break;
      case "cunneen-copy-breadcrumbs.copy":
      default:
        breadcrumbs = `${relative}${pathCrumbSep}${symbols.join(
          crumbPartSep
        )}`;
    }
  }

  const activeTerminal = vscode.window.activeTerminal;
  if (config.pasteToTerminal && activeTerminal) {
    activeTerminal.sendText(breadcrumbs, false);
  }

  if (config.copyToClipboard) {
    vscode.env.clipboard.writeText(breadcrumbs);

    if (config.showAlert) {
      vscode.window.showInformationMessage(
        `Copied "${breadcrumbs}" to clipboard.`
      );
    }
  }
}

module.exports = {
  activate,
  deactivate,
};

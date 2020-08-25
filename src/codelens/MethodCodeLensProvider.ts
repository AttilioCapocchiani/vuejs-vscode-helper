import * as vscode from 'vscode';

/**
 * MethodCodelensProvider
 */
export class MethodCodeLensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private regex: RegExp;
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

  constructor() {
    this.regex = /methods:/g;

    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    this.codeLenses = [];
    const regex = new RegExp(this.regex);
    const text = document.getText();
    let matches;
    while ((matches = regex.exec(text)) !== null) {
      const line = document.lineAt(document.positionAt(matches.index).line);
      const indexOf = line.text.indexOf(matches[0]);
      const position = new vscode.Position(line.lineNumber, indexOf);
      const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));
      if (range) {
        this.codeLenses.push(new vscode.CodeLens(range, {
          title: "Add method",
          tooltip: "Add a new method",
          command: "vueSfcEditor.addMethod"
        }));
        this.codeLenses.push(new vscode.CodeLens(range, {
          title: "Map Vuex action",
          tooltip: "Map a Vuex action in methods",
          command: "vueSfcEditor.mapVuexAction"
        }));
      }
    }
    return this.codeLenses;
  }
}
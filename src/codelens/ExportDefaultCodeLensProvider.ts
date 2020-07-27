import * as vscode from 'vscode';
import { detectLanguage } from '../utils/utils';

/**
 * ExportDefaultCodeLensProvider
 */
export class ExportDefaultCodeLensProvider implements vscode.CodeLensProvider {
  private codeLenses: vscode.CodeLens[] = [];
  private regex: RegExp;
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

  constructor() {
    this.regex = /export default/g;
    
    vscode.workspace.onDidChangeConfiguration((_) => {
      this._onDidChangeCodeLenses.fire();
    });
  }

  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    this.codeLenses = [];
    const regex = new RegExp(this.regex);
    const text = document.getText();
    const isJS = detectLanguage(text) === 'js';

    const shouldAddCreated = (text.match('(?<!\\/\\/)created\\s*\\(') || []).length === 0;
    const shouldAddData = isJS && (text.match('(?<!\\/\\/)data\\s*:*\\s*(function)?\\s*\\(') || []).length === 0;
    const shouldAddMethods = isJS && (text.match('(?<!\\/\\/)methods\\s*\\:\\s*{') || []).length === 0;
    const shouldAddProps = isJS && (text.match('(?<!\\/\\/)props\\s*\\:\\s*{') || []).length === 0;
    const shouldAddWatch = isJS && (text.match('(?<!\\/\\/)watch\\s*\\:\\s*{') || []).length === 0;

    if (shouldAddMethods || shouldAddWatch || shouldAddCreated) {
      let matches;
      while ((matches = regex.exec(text)) !== null) {
        const line = document.lineAt(document.positionAt(matches.index).line);
        const indexOf = line.text.indexOf(matches[0]);
        const position = new vscode.Position(line.lineNumber, indexOf);
        const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));
        if (range) {
          if (shouldAddCreated) {
            this.codeLenses.push(new vscode.CodeLens(range, {
              command: "vueSfcEditor.addCreatedSection",
              title: "Add created function"
            }));
          }

          if (shouldAddMethods) {
            this.codeLenses.push(new vscode.CodeLens(range, {
              command: "vueSfcEditor.addMethodsSection",
              title: "Add methods section"
            }));
          }

          if (shouldAddProps) {
            this.codeLenses.push(new vscode.CodeLens(range, {
              command: "vueSfcEditor.addPropsSection",
              title: "Add props section"
            }));
          }

          if (shouldAddWatch) {
            this.codeLenses.push(new vscode.CodeLens(range, {
              command: "vueSfcEditor.addWatchSection",
              title: "Add watch section"
            }));
          }

          if (shouldAddData) {
            this.codeLenses.push(new vscode.CodeLens(range, {
              command: "vueSfcEditor.addDataSection",
              title: "Add data function"
            }));
          }
        }
      }
    }
    return this.codeLenses;
  }

  // public resolveCodeLens(codeLens: vscode.CodeLens, token: vscode.CancellationToken) {
  //   codeLens.command = {
  //     title: "Add methods",
  //     tooltip: "Add methods block",
  //     command: "vueSfcEditor.addMethodBlock"
  //   };
  //   return codeLens;
  // }
}
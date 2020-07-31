import * as vscode from 'vscode';
import { buildDataCode, detectLanguage, regexIndexOf } from '../utils/utils';
import { AddDataState } from '../utils/interfaces';

export async function addDataCommand() {
  const document = vscode.window.activeTextEditor?.document;
  if (document) {
    const text: string | undefined = document?.getText();

    const dataIndex = text.search(/(?<!\/\/)data\s*:*\s*(function)?\s*\(/);
    const index = regexIndexOf(text, /return\s+\{/, dataIndex);

    let tempString: string | undefined;
    let shouldCreateDataFunction: boolean;

    if (index && index >= 0) {
      tempString = text?.substring(0, index);
      shouldCreateDataFunction = false;
    } else {
      tempString = text?.substring(0, text.indexOf('export default'));
      shouldCreateDataFunction = true;
    }
    const lineNumber = tempString?.split('\n').length || 0;
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();

    const addDataState: AddDataState = {
      variableName: '',
      defaultValue: 'undefined',
      language: detectLanguage(text)
    };

    const variableName = await vscode.window.showInputBox({
      prompt: 'Enter variable name',
      placeHolder: 'foo'
    });

    if (variableName) {
      addDataState.variableName = variableName;

      const defaultValue = await vscode.window.showInputBox({
        prompt: 'Default value',
        placeHolder: 'undefined'
      });

      if (defaultValue) {
        addDataState.defaultValue = defaultValue;
      }

      const code = buildDataCode(addDataState, shouldCreateDataFunction);
      edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
      await vscode.workspace.applyEdit(edit);
      await vscode.workspace.saveAll(false);
      await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
    }
  }
}
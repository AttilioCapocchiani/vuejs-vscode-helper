import * as vscode from 'vscode';
import { buildMethodCode, detectLanguage } from '../utils/utils';
import { AddMethodState } from '../utils/interfaces';

export async function addMethodCommand () {
  const document = vscode.window.activeTextEditor?.document;

  const text: string | undefined = document?.getText();

  const index = text?.indexOf("methods:");
  let tempString: string | undefined;
  let shouldCreateMethodsBlock: boolean;
  if (index && index >= 0) {
    tempString = text?.substring(0, index);
    shouldCreateMethodsBlock = false;
  } else {
    tempString = text?.substring(0, text.indexOf('export default'));
    shouldCreateMethodsBlock = true;
  }
  const lineNumber = tempString?.split('\n').length || 0;
  const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();

  const state: AddMethodState = {
    methodName: '',
    language: detectLanguage(text!)
  };

  const methodName = await vscode.window.showInputBox({
    prompt: 'Enter method name',
    placeHolder: 'myMethod'
  });

  if (methodName) {
    state.methodName = methodName;
    const code = buildMethodCode(state, shouldCreateMethodsBlock);

    if (document) {
      edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
      await vscode.workspace.applyEdit(edit);
      await vscode.workspace.saveAll(false);
      await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
    }
  } else {
    await vscode.window.showWarningMessage('No name provided for method');
  }
}
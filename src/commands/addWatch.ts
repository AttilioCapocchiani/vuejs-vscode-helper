import * as vscode from 'vscode';
import { buildWatchCode, detectLanguage } from '../utils/utils';
import { AddWatchState } from '../utils/interfaces';

export async function addWatchCommand () {
  const document = vscode.window.activeTextEditor?.document;

  const text = document?.getText();

  const index = text?.indexOf("watch:");
  let tempString;
  let shouldCreateWatchBlock: boolean;
  if (index && index >= 0) {
    tempString = text?.substring(0, index);
    shouldCreateWatchBlock = false;
  } else {
    tempString = text?.substring(0, text?.indexOf('export default'));
    shouldCreateWatchBlock = true;
  }
  const lineNumber = tempString?.split('\n').length || 0;
  const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();

  const addWatchState: AddWatchState = {
    variableName: '',
    hasOldValue: false,
    hasNewValue: false,
    methodName: '',
    language: detectLanguage(text!)
  };

  const variableName = await vscode.window.showInputBox({
    prompt: 'Enter variable name',
    placeHolder: 'foo'
  });

  if (variableName) {
    addWatchState.variableName = variableName;

    const hasNewValueInput = await vscode.window.showQuickPick(['Yes', 'No'], {
      placeHolder: 'Include new value as parameter?'
    });

    addWatchState.hasNewValue = hasNewValueInput?.includes('Yes');

    if (addWatchState.hasNewValue) {
      const hasOldValueInput = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: 'Include old value as parameter?'
      });
      addWatchState.hasOldValue = hasOldValueInput?.includes('Yes');
    }

    if (addWatchState.language === 'ts') {
      const methodName = await vscode.window.showInputBox({
        prompt: 'Enter method name',
        placeHolder: 'onFooChange'
      });

      if (methodName) {
        addWatchState.methodName = methodName;
      }
    }

    const code = buildWatchCode(addWatchState, shouldCreateWatchBlock);

    if (document) {
      edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
      await vscode.workspace.applyEdit(edit);
      await vscode.workspace.saveAll(false);
      await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
    }
  } else {
    await vscode.window.showWarningMessage('No name provided for watch');
  }
}
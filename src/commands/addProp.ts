import * as vscode from 'vscode';
import { buildPropCode, detectLanguage } from '../utils/utils';
import { AddPropState } from '../utils/interfaces';

export async function addPropCommand () {
  const document = vscode.window.activeTextEditor?.document;

  const text: string | undefined = document?.getText();

  const index = text?.indexOf("props:");
  let tempString: string | undefined;
  let shouldCreatePropsBlock: boolean;
  if (index && index >= 0) {
    tempString = text?.substring(0, index);
    shouldCreatePropsBlock = false;
  } else {
    tempString = text?.substring(0, text.indexOf('export default'));
    shouldCreatePropsBlock = true;
  }
  const lineNumber = tempString?.split('\n').length || 0;
  const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();

  const state: AddPropState = {
    name: '',
    type: [],
    defaultValue: "",
    required: false,
    language: detectLanguage(text!)
  };

  const propName = await vscode.window.showInputBox({
    prompt: 'Enter prop name',
    placeHolder: 'foo'
  });

  if (propName) {
    state.name = propName;

    if (state.language === 'js') {
      const types = await vscode.window.showQuickPick(
        ['String', 'Number', 'Boolean', 'Object'],
        { canPickMany: true, placeHolder: 'Select allowed type(s)' }
      );

      if (types && types.length) {
        state.type = types;

        const defaultValue = await vscode.window.showInputBox({
          prompt: 'Enter default value',
          placeHolder: 'undefined'
        });

        if (defaultValue) {
          state.defaultValue = defaultValue;

          const required = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: 'Is prop required?'
          });

          state.required = required?.includes('Yes');

          const code = buildPropCode(state, shouldCreatePropsBlock);

          if (document) {
            edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
            await vscode.workspace.applyEdit(edit);
            await vscode.workspace.saveAll(false);
            await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
          }
        } else {
          await vscode.window.showWarningMessage('No default value specified for prop');
        }
      } else {
        await vscode.window.showWarningMessage('No allowed type specified for prop');
      }
    } else {
      const type = await vscode.window.showInputBox({
        prompt: 'Enter prop type',
        placeHolder: 'Foo'
      });

      if (type) {
        state.type = type;

        const code = buildPropCode(state, shouldCreatePropsBlock);

        if (document) {
          edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
          await vscode.workspace.applyEdit(edit);
          await vscode.workspace.saveAll(false);
          await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
        }
      } else {
        await vscode.window.showWarningMessage('No allowed type specified for prop');
      }
    }
  } else {
    await vscode.window.showWarningMessage('No name provided for prop');
  }
}
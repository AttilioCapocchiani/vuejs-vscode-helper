import * as vscode from 'vscode';
import { detectLanguage, buildMapVuexActionCode, regexIndexOf } from '../utils/utils';
import { MapVuexActionState } from '../utils/interfaces';

export async function mapVuexActionCommand() {
  const document = vscode.window.activeTextEditor?.document;

  if (document) {
    const text: string | undefined = document?.getText();

    const state: MapVuexActionState = {
      actionName: '',
      mappedName: '',
      language: detectLanguage(text)
    };

    const actionName = await vscode.window.showInputBox({
      prompt: 'Enter Vuex action name',
      placeHolder: 'namespace/action'
    });

    if (actionName) {
      state.actionName = actionName;

      const mappedName = await vscode.window.showInputBox({
        prompt: 'Enter method name',
        value: actionName.replace('/', '')
      });

      if (mappedName) {
        state.mappedName = mappedName;

        let regExp: RegExp;
        if (actionName === mappedName) {
          regExp = /mapActions\(\[(?!{)/;
        } else {
          regExp = /mapActions\(\[\s*\{/;
        }

        let tempString: string | undefined;
        let shouldCreateMethodsBlock: boolean;
        let shouldCreateMapActionsBlock: boolean;
        let offset = 0;

        const methodsIndex = text.search(/methods/);
        if (methodsIndex && methodsIndex > 0) {
          shouldCreateMethodsBlock = false;
          const index = regexIndexOf(text, regExp, methodsIndex);
          
          if (index && index >= 0) {
            shouldCreateMapActionsBlock = false;
            tempString = text?.substring(0, index);
            offset = 1;
          } else {
            shouldCreateMapActionsBlock = true;
          }
          tempString = text?.substring(0, methodsIndex);
        } else {
          shouldCreateMethodsBlock = true;
          shouldCreateMapActionsBlock = true;
          tempString = text?.substring(0, text.indexOf('export default'));
        }

        const lineNumber = tempString?.split('\n').length || 0;
        const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
        const code = buildMapVuexActionCode(state, shouldCreateMethodsBlock, shouldCreateMapActionsBlock);
        edit.insert(document.uri, new vscode.Position(lineNumber + offset, 0), code);
        await vscode.workspace.applyEdit(edit);
        await vscode.workspace.saveAll(false);
        await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
      }
    }
  }
}
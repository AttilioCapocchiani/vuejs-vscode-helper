import * as vscode from 'vscode';
import { detectLanguage, buildMapVuexActionCode, buildMapVuexGetterCode, regexIndexOf } from '../utils/utils';
import { MapVuexActionState, MapVuexGetterState } from '../utils/interfaces';

async function insertVuexActionMapping(text: string, document: vscode.TextDocument) {
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
        regExp = /mapActions\(\[(?!(\s*{))/;
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
      return true;
    }
    return false;
  }
  return false;
}

async function insertImportVuexMethods(document: vscode.TextDocument, text: string, mappers: string[]) {
  const tempString = text?.substring(0, text.indexOf('<script>'));
  const lineNumber = tempString?.split('\n').length || 0;
  const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
  const code = `import { ${mappers.sort().join(', ')} } from 'vuex'\n`;
  edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
  await vscode.workspace.applyEdit(edit);
  await vscode.workspace.saveAll(false);
  await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
}

async function insertVuexGetterMapping(text: string, document: vscode.TextDocument) {
  const state: MapVuexGetterState = {
    actionName: '',
    mappedName: '',
    language: detectLanguage(text)
  };

  const getterName = await vscode.window.showInputBox({
    prompt: 'Enter Vuex getter name',
    placeHolder: 'namespace/getter'
  });

  if (getterName) {
    state.getterName = getterName;

    const mappedName = await vscode.window.showInputBox({
      prompt: 'Enter method name',
      value: getterName.replace('/', '')
    });

    if (mappedName) {
      state.mappedName = mappedName;

      let regExp: RegExp;
      if (getterName === mappedName) {
        regExp = /mapGetters\(\[(?!(\s*{))/;
      } else {
        regExp = /mapGetters\(\[\s*\{/;
      }

      let tempString: string | undefined;
      let shouldCreateComputedBlock: boolean;
      let shouldCreateMapGettersBlock: boolean;
      let offset = 0;

      const computedIndex = text.search(/computed/);
      if (computedIndex && computedIndex > 0) {
        shouldCreateComputedBlock = false;
        const index = regexIndexOf(text, regExp, computedIndex);
        
        if (index && index >= 0) {
          shouldCreateMapGettersBlock = false;
          tempString = text?.substring(0, index);
          offset = 1;
        } else {
          shouldCreateMapGettersBlock = true;
        }
        tempString = text?.substring(0, computedIndex);
      } else {
        shouldCreateComputedBlock = true;
        shouldCreateMapGettersBlock = true;
        tempString = text?.substring(0, text.indexOf('export default'));
      }

      const lineNumber = tempString?.split('\n').length || 0;
      const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
      const code = buildMapVuexGetterCode(state, shouldCreateComputedBlock, shouldCreateMapGettersBlock);
      edit.insert(document.uri, new vscode.Position(lineNumber + offset, 0), code);
      await vscode.workspace.applyEdit(edit);
      await vscode.workspace.saveAll(false);
      await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);

      return true;
    }
    return false;
  }
  return false;
}

export async function mapVuexActionCommand() {
  const mapActionsRegex = /import\s{\s*mapActions.*\}\s*from\s*('|")vuex('|")/;
  const mapGettersRegex = /import\s{\s*mapGetters.*\}\s*from\s*('|")vuex('|")/;
  const document = vscode.window.activeTextEditor?.document;

  if (document) {
    const text: string | undefined = document?.getText();

    const inserted = await insertVuexActionMapping(text, document);
    if (inserted) {
      const mappers = [];
      if (!text.match(mapActionsRegex)) {
        mappers.push('mapActions');
      }

      if (mappers.length) {
        await insertImportVuexMethods(document, text, mappers);
      }
    }
  }
}

export async function mapVuexGetterCommand() {
  const mapActionsRegex = /import\s{\s*mapActions.*\}\s*from\s*('|")vuex('|")/;
  const mapGettersRegex = /import\s{\s*mapGetters.*\}\s*from\s*('|")vuex('|")/;
  const document = vscode.window.activeTextEditor?.document;

  if (document) {
    const text: string | undefined = document?.getText();

    const inserted = await insertVuexGetterMapping(text, document);
    if (inserted) {
      const mappers = [];
      if (!text.match(mapGettersRegex)) {
        mappers.push('mapGetters');
      }

      if (mappers.length) {
        await insertImportVuexMethods(document, text, mappers);
      }
    }
  }
}
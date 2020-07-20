import * as vscode from 'vscode';
import { buildMethodCode, buildWatchCode, createSFC, extractObject, regexIndexOf } from './utils/utils';
import { AddDataState, AddWatchState, CreateSFCState } from './utils/interfaces';

import { DataCodeLensProvider } from './codelens/DataCodeLensProvider';
import { ExportDefaultCodeLensProvider } from './codelens/ExportDefaultCodeLensProvider';
import { MethodCodeLensProvider } from './codelens/MethodCodeLensProvider';
import { WatchCodeLensProvider } from './codelens/WatchCodeLensProvider';

import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  const dataCodeLensProvider = new DataCodeLensProvider();
  const exportDefaultCodeLensProvider = new ExportDefaultCodeLensProvider();
  const methodCodeLensProvider = new MethodCodeLensProvider();
  const watchCodeLensProvider = new WatchCodeLensProvider();

  vscode.languages.registerCodeLensProvider("vue", dataCodeLensProvider);
  vscode.languages.registerCodeLensProvider("vue", exportDefaultCodeLensProvider);
  vscode.languages.registerCodeLensProvider("vue", methodCodeLensProvider);
  vscode.languages.registerCodeLensProvider("vue", watchCodeLensProvider);


  const addData = vscode.commands.registerCommand("vueSfcEditor.addData", async () => {
    const document = vscode.window.activeTextEditor?.document;
    if (document) {
      const text: string | undefined = document?.getText();

      const dataIndex = text.search(/(?<!\/\/)data\s*:*\s*(function)?\s*\(/);
      const index = regexIndexOf(text, /return\s+\{/, dataIndex);

      let tempString: string | undefined;
      if (index && index >= 0) {
        tempString = text?.substring(0, index);
        const lineNumber = tempString?.split('\n').length || 0;
        const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();

        const addDataState: AddDataState = {
          variableName: '',
          defaultValue: 'undefined'
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

          const code = `      ${addDataState.variableName}: ${addDataState.defaultValue},\n`;
          edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
          await vscode.workspace.applyEdit(edit);
          await vscode.workspace.saveAll(false);
          await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
        }
      }
    }
  });

  const addMethod = vscode.commands.registerCommand('vueSfcEditor.addMethod', async () => {
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

    const methodName = await vscode.window.showInputBox({
      prompt: 'Enter method name',
      placeHolder: 'myMethod'
    });

    if (methodName) {
      const code = buildMethodCode(methodName, shouldCreateMethodsBlock);

      if (document) {
        edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
        await vscode.workspace.applyEdit(edit);
        await vscode.workspace.saveAll(false);
        await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
      }
    } else {
      await vscode.window.showWarningMessage('No name provided for method');
    }
  });

  const addWatch = vscode.commands.registerCommand('vueSfcEditor.addWatch', async () => {
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
      hasNewValue: false
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
  });

  const sortData = vscode.commands.registerCommand('vueSfcEditor.sortData', async () => {
    const document = vscode.window.activeTextEditor?.document;
    if (document) {
      const text: string | undefined = document?.getText();

      const dataIndex = text.search(/(?<!\/\/)data\s*:*\s*(function)?\s*\(/);
      const returnIndex = regexIndexOf(text, /return\s+\{/, dataIndex);
      const index = regexIndexOf(text, /\n/, returnIndex);

      let tempString: string | undefined;
      if (index && index >= 0) {
        tempString = text?.substring(0, index);
        const lineNumber = (tempString?.split('\n').length || 0);
        const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
        const endBlockIndex = extractObject(text.substring(index));

        const dataBlock = text.substring(index, index + endBlockIndex);
        console.log(dataBlock);

        const lines: string[] = dataBlock.split("\n");

        lines.sort();
        // const sorted = split
        //   .map(line => line.split(":"));


        console.log("Split", lines);
        const filtered: string[] = lines
          .filter(l => !!(l.trim()) && !l.includes('}'))
          .map((l, i, a) => {
            if (i !== a.length - 1 && !l.includes(",")) {
              l += ',';
            }
            if (i === a.length - 1) {
              l = l.replace(',', '');
            }


            return l;
          });

        const range: vscode.Range = new vscode.Range(new vscode.Position(lineNumber, 0), new vscode.Position(lineNumber + filtered.length, 0));

        edit.replace(document.uri, range, filtered.join("\n") + "\n");

        // edit.insert(document.uri, new vscode.Position(lineNumber, 0), filtered.join('\n'));
        await vscode.workspace.applyEdit(edit);
        await vscode.workspace.saveAll(false);
        await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
      }
    }
  });

  // Sections
  const addMethodsSection = vscode.commands.registerCommand("vueSfcEditor.addMethodsSection", async () => {
    const document = vscode.window.activeTextEditor?.document;
    if (document) {

      const text: string | undefined = document?.getText();

      const index = text?.indexOf("export default");

      let tempString: string | undefined;
      if (index && index >= 0) {
        tempString = text?.substring(0, index);
        const lineNumber = tempString?.split('\n').length || 0;
        const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();

        const code = `  methods: {\n  },\n`;
        edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
        await vscode.workspace.applyEdit(edit);
        await vscode.workspace.saveAll(false);
        await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
      }
    }
  });

  const addWatchSection = vscode.commands.registerCommand("vueSfcEditor.addWatchSection", async () => {
    const document = vscode.window.activeTextEditor?.document;
    if (document) {

      const text: string | undefined = document?.getText();

      const index = text?.indexOf("export default");

      let tempString: string | undefined;
      if (index && index >= 0) {
        tempString = text?.substring(0, index);
        const lineNumber = tempString?.split('\n').length || 0;
        const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();

        const code = `  watch: {\n  },\n`;
        edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
        await vscode.workspace.applyEdit(edit);
        await vscode.workspace.saveAll(false);
        await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
      }
    }
  });

  const addCreatedSection = vscode.commands.registerCommand("vueSfcEditor.addCreatedSection", async () => {
    const document = vscode.window.activeTextEditor?.document;
    if (document) {
      const text: string | undefined = document?.getText();
      if (!text.match('created\\s*\\(\\)')?.length) {
        const index = text?.indexOf("export default");

        let tempString: string | undefined;
        if (index && index >= 0) {
          tempString = text?.substring(0, index);
          const lineNumber = tempString?.split('\n').length || 0;
          const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();

          const code = `  created () {\n  },\n`;
          edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
          await vscode.workspace.applyEdit(edit);
          await vscode.workspace.saveAll(false);
          await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
        }
      } else {
        await vscode.window.showErrorMessage("Methods section already exist in this SFC");
      }
    }
  });

  const addDataSection = vscode.commands.registerCommand("vueSfcEditor.addDataSection", async () => {
    const document = vscode.window.activeTextEditor?.document;
    if (document) {
      const text: string | undefined = document?.getText();
      if (!text.match('(?<!\\/\\/)data\\s*:*\\s*(function)?\\s*\\(')?.length) {
        const index = text?.indexOf("export default");

        let tempString: string | undefined;
        if (index && index >= 0) {
          tempString = text?.substring(0, index);
          const lineNumber = tempString?.split('\n').length || 0;
          const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();

          const code = `  data () {\n    return {\n    }\n  },\n`;
          edit.insert(document.uri, new vscode.Position(lineNumber, 0), code);
          await vscode.workspace.applyEdit(edit);
          await vscode.workspace.saveAll(false);
          await vscode.commands.executeCommand('vscode.executeFormatDocumentProvider', document.uri);
        }
      } else {
        await vscode.window.showErrorMessage("Methods section already exist in this SFC");
      }
    }
  });

  // Wizard
  const createNewComponent = vscode.commands.registerCommand("vueSfcEditor.createComponent", async () => {
    const state: CreateSFCState = {
      componentName: '',
      createFolder: false,
      fileName: '',
      isStyleScoped: false,
      hasStyle: false,
      hasTemplate: false,
      stylePreProcessor: ''
    };

    const componentName = await vscode.window.showInputBox({
      prompt: 'Enter component name',
      placeHolder: 'MyComponent'
    });

    if (componentName) {
      state.componentName = componentName;
      if (componentName.includes('.vue')) {
        state.fileName = componentName;
      } else {
        state.fileName = `${componentName}.vue`;
      }

      const options = await vscode.window.showQuickPick(
        ['Add <template>', 'Add <style>', 'Create folder'],
        { canPickMany: true }
      );

      const document = vscode.window.activeTextEditor?.document;
      if (document) {
        const path = document.uri.path;

        if (options!.includes('Create folder')) {
          state.createFolder = true;
        }

        if (options!.includes('Add <style>')) {
          state.hasStyle = true;

          const isStyleScoped = await vscode.window.showQuickPick(
            ['Yes', 'No'],
            { placeHolder: 'Is style scoped?' }
          );

          const preProcessor = await vscode.window.showQuickPick(
            ['None', 'scss', 'sass'],
            { placeHolder: 'Select style Pre-processor' }
          );

          state.isStyleScoped = isStyleScoped === 'Yes';
          state.stylePreProcessor = preProcessor;
        }

        if (options!.includes('Add <template>')) {
          state.hasTemplate = true;
        }

        createSFC(state, path);
      }

      console.log(options);
    }

  });


  context.subscriptions.push(addCreatedSection);
  context.subscriptions.push(addData);
  context.subscriptions.push(addDataSection);
  context.subscriptions.push(addMethod);
  context.subscriptions.push(addMethodsSection);
  context.subscriptions.push(addWatch);
  context.subscriptions.push(addWatchSection);
  context.subscriptions.push(createNewComponent);
  context.subscriptions.push(sortData);
}
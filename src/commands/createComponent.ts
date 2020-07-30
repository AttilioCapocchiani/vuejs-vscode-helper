import * as vscode from 'vscode';
import { CreateSFCState } from '../utils/interfaces';
import { createSFC } from '../utils/utils';

export async function createComponentCommand () {
  const state: CreateSFCState = {
    componentName: '',
    createFolder: false,
    fileName: '',
    isStyleScoped: false,
    language: '',
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

    const document = vscode.window.activeTextEditor?.document;
    if (document) {
      const path = document.uri.path;

      const items: vscode.QuickPickItem[] = [
        { label: 'Add <template>', picked: false, description: 'Add template tag' },
        { label: 'Add <style>', picked: false, description: 'Add style tag. A separate prompt will ask for pre-processor' },
        { label: 'Create folder', picked: false, description: 'Create component in a separate folder with same name' },
        { label: 'Use TypeScript', picked: detectLanguage(document!.getText()) === 'ts', description: 'Use TypeScript as component language' },
      ];

      const options = (await vscode.window.showQuickPick(items, { canPickMany: true }))?.map(o => o.label);

      if (options!.includes('Use TypeScript')) {
        state.language = 'ts';
      } else {
        state.language = 'js';
      }

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
  }
}
import * as vscode from 'vscode';

export async function addMethodsCommand () {
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
}
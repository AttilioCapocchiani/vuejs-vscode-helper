import * as vscode from 'vscode';

export async function addDataSectionCommand () {
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
}
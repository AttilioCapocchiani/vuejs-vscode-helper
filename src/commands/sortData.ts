import * as vscode from 'vscode';
import { extractObject, regexIndexOf } from '../utils/utils';

export async function sortDataCommand() {
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
}
import * as vscode from 'vscode';

import { DataCodeLensProvider } from './codelens/DataCodeLensProvider';
import { ExportDefaultCodeLensProvider } from './codelens/ExportDefaultCodeLensProvider';
import { MethodCodeLensProvider } from './codelens/MethodCodeLensProvider';
import { PropCodeLensProvider } from './codelens/PropCodeLensProvider';
import { WatchCodeLensProvider } from './codelens/WatchCodeLensProvider';

import { addDataCommand } from './commands/addData';
import { addMethodCommand } from './commands/addMethod';
import { addPropCommand } from './commands/addProp';
import { addWatchCommand } from './commands/addWatch';
import { sortDataCommand } from './commands/sortData';
import { addMethodsCommand } from './commands/addMethods';
import { addPropsCommand } from './commands/addProps';
import { addWatchSectionCommand } from './commands/addWatchSection';
import { addCreatedSectionCommand } from './commands/addCreatedSection';
import { addDataSectionCommand } from './commands/addDataSection';
import { createComponentCommand } from './commands/createComponent';
import { mapVuexActionCommand } from './commands/mapVuex';

export function activate(context: vscode.ExtensionContext) {
  const dataCodeLensProvider = new DataCodeLensProvider();
  const exportDefaultCodeLensProvider = new ExportDefaultCodeLensProvider();
  const methodCodeLensProvider = new MethodCodeLensProvider();
  const propCodeLensProvider = new PropCodeLensProvider();
  const watchCodeLensProvider = new WatchCodeLensProvider();

  vscode.languages.registerCodeLensProvider("vue", dataCodeLensProvider);
  vscode.languages.registerCodeLensProvider("vue", exportDefaultCodeLensProvider);
  vscode.languages.registerCodeLensProvider("vue", methodCodeLensProvider);
  vscode.languages.registerCodeLensProvider("vue", propCodeLensProvider);
  vscode.languages.registerCodeLensProvider("vue", watchCodeLensProvider);

  const addData = vscode.commands.registerCommand("vueSfcEditor.addData", addDataCommand);
  const addMethod = vscode.commands.registerCommand('vueSfcEditor.addMethod', addMethodCommand);
  const addProp = vscode.commands.registerCommand('vueSfcEditor.addProp', addPropCommand);
  const addWatch = vscode.commands.registerCommand('vueSfcEditor.addWatch', addWatchCommand);
  const sortData = vscode.commands.registerCommand('vueSfcEditor.sortData', sortDataCommand);

  // Sections
  const addMethodsSection = vscode.commands.registerCommand("vueSfcEditor.addMethodsSection", addMethodsCommand);
  const addPropsSection = vscode.commands.registerCommand("vueSfcEditor.addPropsSection", addPropsCommand);
  const addWatchSection = vscode.commands.registerCommand("vueSfcEditor.addWatchSection", addWatchSectionCommand);
  const addCreatedSection = vscode.commands.registerCommand("vueSfcEditor.addCreatedSection", addCreatedSectionCommand);
  const addDataSection = vscode.commands.registerCommand("vueSfcEditor.addDataSection", addDataSectionCommand);

  // Wizard
  const createNewComponent = vscode.commands.registerCommand("vueSfcEditor.createComponent", createComponentCommand);

  // Vuex
  const mapVuexAction = vscode.commands.registerCommand("vueSfcEditor.mapVuexAction", mapVuexActionCommand);

  context.subscriptions.push(addCreatedSection);
  context.subscriptions.push(addData);
  context.subscriptions.push(addDataSection);
  context.subscriptions.push(addMethod);
  context.subscriptions.push(addMethodsSection);
  context.subscriptions.push(addProp);
  context.subscriptions.push(addPropsSection);
  context.subscriptions.push(addWatch);
  context.subscriptions.push(addWatchSection);
  context.subscriptions.push(createNewComponent);
  context.subscriptions.push(mapVuexAction);
  context.subscriptions.push(sortData);
}
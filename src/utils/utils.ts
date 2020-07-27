import { AddDataState, AddMethodState, AddPropState, AddWatchState, CreateSFCState } from './interfaces';
import * as js from './js/jsCodeGenerator';
import * as ts from './ts/tsCodeGenerator';
import * as fs from 'fs';

export function buildDataCode(state: AddDataState, shouldCreateDataBlock: boolean): string {
  if (state.language === 'js') {
    return js.buildDataCode(state, shouldCreateDataBlock);
  } else {
    return ts.buildDataCode(state);
  }
}

export function buildMethodCode(state: AddMethodState, shouldCreateMethodsBlock = false): string {
  if (state.language === 'js') {
    return js.buildMethodCode(state, shouldCreateMethodsBlock);
  } else {
    return ts.buildMethodCode(state);
  }
}

export function buildPropCode(state: AddPropState, shouldCreateMethodsBlock = false): string {
  if (state.language === 'js') {
    return js.buildPropCode(state, shouldCreateMethodsBlock);
  } else {
    return ts.buildPropCode(state);
  }
}

export function buildWatchCode(state: AddWatchState, shouldCreateWatchBlock = false): string {
  if (state.language === 'js') {
    return js.buildWatchCode(state, shouldCreateWatchBlock);
  } else {
    return ts.buildWatchCode(state);
  }
}

export function regexIndexOf(string: string, regex: RegExp, startPosition: number): number {
  const indexOf = string.substring(startPosition).search(regex);
  return (indexOf >= 0) ? (indexOf + (startPosition || 0)) : indexOf;
}

export function extractObject(code: string): number {
  let tempCode: string = code;
  let endIndex = 0;
  let startIndex = 0;
  let returnEndIndex = 0;

  while (startIndex >= 0 && endIndex >= 0 && startIndex <= endIndex) {
    startIndex = tempCode.indexOf('{');
    endIndex = tempCode.indexOf("}", startIndex) + 1;
    returnEndIndex += endIndex;

    tempCode = tempCode.substring(endIndex);
  }

  return returnEndIndex;
}

export function createSFC(state: CreateSFCState, currentPath: string) {
  const pathArray: string[] = currentPath.split("/");
  pathArray.splice(-1, 1);
  if (state.createFolder) {
    pathArray.push(state.componentName!);
  }
  const folderName = pathArray.join("/");

  pathArray.push(state.fileName!);

  fs.mkdirSync(folderName, { recursive: true });
  fs.appendFileSync(pathArray.join("/"), getSFCCode(state));
}

function getSFCCode(state: CreateSFCState): string {
  if (state.language === 'js') {
    return js.createSFCCode(state);
  } else {
    return ts.createSFCCode(state);
  }
}

export function detectLanguage (code: string) {
  if (code.match(/<script\s+lang\s*=\s*"ts"\s*>/)) {
    return 'ts';
  } else {
    return 'js';
  }
}
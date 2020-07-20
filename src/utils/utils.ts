import { AddWatchState, CreateSFCState } from './interfaces';
import * as fs from 'fs';

export function buildMethodCode(methodName: string, shouldCreateMethodsBlock = false): string {
  if (shouldCreateMethodsBlock) {
    return `  methods: {\n    ${methodName} () {\n      return null\n    }\n  },\n`;
  } else {
    return `    ${methodName} () { \n      return null \n    },\n`;
  }
}

export function buildWatchCode(state: AddWatchState, shouldCreateWatchBlock = false): string {
  let code: string;
  let signature = `${state.variableName} (`;

  if (state.hasNewValue) {
    signature += 'newValue';
  }

  if (state.hasOldValue) {
    signature += ', oldValue';
  }

  signature += ')';

  if (shouldCreateWatchBlock) {
    code = `  watch: {\n    ${signature} {\n      return null\n    }\n  },\n`;
  } else {
    code = `    ${signature} { \n      return null \n    },\n`;
  }

  return code;
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
  let code = "";
  
  if (state.hasTemplate) {
    code += "<template>\n</template>\n";  
  }
  code += `<script>\nexport default {\n}\n</script>`;
  if (state.hasStyle) {
    let preProcessor = '';
    if (state.stylePreProcessor !== 'None') {
      preProcessor = ` lang="${state.stylePreProcessor}"`;
    }
    code += `\n<style${preProcessor}${state.isStyleScoped? ' scoped': ''}>\n</style>`;
  }

  return code;
}
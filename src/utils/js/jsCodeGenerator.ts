import { AddDataState, AddMethodState, AddPropState, AddWatchState, CreateSFCState } from '../interfaces';
export function createSFCCode(state: CreateSFCState): string {
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
    code += `\n<style${preProcessor}${state.isStyleScoped ? ' scoped' : ''}>\n</style>`;
  }

  return code;
}

export function buildDataCode(state: AddDataState, shouldCreateDataBlock = false): string {
  if (shouldCreateDataBlock) {
    return `  data () {\n    return {\n      ${state.variableName}: ${state.defaultValue}\n    }  \n  }\n,`;
  }
  return `      ${state.variableName}: ${state.defaultValue},\n`;
}

export function buildMethodCode(state: AddMethodState, shouldCreateMethodsBlock = false): string {
  if (shouldCreateMethodsBlock) {
    return `  methods: {\n    ${state.methodName} () {\n      return null\n    }\n  },\n`;
  } else {
    return `    ${state.methodName} () { \n      return null \n    },\n`;
  }
}

export function buildPropCode(state: AddPropState, shouldCreateMethodsBlock = false): string {
  const code = `    ${state.name}: { \n      type: [${state.type}],\n      defaultValue: ${state.defaultValue},\n      required: ${state.required}\n    },\n`;
  if (shouldCreateMethodsBlock) {
    return `  props: {\n    ${code},\n`;
  } else {
    return code;
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
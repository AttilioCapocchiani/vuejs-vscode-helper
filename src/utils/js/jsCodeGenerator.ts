import { AddDataState, AddMethodState, AddPropState, AddWatchState, CreateSFCState, MapVuexActionState, MapVuexGetterState } from '../interfaces';
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
  const type = state.type?.length === 1 ? state.type : `[${state.type}]`;
  const code = `    ${state.name}: { \n      type: ${type},\n      default: ${state.defaultValue},\n      required: ${state.required}\n    },\n`;
  if (shouldCreateMethodsBlock) {
    return `  props: {\n${code}\n  },\n`;
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

export function buildMapVuexActionCode(state: MapVuexActionState, shouldCreateMethodsBlock = false, shouldCreateMapActionsBlock = false): string {
  let code: string;

  let entryName: string;
  if (state.actionName === state.mappedName) {
    entryName = `'${state.actionName}'`;
  } else {
    entryName = `{ ${state.mappedName}: '${state.actionName}' }`;
  }
  
  if (shouldCreateMethodsBlock) {
    code = `  methods: {\n    ...mapActions([\n      ${entryName}\n    ])\n  },\n`;
  } else if (shouldCreateMapActionsBlock) {
    code = `    ...mapActions([\n      ${entryName}\n    ]),\n`;
  } else {
    code = `      ${entryName},\n`;
  }

  return code;
}

export function buildMapVuexGetterCode(state: MapVuexGetterState, shouldCreateMethodsBlock = false, shouldCreateMapGettersBlock = false): string {
  let code: string;

  let entryName: string;
  if (state.getterName === state.mappedName) {
    entryName = `'${state.getterName}'`;
  } else {
    entryName = `{ ${state.mappedName}: '${state.getterName}' }`;
  }
  
  if (shouldCreateMethodsBlock) {
    code = `  computed: {\n    ...mapGetters([\n      ${entryName}\n    ])\n  },\n`;
  } else if (shouldCreateMapGettersBlock) {
    code = `    ...mapGetters([\n      ${entryName}\n    ]),\n`;
  } else {
    code = `      ${entryName},\n`;
  }

  return code;
}
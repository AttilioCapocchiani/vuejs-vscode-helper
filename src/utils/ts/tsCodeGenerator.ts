import { AddDataState, AddMethodState, CreateSFCState, AddPropState, AddWatchState } from '../interfaces';
export function createSFCCode(state: CreateSFCState): string {
  let code = "";

  if (state.hasTemplate) {
    code += "<template>\n</template>\n";
  }
  code += 
`<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({}) 
export default class ${state.componentName} extends Vue {

}
</script>`;
  if (state.hasStyle) {
    let preProcessor = '';
    if (state.stylePreProcessor !== 'None') {
      preProcessor = ` lang="${state.stylePreProcessor}"`;
    }
    code += `\n<style${preProcessor}${state.isStyleScoped ? ' scoped' : ''}>\n</style>`;
  }

  return code;
}

export function buildDataCode(state: AddDataState): string {
  return `  ${state.variableName} = ${state.defaultValue};\n`;
}

export function buildMethodCode(state: AddMethodState): string {
  return `  ${state.methodName} () { \n    return null \n  }\n\n`;
}

export function buildPropCode(state: AddPropState): string {
  return `  @Prop() ${state.name}: ${state.type}\n`; 
}

export function buildWatchCode(state: AddWatchState): string {
  let code = `  @Watch('${state.variableName}') ${state.methodName}(`;

  if (state.hasNewValue) {
    code += 'newValue: string';

    if (state.hasOldValue) {
      code += ', oldValue: string';
    }
  }

  code += ');\n';

  return code;
}
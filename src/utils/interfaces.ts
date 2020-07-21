export interface AddWatchState {
  variableName: string | undefined
  hasOldValue: boolean | undefined
  hasNewValue: boolean | undefined
}

export interface AddDataState {
  variableName: string | undefined
  defaultValue: string | undefined
}

export interface CreateSFCState {
  componentName: string | undefined
  createFolder: boolean | undefined
  fileName: string | undefined
  isStyleScoped: boolean | undefined
  hasStyle: boolean | undefined
  hasTemplate: boolean | undefined,
  stylePreProcessor: string | undefined
}

export interface CreatePropState {
  defaultValue: string | undefined
  name: string | undefined
  required : boolean | undefined
  type: string | undefined
}

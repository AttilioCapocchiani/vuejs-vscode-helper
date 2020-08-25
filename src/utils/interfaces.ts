export interface AddDataState {
  variableName: string | undefined
  defaultValue: string | undefined
  language: string | undefined
}

export interface AddMethodState {
  methodName: string | undefined
  language: string | undefined
}

export interface AddPropState {
  defaultValue: string | undefined
  name: string | undefined
  required : boolean | undefined
  type: string[] | string | undefined
  language: string | undefined
}

export interface AddWatchState {
  variableName: string | undefined
  hasOldValue: boolean | undefined
  hasNewValue: boolean | undefined
  methodName: string | undefined
  language: string | undefined
}

export interface CreateSFCState {
  componentName: string | undefined
  createFolder: boolean | undefined
  fileName: string | undefined
  isStyleScoped: boolean | undefined
  hasStyle: boolean | undefined
  hasTemplate: boolean | undefined,
  stylePreProcessor: string | undefined
  language: string | undefined
}

export interface MapVuexActionState {
  actionName: string | undefined
  mappedName: string | undefined
  language: string | undefined
}
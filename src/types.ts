export interface AppState {
  dailyLimit: number;
  isWizardPassed: boolean;
  spends: Array<{
    date: string;
    value: number;
  }>,
}

export type ActionTypes = 'wizardPassed' | 'setDailyLimit' | 'addSpend' | 'removeSpendByIndex';

export interface ActionInterface {
  type: ActionTypes;
  [index: string]: any;
}

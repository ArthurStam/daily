export interface AppState {
  updatedAt: string;
  dailyLimit: number;
  activePanel: string;
  activeModal: string;
  spends: Array<{
    date: Date;
    value: number;
  }>
}

export type ActionTypes = 'setActivePanel' | 'setActiveModal' | 'setDailyLimit' | 'addSpend' | 'removeSpendByIndex';

export interface ActionInterface {
  type: ActionTypes;
  [index: string]: any;
}

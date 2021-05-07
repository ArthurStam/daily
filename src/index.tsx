import React, { useCallback, useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  FormItem,
  Group,
  Header,
  Link,
  Panel,
  PanelHeader,
  SimpleCell,
  SplitCol,
  SplitLayout,
  useAdaptivity,
  View,
  ViewWidth,
  Footer,
  Cell,
  PanelHeaderButton,
  ModalRoot,
  Title, Scheme,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Wizard } from './Components/Wizard/Wizard';
import { Icon28HelpCircleOutline, Icon28SettingsOutline } from '@vkontakte/icons';
import { Settings } from './Components/Settings/Settings';
import vkBridge, { VKBridgeSubscribeHandler } from '@vkontakte/vk-bridge';
import { ActionInterface, AppState } from './types';
import { classNames } from '@vkontakte/vkjs';
import './index.css';
import { CurrencyInput } from './Components/CurrencyInput/CurrencyInput';
import { Help } from './Components/Help/Help';

vkBridge.send('VKWebAppInit');

type AppReducer = (state: AppState, action: ActionInterface) => AppState;

const reducer: AppReducer = (state: AppState, action: ActionInterface) => {
  let newState: AppState = { ...state };
  switch (action.type) {
    case 'wizardPassed':
      newState.isWizardPassed = true;
      break;
    case 'setDailyLimit':
      newState.dailyLimit = Number(action.dailyLimit);
      break;
    case 'addSpend':
      newState.spends = [action.spend, ...newState.spends];
      break;
    case 'removeSpendByIndex':
      newState.spends = [...newState.spends.slice(0, action.index), ...newState.spends.slice(action.index + 1)];
      break;
    default:
      throw new Error();
  }
  localStorage.setItem('daily:updatedAt', new Date().toISOString());
  localStorage.setItem('daily:data', JSON.stringify(newState));
  return newState;
}

let initialState: AppState = {
  dailyLimit: null,
  spends: [],
  isWizardPassed: false,
};

try {
  const persistedState = JSON.parse(localStorage.getItem('daily:data')) as AppState;
  let updatedAt = localStorage.getItem('daily:updatedAt');
  if (persistedState) {
    initialState = persistedState;

    if (updatedAt && new Date(updatedAt).getDate() !== new Date().getDate()) {
      initialState.spends = [];
    }
  }
} catch (e) {

}

const App = () => {
  const [state, dispatch] = useReducer<AppReducer>(reducer, initialState);
  const [inputValue, setInputValue] = useState('');
  const [editing, setEditing] = useState(false);
  const [activePanel, setActivePanel] = useState(state.isWizardPassed ? 'main' : 'wizard')
  const [activeModal, setActiveModal] = useState(null);

  const dailySpends = state.spends.reduce((acc, item) => { acc += item.value; return acc; }, 0);
  const balance = state.dailyLimit - dailySpends;
  let balanceLevel = 'good';
  if (balance < state.dailyLimit / 2 && balance >= state.dailyLimit / 3) {
    balanceLevel = 'normal';
  } else if (balance < state.dailyLimit / 3) {
    balanceLevel = 'danger';
  }

  const { viewWidth } = useAdaptivity();
  return (
    <SplitLayout header={viewWidth > ViewWidth.MOBILE && <PanelHeader />}>
      <SplitCol spaced={viewWidth > ViewWidth.MOBILE}>
        <View activePanel={activePanel} modal={
          <ModalRoot activeModal={activeModal}>
            <Settings
              id="settings"
              dispatch={dispatch}
              state={state}
              onClose={() => setActiveModal(null)}
            />
            <Help id="help" onClose={() => setActiveModal(null)} />
          </ModalRoot>
        }>
          <Wizard id="wizard" onSubmit={(dailyLimit) => {
            dispatch({ type: 'setDailyLimit', dailyLimit });
            dispatch({ type: 'wizardPassed' });
            setActivePanel('main');
            ym(77962162,'reachGoal','pass wizard')
          }} />
          <Panel id="main">
            <PanelHeader
              left={
                <React.Fragment>
                  <PanelHeaderButton onClick={() => setActiveModal('settings')}>
                    <Icon28SettingsOutline />
                  </PanelHeaderButton>
                  <PanelHeaderButton onClick={() => setActiveModal('help')}>
                    <Icon28HelpCircleOutline />
                  </PanelHeaderButton>
                </React.Fragment>
              }
            >
              Daily
            </PanelHeader>
            <Group>
              <Header mode="secondary">Остаток</Header>
              <SimpleCell disabled>
                <Title
                  Component="div"
                  weight="regular"
                  level="1"
                  className={classNames('Balance', `Balance--${balanceLevel}`)}
                >
                  {balance.toLocaleString()} ₽
                </Title>
              </SimpleCell>
            </Group>
            <Group>
              <Header
                mode="secondary"
                aside={
                  state.spends.length > 0 &&
                  <Link onClick={() => setEditing(!editing)}>
                    {editing ? 'Готово' : 'Редактировать'}
                  </Link>
                }
              >
                Траты
              </Header>
              <FormItem Component="form" onSubmit={(e) => {
                e.preventDefault();
                setInputValue('');
                dispatch({ type: 'addSpend', spend: { date: (new Date()).toISOString(), value: Number(inputValue) } });
                ym(77962162,'reachGoal','add spend');
              }}>
                <CurrencyInput
                  placeholder="Добавить трату, ₽"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                />
              </FormItem>
              {state.spends.length === 0 && <Footer>Сегодня ещё не было трат</Footer>}
              {state.spends.map((item) => (
                <Cell
                  disabled
                  removable={editing}
                  key={item.date.toString()}
                  data-id={item.date.toString()}
                  onRemove={() => {
                    dispatch({ type: 'removeSpendByIndex', index: state.spends.findIndex(i => i === item) });
                  }}
                  description={`${new Date(item.date).getHours()}:${new Date(item.date).getMinutes()}`}
                >
                  {item.value.toLocaleString()} ₽
                </Cell>
              ))}
            </Group>
          </Panel>
        </View>
      </SplitCol>
    </SplitLayout>
  )
}

const AppWrapper = () => {
  const [scheme, setScheme]: [Scheme, any] = useState(Scheme.BRIGHT_LIGHT);
  const connectListener: VKBridgeSubscribeHandler = useCallback((e) => {
    switch (e.detail.type) {
      case 'VKWebAppUpdateConfig':
        setScheme(e.detail.data.scheme);
    }
  }, []);

  useEffect(() => {
    vkBridge.subscribe(connectListener);
    vkBridge.send('VKWebAppInit');
    return () => {
      vkBridge.unsubscribe(connectListener);
    };
  });

  return (
    <ConfigProvider scheme={scheme}>
      <AdaptivityProvider>
        <AppRoot>
          <App />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

ReactDOM.render(
  <AppWrapper/>, document.getElementById('root')
)

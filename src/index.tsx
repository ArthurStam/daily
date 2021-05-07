import React, { useReducer, useState } from 'react';
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
  Input,
  Footer,
  Cell,
  PanelHeaderButton,
  ModalRoot,
  Title,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Wizard } from './Screens/Wizard/Wizard';
import { Icon28SettingsOutline } from '@vkontakte/icons';
import { Settings } from './Screens/Settings/Settings';
import vkBridge from '@vkontakte/vk-bridge';

vkBridge.send('VKWebAppInit');

function reducer(state, action) {
  let newState = { };
  switch (action.type) {
    case 'setActivePanel':
      newState = { ...state, activePanel: action.activePanel };
      break;
    case 'setActiveModal':
      newState = { ...state, activeModal: action.activeModal };
      break;
    case 'setDailyLimit':
      newState = { ...state, dailyLimit: Number(action.dailyLimit) };
      break;
    case 'addSpend':
      newState = { ...state, spends: [action.spend, ...state.spends] };
      break;
    case 'removeSpendByIndex':
      newState = { ...state, spends: [...state.spends.slice(0, action.index), ...state.spends.slice(action.index + 1)] };
      break;
    default:
      throw new Error();
  }
  localStorage.setItem('daily:data', JSON.stringify(newState));
  return newState;
}

let initialState = {
  dailyLimit: null,
  activePanel: 'wizard',
  activeModal: null,
  spends: [],
};

try {
  const persistedState = JSON.parse(localStorage.getItem('daily:data'))
  if (persistedState) {
    initialState = persistedState;
  }
} catch (e) {

}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [inputValue, setInputValue] = useState('');
  const [editing, setEditing] = useState(false);

  const { viewWidth } = useAdaptivity();
  return (
    <SplitLayout header={viewWidth > ViewWidth.MOBILE && <PanelHeader />}>
      <SplitCol spaced={viewWidth > ViewWidth.MOBILE}>
        <View activePanel={state.activePanel} modal={
          <ModalRoot activeModal={state.activeModal}>
            <Settings
              id="settings"
              dispatch={dispatch}
              state={state}
              onClose={() => dispatch({ type: 'setActiveModal', activeModal: null })}
            />
          </ModalRoot>
        }>
          <Wizard id="wizard" onSubmit={(value) => {
            dispatch({ type: 'setDailyLimit', dailyLimit: value });
            dispatch({ type: 'setActivePanel', activePanel: 'main' });
          }} />
          <Panel id="main">
            <PanelHeader
              left={
                <PanelHeaderButton onClick={() => dispatch({ type: 'setActiveModal', activeModal: 'settings' })}>
                  <Icon28SettingsOutline />
                </PanelHeaderButton>
              }
            >
              Daily
            </PanelHeader>
            <Group>
              <Header mode="secondary">Лимит</Header>
              <SimpleCell>
                <Title Component="div" weight="regular" level="1">
                  {(state.dailyLimit - state.spends.reduce((acc, item) => { acc += item.value; return acc; }, 0)).toLocaleString()} ₽
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
                dispatch({ type: 'addSpend', spend: { date: new Date(), value: Number(inputValue) } });
              }}>
                <Input
                  type="number"
                  placeholder="Добавить трату, ₽"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                />
              </FormItem>
              {state.spends.length === 0 && <Footer>Сегодня ещё не было трат</Footer>}
              {state.spends.map((item) => (
                <Cell
                  removable={editing}
                  key={item.date}
                  data-id={item.date.toString()}
                  onRemove={() => {
                    const removeIndex = state.spends.findIndex(i => i === item);
                    dispatch({ type: 'removeSpendByIndex', index: state.spends.findIndex(i => i === item) });
                  }}
                >
                  - {item.value.toLocaleString()} ₽
                </Cell>
              ))}
            </Group>
          </Panel>
        </View>
      </SplitCol>
    </SplitLayout>
  )
}

ReactDOM.render(
  <ConfigProvider>
    <AdaptivityProvider>
      <AppRoot>
        <App />
      </AppRoot>
    </AdaptivityProvider>
  </ConfigProvider>, document.getElementById('root')
)

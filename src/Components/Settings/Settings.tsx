import { FormItem, Group, ModalPage, ModalPageHeader, PanelHeaderButton } from '@vkontakte/vkui';
import { Icon28CancelOutline, Icon28DoneOutline } from '@vkontakte/icons';
import React, { FC, useState } from 'react';
import { validateDailyLimit } from '../../utils';
import { ActionInterface, AppState } from '../../types';
import { CurrencyInput } from '../CurrencyInput/CurrencyInput';

interface SettingsProps {
  id: string;
  state: AppState;
  dispatch: (action: ActionInterface) => void;
  onClose: VoidFunction;
}

export const Settings: FC<SettingsProps> = ({ id, state, dispatch, onClose }) => {
  const [dailyLimit, setDailyLimit] = useState<string>(String(state.dailyLimit));

  return (
    <ModalPage id={id}>
      <ModalPageHeader
        left={
          <PanelHeaderButton onClick={onClose}>
            <Icon28CancelOutline />
          </PanelHeaderButton>
        }
        right={
          <PanelHeaderButton disabled={!validateDailyLimit(Number(dailyLimit))} onClick={() => {
            dispatch({ type: 'setDailyLimit', dailyLimit });
            onClose();
          }}>
            <Icon28DoneOutline />
          </PanelHeaderButton>
        }
      >
        Настройки
      </ModalPageHeader>
      <Group>
        <FormItem top="Дневной лимит, ₽" Component="form" onSubmit={() => {
          if (validateDailyLimit(Number(dailyLimit))) {
            dispatch({ type: 'setDailyLimit', dailyLimit });
            onClose();
          }
        }}>
          <CurrencyInput value={dailyLimit} onChange={(e) => setDailyLimit(e.target.value)} />
        </FormItem>
      </Group>
    </ModalPage>
  )
}

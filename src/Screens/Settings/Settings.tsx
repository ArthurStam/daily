import { FormItem, Group, Input, ModalPage, ModalPageHeader, PanelHeaderButton } from '@vkontakte/vkui';
import { Icon28CancelOutline, Icon28DoneOutline } from '@vkontakte/icons';
import React, { useState } from 'react';

export const Settings = ({ id, state, dispatch, onClose }) => {
  const [dailyLimit, setDailyLimit] = useState(state.dailyLimit);

  return (
    <ModalPage id={id}>
      <ModalPageHeader
        left={
          <PanelHeaderButton onClick={() => dispatch({ type: 'setActiveModal', activeModal: null })}>
            <Icon28CancelOutline />
          </PanelHeaderButton>
        }
        right={
          <PanelHeaderButton onClick={() => {
            dispatch({ type: 'setDailyLimit', dailyLimit });
            dispatch({ type: 'setActiveModal', activeModal: null });
          }}>
            <Icon28DoneOutline />
          </PanelHeaderButton>
        }
      >
        Настройки
      </ModalPageHeader>
      <Group>
        <FormItem top="Дневной лимит, ₽" Component="form" onSubmit={() => {
          dispatch({ type: 'setDailyLimit', dailyLimit });
          dispatch({ type: 'setActiveModal', activeModal: null });
        }}>
          <Input type="number" value={dailyLimit} onChange={(e) => setDailyLimit(e.target.value)} />
        </FormItem>
      </Group>
    </ModalPage>
  )
}

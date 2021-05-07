import { SimpleCell, Group, ModalPage, ModalPageHeader, PanelHeaderButton } from '@vkontakte/vkui';
import { Icon28CancelOutline } from '@vkontakte/icons';
import React, { FC } from 'react';

interface HelpProps {
  id: string;
  onClose: VoidFunction;
}

export const Help: FC<HelpProps> = ({ id, onClose }) => {
  return (
    <ModalPage id={id}>
      <ModalPageHeader
        left={
          <PanelHeaderButton onClick={onClose}>
            <Icon28CancelOutline />
          </PanelHeaderButton>
        }
      >
        Помощь
      </ModalPageHeader>
      <Group>
        <SimpleCell href="https://vk.com/arthurstam" description="Вопросы и предложения приветствуются">Написать автору</SimpleCell>
      </Group>
    </ModalPage>
  )
}

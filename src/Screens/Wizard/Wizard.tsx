import React, { FC, useState } from 'react';
import {
  Button,
  FormItem,
  Gallery,
  getClassName,
  Input,
  Panel,
  PanelHeader,
  Placeholder,
  usePlatform
} from '@vkontakte/vkui';
import { Icon36CoinsStackHighOutline, Icon36CoinsStacks3Outline, Icon36DiamondOutline } from '@vkontakte/icons';
import './Wizard.css';
import { validateDailyLimit } from '../../utils';

interface WizardProps {
  id: string;
  onSubmit: (dailyLimit: string) => void;
}

export const Wizard: FC<WizardProps> = ({ id, onSubmit }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [dailyLimit, setDailyLimit] = useState('');
  const platform = usePlatform();

  return (
    <Panel id={id} centered>
      <PanelHeader>Daily</PanelHeader>
      <Gallery
        slideIndex={slideIndex}
        onChange={(value) => setSlideIndex(value)}
        className={getClassName('Wizard', platform)}
        align="center"
        bullets="dark"
        slideWidth="100%"
      >
        <Placeholder
          action={<Button onClick={() => setSlideIndex(1)} size="m">Далее</Button>}
          header="Добро пожаловать в Daily"
          icon={<Icon36DiamondOutline />}
        >
          Ультра-простое приложение для трекинга ежедневных расходов
        </Placeholder>
        <Placeholder
          action={
            <Button
              disabled={!validateDailyLimit(Number(dailyLimit))}
              onClick={() => setSlideIndex(2)}
              size="m"
            >
              Далее
            </Button>
          }
          header="Установите дневной лимит"
          icon={<Icon36CoinsStacks3Outline />}
        >
          <FormItem
            Component="form"
            className="Wizard__limit"
            bottom="Его можно будет изменить в любой момент"
            onSubmit={(e) => {
              e.preventDefault();
              if (validateDailyLimit(Number(dailyLimit))) {
                setSlideIndex(2);
              }
            }}
          >
            <Input
              type="number"
              placeholder="650 ₽"
              onChange={(e) => setDailyLimit(e.target.value)}
              value={dailyLimit}
            />
          </FormItem>
        </Placeholder>
        <Placeholder
          action={
            <Button
              size="m"
              disabled={!validateDailyLimit(Number(dailyLimit))}
              onClick={() => onSubmit(dailyLimit)}
            >
              Погнали!
            </Button>}
          header="Вносите дневные траты"
          icon={<Icon36CoinsStackHighOutline />}
        >
          Цель приложения — удержать вас от необязательных трат
        </Placeholder>
      </Gallery>
    </Panel>
  )
}

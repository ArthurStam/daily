import React, { FC } from 'react';
import { Input, InputProps } from '@vkontakte/vkui';

export const CurrencyInput: FC<InputProps> = (props) => {
  return (
    <Input type="number" step="0.01" {...props} />
  )
}

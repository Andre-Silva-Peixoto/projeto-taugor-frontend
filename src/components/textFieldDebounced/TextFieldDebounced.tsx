import React, { useCallback, useState } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type Props = TextFieldProps & {
  debounceMs?: number;
  changeForm: (campo: string, valor: string) => void;
  onChange: (value: string) => void;
};

const TextFieldDebounced: React.FC<Props> = ({
  value,
  onChange,
  changeForm,
  debounceMs = 300,
  name, 
  ...props
}) => {
  const [innerValue, setInnerValue] = useState<string>(typeof value === 'string' ? value : ""); 

  const debouncedChangeHandler = useCallback(
    debounce((newValue: string) => {
      if (name) {
        changeForm(name, newValue);
      }
    }, debounceMs),
    [changeForm, debounceMs, name]
  );

  // Função de alteração do valor
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setInnerValue(newValue);
    onChange(newValue); 
    debouncedChangeHandler(newValue);
  };

  return <TextField value={innerValue} onChange={handleChange} {...props} />;
};

export default TextFieldDebounced;

// Função de debounce
function debounce<T>(func: (...params: T[]) => void, timeout = 300) {
  let timer: number;

  return (...args: T[]) => {
    window.clearTimeout(timer);  // Limpa o timer anterior
    timer = window.setTimeout(() => func(...args), timeout);  // Define um novo timer
  };
}
import React, { useCallback, useEffect, useState } from 'react';
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

  useEffect(() => {
    setInnerValue(typeof value === 'string' ? value : "");
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = event.target.value;

    // Formatação para o campo 'salario' (somente números)
    if (name === 'salario') {
      newValue = newValue.replace(/\D/g, '');
    }

    // Formatação para o campo 'telefone'
    else if (name === 'telefone') {
      const onlyNumbers = newValue.replace(/\D/g, '');
      newValue = onlyNumbers
        .slice(0, 11)
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }

    setInnerValue(newValue);
    onChange(newValue); 
    debouncedChangeHandler(newValue);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedChangeHandler = useCallback(
    debounce((newValue: string) => {
      if (name) {
        changeForm(name, newValue);
      }
    }, debounceMs),
    [changeForm, debounceMs, name]
  );

  return <TextField value={innerValue} onChange={handleChange} {...props} />;
};

export default TextFieldDebounced;

// Função de debounce
function debounce<T>(func: (...params: T[]) => void, timeout = 300) {
  let timer: number;

  return (...args: T[]) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => func(...args), timeout); 
  };
}
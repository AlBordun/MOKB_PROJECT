import React from 'react';
import 'tailwindcss/tailwind.css';
import {type} from "os"; // Импорт стилей Tailwind CSS


interface InputProps {

    type?: string // Тип поля ввода, опциональный
    placeholder?: string // Плейсхолдер, опциональный
    value: string // Значение поля ввода
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Обработчик изменения значения
    className?: string; // Дополнительные CSS классы, опциональные
}

// Компонент поля ввода
const Input: React.FC<InputProps> = ({type = 'text', placeholder,value,onChange,className = ''}) =>
{
    return (
        <Input
            type={type} // Установка типа поля ввода
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`border rounded px-3 py-2 ${className}`} // Применение стилей Tailwind и пользовательских классов
    />
    );
};

export default Input; // Экспорт компонента
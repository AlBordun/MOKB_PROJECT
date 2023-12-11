import React from 'react';
import 'tailwindcss/tailwind.css'; // Импорт стилей Tailwind CSS

interface SelectProps {

    options: { value: string; label: string }[];  // Массив опций
    value: string; // Текущее выбранное значение
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Обработчик изменения выбранного значения
    className?: string; // Дополнительные CSS классы, опциональные

}

const Select: React.FC<SelectProps> = ({options, value, onChange, className = ''}) => {

    return (
        // JSX разметка выпадающего списка
        <select
            value={value} // Установка выбранного значения
            onChange={onChange} // Привязка обработчика изменений
            className={`border rounded px-3 py-2 ${className}`} // Применение стилей Tailwind и пользовательских классов
        >
            {options.map(option =>(
                // Генерация опций выпадающего списка
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select; // Экспорт компонента
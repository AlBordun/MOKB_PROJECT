import React from 'react';
import 'tailwindcss/tailwind.css'; // Импорт стилей Tailwind CSS

interface ButtonProps {
    text: string;// Текст на кнопке
    onClick: () => void;// Обработчик события клика
    type?: 'button' | 'submit' | 'reset';// Тип кнопки, опциональный
    className?: string; // Дополнительные CSS классы, опциональные
}

const Button: React.FC<ButtonProps> = ({text,onClick,type = 'button',className = ''}) => {
    return (
        <button
        type={type} // Установка типа кнопки
        className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-700 ${className}`} // Применение стилей Tailwind и пользовательских классов
        onClick={onClick}// Привязка обработчика события клика
        >
            {text} // Отображение текста кнопки
        </button>
    );
};
export default Button; // Экспорт компонента
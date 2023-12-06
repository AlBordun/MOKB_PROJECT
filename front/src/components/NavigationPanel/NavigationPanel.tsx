import React from 'react';

interface NavigationPanelProps {
    onSearchTermChange: (term: string) => void;
    onFilterDateChange: (date: string) => void;
    onDocumentTypeChange: (type: string) => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({
                                                             onSearchTermChange,
                                                             onFilterDateChange,
                                                             onDocumentTypeChange,
                                                         }) => {
    return (
        <div className="flex space-x-4 p-4 bg-white shadow">
            {/* Поисковое поле */}
            <input
                type="text"
                placeholder="Поиск по пациентам..."
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Фильтр по дате */}
            <input
                type="date"
                onChange={(e) => onFilterDateChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Выпадающий список для фильтрации по типу документа */}
            <select
                onChange={(e) => onDocumentTypeChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">Все документы</option>
                <option value="protocol">Протокол</option>
                <option value="referral">Направление</option>
                <option value="ticket">Талон 2</option>
            </select>
        </div>
    );
};

export default NavigationPanel;
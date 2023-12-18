import React from 'react';

interface SearchInputProps {
    searchText: string;
    setSearchText: (text: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({searchText, setSearchText}) => {
    return (
        <input type="text"
               placeholder="Поиск..."
               value={searchText}
               onChange={(e) => setSearchText(e.target.value)}/>
    );
};
export default SearchInput;
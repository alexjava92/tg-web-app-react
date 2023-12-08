import React, {useState} from 'react';

export const BitcoinNetworkFees = (onSelect) => {
    const [selectedCommission, setSelectedCommission] = useState('');

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedCommission(selectedValue);
        onSelect(selectedValue);
    };

    return (
        <div>
            <label htmlFor="commission">Выберите комиссию:</label>
            <select id="commission" value={selectedCommission} onChange={handleSelectChange}>
                <option value="1">Низкая (1 sat/b)</option>
                <option value="10">Средняя (10 sat/b)</option>
                <option value="20">Высокая (20 sat/b)</option>
                {/* Добавьте другие уровни комиссии по необходимости */}
            </select>
        </div>
    );
};



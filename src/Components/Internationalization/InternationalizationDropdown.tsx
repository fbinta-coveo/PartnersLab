import react, { useContext } from 'react';
import { LanguagesConfig } from '../../config/InternationalizationConfig';
import { LanguageContext } from './LanguageUtils'; 
import styled from 'styled-components';

export const InternationalizationDropdown = () => {
    const { selectedLanguage, changeLanguage } = useContext(LanguageContext);

    const onElementChange = (event: any) => {
        changeLanguage(event.target.value);
        window.location.reload();
    }

    return (
        <CustomSelect value={selectedLanguage} onChange={onElementChange}>
            {
                Object.entries(LanguagesConfig).map(([key, value]) => (
                    <option value={key} key={key}>
                        {value}
                    </option>
                ))
            }
        </CustomSelect>
    );
}

const CustomSelect = styled.select`
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    margin-left: 25px;
    font-size: 10px;
    padding: 8px 0;
    color: #333;
    outline: none;
    appearance: none; 
    cursor: pointer; 

    &:hover {
        color: #555;
    }

    option {
        background-color: transparent; 
        color: #333; 
    }
`;

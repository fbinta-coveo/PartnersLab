import React from 'react';
import Button from '@mui/material/Button';
import {CaseFieldSuggestion } from '@coveo/headless/dist/definitions/case-assist.index';

interface RecommendListSelectProps {
    recommendation : Array<CaseFieldSuggestion>,
    handleSelection : (item : CaseFieldSuggestion)=>void,
    selected : CaseFieldSuggestion | null
}

const RecommendListSelect : React.FC<RecommendListSelectProps> = ({recommendation,handleSelection, selected})=>{

return <>
{recommendation.map((item,index)=>{
    return <Button key = {item.id} variant={selected?.value === item?.value? 'contained' : 'outlined'} style = {{margin: '10px 10px 10px 0px'}}
    onClick = {()=> handleSelection(item)}
    >{item.value}</Button>
})}
</>

};


export default RecommendListSelect;
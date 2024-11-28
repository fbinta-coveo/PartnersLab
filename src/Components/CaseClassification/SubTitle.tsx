import React from 'react';
import Typography from '@mui/material/Typography';

interface SubTitleProps {
    title: string
}

const SubTitle:React.FC<SubTitleProps> = ({title})=>{

    return <>
    <Typography variant="subtitle1" my ={0.2} >{title}</Typography>
    </>
}


export default  SubTitle;
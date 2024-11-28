import React from 'react';
import Typography from '@mui/material/Typography';

interface MainTitleProps {
    title : string,
}

const MainTitle: React.FC<MainTitleProps>= ({title})=>{

    return <>
    <Typography variant="h4" my={5}>{title}</Typography>
    </>
}


export default  MainTitle;
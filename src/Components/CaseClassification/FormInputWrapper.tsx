import React from 'react';
import Box from "@mui/material/Box";

interface FormInputWrapperProps {
    customStyle? : React.CSSProperties
}

const FormInputWrapper: React.FunctionComponent<FormInputWrapperProps> = (props)=>{

return <Box /* container */ sx={{ ...props.customStyle,width: 1 }} my={2.5}>{props.children}</Box>

};


export default FormInputWrapper;
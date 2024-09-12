import { Button } from "antd";
import React from "react";  
const ButtonComponent = ({size,styleButton, styleTextButton , textbutton,disabled, ...rests}) => {  
    return (  
        <Button 
        style={{
            ...styleButton,
            backgroundColor: disabled ? '#ccc' : styleButton?.backgroundColor
        }}
        size={size} 
        {...rests}
        >
        <span style={styleTextButton}>{textbutton}</span>
        </Button>
    )  
}

export default ButtonComponent;
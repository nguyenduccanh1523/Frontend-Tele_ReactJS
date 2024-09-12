import React from "react";
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponnet";

const ButtonInputSearch = (props) => {
    const { placeholder, size, textbutton,  backgroundColorInput = '#fff' } = props;
    return (
        <div style={{display: 'flex'}}>
        <InputComponent size={size} placeholder={placeholder}  style={{ backgroundColor: backgroundColorInput}} {...props} />
        <ButtonComponent 
        size={size} 
        icon={<SearchOutlined />}
        textbutton={textbutton}
        />
        </div>
    )
}

export default ButtonInputSearch;
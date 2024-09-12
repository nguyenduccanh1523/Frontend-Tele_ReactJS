import React from "react";
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from "./style";
import { Checkbox, Rate } from "antd";

const NavbarComponent = () => {
  const onChange = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => {
          return <WrapperTextValue>{option}</WrapperTextValue>;
        });
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option) => {
              return <Checkbox value={option.value}>{option.label}</Checkbox>;
            })}
          </Checkbox.Group>
        );
        case "star":
            return options.map((option) => {
                return (
                    <div style={{display: 'flex'}}>
                        <Rate style={{fontSize: '12px'}} disabled defaultValue={option} />
                        <span>{` từ ${option} sao`} </span>
                    </div>
                )
            });
        case "price":
            return options.map((option) => {
                return (
                    <WrapperTextPrice>
                        {option}
                    </WrapperTextPrice>
                )
            });
      default:
        return {};
    }
  };
  return (
    <div>
      <WrapperLabelText>Label</WrapperLabelText>
      <WrapperContent>
        {renderContent("text", ["Home", "About", "Contact"])}
      </WrapperContent>
      {/* <WrapperContent>
        {renderContent("checkbox", [
          { label: "A", value: "A" },
          { label: "B", value: "B" },
        ])}
      </WrapperContent>
      <WrapperContent>
        {renderContent("star", [3,4,5])}
      </WrapperContent>
      <WrapperContent>
        {renderContent("price", ['dưới 40k', '40k - 100k', 'trên 100k'])}
      </WrapperContent> */}
    </div>
  );
};

export default NavbarComponent;

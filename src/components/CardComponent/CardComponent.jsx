
import React from "react";
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperImageStyle, WrapperOutStock, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from "./style";
import { StarFilled } from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";

const CardComponent = (props) => {
  const { countInStock, description, image, name, price, type, rating, selled, discount, id } = props;
  const navigate = useNavigate();
  const handleDetailProduct = (id) => {
    navigate(`/product-details/${id}`)
  }
  return (
    <WrapperCardStyle
      hoverable
      headStyle={{width: '200px', height: '200px'}}
      style={{ width: 200 }}
      bodyStyle={{ padding: "10px" }}
      cover={
        <img
          alt="example"
          src={image}
        />
      }
      onClick={() => handleDetailProduct(id)}
      disabled={countInStock === 0}
    >
    {countInStock === 0 && (
        <WrapperOutStock>Đã hết hàng</WrapperOutStock>
      )}
      <WrapperImageStyle src={logo} alt="logo"/>
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span>
          <span>{rating}</span>
          <StarFilled style={{ fontSize: "12px", color: "yellow" }} />
        </span>
        <WrapperStyleTextSell> | Đã bán {selled || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText><span style={{marginRight: '8px'}}>{convertPrice(price)}</span> <WrapperDiscountText> - {discount || 0}%</WrapperDiscountText></WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;

import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 200px;
    & img {
        width: 200px;
        height: 200px;
    } 
    position: relative;
    background-color: ${props => props.disabled ? '#ccc' : '#fff'};
    cursor: ${props => props.disabled ? 'pointer' : 'pointer'};
`

export const WrapperOutStock = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: white;
    font-weight: bold;
    background-color: gray;
    padding: 8px;
    border-radius: 4px;
`

export const WrapperImageStyle = styled.img`
    top: -1px;
    left: -1px;
    border-top-left-radius: 3px;
    position: absolute;
    height: 14px !important;
    width: 68px  !important;
`

export const StyleNameProduct = styled.div`
     font-weight: 400;
     font-size: 12px;
     line-height: 16px;
     color: rgb(56, 56, 61);
`

export const WrapperReportText = styled.div`
        display: flex;
        color: rgb(128, 128, 137);
        align-items: center;
        font-size: 11px;
        margin: 6px 0;
    `

export const WrapperPriceText = styled.div`     
        gap: 8px;
        font-size: 16px;
        font-weight: 500;
        color: rgb(255, 66, 78);
        
`

export const WrapperDiscountText = styled.span`     
        gap: 8px;
        font-size: 12px;
        font-weight: 500;
        color: rgb(255, 66, 78);
`

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120,120,120);
`
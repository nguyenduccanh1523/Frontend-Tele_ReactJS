import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    width: 64px;
    height: 64px;
`
export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
`
export const WrapperStyleNameProduct = styled.h1`
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    color: rgb(36,36,36);
    word-break: break-word;
`
export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120,120,120);
`

export const WrapperPriceProduct = styled.div`
    border-radius: 4px;
    background-color: rgb(250,250,250);
`

export const WrapperPriceTextProduct = styled.h1`
    font-size: 32px;
    font-weight: 500;
    line-height: 40px;
    margin-right: 8px;
    padding: 10px;
    margin-top: 10px;
`

export const WrapperAddressProduct = styled.div`
    span.address{
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    span.change-address{
        color: rgb(11, 116, 229);
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
    }
`

export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 120px;
`


export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm{
        width: 40px;
        border-bottom: none;
        border-top: none;
        .ant-input-number-handler-wrap{
            display: none !important;
        }
    }
`
import { Radio } from "antd";
import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
    background: rgb(255,255,255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span {
        font-size: 13px;
        font-weight: 400;
        color: rgb(36,36,36);
    }
`

export const WrapperLeft = styled.div`
    width: 910px;
`

export const WrapperListOrder = styled.div`
`

export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 16px;
    background: #fff;
    margin-top: 12px;
`

export const WrapperPriceDiscount = styled.span`
    color: #999;
    font-size: 13px;
    text-decoration: line-through;
    margin-left: 4px;
`

export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    width: 84px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WrapperRight = styled.div`
    width: 320px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
`

export const WrapperInfo = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    width: 280px;
    font-size: 20px;
`

export const WrapperTotal = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 17px 20px;
    background: #fff;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    width: 280px;
    font-size: 20px;
`

export const WrappperRadio = styled(Radio.Group)`
    background: rgb(240, 248, 255);
    border: 1px solid rgb(194, 225, 255);
    border-radius: 10px;
    padding: 16px;
    display: grid;
    row-gap: 12px;
`

import { Row } from 'antd';
import styled from 'styled-components';

export const WrapperHeader = styled(Row)`
    background-color: rgb(26, 148, 255);
    padding: 10px 0px;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
    `

export const WrapperTextHeader = styled.span`
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-align: left;
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    text-align: right;
`

export const WrapperTextHeaderSmall = styled.span`
    color: #fff;
    font-size: 14px;
    white-space: nowrap;
`

export const WrapperContentPopup = styled.p`
cursor: pointer;
&:hover {
    color: rgb(26, 148, 255);
}
`
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

export const WrapperContainer = styled.div`
`

export const WrapperStyleHeaderDilivery = styled.div`
    background: rgb(255,255,255); 
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    span {
        font-size: 13px;
        font-weight: 400;
        color: rgb(36,36,36);
    }
    margin-bottom: 4px;
`

export const WrapperLeft = styled.div`
    width: 910px;
`

export const WrapperListOrder = styled.div`
`
export const WrapperStatus = styled.div`
    font-size: 20px;
    font-weight: 500;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    border-bottom: 1px solid rgb(235,235,240);
    padding-bottom: 10px;
    margin-bottom: 10px;
    
`


export const WrapperHeaderItem = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 16px;
    background: #fff;
    margin-top: 12px;
`

export const WrapperFooterItem = styled.div`
    text-align: right;
    padding: 9px 16px;
    background: #fff;
    margin-top: 12px;
`
export const WrapperItemOrder = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 9px 16px;
    background: #fff;
    margin-top: 12px;
    width: 950px;
    margin: 0 auto;
    border-radius: 6px;
    box-shadow: 0 12px 12px #ccc;
    margin-bottom: 10px;
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

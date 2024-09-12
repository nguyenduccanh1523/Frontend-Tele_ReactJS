import React, { useMemo } from "react";
import {
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
} from "./style";
import { useLocation, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { convertPrice } from "../../utils";
import { orderContant } from "../../contant";
import Loading from "../../components/LoadingComponent/Loading";

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;

  //console.log("params", params);

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders-details"],
    queryFn: fetchDetailsOrder,
  });
  const { data, isPending } = queryOrder;

  //console.log("data", data);
  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount));
    }, 0);
    return result;
  }, [data]);

  return (
    <Loading  isPending={isPending}>
    <div style={{ background: "#f5f5fa", width: "1270px", height: "100%", margin: '0 auto' }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Chi tiết đơn hàng</h3>
        <div style={{ justifyContent: "center" }}>
          <WrapperHeaderUser>
            <WrapperInfoUser>
              <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
              <WrapperContentInfo style={{ marginTop: "12px" }}>
                <div className="name-info">
                  {data?.shippingAddress?.fullName}
                </div>
                <div className="address-info">
                  <span>Địa chỉ: </span>{" "}
                  {`${data?.shippingAddress?.address}, ${data?.shippingAddress?.city}`}
                </div>
                <div className="phone-info">
                  <span>Điện thoại: </span> {data?.shippingAddress?.phone}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>

            <WrapperInfoUser>
              <WrapperLabel>Hình thức giao hàng</WrapperLabel>
              <WrapperContentInfo style={{ marginTop: "12px" }}>
                <div className="delivery-info">
                  <span
                    className="name-delivery"
                    style={{ color: "#ea8500", fontWeight: "bold" }}
                  >
                    FAST{" "}
                  </span>
                  Giao hàng tiết kiệm
                </div>
                <div className="delivery-fee">
                  <span>Phí giao hàng: </span>{" "}
                  {convertPrice(data?.shippingPrice)}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>

            <WrapperInfoUser>
              <WrapperLabel>Hình thức thanh toán</WrapperLabel>
              <WrapperContentInfo style={{ marginTop: "12px" }}>
                <div className="payment-info">
                  {orderContant.payment[data?.paymentMethod]}
                </div>
                <div
                  className="status-payment"
                  style={{ color: "#ea8500", fontWeight: "bold" }}
                >
                  {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
          </WrapperHeaderUser>
          <WrapperStyleContent>
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "47px",
              }}
            >
              <div style={{ width: "610px", fontSize: "20px" }}>Sản phẩm</div>
              <WrapperItemLabel>Giá</WrapperItemLabel>
              <WrapperItemLabel style={{marginLeft: '10px'}}>Số lượng</WrapperItemLabel>
              <WrapperItemLabel>Giảm giá</WrapperItemLabel>
              <WrapperItemLabel>Thành tiền</WrapperItemLabel>
              

            </div>
            {data?.orderItems?.map((order) => {
              return (
                <WrapperProduct>
                  <WrapperNameProduct>
                    <img
                      src={order?.image}
                      style={{
                        width: "77px",
                        height: "79px",
                        objectFit: "cover",
                        padding: "2px",
                        border: "1px solid rgb(238,238,238)",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "20px",
                        width: 260,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginLeft: "10px",
                      }}
                    >
                      {order?.name}
                    </div>
                  </WrapperNameProduct>
                  <WrapperItem style={{ marginLeft: "225px" }}>
                    {convertPrice(order?.price)}
                  </WrapperItem>
                  <WrapperItem>{order?.amount}</WrapperItem>
                  <WrapperItem style={{marginLeft: '15px'}}>{order?.discount ? convertPrice((order?.price * order?.amount) * (order?.discount / 100))  :  '0 VND'}  </WrapperItem>
                  <WrapperItem>{convertPrice(order?.price * order?.amount)}</WrapperItem>
                  

                </WrapperProduct>
              );
            })}
            <div style={{display: 'flex', gap:  '50px', fontSize: '30px', justifyContent: 'flex-end'}}>
            <div>
            <WrapperItemLabel>Tạm tính</WrapperItemLabel>
            <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
            </div>
            <div>
            <WrapperItemLabel>Phí vận chuyển</WrapperItemLabel>
            <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
            </div>
            
            </div>
            <div style={{display: 'flex', gap:  '50px', fontSize: '30px', justifyContent: 'flex-end'}}>
            <WrapperItemLabel style={{fontSize: '30px'}}>Tổng cộng: </WrapperItemLabel>
            <WrapperItem style={{color: 'red', fontWeight: 'bold',  marginTop: '15px'}}>{convertPrice(data?.totalPrice)}</WrapperItem>
            </div>
          </WrapperStyleContent>
        </div>
      </div>
    </div>
    </Loading>
  );
};

export default DetailsOrderPage;

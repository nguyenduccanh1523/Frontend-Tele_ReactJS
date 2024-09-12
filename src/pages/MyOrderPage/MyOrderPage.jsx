import React, { useEffect } from "react";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import {
  WrapperContainer,
  WrapperFooterItem,
  WrapperHeaderItem,
  WrapperItemOrder,
  WrapperListOrder,
  WrapperStatus,
} from "./style";
import { convertPrice } from "../../utils";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponnet";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { message } from "antd";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderbyUserId(
      state?.id,
      state?.token
    );
    return res.data;
  };
  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: fetchMyOrder });
  const { data, isPending } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: { token: state?.token },
    })
  };

  const mutation = useMutationHooks(
    (data) => {
      const { id, token, orderItems } = data;
      const res = OrderService.cancelOrder(id, token, orderItems);
      return res;
    }
  );

  const handleCancelOrder = (order) => {
    mutation.mutate({ id: order._id , token: state?.token , orderItems: order?.orderItems}, {
      onSuccess: () => {
        queryOrder.refetch()
      }
    });
  }

  const { data: dataCancelOrder, isPending: isPendingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel } = mutation;

  useEffect(() => { 
    if(isSuccessCancel && dataCancelOrder?.status === 'OK') {
      message.success('Hủy đơn hàng thành công')
    }else if(isErrorCancel) {
      message.error('Hủy đơn hàng thất bại')
    }
  }, [isSuccessCancel, isErrorCancel])

  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <WrapperHeaderItem key={order?._id}>
          <div
            style={{
              width: "390px",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
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
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              <span style={{ fontSize: "13px", color: "#242424" }}>
                Giá: {convertPrice(order?.price)}
              </span>
              {/* <WrapperPriceDiscount>230</WrapperPriceDiscount> */}
            </span>
            <span>
              <span style={{ fontSize: "13px", color: "#242424" }}>
                Số lượng: {order?.amount}
              </span>
              {/* <WrapperPriceDiscount>230</WrapperPriceDiscount> */}
            </span>
          </div>
        </WrapperHeaderItem>
      );
    });
  };

  return (
    <Loading isPending={isPending || isPendingCancel}>
      <WrapperContainer>
        <div
          style={{
            background: "#f5f5fa",
            width: "1270px",
            height: "100%",
            margin: "0 auto",
          }}
        >
          <h3>Đơn hàng của tôi</h3>
          <WrapperListOrder>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      Trạng thái
                    </span>
                    <div>
                      <span style={{ color: "rgb(255,66,78)" }}>
                        Giao hàng:{" "}
                      </span>
                      {`${
                        order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"
                      }`}
                    </div>
                    <div>
                      <span style={{ color: "rgb(255,66,78)" }}>
                        Thanh toán:{" "}
                      </span>
                      {`${order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}`}
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span
                        style={{ color: "rgb(255,66,78)", fontSize: "20px" }}
                      >
                        Tổng tiền:{" "}
                      </span>
                      <span
                        style={{
                          fontSize: "20px",
                          color: "rgb(56,56,61)",
                          fontWeight: 700,
                        }}
                      >
                        {convertPrice(order?.totalPrice)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "right",
                        marginTop: "10px",
                      }}
                    >
                      <ButtonComponent
                        onClick={() => handleCancelOrder(order)}
                        size={40}
                        styleButton={{
                          height: "30px",
                          width: "fit-content",
                          borderRadius: "4px",
                          padding: "2px 6px 6px",
                        }}
                        textbutton={"Hủy đơn hàng"}
                        styleTextButton={{
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "rgb(26,148,255)",
                        }}
                      ></ButtonComponent>
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height: "30px",
                          width: "fit-content",
                          borderRadius: "4px",
                          padding: "2px 6px 6px",
                        }}
                        textbutton={"Xem chi tiết"}
                        styleTextButton={{
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "rgb(26,148,255)",
                        }}
                      ></ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              );
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  );
};

export default MyOrderPage;

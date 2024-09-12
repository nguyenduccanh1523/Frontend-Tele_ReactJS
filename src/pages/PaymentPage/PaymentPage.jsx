import React, { useEffect, useMemo, useState } from "react";
import {

  WrapperInfo,

  WrapperLeft,

  WrapperRight,

  WrapperTotal,
  WrappperRadio,
} from "./style";
import {  Form, Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponnet";
import {

  removeAllOrderProduct,

} from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useNavigate } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import * as PaymentService from "../../services/PaymentService";

const OrderPage = () => {
  const order = useSelector((state) => state?.order);
  const user = useSelector((state) => state?.user);
  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const dispatch = useDispatch();


  const priceMemo = useMemo(() => {
    const result = order?.orderItems?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItems?.reduce((total, cur) => {
      if (cur?.discount) {
        return total + cur.price * cur.amount * (cur.discount / 100);
      }
      return total;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo > 500000) {
      return 20000;
    } else if (priceMemo === 0) {
      return 0;
    }
    return 50000;
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return priceMemo + diliveryPriceMemo - priceDiscountMemo;
  }, [priceMemo, diliveryPriceMemo, priceDiscountMemo]);



  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const { data, isSuccess, isError } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItems?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success("Đặt hàng thành công");
      navigate("/orderSuccess", {
        state: {
          delivery,
          payment,
          orders: order?.orderItems,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isError) {
      message.error("Đặt hàng thất bại");
    }
  }, [isSuccess, isError]);

  const handleAddOrder = () => {
    if (
      user?.access_token &&
      order?.orderItems &&
      user?.name &&
      user?.phone &&
      user?.address &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      // eslint-disable-next-line no-unused-expressions
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItems,
        fullName: user?.name,
        phone: user?.phone,
        address: user?.address,
        city: user?.city,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email,
      });
    }
  };

  //console.log("order", order, user);

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };

  const handleUpdateInforUser = () => {
    const { name, phone, address, city } = stateUserDetails;
    if (name && phone && address && city) {
      mutationUpdate.mutate(
        {
          id: user?.id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            dispatch(UserService.updateUser({ name, phone, address, city }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleDilivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  const addPaypalScript = async () => {
    const {data} = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true
    script.onload = () => {
      setSdkReady(true)
    }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if(!window.paypal){
    addPaypalScript()
    }else{
      setSdkReady(true)
    }
  }, [])

  const onSuccessPaypal = (details, data) => {
    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: order?.orderItems,
      fullName: user?.name,
      phone: user?.phone,
      address: user?.address,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: diliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      isPaid: true,
      paidAt: details.update_time,
      email: user?.email,
    });
  }

  return (
    <div style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}>
      <Loading isPending={mutationAddOrder.isPending}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h3>Thanh toán</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperLeft>
              <WrapperInfo style={{ paddingRight: "600px" }}>
                <div>
                  <label>Chọn phương thức giao hàng</label>
                  <WrappperRadio
                    onChange={handleDilivery}
                    value={delivery}
                    style={{ marginTop: "10px" }}
                  >
                    <Radio value="fast">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        FAST
                      </span>{" "}
                      Giao hàng tiết kiệm
                    </Radio>
                    <Radio value="gojek">
                      <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                        GO_JEK
                      </span>{" "}
                      Giao hàng tiết kiệm
                    </Radio>
                  </WrappperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo style={{ paddingRight: "600px" }}>
                <div>
                  <label>Chọn phương thức thanh toán</label>
                  <WrappperRadio
                    onChange={handlePayment}
                    value={payment}
                    style={{ marginTop: "10px" }}
                  >
                    <Radio value="later_money"> Thanh toán khi nhận hàng</Radio>
                    <Radio value="paypal"> Thanh toán bằng Paypal</Radio>
                  </WrappperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <div style={{ width: "100%" }}>
                <WrapperInfo>
                  <span>Địa chỉ: </span>
                  <span
                    style={{ fontWeight: "bold" }}
                  >{`${user?.address} ${user?.city}`}</span>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    Thay đổi
                  </span>
                </WrapperInfo>
                <WrapperInfo>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Tạm tính</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceMemo)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Giảm giá</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceDiscountMemo)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Phí giao hàng</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(diliveryPriceMemo)}
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        color: "rgb(254,56,52)",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(totalPriceMemo)}
                    </span>
                    <span style={{ color: "#000", fontSize: "11px" }}>
                      (Đã bao gồm phí VAT nếu có)
                    </span>
                  </span>
                </WrapperTotal>
              </div>
              {payment === "paypal" && sdkReady ? (
                <div style={{width: '320px'}}>
                <PayPalButton
                  amount={Math.round(totalPriceMemo / 30000)}
                  // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                  onSuccess={onSuccessPaypal}
                  onError={() => {
                    alert("Error");
                  }}
                />
                </div>
              ) : (
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={40}
                  styleButton={{
                    backgroundColor: "rgb(255,57,69)",
                    height: "48px",
                    width: "320px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  textbutton={"Đặt hàng"}
                  styleTextButton={{
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "15px",
                  }}
                ></ButtonComponent>
              )}
            </WrapperRight>
          </div>
        </div>
        <ModalComponent
          forceRender
          title="Cập nhật thông tin giao hàng"
          open={isOpenModalUpdateInfo}
          onCancel={handleCancelUpdate}
          onOk={handleUpdateInforUser}
        >
          <Loading isPending={mutationUpdate.isPending}>
            <Form
              name="basic"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
              style={{
                maxWidth: 600,
              }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your Name!",
                  },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.name}
                  onChange={handleOnChangeDetails}
                  name="name"
                />
              </Form.Item>

              <Form.Item
                label="City"
                name="city"
                rules={[
                  {
                    required: true,
                    message: "Please input your City!",
                  },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.city}
                  onChange={handleOnChangeDetails}
                  name="city"
                />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone!",
                  },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.phone}
                  onChange={handleOnChangeDetails}
                  name="phone"
                />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "Please input your address!",
                  },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.address}
                  onChange={handleOnChangeDetails}
                  name="address"
                />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  );
};

export default OrderPage;

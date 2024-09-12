import React, { useEffect, useMemo, useState } from "react";
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperRight,
  WrapperStyleHeader,
  WrapperStyleHeaderDilivery,
  WrapperTotal,
} from "./style";
import { Checkbox, Form } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { WrapperInputNumber } from "../../components/ProductDetailComponent/style";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponnet";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrderProduct,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useNavigate } from "react-router-dom";
import Step from "../../components/StepComponent/StepComponent";
import StepComponent from "../../components/StepComponent/StepComponent";

const OrderPage = () => {
  const order = useSelector((state) => state?.order);
  const user = useSelector((state) => state?.user);
  const [listChecked, setListChecked] = useState([]);
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const dispatch = useDispatch();
  
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value);
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };
  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increase") {
        if(!limited){
      dispatch(increaseAmount({ idProduct }));
        }
    } else {
        if(!limited){
      dispatch(decreaseAmount({ idProduct }));
        }
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  const priceMemo = useMemo(() => {
    const result = order?.orderItems?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount));
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItems?.reduce((total, cur) => {
        if (cur?.discount) {
            return total + (cur.price * cur.amount) * (cur.discount / 100);
        }
        return total;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 500000 && priceMemo < 1000000) {
      return 20000;
    } else if (priceMemo >= 1000000 || order?.orderItems?.length === 0) {
      return 0;
    }else{
        return 50000;
    }
  }, [priceMemo, order]);

  const totalPriceMemo = useMemo(() => {
    return priceMemo + diliveryPriceMemo - priceDiscountMemo ;
  }, [priceMemo, diliveryPriceMemo, priceDiscountMemo]);


  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }));
    }
  };
  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((order) => {
        newListChecked.push(order?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  


  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo){
        setStateUserDetails({
            city: user?.city,
            name: user?.name,
            address: user?.address,
            phone: user?.phone,
        })
    }
  },[isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const handleAddCard = () => {
    if(!order?.orderItemsSelected?.length){
        message.error('Vui lòng chọn sản phẩm')
    }else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsOpenModalUpdateInfo(true);
    }else{
        navigate('/payment')
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  },
);

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

  //console.log('mutationUpdate', user)
  const handleUpdateInforUser = () => {
    const { name, phone, address, city } = stateUserDetails;
    if(name && phone && address && city){
        mutationUpdate.mutate({
            id: user?.id,
            token: user?.access_token,
            ...stateUserDetails,
          }, {
            onSuccess: () => {
                // eslint-disable-next-line no-undef
                dispatch(UserService.updateUser( id, token, {...stateUserDetails }));
                setIsOpenModalUpdateInfo(false);
                }
          });
    }
  };

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const itemDelivery = [
    {
        title: '50.000 VND',
        description: 'Dưới 500.000 VND',
      },
      {
        title: '20.000 VND',
        description: 'Trên 500.000 VND',
      },
      {
        title: '0 VND',
        description: 'Trên 1.000.000 VND',
      },
  ]
  

  return (
    <div style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
          <WrapperStyleHeaderDilivery>
            <StepComponent items={itemDelivery} current={diliveryPriceMemo === 50000 ? 1 : diliveryPriceMemo === 20000 ? 2 : order?.orderItems?.length === 0 ? 0 : 3}/>
          </WrapperStyleHeaderDilivery>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <Checkbox
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></Checkbox>
                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveAllOrder}
                />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                    <div
                      style={{
                        width: "390px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Checkbox
                        onChange={onChange}
                        value={order?.product}
                        checked={listChecked.includes(order?.product)}
                      ></Checkbox>
                      <img
                        src={order?.image}
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "20px",
                          width: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
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
                          {convertPrice(order?.price)}
                        </span>
                        {/* <WrapperPriceDiscount>230</WrapperPriceDiscount> */}
                      </span>
                      <WrapperCountOrder>
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount("decrease", order?.product, order?.amount === 1)
                          }
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "10px" }} 
                          />
                        </button>
                        <WrapperInputNumber
                          defaultValue={order?.amount}
                          value={order?.amount}
                          size="small"
                          min={1}
                            max={order?.countInStock}
                        />
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount("increase", order?.product,order?.amount === order?.countInStock)
                          }
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "10px" }} 
                          />
                        </button>
                      </WrapperCountOrder>
                      <span
                        style={{
                          color: "rgb(255,66,78)",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {convertPrice(order?.price * order?.amount)}
                      </span>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteOrder(order?.product)}
                      />
                    </div>
                  </WrapperItemOrder>
                );
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <span>Địa chỉ: </span>
                <span style={{fontWeight: 'bold'}}>{`${user?.address} ${user?.city}`}</span>
                <span onClick={handleChangeAddress} style={{color: 'blue', cursor: 'pointer'}}>Thay đổi</span>
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
                  >{convertPrice(priceDiscountMemo)}</span>
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
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              styleButton={{
                backgroundColor: "rgb(255,57,69)",
                height: "48px",
                width: "320px",
                border: "none",
                borderRadius: "4px",
              }}
              textbutton={"Mua hàng"}
              styleTextButton={{
                color: "#fff",
                fontWeight: "700",
                fontSize: "15px",
              }}
            ></ButtonComponent>
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
    </div>
  );
};

export default OrderPage;

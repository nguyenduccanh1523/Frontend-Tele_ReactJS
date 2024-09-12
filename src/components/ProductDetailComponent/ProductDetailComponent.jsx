import { Col, Image, Rate, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import imageProductSmall from "../../assets/images/imagesmall.webp";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import ButtonComponent from "../ButtonComponent/ButtonComponnet";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct, resetOrder } from "../../redux/slides/orderSlide";
import { convertPrice, initFacebookSDK } from "../../utils";
import * as message from "../Message/Message";
import LikeButtonComponent from "../LikeButtonComponent/LikeButtonComponent";
import CommentComponent from "../CommentComponent/CommentComponent";

const ProductDetailComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


  const onChange = (value) => {
    setNumProduct(Number(value));
  };


  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    const res = await ProductService.getDetailsProduct(id);
    return res.data;
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });
  //console.log("productDetails", productDetails);

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited || numProduct > 1) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  useEffect(() => {
    initFacebookSDK();
  },[])

  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item?.product === productDetails?._id
    );
    if (orderRedux?.amount + numProduct > productDetails?.countInStock || productDetails?.countInStock === 0) {
      setErrorLimitOrder(true);
    } else {
      setErrorLimitOrder(false);
    }
  }, [numProduct]);

  //console.log("order", order);

  useEffect(() => {
    if (order.isSuccessOrder) {
      message.success("Thêm sản phẩm vào giỏ hàng thành công");
    }
    return () => {
      dispatch(resetOrder());
    };
  }, [order.isSuccessOrder, dispatch]);

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item?.product === productDetails?._id
      );
      //console.log("orderRedux", orderRedux, numProduct);
      if (orderRedux?.amount + numProduct > productDetails?.countInStock || productDetails?.countInStock === 0) {
        setErrorLimitOrder(true);
      } else {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInStock: productDetails?.countInStock,
            },
          })
        );
      }
    }
  };

  
  return (
    <Loading isPending={isPending}>
      <Row
        style={{
          padding: "16px",
          backgroundColor: "#fff",
          borderRadius: "4px",
        }}
      >
        <Col
          span={10}
          style={{ borderRight: "1px solid #e5e5e5", paddingRight: "8px" }}
        >
          <Image
            src={productDetails?.image}
            alt="image product"
            preview={false}
          />
          <Row style={{ paddingTop: "10px", justifyContent: "space-between" }}>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={imageProductSmall}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
          </Row>
        </Col>
        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyleNameProduct>
            {productDetails?.name}
          </WrapperStyleNameProduct>
          <div>
            <Rate
              allowHalf
              defaultValue={productDetails?.rating}
              value={productDetails?.rating}
            />
            <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {convertPrice(productDetails?.price)}
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến</span>
            <span className="address"> {user?.address}</span> -
            <span className="change-address"> Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <LikeButtonComponent 
            dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href} 
          />
          <div
            style={{
              margin: "10px 0 20px",
              padding: "10px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "10px" }}>Số lượng</div>
            <WrapperQualityProduct>
              <button
                style={{ border: "none", backgroundColor: "transparent" }}
                onClick={() => handleChangeCount("decrease", numProduct === 1)}
              >
                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
              <WrapperInputNumber
                onChange={onChange}
                defaultValue={1}
                max={productDetails?.countInStock}
                value={numProduct}
                size="small"
              />
              <button
                style={{ border: "none", backgroundColor: "transparent" }}
                onClick={() =>
                  handleChangeCount(
                    "increase",
                    numProduct === productDetails?.countInStock
                  )
                }
              >
                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
            </WrapperQualityProduct>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {errorLimitOrder ? (
              <div style={{ color: "red", fontWeight: "bold", fontSize: '20px' }}>
                Sản phẩm đã hết hàng
              </div>
            ) : (
              <>
                <div>
                  <ButtonComponent
                    size={40}
                    styleButton={{
                      backgroundColor: "rgb(255,57,69)",
                      height: "48px",
                      width: "220px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    onClick={handleAddOrderProduct}
                    textbutton={"Chọn mua"}
                    styleTextButton={{
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: "15px",
                    }}
                  ></ButtonComponent>
                </div>
                <ButtonComponent
                  size={40}
                  styleButton={{
                    backgroundColor: "#fff",
                    height: "48px",
                    width: "220px",
                    border: "1px solid rgb(13,92,182)",
                    borderRadius: "4px",
                  }}
                  textbutton={"Mua trả sau"}
                  styleTextButton={{
                    color: "rgb(13,92,182)",
                    fontWeight: "700",
                    fontSize: "15px",
                  }}
                ></ButtonComponent>
              </>
            )}
          </div>
        </Col>
        <CommentComponent 
        dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href} 
        width="1270" />
      </Row>
    </Loading>
  );
};

export default ProductDetailComponent;

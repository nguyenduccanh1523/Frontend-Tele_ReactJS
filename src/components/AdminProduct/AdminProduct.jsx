import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Select, Space } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64, renderOptions } from "../../utils";
import { WrapperUploadFile } from "./style";
import * as ProductService from "../../services/ProductService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [typeSelect, setTypeSelect] = useState("");
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const initial = () => ({
    name: "",
    type: "",
    countInStock: "",
    price: "",
    image: "",
    rating: "",
    description: "",
    newType: "",
    discount: "",
  })

  //all product
  const [stateProduct, setStateProduct] = useState(initial());

  //product details
  const [stateProductDetails, setStateProductDetails] = useState(initial());

  const [form] = Form.useForm();

  //mutation create product
  const mutation = useMutationHooks((data) => {
    const { name, type, countInStock, price, image, rating, description, discount } =
      data;
    const res = ProductService.createProduct({
      name,
      type,
      countInStock,
      price,
      image,
      rating,
      description,
      discount,
    });
    return res;
  });

  //mutation update product
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  //mutation delete product
  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  //mutation delete many product
  const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  //console.log("mutationDeleteMany", mutationDeleteMany);

  //get all product
  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  //get details product
  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected);
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        price: res?.data?.price,
        image: res?.data?.image,
        rating: res?.data?.rating,
        description: res?.data?.description,
        discount: res?.data?.discount,
      });
    }
    setIsLoadingUpdate(false);
  };

  //set value for form
  useEffect(() => {
    if(!isModalOpen){
      form.setFieldsValue(stateProductDetails);
    }else{
      form.setFieldsValue(initial());
    }    
  }, [form, stateProductDetails, isModalOpen]);

  //get details product when row selected
  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  //open drawer
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };

  //delete many product
  const handleDeleteManyProducts = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  //get data from mutation
  const { data, isSuccess, isError } = mutation;

  //get data from mutation update
  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  //get data from mutation delete
  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;

  const {
    data: dataDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeleteMany;

  //console.log("dataUpdated", dataUpdated);

  //get all product
  const queryProduct = useQuery({
    queryKey: "products",
    queryFn: getAllProducts,
  });

  //get all product
  const typeProduct = useQuery({
    queryKey: "type-product",
    queryFn: fetchAllTypeProduct,
  });

  const { isLoading: isLoadingProducts, data: products } = queryProduct;

  //render action
  const renderAction = () => {
    return (
      <div>
        <EditOutlined
          style={{
            color: "orange",
            fontSize: "30px",
            cursor: "pointer",
            marginRight: "20px",
          }}
          onClick={handleDetailsProduct}
        />
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
      </div>
    );
  };

  //console.log("type", typeProduct);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  //search product
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "<= 50",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        } else if (value === "<=") {
          return record.price <= 50;
        }
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">= 3",
          value: ">=",
        },
        {
          text: "<= 3",
          value: "<=",
        },
      ],
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.rating >= 3;
        } else if (value === "<=") {
          return record.rating <= 3;
        }
      },
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  //data table
  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return {
        ...product,
        key: product._id,
      };
    });

  //message success or error when create product
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleCancel();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
    } else if (isErrorDeletedMany) {
      message.error();
    }
  }, [isSuccessDeletedMany, isErrorDeletedMany]);

  //message success or error when delete product
  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error();
    }
  }, [isSuccessDeleted, isErrorDeleted]);

  //message success or error when update product
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated, isErrorUpdated]);

  //cancel delete product
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };


  //delete product
  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  //cancel create product
  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      type: "",
      countInStock: "",
      price: "",
      image: "",
      rating: "",
      description: "",
      discount: "",
    });
    form.resetFields();
  };

  //close drawer
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      type: "",
      countInStock: "",
      price: "",
      image: "",
      rating: "",
      description: "",
    });
    form.resetFields();
  };

  //create product
  const onFinish = () => {
    const params = {
      name: stateProduct.name,
    type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
    countInStock: stateProduct.countInStock,
    price: stateProduct.price,
    image: stateProduct.image,
    rating: stateProduct.rating,
    description: stateProduct.description,
    discount: stateProduct.discount,
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  //handle change input create product
  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  //handle change input details update product
  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };

  //update product
  const onUpdateProduct = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateProductDetails,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleChangeSelect = (value) => {

      setStateProduct({
        ...stateProduct,
        type: value,
      });
  }


  return (
    <div>
      <WrapperHeader>Quản lí sản phẩm</WrapperHeader>
      <div>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusOutlined style={{ fontSize: "60px" }} />
        </Button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          handleDeleteMany={handleDeleteManyProducts}
          columns={columns}
          isLoading={isLoadingProducts}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <ModalComponent
        forceRender
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isPending={mutation.isPending}>
          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            style={{
              maxWidth: 600,
            }}
            onFinish={onFinish}
            //   onFinishFailed={onFinishFailed}
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
                value={stateProduct.name}
                onChange={handleOnChange}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your type!",
                },
              ]}
            >
              <Select
                name="type"
                value={stateProduct.type}
                onChange={handleChangeSelect}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
              {stateProduct.type === 'add_type' && (
              <Form.Item
              label='New type'
              name="newType"
              rules={[
                {
                  required: true,
                  message: "Please input your type!",
                },
              ]}
              >
                <InputComponent
                value={stateProduct.newType}
                onChange={handleOnChange}
                name="newType"
              />
                
              </Form.Item>
              )}
              
            

            <Form.Item
              label="Count In Stock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Please input your count InStock!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.countInStock}
                onChange={handleOnChange}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input your price!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnChange}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Please input your rating!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.rating}
                onChange={handleOnChange}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleOnChange}
                name="discount"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnChange}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please input your image!",
                },
              ]}
            >
              <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                <Button>Select File</Button>
                {stateProduct?.image && (
                  <img
                    src={stateProduct?.image}
                    alt="avatar"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 20,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
      <DrawerComponent
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Loading isPending={isLoadingUpdate || mutationUpdate.isPending}>
          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 22,
            }}
            style={{
              maxWidth: 600,
            }}
            onFinish={onUpdateProduct}
            //   onFinishFailed={onFinishFailed}
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
                value={stateProductDetails.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Please input your type!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.type}
                onChange={handleOnChangeDetails}
                name="type"
              />
            </Form.Item>

            <Form.Item
              label="Count In Stock"
              name="countInStock"
              rules={[
                {
                  required: true,
                  message: "Please input your count InStock!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.countInStock}
                onChange={handleOnChangeDetails}
                name="countInStock"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input your price!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.price}
                onChange={handleOnChangeDetails}
                name="price"
              />
            </Form.Item>

            <Form.Item
              label="Rating"
              name="rating"
              rules={[
                {
                  required: true,
                  message: "Please input your rating!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.rating}
                onChange={handleOnChangeDetails}
                name="rating"
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input your discount!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.discount}
                onChange={handleOnChangeDetails}
                name="discount"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleOnChangeDetails}
                name="description"
              />
            </Form.Item>

            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please input your image!",
                },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
              >
                <Button>Select File</Button>
                {stateProductDetails?.image && (
                  <img
                    src={stateProductDetails?.image}
                    alt="avatar"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginLeft: "10px",
                    }}
                  />
                )}
              </WrapperUploadFile>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 20,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponent>

      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isPending={mutationDelete.isPending}>
          <div>Bạn có chắc xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;

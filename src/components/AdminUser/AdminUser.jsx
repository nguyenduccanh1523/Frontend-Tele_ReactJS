import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Space } from "antd";
import { EditOutlined, DeleteOutlined,SearchOutlined } from "@ant-design/icons";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import { getBase64 } from "../../utils";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../LoadingComponent/Loading";
import * as message from "../Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  //product details
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    avatar: "",
    address: ""
  });

  const [form] = Form.useForm();


  //mutation update product
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  },
);

//mutation delete product
const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  },
);

const mutationDeleteMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
    return res;
  },
  );

//get all product
  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  //get details product
  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        avatar: res?.data?.avatar,
      });
    }
    setIsLoadingUpdate(false);
  };

  //set value for form
  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);


  //get details product when row selected
  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  //open drawer
  const handleDetailsProduct = () => {
    setIsOpenDrawer(true);
  };


  const handleDeleteManyUsers = (ids) => {
    mutationDeleteMany.mutate({ ids: ids, token: user?.access_token }, {
        onSettled: () => {
            queryUser.refetch()
        }
    });
  }


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
  const queryUser = useQuery({
    queryKey: "users",
    queryFn: getAllUsers,
  });

  const { isLoading: isLoadingUsers, data: users } = queryUser;

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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
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
          color: filtered ? '#1677ff' : undefined,
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
      ...getColumnSearchProps('name'),
    },
    {
        title: "Email",
        dataIndex: "email",
        sorter: (a, b) => a.email.length - b.email.length,
        ...getColumnSearchProps('email'),
    },
    {
        title: "Address",
        dataIndex: "address",
        sorter: (a, b) => a.address.length - b.address.length,
        ...getColumnSearchProps('address'),
    },
    {
        title: "Admin",
        dataIndex: "isAdmin",
        filters: [
      {
        text: 'True',
        value: true,
      },
      {
        text: 'False',
        value: false,
      }
    ],
    onFilter: (value, record) => record.isAdmin === value,
    },

    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone'),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  //data table
  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "True" : "False",
      };
    });


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
    const handleDeleteUser = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        });
    }

  

  //close drawer
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: "",
    email: "",
    phone: "",
    isAdmin: false,
    });
    form.resetFields();
  };


  //handle change input details update product
  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };


  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview,
    });
  };

  //update product
  const onUpdateUser = () => {
    mutationUpdate.mutate({
      id: rowSelected,
      token: user?.access_token,
      ...stateUserDetails,
    }, {
        onSettled: () => {
            queryUser.refetch()
        }
    });
  };
  return (
    <div>
      <WrapperHeader>Quản lí người dùng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
        handleDeleteMany = {handleDeleteManyUsers}
          columns={columns}
          isLoading={isLoadingUsers}
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
      <DrawerComponent
        title="Chi tiết người dùng"
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
            onFinish={onUpdateUser}
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
                value={stateUserDetails.name}
                onChange={handleOnChangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <InputComponent
                value={stateUserDetails.email}
                onChange={handleOnChangeDetails}
                name="email"
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

            <Form.Item
              label="Avatar"
              name="avatar"
              rules={[
                {
                  required: true,
                  message: "Please input your avatar!",
                },
              ]}
            >
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
              >
                <Button>Select File</Button>
                {stateUserDetails?.avatar && (
                  <img
                    src={stateUserDetails?.avatar}
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
      forceRender
        title="Xóa người dùng"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteUser}
      >
        <Loading isPending={mutationDelete.isPending}>
          <div>Bạn có chắc xóa người dùng này không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;

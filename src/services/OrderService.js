// export const createProduct = async (data) => {
//     const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
//     return res.data
// }

import { axiosJWT } from "./UserService"

export const createOrder = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getOrderbyUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getDetailsOrder= async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const cancelOrder= async (id, access_token, orderItems) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`, {data: orderItems}, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getAllOrder= async ( access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/getAll`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
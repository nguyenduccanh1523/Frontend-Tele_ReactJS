import React, { Fragment, useEffect, useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes  } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import * as UserService from './services/UserService'
import { resetUser, updateUser } from './redux/slides/userSlide'
import { useDispatch, useSelector } from 'react-redux'
import { jwtDecode } from "jwt-decode";
import Loading from './components/LoadingComponent/Loading'
import { isPending } from '@reduxjs/toolkit'



function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    setIsLoading(true)
    const {storageData, decoded} = handleDecoded()
      if(decoded?.id) {
        handleGetDetailsUser(decoded?.id, storageData)  
      }
    setIsLoading(false)
  },[])

  const handleDecoded = () =>{
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if(storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    } 
    return {decoded, storageData}
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const {decoded} = handleDecoded()
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const decodedRefreshToken = jwtDecode(refreshToken)
    if(decoded?.exp < currentTime.getTime() / 1000) {
      if(decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken(refreshToken)
      config.headers['token'] = `Bearer ${data?.access_token}`
      } else {
        dispatch(resetUser())
      }
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  const handleGetDetailsUser = async (id, token) => {
    const storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token, refreshToken: refreshToken}))
    // console.log('res', res)
  }


  return (
    <div>
    <Loading isPending={isLoading} >
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const ischeckAuth = !route.isPrivate || user.isAdmin
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.path} path={ischeckAuth ? route.path : undefined} element={
                <Layout>
                  <Page />
                </Layout>
              } />
            )
          })
          }
        </Routes>
      </Router>
    </Loading>
    </div>
  )
}

export default App
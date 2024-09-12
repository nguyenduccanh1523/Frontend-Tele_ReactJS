import React, { useEffect, useState } from "react";
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponnet";
import { Image } from "antd";
import imageLogo from "../../assets/images/Login.png";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";


const SignUpPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleOnchangeEmail = (value) => {
      setEmail(value)
    }

    const mutation = useMutationHooks(
      data => UserService.signupUser(data),
    )

    const { data, isSuccess, isError} = mutation

    useEffect(() => {
      if(isSuccess) {
        message.success()
        handleNavigateLogin()
      }
      else if(isError) {
        message.error()
      }
    }, [isSuccess, isError])

    const handleOnchangePassword = (value) => {
      setPassword(value)
    }

    const handleOnchangeConfirmPassword = (value) => {
      setConfirmPassword(value)
    }

    const handleSignUp = () => {
      mutation.mutate({ email, password, confirmPassword })
    
    }

    const navigate = useNavigate();
    const handleNavigateLogin = () => {
      navigate('/sign-in')
  }

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh'}}>
      <div style={{display: 'flex',width: '800px', height: '445px', borderRadius:'6px', background:'#fff'}}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm style={{marginBottom: '10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
          <div style={{ position: "relative", marginBottom: '10px' }}>
            <span
            onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "14px",
                right: "8px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="password"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "14px",
                right: "8px",
              }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="confirm password"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
            />
          </div>
          {data?.status === 'ERR' && <span style={{color: 'red', fontSize: '12px'}}>{data?.message}</span>}
          <Loading isPending={mutation.isPending}>
          <ButtonComponent
          disabled={!email.length || !password.length || !confirmPassword.length}
          onClick={handleSignUp}
            size={40}
            styleButton={{
              backgroundColor: "rgb(255,57,69)",
              height: "48px",
              width: "100%",
              border: "none",
              borderRadius: "4px",
              margin: "26px 0 10px"
            }}
            textbutton={"Đăng ký"}
            styleTextButton={{
              color: "#fff",
              fontWeight: "700",
              fontSize: "15px",
            }}
          ></ButtonComponent>
          </Loading>
          <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateLogin}>Đăng nhập</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px"/>
          <h4>Mua sắm tại LTTD</h4>
        </WrapperContainerRight>
      </div>
    </div>
    );
}

export default SignUpPage;
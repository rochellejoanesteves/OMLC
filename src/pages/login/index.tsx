import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import { Button, Checkbox, Form, Input } from "antd";
import logo from "../../assets/logo.png";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

function Login({ userData }: any) {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    const userAccount = userData.find(
      (account: any) =>
        account.userName === values.username &&
        account.password === values.password
    );

    if (userAccount) {
      localStorage.setItem("USER_NAME", userAccount.userName);
      localStorage.setItem("USER_ID", userAccount.id);
      navigate("/home");
    } else {
      alert("Incorrect username/password. Thank you!");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="logo">
       <img src={logo} alt="" />
      </div>
      <div className="loginContainer">
        <div className="loginSection">
          <p>Sign in to continue</p>
          <hr style={{ width: "40%" }} />
          <Form
            name="basic"
            wrapperCol={{ span: 30 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="form"
          >
            <Form.Item<FieldType>
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item<FieldType>
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Button
              style={{ width: "100%", background: "#474747", color: "#fff" }}
              htmlType="submit"
            >
              Sign In
            </Button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Form.Item<FieldType> name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item<FieldType> name="remember" valuePropName="checked">
                <span style={{ color: "#586d86", fontWeight: "bold" }}>
                  {" "}
                  Forgot Password?
                </span>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;

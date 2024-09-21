import React from "react";
import { Button, Form, Input } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useLogin } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const Login = () => {
  const { mutate: login, error, isPending } = useLogin();
  const navigate = useNavigate();

  const onFinish = (values: { email: string; password: string }) => {
    login(values);
  };

  const handleGoogleLogin = () => {
    const googleOAuthURL = getGoogleOAuthURL();
    window.location.href = googleOAuthURL;
  };
  console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID , process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL)

  function getGoogleOAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
      redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URL as string,
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID as string,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
  }

  return (
    <div className="login">
      <h1 className="login_title">Login</h1>
      <Form
        name="login_form"
        layout="vertical"
        className="login_form"
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        {error && <p className="error-message">{error.message}</p>}

        <Form.Item>
          <Button
            type="primary"
            className="login_form_login"
            htmlType="submit"
            block
            loading={isPending}
          >
            Login
          </Button>
        </Form.Item>

        <div className="login_form_additional_options">
          Don’t have an account? <a href="/signup">Signup</a>
        </div>

        <Form.Item className="login_form_google_container">
          <Button
            icon={<GoogleOutlined />}
            type="primary"
            className="login_form_google_login"
            block
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

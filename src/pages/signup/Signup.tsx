import React from "react";
import { Button, Form, Input } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useSignup } from "../../hooks/useAuth";
import "./signup.scss";

const Signup = () => {
  const { mutate: signup, error, isPending } = useSignup();

  const onFinish = (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    signup({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <div className="signup">
      <h1 className="signup_title">Signup</h1>
      <Form
        name="signup_form"
        layout="vertical"
        className="signup_form"
        onFinish={onFinish}
      >
        <Form.Item
          name="firstName"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input placeholder="Last Name" />
        </Form.Item>

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

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        {error && <p className="error-message">{error.message}</p>}

        <Form.Item>
          <Button
            type="primary"
            className="signup_form_signup"
            htmlType="submit"
            block
            loading={isPending}
          >
            Signup
          </Button>
        </Form.Item>

        <div className="signup_form_additional_options">
          Already have an account? <a href="/login">Login</a>
        </div>

        <Form.Item className="signup_form_google_container">
          <Button
            icon={<GoogleOutlined />}
            type="primary"
            className="signup_form_google_signup"
            block
          >
            Signup with Google
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;

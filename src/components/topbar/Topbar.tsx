import {
  CalendarFilled,
  UserOutlined,
  LogoutOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Button, Spin, Dropdown, Menu, Avatar, Modal, Card } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { user } from "../../api/auth";
import { useLogout } from "../../hooks/useAuth";  
import "./topbar.scss";
import { useState } from "react";

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: user,
  });

  const { mutateAsync: handleLogout, isPending } = useLogout();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleProfileClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const userMenu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<UserOutlined />}
        onClick={handleProfileClick}
      >
        Profile
      </Menu.Item>
      <Menu.Item key="2" onClick={(e: any) => {
        // e.preventDefault(); ,
        handleLogout(); 
      }}>
        <LogoutOutlined style={{ color: "#52c41a", marginRight: 8 }} />
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="topbar">
      <CalendarFilled
        style={{ color: "white", fontSize: "26px", cursor: "pointer" }}
      />
      <div className="topbar_buttons">
        {isLoading ? (
          <Spin />
        ) : isError || !data ? (
          <>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleSignup}>Signup</Button>
          </>
        ) : (
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Avatar
              style={{ backgroundColor: "#87d068", cursor: "pointer" }}
              size="large"
              onClick={(e: any) => e.preventDefault()}
            >
              {data?.data.firstName
                ? data?.data.firstName.charAt(0).toUpperCase()
                : "U"}
            </Avatar>
          </Dropdown>
        )}
      </div>

      <Modal
        title="User Profile"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="back" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {data && (
          <Card style={{ width: 300 }} cover={<Avatar size={100} src={`https://ui-avatars.com/api/?name=${data.data.firstName}+${data.data.lastName}`} />}>
            <Card.Meta
              title={`${data.data.firstName} ${data.data.lastName}`}
              description={
                <div>
                  <p>
                    <MailOutlined style={{ marginRight: 8 }} />
                    {data.data.email}
                  </p>
                </div>
              }
            />
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default Topbar;

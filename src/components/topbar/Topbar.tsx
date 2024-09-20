import { CalendarFilled } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./topbar.scss";

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <CalendarFilled
        style={{ color: "white", fontSize: "26px", cursor: "pointer" }}
      />
      <div className="topbar_buttons">
        <Button className="topbar_buttons_login" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button className="topbar_buttons_signup" onClick={() => navigate("/signup")}>
          Signup
        </Button>
      </div>
    </div>
  );
};

export default Topbar;

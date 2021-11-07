import Navbar from "../../components/navbar/navbar";
import "./login.scss";
import { Input, Button, Icon, Dimmer, Loader } from "semantic-ui-react";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
const axios = require("axios");
const account = { username: "admin", password: "admin" };

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleChange = (e, field) => {
    if (field == "username") {
      setUsername(e.target.value);
    } else if (field == "password") {
      setPassword(e.target.value);
    }
  };
  const onLogin = () => {
    setLoading(true);
    axios
      .post("https://lap-center.herokuapp.com/api/login", {
        username: username,
        password: password,
      })
      .then(function (response) {
        setLoading(false);
        console.log(response);
        alert("Đăng nhập thành công!!!");
        localStorage.setItem("customerName", response.data.userName);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem('isAdmin',response.data.isAdmin);
        history.push("/");
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
        alert("Sai tên đăng nhập hoặc mật khẩu!!!");
      });
  };
  let checkInfo = true;
  !username || !password ? (checkInfo = true) : (checkInfo = false);

  return (
    <div>
      <Icon
        className="icon-home"
        name="home"
        size="large"
        inverted
        circular
        link
        onClick={() => history.push("/")}
      />
      <Dimmer active={loading} inverted>
        <Loader>Loading</Loader>
      </Dimmer>
      <div className="login-container">
        <div className="login-form">
          <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
            {" "}
            Đăng Nhập{" "}
          </h1>
          <div className="login-content">
            <label>Tên đăng nhập</label>
            <br />
            <Input
              placeholder="Username"
              className="inputText"
              onChange={(e) => handleChange(e, "username")}
              value={username}
            />
            <br />
            <label style={{ marginTop: "10px" }}>Mật khẩu</label>
            <br />
            <Input
              placeholder="Password"
              type="password"
              className="inputText"
              onChange={(e) => handleChange(e, "password")}
              value={password}
            />
            <br />
            <Button color="primary" onClick={onLogin} disabled={checkInfo}>
              Đăng nhập
            </Button>
            <p style={{ marginTop: "20px", textAlign: "center" }}>
              Bạn chưa có tài khoản?{" "}
              <a
                className="register-text"
                onClick={() => history.push("./register")}
              >
                Đăng ký ngay.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;

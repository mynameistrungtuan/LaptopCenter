import React, { useState } from "react";
import { Input, Button, Dimmer, Loader, Icon, Modal } from "semantic-ui-react";
import "./register.scss";
import { useHistory } from "react-router-dom";
const axios = require("axios");

const account = { username: "admin", password: "admin" };

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cfpassword, setCfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState("");

  const history = useHistory();

  const handleChange = (e, field) => {
    if (field === "name") {
      setName(e.target.value);
    }
    if (field === "password") {
      setPassword(e.target.value);
    }
    if (field === "cfpassword") {
      setCfPassword(e.target.value);
    }
    if (field === "phone") {
      setPhone(e.target.value);
    }
    if (field === "email") {
      setEmail(e.target.value);
    }
  };
  const onRegister = () => {
    if (password === cfpassword) {
      setLoading(true);
      axios
        .post("https://lap-center.herokuapp.com/api/register", {
          name: name,
          email: email,
          phone: phone,
          password: password,
        })
        .then(function (res) {
          setLoading(false);
          setOpenDialog(true);
          setMessage("Đặt ký thành công!!!");
        })
        .catch(function (err) {
          setLoading(false);
          setOpenDialog(true);
          setMessage(
            "Đăng ký tài khoản không thành công. Vui lòng thử lại sau!!!"
          );
        });
    } else {
      setOpenDialog(true);
      setMessage("Mật khẩu không trùng khớp. Vui lòng thử lại!!!");
    }
  };
  let checkInfo = true;
  !name || !phone || !email || !password || !cfpassword
    ? (checkInfo = true)
    : (checkInfo = false);

  if (!name || !phone || !email || !password || !cfpassword) checkInfo = true;
  else checkInfo = false;

  // if (!name || !phone || !email || !password || !cfpassword)
  // if (customerName && phoneNumber && email && address) checkInfo = false

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
      <div className="register-container">
        <div className="register-form">
          <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
            {" "}
            Đăng Ký{" "}
          </h1>
          <div className="register-content">
            <label>Tên người dùng</label>
            <br />
            <Input
              placeholder="Tên người dùng"
              className="inputText"
              value={name}
              onChange={(e) => handleChange(e, "name")}
            />
            <br />
            <label>Email</label>
            <br />
            <Input
              placeholder="Email"
              className="inputText"
              value={email}
              onChange={(e) => handleChange(e, "email")}
            />
            <br />
            <label>Số điện thoại</label>
            <br />
            <Input
              placeholder="Số điện thoại"
              className="inputText"
              value={phone}
              onChange={(e) => handleChange(e, "phone")}
            />
            <br />
            <label style={{ marginTop: "10px" }}>Mật khẩu</label>
            <br />
            <Input
              placeholder="Mật khẩu"
              type="password"
              className="inputText"
              value={password}
              onChange={(e) => handleChange(e, "password")}
            />
            <br />
            <label style={{ marginTop: "10px" }}>Nhập lại mật khẩu</label>
            <br />
            <Input
              placeholder="Nhập Lại Mật Khẩu"
              type="password"
              className="inputText"
              value={cfpassword}
              onChange={(e) => handleChange(e, "cfpassword")}
            />
            <br />
            <Button primary onClick={onRegister} disabled={checkInfo}>
              Đăng ký
            </Button>
            <p style={{ marginTop: "10px", textAlign: "center" }}>
              Bạn đã có tài khoản.{" "}
              <a className="login-text" onClick={() => history.push("/login")}>
                Đăng Nhập
              </a>
            </p>
          </div>
        </div>
      </div>
      <Modal
        onClose={() => setOpenDialog(false)}
        onOpen={() => setOpenDialog(true)}
        open={openDialog}
        size="mini"
      >
        <Modal.Header>
          <h4 className="txt-check">Thông báo</h4>
        </Modal.Header>
        <Modal.Content image>
          <p>{message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
          {password === cfpassword && (
            <Button
              primary
              onClick={() => (history.push("/login"), setOpenDialog(false))}
            >
              Đăng nhập
            </Button>
          )}
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Register;

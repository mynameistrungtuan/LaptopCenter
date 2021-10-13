import React, {useState} from "react";
import Navbar from "../../components/navbar/navbar";
import { Input, Button } from 'semantic-ui-react';
// import './register.scss'git
import {useHistory} from 'react-router-dom'

const account = { username: 'admin', password: 'admin'}


const Register =() => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cfpassword, setCfPassword] = useState('');

  const history = useHistory();

  const handleChange = (e, field) => {
    if(field === 'username') {
      setUsername(e.target.value)
    }
    if(field === 'password') {
      setPassword(e.target.value)
    }
    if(field === 'cfpassword') {
        setCfPassword(e.target.value)
      }
  }
  const onRegister = () => {
    console.log(username, password);
    if(password === cfpassword){
      console.log('Dang ky thanh cong');
      alert('Đăng Ký Thành Công!!!')
      history.push('/login');
    } else {
      console.log('Dang nhap that bai')
      alert('Mật Khẩu Không Trùng Khớp!!!')
    }
  }

    return(
        <div>
      <Navbar />
      <div className="login-container">
        <div className="login-form">
          <h1 style={{ textAlign: "center", marginBottom: "40px" }}> Đăng Ký </h1>
          <div className="login-content">
            <label>Tên đăng nhập</label>
            <br />
            <Input placeholder="Username" className="inputText" 
             value = {username}
             onChange={(e) => handleChange(e, 'username')}
            />
            <br />
            <label style={{ marginTop: "10px" }}>Mật khẩu</label>
            <br />
            <Input placeholder="Password" type="password" className="inputText"
            value={password}
            onChange={(e) => handleChange(e, 'password')}
            />
            <br />
            <label style={{ marginTop: "10px" }}>Nhập Lại Mật Khẩu</label>
            <br />
            <Input placeholder="ComFirm Password" type="password" className="inputText"
            value={cfpassword}
            onChange={(e) => handleChange(e, 'cfpassword')}
            />
            <br />
            <Button color="green" onClick={onRegister} > Đăng Ký </Button>
          </div>
        </div>
      </div>
    </div>
    )
};

export default Register;
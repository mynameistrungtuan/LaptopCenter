import React, { useState, useEffect } from "react";
import "./buy.scss";
import Navbar from "../../components/navbar/navbar";
import {
  Segment,
  Button,
  Input,
  Label,
  Form,
  TextArea,
  Modal,
  Image
} from "semantic-ui-react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";

const Buy = () => {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const id = location.pathname?.split("buy/")[1];
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = () => {
    setLoading(true);
    let url = `https://lap-center.herokuapp.com/api/product/getProductById/${id}`;
    axios
      .get(url)
      .then(function (res) {
        const data = res.data.response;
        setLoading(false);
        setData(data);
        setImage(data.images[0]);
      })
      .catch(function (error) {
        setLoading(false);
      });
  };

  const onChangeInfo = (event, field) => {
    const value = event.target.value;
    switch (field) {
      case "customerName":
        setCustomerName(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "address":
        setAddress(value);
        break;
      default:
    }
  };

  const onChange = (number) => {
    setQuantity(number);
    console.log(number);
  };
  const onChangeQuantity = (method) => {
    if (method === "plus") {
      setQuantity(quantity + 1);
    } else if (quantity === 1) {
      setQuantity(1);
    } else {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    fetchData();
  },[]);

  const onOder = () => {
    setOpen(false)
    setLoading(true);
    axios.post('https://lap-center.herokuapp.com/api/order/addOrder', {
      customerName : customerName,
      email: email,
      phone: phoneNumber,
      address: address,
      productName: data.name,
      productBrand: data.brand,
      quantity: quantity,
      orderStatus: 1
    })
    .then(function (res) {
      console.log(res);
      setLoading(false);
      setOpenDialog(true);
      setMessage('Đặt hàng thành công!!!');
    })
    .catch(function (error) {
      console.log(error);
      setLoading(false);
      setMessage('Đặt hàng thất bại, vui lòng thử lại sau!!!');
    });
  };

  let checkInfo = true;
  if (!customerName || !phoneNumber || !email || !address) checkInfo = true;
  if (customerName && phoneNumber && email && address) checkInfo = false;

  return (
    <div>
      <Navbar />
      <Segment loading={loading} className="buy-container" >
        <div className="buy-title">
          <p>Để đặt hàng</p>
          <span>
            , quý khách hàng vui lòng kiểm tra sản phẩm, số lượng, giá, màu sắc
            và điền các thông tin dưới đây:
          </span>
        </div>
        <div className="buy-content">
          <div className="buy-header">
            <img className="buy-image" src={image} alt={image} />
            <p>{data.name}</p>
            <div className="quantity">
              <Button icon="minus" onClick={() => onChangeQuantity("minus")} />
              <Input
                className="inp-quantity"
                value={quantity}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
              />
              <Button icon="plus" onClick={() => onChangeQuantity("plus")} />
              <h4>{data.price} đ</h4>
            </div>
          </div>
          <hr />
          <div className="buy-total">
            <h3>Tổng tiền:</h3>
            <p>{data.price * quantity} đ</p>
          </div>
          <div className="user-info">
            <Segment raised>
              <Label as="a" color="red" ribbon>
                Thông tin khách hàng
              </Label>
              <Form className="info-form">
                <Form.Field>
                  <label>Tên Khách Hàng</label>
                  <input
                    value={customerName}
                    onChange={(e) => onChangeInfo(e, "customerName")}
                    placeholder="Tên khách hàng"
                  />
                </Form.Field>
                <Form.Field>
                  <label>Số điện thoại</label>
                  <input
                    placeholder="số điện thoại"
                    onChange={(e) => onChangeInfo(e, "phoneNumber")}
                    value={phoneNumber}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Địa chỉ</label>
                  <TextArea
                    placeholder="địa chỉ"
                    value={address}
                    onChange={(e) => onChangeInfo(e, "address")}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Email</label>
                  <input
                    placeholder="email"
                    value={email}
                    onChange={(e) => onChangeInfo(e, "email")}
                  />
                </Form.Field>
                {/* <Button color="red" disabled={checkInfo} className="btn-order">
                  Đặt hàng
                </Button> */}
                <Modal
                  onClose={() => setOpen(false)}
                  onOpen={() => setOpen(true)}
                  open={open}
                  trigger={
                    <Button
                      color="red"
                      disabled={checkInfo}
                      className="btn-order"
                    >
                      Đặt hàng
                    </Button>
                  }
                >
                  <Modal.Header>Xác nhận thông tin</Modal.Header>
                  <Modal.Content image>
                    <Image
                      size="medium"
                      src={image}
                      wrapped
                    />
                    <Modal.Description>
                    <h5 className="txt-title">Thông tin sản phẩm</h5>
                      <div className="info-check">
                        <p>Tên sản phẩm:</p>
                        <span>{data.name}</span>
                      </div>
                      <div className="info-check">
                        <p>Hãng:</p>
                        <span>{data.brand}</span>
                      </div>
                      <div className="info-check">
                        <p>Số lượng:</p>
                        <span>{quantity}</span>
                      </div>
                      <div className="info-check">
                        <p>Tổng tiền:</p>
                        <span>{quantity * data.price}</span>
                      </div>
                      <h5 className="txt-title">Thông tin khách hàng</h5>
                      <div className="info-check">
                        <p>Tên khách hàng:</p>
                        <span>{customerName}</span>
                      </div>
                      <div className="info-check">
                        <p>Số điện thoại:</p>
                        <span>{phoneNumber}</span>
                      </div>
                      <div className="info-check">
                        <p>Email:</p>
                        <span>{email}</span>
                      </div>
                      <div className="info-check">
                        <p>Địa chỉ giao hàng:</p>
                        <span>{address}</span>
                      </div>
                    </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={() => setOpen(false)}>Hủy</Button>
                    <Button onClick={onOder} positive>
                      Xác Nhận
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Form>
            </Segment>
          </div>
        </div>
      </Segment>
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
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Buy;

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
  const currentUser = localStorage.getItem("customerName");

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
      setLoading(false);
      currentUser && onAddToHistory();
      setOpenDialog(true);
      setMessage('?????t h??ng th??nh c??ng!!!');
    })
    .catch(function (error) {
      console.log(error);
      setLoading(false);
      setMessage('?????t h??ng th???t b???i, vui l??ng th??? l???i sau!!!');
    });
  };

  const onAddToHistory = () => {
    axios.post('https://lap-center.herokuapp.com/api/history/addProductToHistory', {
      userId : localStorage.getItem("userId"),
      phone: phoneNumber,
      address: address,
      productName: data.name,
      productBrand: data.brand,
      quantity: quantity,
      orderStatus: 1
    })
    .then(function (res) {
      console.log(res);
     
    })
    .catch(function (error) {
      console.log('tuan');
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
          <p>????? ?????t h??ng</p>
          <span>
            , qu?? kh??ch h??ng vui l??ng ki???m tra s???n ph???m, s??? l?????ng, gi??, m??u s???c
            v?? ??i???n c??c th??ng tin d?????i ????y:
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
              <h4>{data.price} ??</h4>
            </div>
          </div>
          <hr />
          <div className="buy-total">
            <h3>T???ng ti???n:</h3>
            <p>{data.price * quantity} ??</p>
          </div>
          <div className="user-info">
            <Segment raised>
              <Label as="a" color="red" ribbon>
                Th??ng tin kh??ch h??ng
              </Label>
              <Form className="info-form">
                <Form.Field>
                  <label>T??n Kh??ch H??ng</label>
                  <input
                    value={customerName}
                    onChange={(e) => onChangeInfo(e, "customerName")}
                    placeholder="T??n kh??ch h??ng"
                  />
                </Form.Field>
                <Form.Field>
                  <label>S??? ??i???n tho???i</label>
                  <input
                    placeholder="s??? ??i???n tho???i"
                    onChange={(e) => onChangeInfo(e, "phoneNumber")}
                    value={phoneNumber}
                  />
                </Form.Field>
                <Form.Field>
                  <label>?????a ch???</label>
                  <TextArea
                    placeholder="?????a ch???"
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
                  ?????t h??ng
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
                      ?????t h??ng
                    </Button>
                  }
                >
                  <Modal.Header>X??c nh???n th??ng tin</Modal.Header>
                  <Modal.Content image>
                    <Image
                      size="medium"
                      src={image}
                      wrapped
                    />
                    <Modal.Description>
                    <h5 className="txt-title">Th??ng tin s???n ph???m</h5>
                      <div className="info-check">
                        <p>T??n s???n ph???m:</p>
                        <span>{data.name}</span>
                      </div>
                      <div className="info-check">
                        <p>H??ng:</p>
                        <span>{data.brand}</span>
                      </div>
                      <div className="info-check">
                        <p>S??? l?????ng:</p>
                        <span>{quantity}</span>
                      </div>
                      <div className="info-check">
                        <p>T???ng ti???n:</p>
                        <span>{quantity * data.price}</span>
                      </div>
                      <h5 className="txt-title">Th??ng tin kh??ch h??ng</h5>
                      <div className="info-check">
                        <p>T??n kh??ch h??ng:</p>
                        <span>{customerName}</span>
                      </div>
                      <div className="info-check">
                        <p>S??? ??i???n tho???i:</p>
                        <span>{phoneNumber}</span>
                      </div>
                      <div className="info-check">
                        <p>Email:</p>
                        <span>{email}</span>
                      </div>
                      <div className="info-check">
                        <p>?????a ch??? giao h??ng:</p>
                        <span>{address}</span>
                      </div>
                    </Modal.Description>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button onClick={() => setOpen(false)}>H???y</Button>
                    <Button onClick={onOder} positive>
                      X??c Nh???n
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
          <h4 className="txt-check">Th??ng b??o</h4>
        </Modal.Header>
        <Modal.Content image>
          <p>{message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenDialog(false)}>????ng</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Buy;

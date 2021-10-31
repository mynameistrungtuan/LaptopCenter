import { useState, useEffect } from "react";
import {
  Segment,
  Table,
  Button,
  Popup,
  Menu,
  Icon,
  Modal,
  Pagination,
} from "semantic-ui-react";
import Navbar from "../../../components/navbar/navbar";
import "./manageOrder.scss";
import axios from "axios";

const ManageOrder = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataItem, setDataItem] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState(0);
  const [temp, setTemp] = useState([]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("https://lap-center.herokuapp.com/api/order")
      .then(function (response) {
        const data = response.data.orders;
        setPageNumber(1);
        setTotalPage(response.data.totalPage);
        setData(data);
        setLoading(false);
        console.log("data", response.data);
      })
      .catch(function (error) {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData("https://lap-center.herokuapp.com/api/order");
  }, []);

  const convertOrder = (order) => {
    //   return order === 1 ? (
    //     <span className="case1">Vừa đặt hàng</span>
    //   ) : order === 2 ? (
    //     <span className="case2">Đang giao hàng</span>
    //   ) : order === 3 ? (
    //     <span className="case3">Đã nhận hàng</span>
    //   ) : (
    //     <span className="case4">Trả hàng</span>
    //   );

    switch (order) {
      case 1:
        return <span className="case1">Vừa đặt hàng</span>;
      case 2:
        return <span className="case2">Đang giao hàng</span>;
      case 3:
        return <span className="case3">Đã nhận hàng</span>;
      default:
        return <span className="case4">Trả hàng</span>;
    }
  };

  const handlePaginationChange = async (activePage) => {
    setTemp(activePage);
    const page = parseInt(activePage.target.innerHTML);
    await setLoading(true);
    await setPageNumber(page);
    let url = `https://lap-center.herokuapp.com/api/order?pageNumber=${activePage}`;
    await axios
      .get(url)
      .then(function (response) {
        window.scrollTo(0, 0);
        setData(response.data.orders);
        setTotalPage(response.data.totalPage);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const changeOrderStatus = () => {
    setOpen(false);
    setLoading(true);
    axios
      .patch(
        `https://lap-center.herokuapp.com/api/order/editOrderStatus/${orderId}`,
        {
          orderStatus: orderStatus,
        }
      )
      .then(function (res) {
        setLoading(false);
        handlePaginationChange(temp);
        setOpenDialog(true);
        setMessage("Thay đổi trạng thái đơn hàng thành công!!!");
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
        setMessage(
          "Thay đổi trạng thái đơn hàng thất bại thất bại, vui lòng thử lại sau!!!"
        );
      });
  };

  const onOpenDetail = (item) => {
    setDataItem(item);
    setOrderId(item._id);
    setOrderStatus(item.orderStatus);
    setOpen(true);
  };

  const handleSelectChange = (e) => {
    const order = parseInt(e.target.value);
    setOrderStatus(order);
  };

  return (
    <div>
      <Navbar />
      <Segment loading={loading} className="order-container">
        <h2>Quản lý đơn hàng</h2>
        <Table celled color="blue">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Tên khách hàng</Table.HeaderCell>
              <Table.HeaderCell>Tên sản phẩm</Table.HeaderCell>
              <Table.HeaderCell>Số điện thoại</Table.HeaderCell>
              <Table.HeaderCell>Trạng thái</Table.HeaderCell>
              <Table.HeaderCell>Hành động</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>{item.customerName}</Table.Cell>
                <Table.Cell>{item.productName}</Table.Cell>
                <Table.Cell>{item.phone}</Table.Cell>
                <Table.Cell>
                  <Table.Cell>
                    {/* {item.orderStatus === 1 ? (
                      <span className="case1">Vừa đặt hàng</span>
                    ) : item.orderStatus === 2 ? (
                      <span className="case2">Đang giao hàng</span>
                    ) : item.orderStatus === 3 ? (
                      <span className="case3">Đã nhận hàng</span>
                    ) : (
                      <span className="case4">Trả hàng</span>
                    )} */}
                    {convertOrder(item.orderStatus)}
                  </Table.Cell>
                </Table.Cell>
                <Table.Cell>
                  <Popup
                    content="Chi tiết"
                    trigger={
                      <Button
                        icon="eye"
                        color="facebook"
                        circular
                        onClick={() => {
                          onOpenDetail(item);
                        }}
                      />
                    }
                  />
                  <Popup
                    content="Mua"
                    trigger={
                      <Button
                        icon="trash alternate"
                        color="youtube"
                        circular
                        // onClick={() => moveToBuy(item.productId)}
                      />
                    }
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="5">
                <Pagination
                  boundaryRange={0}
                  activePage={pageNumber}
                  ellipsisItem={true}
                  firstItem={true}
                  lastItem={true}
                  siblingRange={1}
                  totalPages={totalPage}
                  onPageChange={handlePaginationChange.bind(this)}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>

      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header>Thông tin khách hàng</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <div className="info-check">
              <p>Tên khách hàng:</p>
              <span>{dataItem?.customerName}</span>
            </div>
            <div className="info-check">
              <p>Tên sản phẩm:</p>
              <span>{dataItem?.productName}</span>
            </div>
            <div className="info-check">
              <p>Hãng:</p>
              <span>{dataItem?.productBrand}</span>
            </div>
            <div className="info-check">
              <p>Số lượng:</p>
              <span> {dataItem?.quantity}</span>
            </div>
            <div className="info-check">
              <p>Số điện thoại:</p>
              <span>{dataItem?.phone}</span>
            </div>
            <div className="info-check">
              <p>Địa chỉ:</p>
              <span>{dataItem?.address}</span>
            </div>
            <div className="info-check">
              <p>Trạng thái đơn hàng:</p>
              <select
                value={orderStatus}
                onChange={(e) => handleSelectChange(e)}
                className="select-status"
              >
                <option value="1">Vừa đặt hàng</option>
                <option value="2">Đang giao hàng</option>
                <option value="3">Đã nhận hàng</option>
                <option value="4">Trả hàng</option>
              </select>
            </div>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={() => changeOrderStatus()} color="blue">
            Cập nhật
          </Button>
        </Modal.Actions>
      </Modal>
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

export default ManageOrder;

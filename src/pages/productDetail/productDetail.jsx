import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import { Segment, Button, Table } from "semantic-ui-react";
import "./productDetail.scss";
import { useLocation, useHistory } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import CardItem from "../../components/cardItem/cardItem";
import Footer from "../footer/footer";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const ProductDetail = () => {
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
  const [load, setLoad] = useState(true);
  const location = useLocation();
  const id = location.pathname?.split("product/")[1];
  const [sameProduct, setSameProduct] = useState([]);
  // const id = location.pathname?.replace('product/', '');
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("first");
    fetchData();
  }, [location]);

  const fetchData = () => {
    setLoad(true);
    let url = `https://lap-center.herokuapp.com/api/product/getProductById/${id}`;
    axios
      .get(url)
      .then(function (res) {
        const data = res.data.response;
        setData(data);
        console.log("data detail: ", data);
        setImage(data.images[0]);
        setLoad(false);
        fecthSameProduct(data.brand);
      })
      .catch(function (error) {
        setLoad(false);
        console.log("error: ", error);
      });
  };

  const onChooseImage = (image) => {
    setImage(image);
  };

  const fecthSameProduct = (brand) => {
    // fetch API for get more product for this brand
    setLoad(true);
    axios
      .get(
        `https://lap-center.herokuapp.com/api/product?productBrand=${brand}&pageSize=10&pageNumber=1`
      )
      .then(function (response) {
        console.log("product more: ", response.data.products);
        setSameProduct(response.data.products);
        setLoad(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoad(false);
      });
  };

  const moveToBuy = () => {
    history.push(`/buy/${id}`)
  }
  return (
    <div>
      <Navbar />
      <Segment loading={load} className="detail-segment-container">
        <div className="detail-product-name">{data.name}</div>
        <div className="detail-status">
          <p>Tình trạng: Còn hàng</p>
          <p style={{ marginLeft: "20px" }}>Bảo hành: 24 tháng</p>
        </div>
        <hr style={{ width: "80%" }} />
        <div className="detail-container">
          <div className="detail-left">
            <img className="detail-image" src={image} alt="" />
            <div className="detail-list-images">
              {data?.images?.map((item) => (
                <img
                  className="detail-image-small"
                  src={item}
                  alt=""
                  onClick={() => onChooseImage(item)}
                />
              ))}
            </div>
          </div>
          <div className="detail-main">
            <p>
              Giá bán: <span>{data.price}</span>
            </p>
            <div className="detail-discount">
              <div className="discount-top">
                <p>Khuyến mãi - Quà tặng</p>
              </div>
              <div className="discount-content">Something</div>
            </div>
            <div className="detail-buy">
              <Button color="red" onClick={moveToBuy}>
                MUA NGAY
              </Button>
              <p>
                GỌI NGAY <a href="tel:+84969442510"> 0522 564 268 </a> ĐỂ GIỮ
                HÀNG
              </p>
            </div>
          </div>
          <div className="detail-right">
            <div>
              <span>Điện thoại tư vấn - Đặt hàng</span>
              <ul>
                <li>Kim Lý - 0904 555 666</li>
                <li>Huỳnh Lệ - 0345 789 789</li>
                <li>Văn Dũng - 0876 567 678</li>
              </ul>
            </div>
            <div>
              <span>Địa chỉ mua hàng</span>
              <ul>
                <li>152 ABC, Thanh Khê, TP. Đà Nẵng</li>
                <li>162 ABC, Thanh Khê, TP. Đà Nẵng</li>
                <li>172 ABC, Thanh Khê, TP. Đà Nẵng</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="specifications">
          <Table celled fixed singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Phan cung</Table.HeaderCell>
                <Table.HeaderCell>Thong so ki thuat</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>Ram</Table.Cell>
                <Table.Cell>{data.ram}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Man hinh</Table.Cell>
                <Table.Cell>{data.monitor}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>CPU</Table.Cell>
                <Table.Cell>{data.cpu}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Card man hinh</Table.Cell>
                <Table.Cell>{data.card}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Model</Table.Cell>
                <Table.Cell>{data.model}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>O cung</Table.Cell>
                <Table.Cell>{data.disk}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <div className="same-product">
          <h3>Sản phẩm cùng thương hiệu</h3>
          <hr />
          <Carousel responsive={responsive} showDots={true}>
            {sameProduct.map((item) => (
              <CardItem product={item} />
            ))}
          </Carousel>
        </div>
      </Segment>
      <Footer />
    </div>
  );
};

export default ProductDetail;

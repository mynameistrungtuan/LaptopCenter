import React,{ useState, useEffect } from "react";
import { Segment, Button, Table, Loading, Card,Modal } from "semantic-ui-react";
import "./productDetail.scss";
import Navbar from "../../components/navbar/navbar";
import { useLocation,useHistory } from "react-router-dom";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from "axios";
import CardItem from "../../components/cardItem/cardItem";
import Footer from "../footer/footer";
import Buy from "../buy/buy";
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};




const ProductDetail = () => {
  const [data, setData] = useState([]);
  const [sameProduct, setSameProduct] = useState([]);
  const [image,setImage]=useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [message,setMessage]=useState('');
  const [openDialog,setOpenDialog]=useState(false);
  const id = location.pathname?.split('product/')[1];
  // const id = location.pathname?.replace('product/', '');
  const history = useHistory();

  useEffect(async () => {
    window.scrollTo(0, 0);
    console.log('fitst');
    fetchData();    
  }, [location]);
  const fetchData = () => {
    setLoading(true);
    let url = `https://lap-center.herokuapp.com/api/product/getProductById/${id}`;
    axios.get(url)
      .then(function (response) {
        const data=response.data.response;
        console.log('data detail: ', data);
        setData(data);
        setImage(data.images[0]);
        setLoading(false);
        fecthSameProduct(data.brand);
      })
      .catch(function (error) {
        console.log('error: ', error);
        setLoading(false);

      })
  }

  const onAddToCart = () =>{
    setLoading(true);
    axios.post('https://lap-center.herokuapp.com/api/cart/addProductToCart', {
        userId : localStorage.getItem("userId"),
        productId: id,
        productName: data.name,
        productBrand: data.brand,
       image:image,
       price:data.price,
      })
      .then(function (res) {
        console.log(res);
        setLoading(false);
        setOpenDialog(true);
        setMessage('?????t h??ng th??nh c??ng!!!');
      })
      .catch(function (error) {
        console.log(error);
       setLoading(false);
       setOpenDialog(true);
       setMessage('?????t h??ng ko th??nh c??ng vui l??ng th??? l???i!!!');
      });
  
  }

  const fecthSameProduct = (brand) => {
    // fetch API for get more product for this brand
    setLoading(true);
    axios.get(`https://lap-center.herokuapp.com/api/product?productBrand=${brand}&pageSize=10&pageNumber=1`)
      .then(function (response) {
        console.log('product more: ', response.data.products);
        setSameProduct(response.data.products);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      })
    }
  const onChooseImage = (image) => {
    setImage(image);
  }

  const moveToBuy = () => {
    history.push(`/buy/${id}`)
      };
  return (
    <div>
        <Navbar/>
      <Segment loading={loading} className="detail-segment-container">
        <div className="detail-product-name">{data.name}</div>
        <div className="detail-status">
          <p>T??nh tr???ng: C??n h??ng</p>
          <p style={{ marginLeft: "20px" }}>B???o h??nh: 24 th??ng</p>
        </div>
        <hr style={{ width: "80%" }} />
        <div className="detail-container">
          <div className="detail-left">
            <img
              className="detail-image"
              src={image}
              alt={image}
            />
            <div className="detail-list-images">
              {data?.images?.map((item) => (
                <img className="detail-image-small" src={item} alt=""
                 onClick={() => onChooseImage(item)} />
              ))}
            </div>
          </div>
          <div className="detail-main">
            <p>
              Gi?? b??n: <span>{data.price}</span>
            </p>
            <div className="detail-discount">
              <div className="discount-top">
                <p>Khuy???n m??i - Qu?? t???ng</p>
              </div>
              <div className="discount-content">something</div>
            </div>
            <div className="detail-buy">
              <Button onClick={moveToBuy} color="red">MUA NGAY</Button>
              <Button onClick={onAddToCart} color="green" className="btnCart">TH??M V??O GI??? H??NG</Button>
              <p>
                G???I NGAY <a href="tel:+84969442510"> 0379 26 6143 </a> ????? GI???
                H??NG
              </p>
            </div>
          </div>
          <div className="detail-right">
            <div>
              <span>??i???n tho???i t?? v???n - ?????t h??ng</span>
              <ul>
                <li>Kim L?? - 0904 555 666</li>
                <li>Hu???nh L??? - 0345 789 789</li>
                <li>V??n D??ng - 0876 567 678</li>
              </ul>
            </div>
            <div>
              <span>?????a ch??? mua h??ng</span>
              <ul>
                <li>152 ABC, Thanh Kh??, TP. ???? N???ng</li>
                <li>162 ABC, Thanh Kh??, TP. ???? N???ng</li>
                <li>172 ABC, Thanh Kh??, TP. ???? N???ng</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="specifications">
          <Table fixed>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>ph???n c???ng</Table.HeaderCell>
                <Table.HeaderCell>th??ng s??? k?? thu???t</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>Model</Table.Cell>
                <Table.Cell>{data.model}</Table.Cell>
                
              </Table.Row>
              <Table.Row>
                <Table.Cell>Cpu</Table.Cell>
                <Table.Cell>{data.cpu}</Table.Cell>
                
              </Table.Row>
              <Table.Row>
                <Table.Cell>Ram</Table.Cell>
                <Table.Cell>{data.ram}</Table.Cell>
                
              </Table.Row>
              <Table.Row>
                <Table.Cell>??? c???ng</Table.Cell>
                <Table.Cell>{data.disk}</Table.Cell>
                
              </Table.Row>
              <Table.Row>
                <Table.Cell>Card ????? h???a</Table.Cell>
                <Table.Cell>{data.card}</Table.Cell>
                
              </Table.Row>
              <Table.Row>
                <Table.Cell>M??n H??nh</Table.Cell>
                <Table.Cell>{data.monitor}</Table.Cell>
                
              </Table.Row>
              
            </Table.Body>
          </Table>
        </div>
        <div className="same-product">
          <h3>S???n ph???m c??ng th????ng hi???u</h3>
          <hr />
          <Carousel 
            responsive={responsive}
            showDots={true}
          >
            {sameProduct.map((item) => (
              <CardItem product={item}/>
            ))}
          </Carousel>
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
      </Segment>
      <hr style={{ width: "80%" }} />
      <Footer />
      


    </div>
  );
};

export default ProductDetail;
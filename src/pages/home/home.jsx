import "./home.scss";
import Navbar from "../../components/navbar/navbar";
import Card from "../../components/card/card";
import product from "../../assets/data/product";
import { useState, useEffect } from "react";
import { Input, Icon, Segment, Pagination } from "semantic-ui-react";
const axios = require("axios");

function Home() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (url) => {
    setLoading(true);
    await axios
      .get(url)
      .then(function (response) {
        setPageNumber(1)
        setTotalPage(response.data.totalPage)
        setData(response.data.products);
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
      });
  };

  useEffect(async () => {
    let url = `https://lap-center.herokuapp.com/api/product`;
    await fetchData(url);
  }, []);

  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  const onSubmitSearch = async () => {
    let url = `https://lap-center.herokuapp.com/api/product?productName=${search}&productBrand=${brand}&orderByColumn=price&orderByDirection=${price}`;
    await fetchData(url);
  };

  const onSearchBrand = async (e) => {
    setBrand(e.target.value);
    let url = `https://lap-center.herokuapp.com/api/product?productName=${search}&productBrand=${e.target.value}&orderByColumn=price&orderByDirection=${price}`;
    await fetchData(url);
  };
  const sortPrice = async (e) => {
    
    setPrice(e.target.value);
   
    let url = `https://lap-center.herokuapp.com/api/product?productName=${search}&productBrand=${brand}&orderByColumn=price&orderByDirection=${e.target.value}`;
    await fetchData(url);
  };

  const handlePaginationChange = async (e, { activePage }) => {
    await setLoading(true);
    await setPageNumber(activePage);
    let url = `https://lap-center.herokuapp.com/api/product?productName=${search}&productBrand=${brand}&orderByColumn=price&orderByDirection=${price}&pageSize=12&pageNumber=${activePage}`;
    await axios
      .get(url)
      .then(function (response) {
        setData(response.data.products);
        setTotalPage(response.data.totalPage);
    
setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="filter">
        <div className="search">
          <Input
            icon={
              <Icon
                name="search"
                inverted
                circular
                link
                onClick={onSubmitSearch}
              />
            }
            placeholder="Search..."
            value={search}
            onChange={onChangeSearch}
          />
        </div>
        <div className="selectForm">
          <select className="selectBox" value={brand} onChange={onSearchBrand}>
            <option selected value="">
              Tất cả
            </option>
            <option value="Asus">ASUS</option>
            <option value="Dell">DELL</option>
            <option value="Acer">ACER</option>
            <option value="Lenovo">LENOVO</option>
          </select>
        </div>
        <div className="selectForm">
          <select className="selectBox" value={price} onChange={sortPrice}>
            <option selected value="">
              Tất cả
            </option>
            <option value="asc">Từ thấp đến cao</option>
            <option value="desc">Từ cao đến thấp</option>
          </select>
        </div>
      </div>
      <div className="container-body">
        <div className="menuLeft">
          {/* <Input
          icon={
            <Icon
              name="search"
              inverted
              circular
              link
              onClick={onSubmitSearch}
            />
          }
          placeholder="Search..."
          value={search}
          onChange={onChangeSearch}
        />
        <div className="selectForm">
          <p>Hãng</p>
          <select className="selectBox" value={brand} onChange={onSearchBrand}>
            <option selected value=""></option>
            <option value="Asus">ASUS</option>
            <option value="Dell">DELL</option>
            <option value="Acer">ACER</option>
            <option value="Lenovo">LENOVO</option>
          </select>
        </div>

        <div className="selectForm">
          <p>Giá</p>
          <select className="selectBox" value={price} onChange={sortPrice}>
            <option selected value=""></option>
            <option value="asc">Từ thấp đến cao</option>
            <option value="desc">Từ cao đến thấp</option>
          </select> */}
          {/* </div> */}
        </div>
        <Segment loading={loading} className="product">
          {data.length === 0 ? (
            <div className="noResults">
              <h1 style={{ textAlign: "center" }}>
                Không tìm thấy sản phẩm nào!
              </h1>
            </div>
          ) : (
            data.map((item) => <Card product={item} />)
          )}
        </Segment>
        <div className="menuRight"></div>
      </div>
      <div className="paginator">
        <Pagination
          boundaryRange={0}
          activePage={pageNumber}
          ellipsisItem={true}
          firstItem={true}
          lastItem={true}
          siblingRange={1}
          totalPages={totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}

export default Home;

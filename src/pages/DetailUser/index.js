import classNames from "classnames";
import styles from "./DetailUser.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import searchIcon from "~/components/Image/search-icon.png";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;
export default function DetailUser() {
  const [user, setUser] = useState();
  const [carPicture, setCarPicture] = useState();
  const [rides, setRides] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [showCarImage, setShowCarImage] = useState(false);
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const { user_id } = useParams();
  useEffect(() => {
    axios
      .get(`${beURL}/users/detailByOwner/${user_id}`, config)
      .then((response) => {
        const data = response.data;
        setUser(data);
        setCarPicture(data.car_images)
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        `${beURL}/ride/historyRideByOwner/${user_id}?page=${currentPage}&pageSize=${pageSize}`,
        config
      )
      .then((response) => {
        const data = response.data;
        setRides(data.rides);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, user_id, pageSize, currentPage]);

  const handleClickDetail = () => {
    alert("ok");
  };
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    axios
      .get(
        `${beURL}/ride/historyRideByOwner/${user_id}?page=${currentPage}&pageSize=${pageSize}&search=${searchInput}`,
        config
      )
      .then((response) => {
        const data = response.data;
        setRides(data.rides);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleShowCarImage = (a) => {
    setShowCarImage(!showCarImage)
  }

  console.log(carPicture);
  if (user) {
    return (
      <div>
        <div className={cx("duInforContainer")}>
          <div className={cx("inforPortrait")}>
            <img></img>
          </div>
          <div className={cx("inforDetailBox")}>
            <div className={cx("detailName")}>Tên Tài Xế: {" " + user.name} </div>
            <div className={cx("detailLoginName")}>tên đăng nhập: {" " + user.userName}</div>
            <div className={cx("detailAmount")}>số dư: {" " + user.amount}</div>
            <div className={cx("detailCarData")}>
              <div className={cx("dataPlate")}>biển kiểm soát: {" " + user.licensePlate}</div>
              <div className={cx("dateCarType")}>loại xe: {" " + user.carType} chỗ</div>
              <div className={cx("dataCarImageBox")}>
                <button
                  onClick={() => handleShowCarImage(true)}
                >
                  {!showCarImage && "ấn để xem ảnh xe"}
                  {showCarImage && "ẩn để ẩn ảnh"}
                </button>
                {showCarImage && (
                  <div className={cx("imageBox")}>
                    {carPicture.map((car, index) => (
                      <img src={car.path}></img>
                    ))}
                  </div>

                )}
              </div>
            </div>
          </div>
        </div>

        <div className={cx("duTransactionContainer")}>
          
        </div>

      </div>
    );
  }
  return "loading ...";
}

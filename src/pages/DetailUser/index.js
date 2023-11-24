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
  const [CreatedList, setCreatedList] = useState([]);
  const [currentRidesPage, setCurrentRidesPage] = useState(1);
  const [currentCreatedPage, setCurrentCreatedPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [showCarImage, setShowCarImage] = useState(false);
  const [showRidesList, setShowRidesList] = useState(false);
  const [showCreatedList, setShowCreatedList] = useState(false);
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const { user_id } = useParams();
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];

  var currentDate = new Date();

  // Get various components of the date
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1; // Months are zero-based
  var day = currentDate.getDate();

  // Format the date as a string
  var formattedDate = day + '/' + month + '/' + year

  useEffect(() => {
    //get user data
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

  }, [token, user_id]);

  useEffect(() => {
    //get lịch sử đã nhận
    axios
      .get(
        `${beURL}/ride/historyReceivedByOwner/${user_id}?page=${currentRidesPage}&pageSize=${pageSize}&date=${formattedDate}`,
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
  }, [token, user_id, pageSize, currentRidesPage]);

  useEffect(() => {
    //get lịch sử đã tạo
    axios
      .get(
        `${beURL}/ride/historyCreatedByOwner/${user_id}?page=${currentRidesPage}&pageSize=${pageSize}&date=${formattedDate}`,
        config
      )
      .then((response) => {
        const data = response.data;
        setCreatedList(data.rides);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, user_id, pageSize, currentCreatedPage]);

  const handleRidesPageChange = (newPage) => {
    setCurrentRidesPage(newPage);
  };

  const handleCreatedPageChange = (newPage) => {
    setCurrentCreatedPage(newPage);
  };

  const handleShowCarImage = (a) => {
    setShowCarImage(!showCarImage)
  }

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
            </div>
          </div>
        </div>

        <div className={cx("duContainer")}>
          <div className={cx("box1")}>
            <div className={cx("topBox1")}>
              {carPicture.length !== 0 &&
                <div id="buttonShowCarImage"
                  onClick={() => handleShowCarImage(true)}
                >
                  {!showCarImage && "xem ảnh xe"}
                  {showCarImage && "ẩn ảnh xe"}
                </div>
              }
              {carPicture.length === 0 && "Không Có Ảnh Xe"}
            </div>
            <div className={cx("bottomBox1")}>
              {showCarImage && (
                <div className={cx("imageBox")}>
                  {carPicture.map((car, index) => (
                    <img src={car.path} key={index}></img>
                  ))}
                </div>

              )}
            </div>
          </div>
          <div className={cx("box2")}>
            <div className={cx("topBox2")} onClick={() => { setShowRidesList(!showRidesList) }}>
              {!showRidesList && "Chuyến xe đã nhận"}
              {showRidesList && "Ẩn Danh Sách Chuyến xe đã Nhận"}
            </div>
            {rides.length !== 0 && showRidesList && (
              <div className={cx("bottomBox2")}>
                <div className={cx("duRidesList")}>
                  <div className={cx("rlAddress")}>
                    <div className={cx("tableTitle")}>Điểm Đi/Điểm Đến</div>
                    {/* {users.map((user, index) => (
        <div className={cx("tableContent")}>{user.name}</div>
      ))} */}
                  </div>
                  <div className={cx("rlAcceptTime")}>
                    <div className={cx("tableTitle")}>Thời Gian Nhận</div>
                    {/* {users.map((user, index) => (
        <div className={cx("tableContent")}>{user.userName}</div>
      ))} */}
                  </div>
                  <div className={cx("rlStatus")}>
                    <div className={cx("tableTitle")}>Trạng Thái</div>
                    {/* {users.map((user, index) => (
        <div className={cx("tableContent")}>
          <a
            onClick={() => {
              handleClickDetail(user._id);
            }}
          >
            {"Xem Chi Tiết"}
          </a>
        </div>
      ))} */}
                  </div>
                  <div className={cx("rlDetail")}>
                    <div className={cx("tableTitle")}>Chi Tiết</div>
                    {/* {users.map((user, index) => (
        <div className={cx("tableContent")}>{user.amount}</div>
      ))} */}
                  </div>
                </div>
              </div>
            )}
            {rides.length === 0 && showRidesList && (
              <div className={cx("emptyWarning")}>Không Có Chuyến Nào đã Nhận</div>
            )}

          </div>
          <div className={cx("box3")}>
            <div className={cx("topBox3")} onClick={() => { setShowCreatedList(!showCreatedList) }}>
              {!showCreatedList && "Chuyến xe đã tạo"}
              {showCreatedList && "Ẩn Danh Sách Chuyến xe đã tạo"}
            </div>
            <div className={cx("bottomBox3")}>
              {CreatedList.length !== 0 && showCreatedList && (
                <div className={cx("bottomBox2")}>
                  <div className={cx("duCreatedList")}>
                    <div className={cx("rlAddress")}>
                      <div className={cx("tableTitle")}>Điểm Đi/Điểm Đến</div>
                      {/* {users.map((user, index) => (
                        <div className={cx("tableContent")}>{user.name}</div>
                      ))} */}
                    </div>
                    <div className={cx("rlCreateTime")}>
                      <div className={cx("tableTitle")}>Thời Gian Tạo</div>
                      {/* map */}
                    </div>
                    <div className={cx("rlStatus")}>
                      <div className={cx("tableTitle")}>Trạng Thái</div>

                    </div>
                    <div className={cx("rlDetail")}>
                      <div className={cx("tableTitle")}>Chi Tiết</div>
                      {/* map */}
                    </div>
                  </div>
                </div>
              )}
              {CreatedList.length === 0 && showCreatedList && (
                <div className={cx("emptyWarning")}>Không Có Chuyến Nào đã Tạo</div>
              )}
            </div>
          </div>

        </div>

      </div>
    );
  }
  return "loading ...";
}

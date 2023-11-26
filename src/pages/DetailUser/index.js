import classNames from "classnames";
import styles from "./DetailUser.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import searchIcon from "~/components/Image/search-icon.png";
import { type } from "@testing-library/user-event/dist/type";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;
export default function DetailUser() {
  const [user, setUser] = useState();
  const [carPicture, setCarPicture] = useState();
  const [rides, setRides] = useState([]);
  const [createdList, setCreatedList] = useState([]);
  const [currentRidesPage, setCurrentRidesPage] = useState(1);
  const [currentCreatedPage, setCurrentCreatedPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRidesPages, setTotalRidesPages] = useState(0);
  const [totalCreatedPages, setTotalCreatedPages] = useState(0);
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
        setTotalRidesPages(Math.ceil(data.totalCount / pageSize));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, user_id, pageSize, currentRidesPage]);

  useEffect(() => {
    //get lịch sử đã tạo
    axios
      .get(
        `${beURL}/ride/historyCreatedByOwner/${user_id}?page=${currentCreatedPage}&pageSize=${pageSize}`,
        config
      )
      .then((response) => {
        const data = response.data;
        console.log(data);
        setCreatedList(data.rides);
        setTotalCreatedPages(Math.ceil(data.totalCount / pageSize));
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
                  <div className={cx("rlType")}>
                    <div className={cx("tableTitle")}>Phân Loại</div>
                    {rides.map((ride, index) => (
                      <div className={cx("tableContent")} key={index}>
                        {ride.type === "PARCEL" && <div>Giao Hàng</div>}
                        {ride.type === "RIDE" && <div>Chở Khách</div>}
                      </div>
                    ))}
                  </div>
                  <div className={cx("rlAddress")}>
                    <div className={cx("tableTitle")}>
                      <div>Điểm Đi</div>
                      <div>Điểm Đến</div>
                    </div>
                    {rides.map((ride, index) => (
                      <div className={cx("tableContent")} key={index}>
                        {ride.type === "RIDE" && (
                          <div>{ride.startPoint}</div>
                        )}
                        {ride.type === "PARCEL" && (
                          <div>{ride.receivePoint}</div>
                        )}
                        {ride.type === "RIDE" && (
                          <div>{ride.endPoint}</div>
                        )}
                        {ride.type === "PARCEL" && (
                          <div>{ride.sendPoint}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={cx("rlAcceptTime")}>
                    <div className={cx("tableTitle")}>Thời Gian Nhận</div>
                    {rides.map((ride, index) => {
                      var timestamp = ride.changeDate;
                      var date = new Date(timestamp);
                      var month = date.getMonth() + 1; // Months are zero-based
                      var day = date.getDate();
                      var hours = date.getHours();
                      var minutes = date.getMinutes();
                      var formattedHours = hours < 10 ? '0' + hours : hours;
                      var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                      var formattedReceiveTime = formattedHours + ':' + formattedMinutes;
                      var formattedReceiveDate = day + '/' + month;
                      return (
                        <div className={cx("tableContent")} key={index}>
                          <div>{formattedReceiveTime}</div>
                          <div>{formattedReceiveDate}</div>
                        </div>
                      );
                    })}

                  </div>
                  <div className={cx("rlStatus")}>
                    <div className={cx("tableTitle")}>Trạng Thái</div>
                    {rides.map((ride, index) => (
                      <div className={cx("tableContent")} key={index}>
                        {ride.status === "COMPLETED" && <div>Đã Hoàn Thành</div>}
                        {ride.status === "CANCELED" && <div>Đã Huỷ</div>}
                        {ride.status === "PENDING" && <div>Đang Liên Hệ Khách Hàng</div>}
                        {ride.status === "TAKED" && <div>Đang Thực Hiện</div>}
                      </div>
                    ))}
                  </div>
                  <div className={cx("rlDetail")}>
                    <div className={cx("tableTitle")}>Chi Tiết</div>
                    {rides.map((ride, index) => (
                      <div className={cx("tableContent")} key={index}>
                        Xem Chi Tiết
                      </div>
                    ))}
                  </div>
                </div>
                <div className={cx("duPagination")}>
                  {Array.from({ length: totalRidesPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handleRidesPageChange(index + 1)}
                      className={cx({ active: index + 1 === currentRidesPage })}
                    >
                      {index + 1}
                    </button>
                  ))}
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
            {createdList.length !== 0 && showCreatedList && (
              <div className={cx("bottomBox3")}>
                <div className={cx("duCreatedList")}>
                  <div className={cx("clType")}>
                    <div className={cx("tableTitle")}>Phân Loại</div>
                    {createdList.map((create, index) => (
                      <div className={cx("tableContent")} key={index}>
                        {create.type === "PARCEL" && <div>Giao Hàng</div>}
                        {create.type === "RIDE" && <div>Chở Khách</div>}
                      </div>
                    ))}
                  </div>
                  <div className={cx("clAddress")}>
                    <div className={cx("tableTitle")}>
                      <div>Điểm Đi</div>
                      <div>Điểm Đến</div>
                    </div>
                    {createdList.map((create, index) => (
                      <div className={cx("tableContent")} key={index}>
                        {create.type === "RIDE" && (
                          <div>{create.startPoint}</div>
                        )}
                        {create.type === "PARCEL" && (
                          <div>{create.receivePoint}</div>
                        )}
                        {create.type === "RIDE" && (
                          <div>{create.endPoint}</div>
                        )}
                        {create.type === "PARCEL" && (
                          <div>{create.sendPoint}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={cx("clCreatedTime")}>
                    <div className={cx("tableTitle")}>Thời Gian Tạo</div>
                    {createdList.map((ride, index) => {
                      var timestamp = ride.createdAt;
                      var date = new Date(timestamp);
                      var month = date.getMonth() + 1; // Months are zero-based
                      var day = date.getDate();
                      var hours = date.getHours();
                      var minutes = date.getMinutes();
                      var formattedHours = hours < 10 ? '0' + hours : hours;
                      var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                      var formattedCreatedTime = formattedHours + ':' + formattedMinutes;
                      var formattedCreatedDate = day + '/' + month;
                      return (
                        <div className={cx("tableContent")} key={index}>
                          <div>{formattedCreatedTime}</div>
                          <div>{formattedCreatedDate}</div>
                        </div>
                      );
                    })}

                  </div>
                  <div className={cx("clStatus")}>
                    <div className={cx("tableTitle")}>Trạng Thái</div>
                    {createdList.map((ride, index) => (
                      <div className={cx("tableContent")} key={index}>
                        {ride.status === "COMPLETED" && <div>Đã Hoàn Thành</div>}
                        {ride.status === "CANCELED" && <div>Đã Huỷ</div>}
                        {ride.status === "PENDING" && <div>Đang Liên Hệ Khách Hàng</div>}
                        {ride.status === "TAKED" && <div>Đang Thực Hiện</div>}
                        {ride.status === "READY" && <div>Chưa Có Người Nhận</div>}
                      </div>
                    ))}
                  </div>
                  <div className={cx("clDetail")}>
                    <div className={cx("tableTitle")}>Chi Tiết</div>
                    {createdList.map((ride, index) => (
                      <div className={cx("tableContent")} key={index}>
                        Xem Chi Tiết
                      </div>
                    ))}
                  </div>
                </div>
                <div className={cx("duPagination")}>
                  {Array.from({ length: totalCreatedPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handleCreatedPageChange(index + 1)}
                      className={cx({ active: index + 1 === currentRidesPage })}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {createdList.length === 0 && showCreatedList && (
              <div className={cx("emptyWarning")}>Không Có Chuyến Nào đã Tạo</div>
            )}
          </div>

        </div>

      </div>
    );
  }
  return "loading ...";
}

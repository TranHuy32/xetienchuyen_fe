import classNames from "classnames";
import styles from "./DetailUser.scss";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import searchIcon from "~/components/Image/search-icon.png";
import { type } from "@testing-library/user-event/dist/type";
import { act } from "react-dom/test-utils";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;
export default function DetailUser() {
  const { user_id } = useParams();
  const [user, setUser] = useState();
  const [carPicture, setCarPicture] = useState();
  const [state, setState] = useState({
    car_images: [],
    licensePlate: "",
    carType: "",
  });
  const [rides, setRides] = useState([]);
  const [createdList, setCreatedList] = useState([]);
  const [detailRide, setDetailRide] = useState([]);
  const [detailParcel, setDetailParcel] = useState([]);
  const [currentRidesPage, setCurrentRidesPage] = useState(1);
  const [currentCreatedPage, setCurrentCreatedPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRidesPages, setTotalRidesPages] = useState(0);
  const [totalCreatedPages, setTotalCreatedPages] = useState(0);
  const [accountStatus, setAccountStatus] = useState("");
  const [showCarImage, setShowCarImage] = useState(false);
  const [showRidesList, setShowRidesList] = useState(false);
  const [showCreatedList, setShowCreatedList] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreatedDetail, setShowCreatedDetail] = useState(false);
  const [showFixInfoWindow, setShowFixInfoWindow] = useState(false);
  const [reload, setReload] = useState(false);
  const token = localStorage.getItem("token") || [];

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();

  const owner = JSON.parse(localStorage.getItem("token_state")) || [];

  var currentDate = new Date();
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
        if (data.active) {
          setAccountStatus("Đã Kích Hoạt")
        } else {
          setAccountStatus("Chưa Kích Hoạt")
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }, [token, user_id, reload]);

  useEffect(() => {
    //get lịch sử đã nhận
    axios
      .get(
        // `${beURL}/ride/historyReceivedByOwner/${user_id}?page=${currentRidesPage}&pageSize=${pageSize}&date=${formattedDate}`,
        `${beURL}/ride/historyReceivedByOwner/${user_id}?page=${currentRidesPage}&pageSize=${pageSize}`,
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

  const handleShowDetail = (type, id, box) => {
    if (type === "RIDE" && box === 2) {
      //get rides data 
      axios
        .get(
          `${beURL}/ride/detailByOwner/${id}`,
          config
        )
        .then((response) => {
          const data = response.data;
          setDetailRide(data)
          setShowDetail(true)
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (type === "PARCEL" && box === 2) {
      //get parcel data 
      axios
        .get(
          `${beURL}/parcel/detailByOwner/${id}`,
          config
        )
        .then((response) => {
          const data = response.data;
          setDetailParcel(data)
          setShowDetail(true)
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (type === "RIDE" && box === 3) {
      //get rides data 
      axios
        .get(
          `${beURL}/ride/detailByOwner/${id}`,
          config
        )
        .then((response) => {
          const data = response.data;
          setDetailRide(data)
          setShowCreatedDetail(true)
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (type === "PARCEL" && box === 3) {
      //get parcel data 
      axios
        .get(
          `${beURL}/parcel/detailByOwner/${id}`,
          config
        )
        .then((response) => {
          const data = response.data;
          setDetailParcel(data)
          setShowCreatedDetail(true)
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const handleCancel = () => {
    setShowFixInfoWindow(false)
    setShowDetail(false)
    setShowCreatedDetail(false)
    setDetailParcel([])
    setDetailRide([])
    setState({
      car_images: [],
      licensePlate: "",
      carType: "",
    })
  }

  const handleShowFixInfoWindow = () => {
    setShowFixInfoWindow(true)
  }

  const isImageFile = (file) => {
    const acceptedFormats = ["image/png", "image/jpeg", "image/jpg"];
    return acceptedFormats.includes(file.type);
  };

  function handleFileInputChange(event) {
    const fileInput = event.target;
    const fileLabel = document.getElementById("car_images");
    const files = event.target.files;

    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter(isImageFile);

      // Check if adding new image files will exceed the limit
      if (state.car_images.length + imageFiles.length <= 5) {
        setState((prevState) => ({
          ...prevState,
          car_images: [...prevState.car_images, ...imageFiles],
        }));
      } else {
        alert("Số Ảnh Đã Đạt Tối Đa");
      }
    }
  }

  const changeHandler = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleChangeActive = (active) => {
    const type = !active
    axios
      .put(
        `${beURL}/users/manager/${user_id}`,
        { active: type },
        config
      )
      .then((response) => {
        const data = response.data;
        setReload(!reload);
        if (data) {
          setAccountStatus("Đã Kích Hoạt")
        } else {
          setAccountStatus("Chưa Kích Hoạt")
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSubmitFixInfo = (e) => {
    e.preventDefault();
    const formData = new FormData();
    // formData.append("car_images", state.car_images);
    formData.append("licensePlate", state.licensePlate);
    formData.append("carType", state.carType);
    for (let i = 0; i < state.car_images.length; i++) {
      formData.append('car_images', state.car_images[i]);
    }
    // const formDataObj = {};
    // formData.forEach((value, key) => {
    //   formDataObj[key] = value;
    // });

    axios
      .put(
        `${beURL}/users/update/${user_id}`,
        formData,
        config
      )
      .then((response) => {
        console.log(response);
        setState({
          car_images: [],
          licensePlate: "",
          carType: "",
        })
        setReload(!reload)
        alert("Thành Công")
        handleCancel()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleRemoveImage = (fileName) => {
    // Create a copy of the current car_images array
    const updatedCarImages = [...state.car_images];

    // Find the index of the file with the specified name
    const indexToRemove = updatedCarImages.findIndex((file) => file.name === fileName);

    // If the file with the specified name is found, remove it from the array
    if (indexToRemove !== -1) {
      updatedCarImages.splice(indexToRemove, 1);

      // Update the state with the new array
      setState((prevState) => ({
        ...prevState,
        car_images: updatedCarImages,
      }));
    }
  }

  const { licensePlate, carType } = state;

  console.log(state);

  if (user) {
    return (
      <div>
        {(showFixInfoWindow) && (
          <Fragment>
            <div className={cx("overlay")} onClick={() => handleCancel()}></div>
            <div className={cx("FixInfoWindow")}>
              <h2 className={cx("windowTitle")}>Thêm Thông Tin</h2>
              <div className={cx("fixBox1")}>
                <label for="seat">
                  Nhập Số Chỗ Ngồi:
                </label>
                <input
                  onChange={changeHandler}
                  name="carType"
                  id="seat"
                  type="number"
                  value={carType}
                  placeholder={user.carType !== 0 && (user.carType || "Số Chỗ Ngồi")} 
                ></input>
              </div>
              <div className={cx("fixBox2")}>
                <label for="carplate">
                  Nhập Biển Số Xe:
                </label>
                <input
                  onChange={changeHandler}
                  name="licensePlate"
                  id="carplate"
                  type="text"
                  value={licensePlate}
                  placeholder={user.licensePlate !== null && (user.licensePlate || "Biển Số Xe")} 

                ></input>
              </div>
              <div className={cx("fixImageBox")}>
                <div htmlFor="carImage">Ảnh Chụp Xe:</div>
                <input
                  id="carImage"
                  onChange={handleFileInputChange}
                  type="file"
                  name="car_images"
                  accept="image/png,image/jpeg,image/jpg"
                  className={cx("custom-file-input")}
                  multiple
                ></input>
                <label
                  id="file-label"
                  className="custom-file-label"
                  htmlFor="carImage"
                >
                  Ấn Để Chọn Ảnh
                </label>
              </div>
              {state.car_images.length > 0 &&
                state.car_images.map((image, index) => (
                  <div className={cx("fixImageNameBox")}>
                    <div className={cx("removeImageButton")}
                      onClick={() => handleRemoveImage(image.name)}
                    >Xoá</div>
                    <div key={index} className={cx("imageName")}>{image.name}</div>
                  </div>

                ))
              }
              <button id="submitFixInfo"
                onClick={handleSubmitFixInfo}
              >Gửi Đi</button>
            </div>
          </Fragment>
        )}
        {(showDetail && detailRide.length !== 0) && (
          <Fragment>
            <div className={cx("overlay")} onClick={() => handleCancel()}></div>
            <div className={cx("duDetailContainer")}>
              <div className={cx("customer")}>
                <div className={cx("customerName")}>tên khách hàng: {detailRide.customerName}</div>
                <div className={cx("customerPhone")}>SĐT khách hàng: {detailRide.customerPhone}</div>
              </div>


              <div className={cx("travel")}>
                <div className={cx("from")}>
                  <div className={cx("start1")}>điểm đi chi tiết: {detailRide.startDetail.startDetail}</div>
                  <div className={cx("start2")}>điểm đi: {detailRide.startDetail.startDistrictName + "-" + detailRide.startDetail.startProvinceName}</div>
                </div>
                <div className={cx("moveIcon")}>
                  {">>>"}
                </div>
                <div className={cx("to")}>
                  <div className={cx("end1")}>điểm đến chi tiết: {detailRide.endDetail.endDetail}</div>
                  <div className={cx("end2")}>điểm đến: {detailRide.endDetail.endDistrictName + "-" + detailRide.endDetail.endProvinceName}</div>
                </div>
              </div>

              <div className={cx("numberPeople")}>Số Khách: {detailRide.numberPeople} người</div>

              <div className={cx("price")}>Thu Khách: {detailRide.customerPrice} k</div>

              <div className={cx("seller")}>
                <div className={cx("fee1")}>hoa hồng: {detailRide.commission} k</div>
                <div className={cx("sellerPhone")}>Trung Gian: {detailRide.sellerPhone}</div>
              </div>


              <div className={cx("fee2")}>app phí: {detailRide.appFee} k</div>

              <div className={cx("receive")}>thực nhận: {detailRide.driverPrice} k</div>

              <div className={cx("note")}>Ghi Chú: {detailRide.note}</div>
            </div>
          </Fragment>
        )}
        {(showCreatedDetail && detailRide.length !== 0) && (
          <Fragment>
            <div className={cx("overlay")} onClick={() => handleCancel()}></div>
            <div className={cx("duDetailContainer")}>
              <div className={cx("customer")}>
                <div className={cx("customerName")}>tên khách hàng: {detailRide.customerName}</div>
                <div className={cx("customerPhone")}>SĐT khách hàng: {detailRide.customerPhone}</div>
              </div>


              <div className={cx("travel")}>
                <div className={cx("from")}>
                  <div className={cx("start1")}>điểm đi chi tiết: {detailRide.startDetail.startDetail}</div>
                  <div className={cx("start2")}>điểm đi: {detailRide.startDetail.startDistrictName + "-" + detailRide.startDetail.startProvinceName}</div>
                </div>
                <div className={cx("moveIcon")}>
                  {">>>"}
                </div>
                <div className={cx("to")}>
                  <div className={cx("end1")}>điểm đến chi tiết: {detailRide.endDetail.endDetail}</div>
                  <div className={cx("end2")}>điểm đến: {detailRide.endDetail.endDistrictName + "-" + detailRide.endDetail.endProvinceName}</div>
                </div>
              </div>

              <div className={cx("numberPeople")}>Số Khách: {detailRide.numberPeople} người</div>

              <div className={cx("price")}>Thu Khách: {detailRide.customerPrice} k</div>

              <div className={cx("seller")}>
                <div className={cx("fee1")}>hoa hồng: {detailRide.commission} k</div>
                <div className={cx("sellerPhone")}>Tài Xế: {detailRide.driverPhone} </div>
              </div>


              <div className={cx("fee2")}>app phí: {detailRide.appFee} k</div>

              <div className={cx("receive")}>thực nhận: {detailRide.driverPrice} k</div>

              <div className={cx("note")}>Ghi Chú: {detailRide.note}</div>
            </div>
          </Fragment>
        )}
        {(showDetail && detailParcel.length !== 0) && (
          <Fragment>
            <div className={cx("overlay")} onClick={() => handleCancel()}></div>
            <div className={cx("duDetailContainer")}>
              <div className={cx("parcelName")}>tên hàng: {detailParcel.parcelName !== null && detailParcel.parcelName}</div>
              <div className={cx("parcelWeight")}>cân nặng: {detailParcel.weight} kg</div>
              <div className={cx("parcelSize")}>
                kích thước:
                {detailParcel.size && (
                  <>
                    {detailParcel.size.width + "x" + detailParcel.size.height + "x" + detailParcel.size.length}
                  </>
                )}
              </div>

              <div className={cx("sendTime")}>
                thời gian nhận hàng: {
                  (() => {
                    // Extracting the timestamp from detailParcel.receiveTime
                    var timestamp = detailParcel.sendTime;
                    // Creating a new Date object using the timestamp
                    var date = new Date(timestamp);
                    // Extracting month, day, hours, and minutes from the date object
                    var month = date.getMonth() + 1; // Months are zero-based
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    // Formatting hours and minutes to have leading zeros if needed
                    var formattedHours = hours < 10 ? '0' + hours : hours;
                    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                    // Creating formatted strings for time and date
                    var formattedReceiveTime = formattedHours + ':' + formattedMinutes;
                    var formattedReceiveDate = day + '/' + month;
                    // Returning the formatted time and date
                    return (
                      formattedReceiveTime + " " + formattedReceiveDate
                    );
                  })()
                }
              </div>


              <div className={cx("sender")}>
                <div className={cx("name")}>tên người gửi:</div>
                <div className={cx("phone")}>sđt người gửi:{detailParcel.senderPhone}</div>
              </div>
              <div className={cx("sendFrom1")}>nơi gửi: {detailParcel.sendPoint}</div>
              <div className={cx("receiveTime")}>thời gian giao hàng:
                {
                  (() => {
                    // Extracting the timestamp from detailParcel.receiveTime
                    var timestamp = detailParcel.receiveTime;
                    // Creating a new Date object using the timestamp
                    var date = new Date(timestamp);
                    // Extracting month, day, hours, and minutes from the date object
                    var month = date.getMonth() + 1; // Months are zero-based
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    // Formatting hours and minutes to have leading zeros if needed
                    var formattedHours = hours < 10 ? '0' + hours : hours;
                    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                    // Creating formatted strings for time and date
                    var formattedReceiveTime = formattedHours + ':' + formattedMinutes;
                    var formattedReceiveDate = day + '/' + month;
                    // Returning the formatted time and date
                    return (
                      formattedReceiveTime + " " + formattedReceiveDate
                    );
                  })()
                }</div>
              <div className={cx("receiver")}>
                <div className={cx("name")}>tên người nhận:</div>
                <div className={cx("phone")}>sđt người nhận:{detailParcel.receiverPhone}</div>
              </div>

              <div className={cx("sendto1")}>nơi nhận: {detailParcel.receivePoint}</div>

              <div className={cx("shippingPayer")}>người trả phí ship:
                {detailParcel.shippingPayer === "RECEIVER" && " người nhận"}
                {detailParcel.shippingPayer === "SENDER" && " người gửi"}
              </div>
              <div className={cx("prePay")}>ứng trước: {detailParcel.prePay === true && ("có" || "không")}</div>
              <div className={cx("senderAmount")}>tiền thu khách gửi: {detailParcel.senderAmount} k</div>
              <div className={cx("receiverAmount")}>tiền thu khách nhận: {detailParcel.prePay && " ứng "} {detailParcel.receiverAmount} k</div>
              <div className={cx("cod")}>Tiền thu hộ: {detailParcel.cod} k</div>
              <div className={cx("appFee")}>phí app: {detailParcel.appFee} k</div>



            </div>
          </Fragment>
        )}
        {(showCreatedDetail && detailParcel.length !== 0) && (
          <Fragment>
            <div className={cx("overlay")} onClick={() => handleCancel()}></div>
            <div className={cx("duDetailContainer")}>
              <div className={cx("parcelName")}>tên hàng: {detailParcel.parcelName !== null && detailParcel.parcelName}</div>
              <div className={cx("parcelWeight")}>cân nặng: {detailParcel.weight} kg</div>
              <div className={cx("parcelSize")}>
                kích thước:
                {detailParcel.size && (
                  <>
                    {detailParcel.size.width + "x" + detailParcel.size.height + "x" + detailParcel.size.length}
                  </>
                )}
              </div>

              <div className={cx("sendTime")}>
                thời gian nhận hàng: {
                  (() => {
                    // Extracting the timestamp from detailParcel.receiveTime
                    var timestamp = detailParcel.sendTime;
                    // Creating a new Date object using the timestamp
                    var date = new Date(timestamp);
                    // Extracting month, day, hours, and minutes from the date object
                    var month = date.getMonth() + 1; // Months are zero-based
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    // Formatting hours and minutes to have leading zeros if needed
                    var formattedHours = hours < 10 ? '0' + hours : hours;
                    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                    // Creating formatted strings for time and date
                    var formattedReceiveTime = formattedHours + ':' + formattedMinutes;
                    var formattedReceiveDate = day + '/' + month;
                    // Returning the formatted time and date
                    return (
                      formattedReceiveTime + " " + formattedReceiveDate
                    );
                  })()
                }
              </div>


              <div className={cx("sender")}>
                <div className={cx("name")}>tên người gửi:</div>
                <div className={cx("phone")}>sđt người gửi:{detailParcel.senderPhone}</div>
              </div>
              <div className={cx("sendFrom1")}>nơi gửi: {detailParcel.sendPoint}</div>
              <div className={cx("receiveTime")}>thời gian giao hàng:
                {
                  (() => {
                    // Extracting the timestamp from detailParcel.receiveTime
                    var timestamp = detailParcel.receiveTime;
                    // Creating a new Date object using the timestamp
                    var date = new Date(timestamp);
                    // Extracting month, day, hours, and minutes from the date object
                    var month = date.getMonth() + 1; // Months are zero-based
                    var day = date.getDate();
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    // Formatting hours and minutes to have leading zeros if needed
                    var formattedHours = hours < 10 ? '0' + hours : hours;
                    var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                    // Creating formatted strings for time and date
                    var formattedReceiveTime = formattedHours + ':' + formattedMinutes;
                    var formattedReceiveDate = day + '/' + month;
                    // Returning the formatted time and date
                    return (
                      formattedReceiveTime + " " + formattedReceiveDate
                    );
                  })()
                }</div>
              <div className={cx("receiver")}>
                <div className={cx("name")}>tên người nhận:</div>
                <div className={cx("phone")}>sđt người nhận:{detailParcel.receiverPhone}</div>
              </div>

              <div className={cx("sendto1")}>nơi nhận: {detailParcel.receivePoint}</div>

              <div className={cx("shippingPayer")}>người trả phí ship:
                {detailParcel.shippingPayer === "RECEIVER" && " người nhận"}
                {detailParcel.shippingPayer === "SENDER" && " người gửi"}
              </div>
              <div className={cx("prePay")}>ứng trước: {detailParcel.prePay === true && ("có" || "không")}</div>
              <div className={cx("senderAmount")}>tiền thu khách gửi: {detailParcel.senderAmount} k</div>
              <div className={cx("receiverAmount")}>tiền thu khách nhận: {detailParcel.prePay && " ứng "} {detailParcel.receiverAmount} k</div>
              <div className={cx("cod")}>Tiền thu hộ: {detailParcel.cod} k</div>
              <div className={cx("appFee")}>phí app: {detailParcel.appFee} k</div>



            </div>
          </Fragment>
        )}
        {(user.licensePlate === null || user.carType === 0 || carPicture.length === 0) && (
          <div className={cx("duMissingWarningContainer")}>
            <div className={cx("mwMessage")}>Hồ Sơ Hiện Đang Thiếu
              {user.licensePlate === null && " Biến Số Xe. "}
              {user.carType === 0 && " Số Chỗ Ngồi. "}
              {carPicture.length === 0 && " Ảnh Chụp Xe. "}
            </div>
            <div className={cx("mwFixButton")}
              onClick={() => handleShowFixInfoWindow()}
            >Bổ Xung Ngay</div>
          </div>
        )}
        <div className={cx("duInforContainer")}>
          <div className={cx("inforPortrait")}>
            <img alt="ảnh chân dung"></img>
          </div>
          <div className={cx("inforDetailBox")}>
            <div className={cx("detailName")}>Tên Tài Xế: {" " + user.name} </div>
            <div className={cx("detailLoginName")}>tên đăng nhập: {" " + user.userName}</div>
            <div className={cx("detailAccountStatus")}>
              Trạng Thái Tài Khoản: {accountStatus}
              <button
                className={user.active && "active"}
                onClick={() => handleChangeActive(user.active)}
              >
                {user.active && "Tắt Hoạt Động"}
                {!user.active && "Kích Hoạt"}
              </button></div>
            <div className={cx("detailAmount")}>số dư: {" " + user.amount}</div>
            <div className={cx("detailCarData")}>
              <div className={cx("dataPlate")}>biển kiểm soát: {user.licensePlate !== "Null" && user.licensePlate}</div>
              <div className={cx("dateCarType")}>loại xe: {user.carType !== 0 && (user.carType + " chỗ")}</div>
            </div>
          </div>
        </div>

        <div className={cx("duContainer")}>
          <div className={cx("box1")}>
            {carPicture.length !== 0 &&
              <div className={cx("topBox1")}
                onClick={() => handleShowCarImage(true)}
              >
                {!showCarImage && "xem ảnh xe"}
                {showCarImage && "ẩn ảnh xe"}
              </div>
            }
            {carPicture.length === 0 && (
              <div className={cx("topBox1")}
              >
                Không Có Ảnh Xe
              </div>
            )}
            <div className={cx("bottomBox1")}>
              {showCarImage && (
                <div className={cx("imageBox")}>
                  {carPicture.map((car, index) => (
                    <img src={car.path} key={index} alt="ảnh xe"></img>
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
                          <div>{ride.sendPoint}</div>
                        )}
                        {ride.type === "RIDE" && (
                          <div>{ride.endPoint}</div>
                        )}
                        {ride.type === "PARCEL" && (
                          <div>{ride.receivePoint}</div>
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
                      <div className={cx("tableContent")}
                        key={index}
                        onClick={() => handleShowDetail(ride.type, ride._id, 2)}
                      >
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
                          <div>{create.sendPoint}</div>
                        )}
                        {create.type === "RIDE" && (
                          <div>{create.endPoint}</div>
                        )}
                        {create.type === "PARCEL" && (
                          <div>{create.receivePoint}</div>
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
                      <div className={cx("tableContent")}
                        key={index}
                        onClick={() => handleShowDetail(ride.type, ride._id, 3)}
                      >
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

import classNames from "classnames";
import styles from "./DetailUser.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function DetailUser() {
  const [user, setUser] = useState([]);
  const [rides, setRides] = useState([]);

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const { user_id } = useParams();
  console.log(user);
  useEffect(() => {
    axios
      .get(`${beURL}/users/detailByOwner/${user_id}`, config)
      .then((response) => {
        const data = response.data;
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${beURL}/ride/historyRideByOwner/${user_id}`, config)
      .then((response) => {
        const data = response.data;
        setRides(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, user_id]);
  const handleClickDetail = () => {
    alert("ok");
  };
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];

  if (user.length !== 0) {
    return (
      <div className={cx("dWrapper")}>
        <ul className={cx("dMenu")}>
          <li
            className={cx("fActived")}
            onClick={() => {
              navigate(`/users/${owner.groupId}`);
            }}
          >
            Thành viên
          </li>
          <li
            onClick={() => {
              navigate("/createUser");
            }}
          >
            Tạo tài khoản
          </li>
          <li
            onClick={() => {
              navigate("/followProvince");
            }}
          >
            Các tỉnh hay chạy
          </li>
          <li
            onClick={() => {
              navigate(`/transaction/${owner.groupId}`);
            }}
          >
            Giao dịch
          </li>
        </ul>
        <div className={cx("dContentWrapper")}>
          <h2 className={cx("dUserName")}>Thành viên {user.name}</h2>
          <div className={cx("dContentBox")}>
            <div className={cx("dTitle")}>
            </div>
            <ul className={cx("")}>
              <li>
              </li>
              <li>
                <p>Tên</p>
                <p>{user.name}</p>
              </li>
              <li>
                <p>Số dư</p>
                <p className={cx("dAmount")}>{user.amount} k</p>
              </li>
              <li>
                <p>Tên đăng nhập</p>
                <p>{user.userName}</p>
              </li>
              <li>
                <p>Loại xe</p>
                <p>{user.name}</p>
              </li>
            </ul>
          </div>
          <div className={cx("dAllRidesWrapper")}>
            <h3 className={cx("dAllRidesTittle")}>Các chuyến đã nhận:</h3>
            <ul className={cx("")}>
              <li className={cx("total-info")}>
                <div className={cx("dRideInfo")}>
                  <p>Khách hàng</p>
                  <p>Giá cước</p>
                  <p>Hoa hồng</p>
                  <p>Trạng thái</p>
                </div>
                <p className={cx("dRideDetail")}>Chi tiết</p>
              </li>
              {rides.map((user, index) => (
                <li key={index} className={cx("")}>
                  <div className={cx("dRideInfo")}>
                    <p>{user.customerPhone}</p>
                    <p className={cx("dRideAmount")}>{user.customerPrice} k</p>
                    <p className={cx("dRideAmount")}>{user.customerPrice - user.appFee - user.driverPrice} k</p>
                    <p>{user.status}</p>
                  </div>
                  <p
                    className={cx("dRideEdit", "dRideArrow")}
                    onClick={() => {
                      handleClickDetail(user._id);
                    }}
                  >
                    {">"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div >
    );
  }
  return "loading ...";
}

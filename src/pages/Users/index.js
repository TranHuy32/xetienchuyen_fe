import classNames from "classnames";
import styles from "./Users.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [group, setGroup] = useState([]);

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const { group_id } = useParams();

  useEffect(() => {
    axios
      .get(`${beURL}/group/detail/${group_id}`, config)
      .then((response) => {
        const data = response.data;
        setGroup(data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${beURL}/users/allGroupMembers/${group_id}`, config)
      .then((response) => {
        const data = response.data;
        if (!data || data.length === 0) {
          setUsers([]);
        } else {
          setUsers(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, group_id]);
  const handleClickDetail = () => {
    alert("ok");
  };
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];

  if (users.length !== 0) {
    return (
      <div className={cx("uWrapper")}>
        <ul className={cx("uMenu")}>
          <li
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
        </ul>
        <div>
          <h2 className={cx("uGroupName")}>Nhóm {group.name}</h2>
          <div className={cx("uContentBox")}>
            <div className={cx("uTitle")}>
              <p>Danh sách thành viên trong nhóm:</p>
              {/* <button>Tạo tài khoản</button> */}
            </div>
            <ul className={cx("")}>
              <li className={cx("total-info")}>
                <div className={cx("uInfo")}>
                  <p>Tên</p>
                  <p>Số dư</p>
                  <p>Tên đăng nhập</p>
                  <p>Loại xe</p>
                  <p>Số lượng ghế</p>
                  <p>Biển số xe</p>
                </div>
                <p className={cx("uEdit")}>Chỉnh sửa</p>
              </li>
              {users.map((user, index) => (
                <li key={index} className={cx("")}>
                  <div className={cx("uInfo")}>
                    <p>{user.name}</p>
                    <p className={cx("uAmount")}>{user.amount} k</p>
                    <p>{user.userName}</p>
                    <p>{user.manufacturer}</p>
                    <p>{user.carType}</p>
                    <p>{user.licensePlate}</p>
                  </div>
                  <p
                    className={cx("uEdit", "uArrow")}
                    onClick={handleClickDetail}
                  >
                    {">"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
  return "loading ...";
}

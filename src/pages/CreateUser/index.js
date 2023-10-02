import classNames from "classnames";
import styles from "./CreateUser.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function CreateUser() {
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];
  const [state, setState] = useState({
    name: "",
    userName: "",
    password: "",
    rePassword: "",
    manufacturer: "",
    carType: "",
    licensePlate: "",
    groupId: owner.groupId,
  });
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const handleCreateUser = (e) => {
    if (state.password !== state.rePassword) {
      alert("Mật khẩu nhập lại không đúng!");
      return;
    }
    e.preventDefault();
    axios
      .post(`${beURL}/users-auth/register`, state, config)
      .then((response) => {
        if (response.data === "UserName Existed!") {
          alert("Tên đăng nhập đã tồn tại");
        } else if (response.data === "Group Not Existed") {
          alert("Nhóm không tồn tại");
        } else {
          alert("Tạo thành công");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeHandler = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!/^[0-9]+$/.test(keyValue)) {
      event.preventDefault();
    }
  };
  const {
    name,
    userName,
    password,
    rePassword,
    manufacturer,
    carType,
    licensePlate,
  } = state;

  return (
    <div className={cx("cuWrapper")}>
      <ul className={cx("cuMenu")}>
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
          className={cx("cuActived")}
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
      <div className={cx("cuContent")}>
        <h2 className={cx("cuTitle")}>Tạo tài khoản</h2>
        <form className={cx("cuForm")} onSubmit={handleCreateUser}>
          <div>
            <label htmlFor="name">Họ tên thành viên: </label>
            <input
              required
              className={cx("")}
              placeholder="Họ tên"
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={changeHandler}
            ></input>
          </div>
          <div>
            <label htmlFor="userName">Tên đăng nhập:</label>
            <input
              required
              className={cx("")}
              placeholder="Số điện thoại"
              type="tel"
              pattern="[0-9]*"
              name="userName"
              maxLength="10"
              id="userName"
              value={userName}
              onChange={changeHandler}
              onKeyPress={handleKeyPress}
            ></input>
          </div>
          <div>
            <label htmlFor="password">Mật khẩu:</label>
            <input
              required
              className={cx("")}
              placeholder="Mật khẩu"
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={changeHandler}
            ></input>
          </div>
          <div>
            <label htmlFor="rePassword">Nhập lại mật khẩu:</label>
            <input
              required
              className={cx("")}
              placeholder="Nhập lại mật khẩu"
              type="password"
              name="rePassword"
              id="rePassword"
              value={rePassword}
              onChange={changeHandler}
            ></input>
          </div>
          <div>
            <label htmlFor="manufacturer">Loại xe:</label>
            <input
              required
              className={cx("")}
              placeholder="Loại xe"
              type="text"
              name="manufacturer"
              id="manufacturer"
              value={manufacturer}
              onChange={changeHandler}
            ></input>
          </div>
          <div>
            <label htmlFor="carType">Số lượng ghế:</label>
            <input
              required
              className={cx("")}
              placeholder="Số lượng ghế"
              type="tel"
              pattern="[0-9]*"
              name="carType"
              id="carType"
              value={carType}
              onKeyPress={handleKeyPress}
              onChange={changeHandler}
            ></input>
          </div>
          <div>
            <label htmlFor="licensePlate">Biển số xe:</label>
            <input
              required
              className={cx("")}
              placeholder="Biển số xe"
              type="text"
              name="licensePlate"
              id="licensePlate"
              value={licensePlate}
              onChange={changeHandler}
            ></input>
          </div>
          <button className={cx("")} type="submit">
            Tạo tài khoản
          </button>
        </form>
      </div>
    </div>
  );
}

import classNames from "classnames";
import styles from "./Recharge.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Users from "../Users";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;
const defaultPassword = "12345678";

export default function CreateUser() {
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];
  const [state, setState] = useState({
    name: "",
    userName: "",
    password: defaultPassword,
    groupId: owner.groupId,
  });
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const handleCreateUser = (e) => {

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
    <div className={cx("rWrapper")}>
      <div className={cx("rContent")}>
        <form className={cx("rForm")} onSubmit={handleCreateUser}>
          <div>
            <label htmlFor="userName">Tên Đăng Nhập:</label>
            <input
              required
              className={cx("")}
              placeholder="Nhập Số Điện Thoại"
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
            <label htmlFor="name">Số Tiền: </label>
            <input
              required
              className={cx("")}
              placeholder="Nhập Số Tiền"
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={changeHandler}
            ></input>
          </div>
          <button className={cx("")} type="submit">
            Xác Nhận Nạp Tiền
          </button>
        </form>
      </div>
    </div>
  );
}
import classNames from "classnames";
import styles from "./CreateUser.scss";
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
    // rePassword: "",
    // manufacturer: "",
    // carType: "",
    // licensePlate: "",
    groupId: owner.groupId,
  });
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const handleCreateUser = (e) => {
    // if (state.password !== state.rePassword) {
    //   alert("Mật khẩu nhập lại không đúng!");
    //   return;
    // }
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
      <div className={cx("cuContent")}>
        <form className={cx("cuForm")} onSubmit={handleCreateUser}>
          <div>
            <label htmlFor="name">Họ Và Tên: </label>
            <input
              required
              className={cx("")}
              placeholder="Tên Tài Xế"
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={changeHandler}
              maxLength={40}
            ></input>
          </div>
          <div>
            <label htmlFor="userName">Số Điện Thoại:</label>
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
          <div className={cx("cuPassWord")}>
              <div>Mật khẩu mặc định:<p>{state.password}</p></div>
          </div>
          <button className={cx("")} type="submit">
            Tạo tài khoản
          </button>
        </form>
      </div>
    </div>
  );
}

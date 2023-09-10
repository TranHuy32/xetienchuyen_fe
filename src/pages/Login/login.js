import classNames from "classnames";
import styles from "~/pages/Login/Login.scss";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignOut } from "react-auth-kit";
import axios from "axios";
import { useEffect, useState } from "react";
import Users from "../Users";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function Login() {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [formData, setFormData] = useState({
    ownerName: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${beURL}/owner-auth/login`, formData);
      const { accessToken, refreshToken, owner } = response.data;
      if (!response.data) {
        return alert("Sai Tên Tài Khoản Hoặc Mật Khẩu");
      }
      signIn({
        token: accessToken,
        tokenType: "Bearer",
        expiresIn: 60,
        authState: owner,
        refreshToken: refreshToken,
        refreshTokenExpireIn: 43200,
      });
      navigate(`/users/${owner.groupId}`);
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error.response);
        return;
      } else {
        console.log(error);
        return error;
      }
    }
  };
  return (
    <div className={cx("lgWrapper")}>
      <div className={cx("blackBar")}>
        <div className={cx("TopBar")}>
          <div className={cx("mTopBar")}></div>
        </div>
      </div>
      <div className={cx("lgBody")}>
        <div className={cx("bMarginTop")}></div>
        <div className={cx("lgContent")}>
          <div className={cx("lgRightContainer")}>
            <h2>Đăng nhập</h2>
            <form className={cx("lgBox")} onSubmit={handleSubmit}>
              <div className={cx("lgAccountBox")}>
                <input
                  required
                  className={cx("account-input")}
                  type="text"
                  placeholder="Tên Đăng Nhập"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ownerName: e.target.value,
                    })
                  }
                ></input>
              </div>
              <div className={cx("lgPasswordBox")}>
                <input
                  required
                  className={cx("password-input")}
                  type="password"
                  placeholder="Mật Khẩu"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                ></input>
              </div>
              <div className={cx("lgLoginButtonBox")}>
                <button type="submit" value="Log in">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

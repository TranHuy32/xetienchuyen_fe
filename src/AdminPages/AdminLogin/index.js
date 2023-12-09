import classNames from "classnames";
import styles from "~/AdminPages/AdminLogin/AdminLogin.scss";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignOut } from "react-auth-kit";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function AdminLogin() {

  const navigate = useNavigate();
  const signIn = useSignIn();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${beURL}/users-auth/loginAdmin`, formData);
      const { accessToken, refreshToken, admin } = response.data;
      if (!response.data) {
        return alert("Sai Tên Tài Khoản Hoặc Mật Khẩu");
      }
      console.log(formData);
      signIn({
        token: accessToken,
        tokenType: "Bearer",
        expiresIn: 30,
        authState: admin,
        refreshToken: refreshToken,
        refreshTokenExpireIn: 43200,
      });
      navigate(`/adminhome`);
      // window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error.response.data.message);
        alert(error.response.data.message)
        return;
      } else {
        alert(error.response.data.message)
        console.log(error);
        return error;
      }
    }
  };

  return (
    <div className={cx("lgWrapper")}>
      <div className={cx("lgBody")}>
        <div className={cx("bMarginTop")}></div>
        <div className={cx("lgContent")}>
          <div className={cx("lgRightContainer")}>
            <h2>ADMIN</h2>
            <form className={cx("lgBox")}
              onSubmit={handleSubmit}
            >
              <div className={cx("lgAccountBox")}>
                <input
                  required
                  className={cx("account-input")}
                  type="text"
                  placeholder="Tên Đăng Nhập"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      userName: e.target.value,
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
              <div className={cx("adminlgLoginButtonBox")}>
                <button type="submit" value={"Log in"}
                >
                  Đăng Nhập
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

import classNames from "classnames";
import styles from "~/pages/Login/Login.scss";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignOut } from "react-auth-kit";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import Users from "../Users";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function Login() {
  const [show2FAInput, setShow2FAInput] = useState(false);
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    // twoFaCode: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post(`${beURL}/users-auth/loginOwner`, formData);
      const { accessToken, refreshToken, user } = response.data;
      if (!response.data) {
        return alert("Sai Tên Tài Khoản Hoặc Mật Khẩu");
      }
      signIn({
        token: accessToken,
        tokenType: "Bearer",
        expiresIn: 30,
        authState: user,
        refreshToken: refreshToken,
        refreshTokenExpireIn: 43200,
      });
      navigate(`/users/${user.groupId}`);
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

  function clickEvent(event, nextInputId, prevInputId) {
    const currentInput = event.target;

    if (currentInput.value >= 0 && currentInput.value <= 9) {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      return;
    }

    if (event.key === 'Backspace' && currentInput.value.length === 0) {
      const prevInput = document.getElementById(prevInputId);
      if (prevInput) {
        prevInput.focus();
      }
      return; // Stop further execution
    }

    if (!/^\d$/.test(currentInput.value)) {
      return; // Return early if the entered value is not a digit
    }
  };

  const handleCancel = () => {
    setShow2FAInput(false)
  }

  return (
    <div className={cx("lgWrapper")}>
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
              <div className={cx("lgLoginButtonBox")}>
                <p onClick={() => (setShow2FAInput(true))}>
                  Đăng Nhập
                </p>
                {show2FAInput && (
                  <Fragment>
                    <div className={cx("overlay")} onClick={() => handleCancel()}></div>
                    <div className={cx("FAContainer")}>
                      <div className={cx("FATitle")}>Nhập Mã Xác Thực 2FA: </div>
                      <div className={cx("inputContainer")}>
                        <input type="number" pattern="[0-9]" id="text1" onKeyUp={(e) => clickEvent(e, "text2", "text1")} autoFocus />
                        <input type="number" pattern="[0-9]" id="text2" onKeyUp={(e) => clickEvent(e, "text3", "text1")} />
                        <input type="number" pattern="[0-9]" id="text3" onKeyUp={(e) => clickEvent(e, "text4", "text2")} />
                        <input type="number" pattern="[0-9]" id="text4" onKeyUp={(e) => clickEvent(e, "text5", "text3")} />
                        <input type="number" pattern="[0-9]" id="text5" onKeyUp={(e) => clickEvent(e, "text6", "text4")} />
                        <input type="number" pattern="[0-9]" id="text6" onKeyUp={(e) => clickEvent(e, "submit", "text5")} />
                      </div>
                      <button type="submit" value="Log in">
                        Xác Nhận
                      </button>
                    </div>
                  </Fragment>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

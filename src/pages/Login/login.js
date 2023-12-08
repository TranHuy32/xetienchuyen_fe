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
    concatenateValues()
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

  console.log(formData);

  const concatenateValues = () => {
    const input1Value = document.getElementById("text1").value;
    const input2Value = document.getElementById("text2").value;
    const input3Value = document.getElementById("text3").value;
    const input4Value = document.getElementById("text4").value;
    const input5Value = document.getElementById("text5").value;
    const input6Value = document.getElementById("text6").value;

    const isNumericInRange = (value) => {
      return /^\d$/.test(value) && Number(value) >= 0 && Number(value) <= 9;
    };

    if (
      !isNumericInRange(input1Value) ||
      !isNumericInRange(input2Value) ||
      !isNumericInRange(input3Value) ||
      !isNumericInRange(input4Value) ||
      !isNumericInRange(input5Value) ||
      !isNumericInRange(input6Value)
    ) {
      alert("Mã Xác Thực Không Hợp Lệ")
    } else {
      const concatenatedString = `${input1Value}${input2Value}${input3Value}${input4Value}${input5Value}${input6Value}`;
      setFormData({
        ...formData,
        twoFaCode: concatenatedString,
      })
      return formData;
    }
  };

  function inputEvent(event, nextInputId, prevInputId) {
    const currentInput = event.target;

    if (event.key === 'Backspace' && currentInput.value.length === 0) {
      const prevInput = document.getElementById(prevInputId);
      if (prevInput) {
        prevInput.focus();
      }
      return;
    }

    if (!/^\d$/.test(currentInput.value)) {
      return; 
    }

    if (currentInput.value >= 0 && currentInput.value <= 9) {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      return;
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
                        <input type="number" pattern="[0-9]" id="text1" onKeyUp={(e) => inputEvent(e, "text2", "text1")} autoFocus />
                        <input type="number" pattern="[0-9]" id="text2" onKeyUp={(e) => inputEvent(e, "text3", "text1")} />
                        <input type="number" pattern="[0-9]" id="text3" onKeyUp={(e) => inputEvent(e, "text4", "text2")} />
                        <input type="number" pattern="[0-9]" id="text4" onKeyUp={(e) => inputEvent(e, "text5", "text3")} />
                        <input type="number" pattern="[0-9]" id="text5" onKeyUp={(e) => inputEvent(e, "text6", "text4")} />
                        <input type="number" pattern="[0-9]" id="text6" onKeyUp={(e) => inputEvent(e, "submit", "text5")} />
                      </div>
                      <button type="submit" value={"Log in"}>
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

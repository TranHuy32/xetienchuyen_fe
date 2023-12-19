import classNames from "classnames";
import styles from "~/pages/Login/Login.scss";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignOut } from "react-auth-kit";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import Users from "../Users";
import OtpInput from 'react-otp-input';
const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function Login() {
  const [show2FAInput, setShow2FAInput] = useState(false);
  const [otp, setOtp] = useState('')
  const navigate = useNavigate();
  const signIn = useSignIn();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    twoFaCode: "",
  });

  useEffect(() => {
    setFormData({
      ...formData,
      twoFaCode: otp,
    })
  }, [otp]);
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length === 6) {
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
          console.log(formData);
          return;
        } else {
          console.log(error);
          return error;
        }
      }
    }else{
      alert("Hãy Kiểm Tra Lại Mã Xác Thực")
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
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          renderSeparator={<span> </span>}
                          renderInput={(props) => <input {...props} />}
                        />
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

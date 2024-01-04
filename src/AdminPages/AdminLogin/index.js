import classNames from "classnames";
import styles from "~/AdminPages/AdminLogin/AdminLogin.scss";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignOut } from "react-auth-kit";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import OtpInput from 'react-otp-input';
const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function AdminLogin() {

  const navigate = useNavigate();
  const signIn = useSignIn();
  const [firstOTP, setFirstOTP] = useState('')
  const [otp, setOtp] = useState('')
  const [qrGenerated, setQrGenerated] = useState(false)
  const [showAdd2faPopup, setShowAdd2faPopup] = useState(false)
  const [form2FAData, setForm2FAData] = useState({
    userName: "",
    password: "",
    otp: ""
  });
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  //update OTP
  useEffect(() => {
    setForm2FAData({
      ...form2FAData,
      otp: firstOTP,
    })
  }, [firstOTP]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${beURL}/users-auth/loginAdmin`, formData);
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
      navigate(`/adminlogin/adminhome`);
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

  const handleCancelShowPopup = () => {
    setShowAdd2faPopup(false)
  }

  const handleShowAdd2faPopup = () => {
    setShowAdd2faPopup(true)

  }

  console.log(form2FAData);

  return (
    <div className={cx("lgWrapper")}>
      {showAdd2faPopup && (
        <Fragment>
          <div className={cx("overlay")} onClick={() => handleCancelShowPopup()}></div>
          <div className={cx("add2faContainer")}>
            <div className={cx("title")}>Cài Đặt Bảo Mật 2 Lớp</div>
            <div className={cx("content")}>
              <div className={cx("leftContainer")}>
                <div className={cx("inputLoginName")}>
                  <label for="2faName">Tên Đăng Nhập:</label>
                  <input
                    id="2faName"
                    type="text"
                    onChange={(e) =>
                      setForm2FAData({
                        ...form2FAData,
                        userName: e.target.value,
                      })
                    }
                  ></input>
                </div>
                <div className={cx("inputPassword")}>
                  <label for="2faPassword">Mật Khẩu:</label>
                  <input
                    id="2faPassword"
                    type="text"
                    onChange={(e) =>
                      setForm2FAData({
                        ...form2FAData,
                        password: e.target.value,
                      })
                    }
                  ></input>
                </div>
                {!qrGenerated && (
                  <button onClick={() => setQrGenerated(true)}>Tạo QR Code</button>
                )}
                {qrGenerated && (
                  <div className={cx("otpInputContainer")}> 
                    <div>Nhập Mã Otp:</div>
                    <OtpInput
                      value={firstOTP}
                      onChange={setFirstOTP}
                      numInputs={6}
                      renderSeparator={<span> </span>}
                      renderInput={(props) => <input {...props} />}
                    />
                    <button onClick={() => setQrGenerated(false)}>Gửi Mã Xác Nhận</button>
                  </div>
                )}

              </div>
              <div className={cx("rightContainer")}>
                {/* <div className={cx("rightTitle")}>2FA QR CODE</div> */}
                <div id="img">ảnh QR</div>
              </div>
            </div>

          </div>
          {/* <div className={cx("FAContainer")}>
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
            </div> */}
        </Fragment>
      )}
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
              <p id="admin2FATextLine">Chưa Có Mã Xác Thực 2FA?
                <strong onClick={() => handleShowAdd2faPopup()}>Kích Hoạt Ngay</strong></p>
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

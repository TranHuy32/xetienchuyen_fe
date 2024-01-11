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
  const [otpAdmin, setOtpAdmin] = useState('')
  const [qrGenerated, setQrGenerated] = useState(false)
  const [qrSrc, setQrSrc] = useState("")
  const [showAdd2faPopup, setShowAdd2faPopup] = useState(false)
  const [showInputFaCode, setShowInputFaCode] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    twoFaCode: ""
  });

  //update OTP
  useEffect(() => {
    setFormData({
      ...formData,
      twoFaCode: otpAdmin,
    })
  }, [otpAdmin]);

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
    setShowInputFaCode(false)
  }

  const handleShowAdd2faPopup = () => {
    setShowAdd2faPopup(true)
  }

  const handleGetQR = () => {
    axios
      .get(`${beURL}/users-auth/2faForAdmin/qr`)
      .then((response) => {
        const data = response.data;
        console.log(data);
        setQrSrc(data)
        setQrGenerated(true)
      })
      .catch((error) => {
        console.log(error);
        if (!!error?.response?.data?.message) {
          if (error.response.data.message === "2FA was enabled") {
            alert("Đã Bật Bảo Mật 2 Lớp")
            return
          }
        }
      });
  }

  const handleTurnOn2fa = () => {
    axios
      .post(`${beURL}/users-auth/2faForAdmin/turn-on`, {
        "twoFaCode": firstOTP
      })
      .then((response) => {
        const data = response?.data;
        if (!!data && data === true) {
          alert("Bật Bảo Mật 2 Lớp Thành Công")
          setFirstOTP('')
          setShowAdd2faPopup(false)
          setQrSrc("")
          setQrGenerated(false)
        } else {
          alert("Bật Bảo Mật 2 Lớp Thất Bại")
        }
      })
      .catch((error) => {
        console.log(error?.response?.data?.message);
        if (!!error?.response?.data?.message) {
          if (error.response.data.message === "Wrong authentication code") {
            alert("Sai Mã Xác Thực")
            return
          }
        }
      });
  }
  console.log(formData);
  return (
    <div className={cx("lgWrapper")}>
      {showAdd2faPopup && (
        <Fragment>
          <div className={cx("overlay")} onClick={() => handleCancelShowPopup()}></div>
          <div className={cx("add2faContainer")}>
            <div className={cx("title")}>Cài Đặt Bảo Mật 2 Lớp</div>
            <div className={cx("content")}>
              <div className={cx("topContainer")}>
                {/* <div className={cx("rightTitle")}>2FA QR CODE</div> */}
                {/* <div id="img">ảnh QR</div> */}
                {qrGenerated && (
                  <img src={qrSrc} alt="qr-code"></img>
                )}

              </div>
              <div className={cx("bottomContainer")}>
                {/* <div className={cx("inputLoginName")}>
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
                </div> */}
                {!qrGenerated && (
                  <button onClick={() => handleGetQR()}>Tạo QR Code</button>
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
                    <button onClick={() => handleTurnOn2fa()}>Gửi Mã Xác Nhận</button>
                  </div>
                )}

              </div>

            </div>

          </div>

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
              <div className={cx("lgLoginButtonBox")}>
                {/* <button type="submit" value={"Log in"}
                >
                  Đăng Nhập
                </button> */}
                <p id="adminLoginButton" onClick={() => setShowInputFaCode(true)}>
                  Đăng Nhập
                </p>
                {showInputFaCode && (
                  <Fragment>
                    <div className={cx("overlay")} onClick={() => handleCancelShowPopup()}></div>
                    <div className={cx("FAContainer")}>
                      <div className={cx("FATitle")}>Nhập Mã Xác Thực 2FA: </div>
                      <div className={cx("inputContainer")}>
                        <OtpInput
                          value={otpAdmin}
                          onChange={setOtpAdmin}
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

export default AdminLogin;

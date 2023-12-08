import classNames from "classnames";
import styles from "~/AdminPages/AdminLogin/AdminLogin.scss";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignOut } from "react-auth-kit";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function AdminLogin() {

  return (
    <div className={cx("lgWrapper")}>
      <div className={cx("lgBody")}>
        <div className={cx("bMarginTop")}></div>
        <div className={cx("lgContent")}>
          <div className={cx("lgRightContainer")}>
            <h2>ADMIN</h2>
            <form className={cx("lgBox")}
            // onSubmit={handleSubmit}
            >
              <div className={cx("lgAccountBox")}>
                <input
                  required
                  className={cx("account-input")}
                  type="text"
                  placeholder="Tên Đăng Nhập"
                // onChange={(e) =>
                //   setFormData({
                //     ...formData,
                //     userName: e.target.value,
                //   })
                // }
                ></input>
              </div>
              <div className={cx("lgPasswordBox")}>
                <input
                  required
                  className={cx("password-input")}
                  type="password"
                  placeholder="Mật Khẩu"
                // onChange={(e) =>
                //   setFormData({
                //     ...formData,
                //     password: e.target.value,
                //   })
                // }
                ></input>
              </div>
              <div className={cx("lgLoginButtonBox")}>
                <p
                // onClick={() => (setShow2FAInput(true))}
                >
                  Đăng Nhập
                </p>
                {/* {show2FAInput && (
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
                )} */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

import styles from "./AdminDefaultLayout.scss";
import classNames from "classnames";
import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import axios from "axios";
const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;
function AdminDefaultLayout({ children }) {
  const singOut = useSignOut();
  const navigate = useNavigate();
  const [depositStatus, setDepositStatus] = useState(false);
  const [reloadStatus, setReloadStatus] = useState(false);
  const logout = () => {
    singOut();
    navigate("/adminlogin");
  };

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const owner = JSON.parse(localStorage.getItem("token_state")) || [];

  useEffect(() => {
    axios
      .get(`${beURL}/users/depositStatus`)
      .then((response) => {
        const data = response.data;
        if (data.success === 1) {
          setDepositStatus(data.data.depositStatus)
        }else{
          setDepositStatus(false)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reloadStatus])

  const handleChangeDepositStatus = (currentStat) => {
    const newStat = !currentStat;
    axios
      .put(`${beURL}/users/turnDeposit`, { status: newStat }, config)
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data.success === 1) {
          setReloadStatus(!reloadStatus)
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <div className={cx("adlWrapper")}>
      <div className={cx("adhWrapper")}>
        <div className={cx("adhContent")}>
          <h2
            className={cx("adhTextLogo")}
          // onClick={() => navigate(`/users/${owner.groupId}`)}
          >
            Quản Lý
          </h2>
          <div className="adhUserBox">
            <p>Admin</p>
            <div id="changeDepositStatusBox"
              onClick={() => handleChangeDepositStatus(depositStatus)}
            >Nạp Tiền: <strong>{depositStatus ? "Đang Bật" : "Đang Tắt"}</strong></div>
            <a className={cx("adhLogout")}
              onClick={() => logout()}
            >
              Đăng xuất
            </a>
          </div>
        </div>
        <div className="adhMenu">
          <ul>
            <li
              className={cx("")}
              onClick={() => {
                navigate(`/adminlogin/adminhome`);
              }}
            >
              Quản Lý Group
            </li>
            <li
              onClick={() => {
                navigate("/adminlogin/adminownermanager");
              }}
            >
              Quản Lý Owner
            </li>
            <li
              onClick={() => {
                navigate("/adminlogin/adminadsmanager");
              }}
            >
              Quản Lý Quảng Cáo
            </li>
            <li
              onClick={() => {
                navigate("/adminlogin/adminpaymentmanager");
              }}
            >
              Yêu Cầu Rút Tiền
            </li>
            <li
              onClick={() => {
                navigate("/adminlogin/adminwarningpayment");
              }}
            >
              Yêu Cầu Sai Thông Tin
            </li>
          </ul>
        </div>
      </div>
      <div className={cx("bWrapper")}>
        <div className={cx("")}>{children}</div>
      </div>
    </div>
  );
}
export default memo(AdminDefaultLayout);
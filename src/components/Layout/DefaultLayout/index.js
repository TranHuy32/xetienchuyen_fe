import styles from "./DefaultLayout.scss";
import classNames from "classnames";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function DefaultLayout({ children }) {
  const singOut = useSignOut();
  const navigate = useNavigate();
  const [totalNotice, setTotalNotice] = useState(0)

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  //get payment list
  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${beURL}/payment/allByOwner`, config)
        .then((response) => {
          const data = response.data;
          if (data.payments.length > 0) {
            const pendingPayments = data.payments.filter(payment => payment.status === "PENDING");
            if (pendingPayments.length !== 0) {
              setTotalNotice(pendingPayments.length);
            } else {
              setTotalNotice(0);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    // Fetch data initially
    fetchData();

    // Set up an interval to fetch data every 15 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 15000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const logout = () => {
    singOut();
    navigate("/");
  };
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];
  return (
    <div className={cx("dWrapper")}>
      <div className={cx("hWrapper")}>
        <div className={cx("hContent")}>
          <h2
            className={cx("hTextLogo")}
            onClick={() => navigate(`/users/${owner.groupId}`)}
          >
            Xe tiện chuyến
          </h2>
          <div className="hUserBox">
            <p>{owner.name}</p>
            <a className={cx("hLogout")} onClick={logout}>
              Đăng xuất
            </a>
          </div>
        </div>
        <div className="hMenu">
          <ul>
            <li
              className={cx("fActived")}
              onClick={() => {
                navigate(`/users/${owner.groupId}`);
              }}
            >
              Thành viên
            </li>
            <li
              onClick={() => {
                navigate("/createUser");
              }}
            >
              Tạo tài khoản
            </li>
            <li
              onClick={() => {
                navigate("/followProvince");
              }}
            >
              Đăng Kí Tỉnh Thành
            </li>
            {/* <li
              onClick={() => {
                navigate(`/transaction/${owner.groupId}`);
              }}
            >
              Giao dịch
            </li> */}
            <li
              id="requestMoney"
              onClick={() => {
                navigate(`/recharge`);
              }}
            >
              Yêu Cầu Nạp/Rút Tiền
              {totalNotice !== 0 && (
                <p>{totalNotice < 99 ? totalNotice : "99+"}</p>
              )}
              
            </li>
          </ul>
        </div>
      </div>

      {/* End header */}
      <div className={cx("bWrapper")}>
        <div className={cx("")}>{children}</div>
      </div>
    </div>
  );
}
export default memo(DefaultLayout);

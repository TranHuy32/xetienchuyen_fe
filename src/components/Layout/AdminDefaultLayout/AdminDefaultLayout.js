import styles from "./AdminDefaultLayout.scss";
import classNames from "classnames";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";

const cx = classNames.bind(styles);

function AdminDefaultLayout({ children }) {
  const singOut = useSignOut();
  const navigate = useNavigate();

  const logout = () => {
    singOut();
    navigate("/adminlogin");
  };
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];
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
            // onClick={() => {
            //   navigate("/createUser");
            // }}
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
            {/* <li
            // onClick={() => {
            //   navigate(`/recharge`);
            // }}
            >
              
            </li> */}
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
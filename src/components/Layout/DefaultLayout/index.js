import styles from "./DefaultLayout.scss";
import classNames from "classnames";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  const singOut = useSignOut();
  const navigate = useNavigate();

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
            <p>{owner.ownerName}</p>
            <a className={cx("hLogout")} onClick={logout}>
              Đăng xuất
            </a>
          </div>
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

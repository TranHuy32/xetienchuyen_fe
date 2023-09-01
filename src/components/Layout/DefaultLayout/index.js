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
    navigate("/login");
  };

  return (
    <div className={cx("dWrapper")}>
      <div>
        <div>
          <h2>DefaultLayout</h2>
          <div className="">
            <a href="/login" onClick={logout}>
              Đăng xuất
            </a>
          </div>
        </div>
        {/* End header */}
        <div className={cx("")}>
          <div className={cx("")}>{children}</div>
        </div>
      </div>
    </div>
  );
}
export default memo(DefaultLayout);

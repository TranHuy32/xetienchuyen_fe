import classNames from "classnames";
import styles from "./Recharge.scss";
import { Fragment, useEffect, useState } from "react";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  const [show2FAInput, setShow2FAInput] = useState(false);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCancel = () => {
    setShow2FAInput(false)
  }

  const handleSubmit2FACode = () => {
    setShow2FAInput(false)
  }

  return (
    <div className={cx("rcWrapper")}>
      {show2FAInput && (
        <Fragment>
          <div className={cx("overlay")} onClick={() => handleCancel()}></div>
          <div className={cx("FAContainer")}>
            <div className={cx("FATitle")}>Nhập Mã Xác Thực 2FA: </div>
            <div className={cx("inputContainer")}>
              <input type="text" maxlength="1" autofocus />
              <input type="text" maxlength="1" />
              <input type="text" maxlength="1" />
              <input type="text" maxlength="1" />
              <input type="text" maxlength="1" />
              <input type="text" maxlength="1" />
            </div>
            <button onClick={() => handleSubmit2FACode()}>Xác Nhận</button>
          </div>
        </Fragment>
      )}
      <h2 className={cx("rcTitle")}>Xác Thực Nạp Tiền</h2>
      <table>
        <tr>
          <th>Thời Gian</th>
          <th>Tên Tài Xế</th>
          <th>SĐT Đăng Nhập</th>
          <th>Số Tiền</th>
          <th>Thao Tác</th>
        </tr>
        {Array.from({ length: 8 }, (_, index) => (
          <tr>
            <td>decoy</td>
            <td>decoy</td>
            <td>decoy</td>
            <td>decoy</td>
            <td>
              <button onClick={() => setShow2FAInput(true)}>Xác Thực</button>
            </td>
          </tr>
        ))}
      </table>
      <div className={cx("rcPagination")}>
        {/* {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={cx({ active: index + 1 === currentPage })}
            >
              {index + 1}
            </button>
          ))} */}
        {currentPage > 3 && (
          <button
          >
            ...
          </button>
        )}

        {currentPage > 2 && (
          <button
            onClick={() => handlePageChange(currentPage - 2)}
          >
            {currentPage - 2}
          </button>
        )}
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {currentPage - 1}
          </button>
        )}

        <button
          onClick={() => handlePageChange(currentPage)}
          className={cx({ active: currentPage })}
        >
          {currentPage}
        </button>
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={cx()}
          >
            {currentPage + 1}
          </button>
        )}
        {(currentPage + 1) < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 2)}
            className={cx()}
          >
            {currentPage + 2}
          </button>
        )}
        {currentPage < (totalPages - 2) && (
          <button
          >
            ...
          </button>
        )}

      </div>
    </div>
  );
}

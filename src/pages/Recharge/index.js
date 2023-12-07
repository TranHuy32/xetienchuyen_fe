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

  function clickEvent(event, nextInputId, prevInputId) {
    const currentInput = event.target;

    if (currentInput.value >= 0 && currentInput.value <= 9) {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      return;
    }

    if (event.key === 'Backspace' && currentInput.value.length === 0) {
      const prevInput = document.getElementById(prevInputId);
      if (prevInput) {
        prevInput.focus();
      }
      return; // Stop further execution
    }

    if (!/^\d$/.test(currentInput.value)) {
      return; // Return early if the entered value is not a digit
    }
  }

  return (
    <div className={cx("rcWrapper")}>
      {show2FAInput && (
        <Fragment>
          <div className={cx("overlay")} onClick={() => handleCancel()}></div>
          <div className={cx("FAContainer")}>
            <div className={cx("FATitle")}>Nhập Mã Xác Thực 2FA: </div>
            <div className={cx("inputContainer")}>
              <input type="number" pattern="[0-9]" id="text1" onKeyUp={(e) => clickEvent(e, "text2", "text1")} autoFocus />
              <input type="number" pattern="[0-9]" id="text2" onKeyUp={(e) => clickEvent(e, "text3", "text1")} />
              <input type="number" pattern="[0-9]" id="text3" onKeyUp={(e) => clickEvent(e, "text4", "text2")} />
              <input type="number" pattern="[0-9]" id="text4" onKeyUp={(e) => clickEvent(e, "text5", "text3")} />
              <input type="number" pattern="[0-9]" id="text5" onKeyUp={(e) => clickEvent(e, "text6", "text4")} />
              <input type="number" pattern="[0-9]" id="text6" onKeyUp={(e) => clickEvent(e, "submit", "text5")} />

            </div>
            <button id="submit" onClick={() => handleSubmit2FACode()}>Xác Nhận</button>
          </div>
        </Fragment>
      )}
      <h2 className={cx("rcTitle")}>Xác Thực Nạp Tiền</h2>
      <table>
        <thead>
          <tr>
            <th>Thời Gian</th>
            <th>Tên Tài Xế</th>
            <th>SĐT Đăng Nhập</th>
            <th>Số Tiền</th>
            <th>Thao Tác</th>
          </tr>
        </thead>

        {Array.from({ length: 8 }, (_, index) => (
          <tbody key={index}>
            <tr>
              <td>decoy</td>
              <td>decoy</td>
              <td>decoy</td>
              <td>decoy</td>
              <td>
                <button onClick={() => setShow2FAInput(true)}>Xác Thực</button>
              </td>
            </tr>
          </tbody>

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

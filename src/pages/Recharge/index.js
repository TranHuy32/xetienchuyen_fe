import classNames from "classnames";
import styles from "./Recharge.scss";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { type } from "@testing-library/user-event/dist/type";
import OtpInput from 'react-otp-input';
const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function Users() {
  const [paymentList, setPaymentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [OTP2fa, setOTP2fa] = useState('');
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [show2FAInput, setShow2FAInput] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [refreshList, setRefreshList] = useState(false);

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  //get payment list
  useEffect(() => {
    axios
      .get(`${beURL}/payment/allByOwner?page=${currentPage}&pageSize=${pageSize}`, config)
      .then((response) => {
        const data = response.data;
        setPaymentList(data.payments);
        setTotalPages(Math.ceil(data.totalCount / pageSize))
      })
      .catch((error) => {
        console.log(error);
      });
  }, [totalPages, currentPage, refreshList]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleCancel = () => {
    setShow2FAInput(false)
    setSelectedPaymentId("")
  }

  const handleOpenOTPInput = (paymentId) => {
    setShow2FAInput(true)
    setSelectedPaymentId(paymentId)
  }
  //send otp to accept
  const handleSubmit2FACode = () => {
    // setShow2FAInput(false)
    const otp = OTP2fa;
    console.log({
      "action": "ACEPT",
      "twoFaCode": otp,
      "paymentId": selectedPaymentId,
    });
    axios
      .put(`${beURL}/payment/action`,
        {
          "action": "ACCEPT",
          "twoFaCode": otp,
          "paymentId": selectedPaymentId,
        }
        , config)
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data.message === "SUCCESS") {
          alert("Thành Công")
          setShow2FAInput(false)
          setSelectedPaymentId("")
          setRefreshList(!refreshList)
        } else if (data.message !== "SUCCESS") {
          alert(data.message + ". Mã Lỗi: " + data.code)
          setShow2FAInput(false)
          setSelectedPaymentId("")
          setRefreshList(!refreshList)
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.message === "Request failed with status code 401") {
          alert("Hãy Kiểm Tra Lại Mã Xác Thực")
        }
      });

  }

  //auto focus next input
  function clickEvent(event, nextInputId, prevInputId) {
    const currentInput = event.target;
    const backspaceCount = (Number(currentInput.dataset.backspaceCount) || 0) + 1;
    console.log(currentInput.value

    );
    if (event.key === 'Backspace') {
      if (backspaceCount === 1) {
        // Xoá giá trị hiện tại, nhưng không chuyển focus
        currentInput.dataset.backspaceCount = backspaceCount;
        return;
      }


      const prevInput = document.getElementById(prevInputId);
      if (backspaceCount === 2) {
        prevInput.focus();
      }

      // Reset backspace count after navigating to the previous input
      currentInput.dataset.backspaceCount = 0;
    } else if (event.key >= '0' && event.key <= '9') {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }

      // Reset backspace count after focusing on the next input
      currentInput.dataset.backspaceCount = 0;
    } else if (!/^\d$/.test(event.key)) {
      // Return early if the entered value is not a digit
      currentInput.dataset.backspaceCount = 0;
      return;
    }
  }


  //combine otp code
  const concatenateValues = () => {
    const input1Value = document.getElementById("text1").value;
    const input2Value = document.getElementById("text2").value;
    const input3Value = document.getElementById("text3").value;
    const input4Value = document.getElementById("text4").value;
    const input5Value = document.getElementById("text5").value;
    const input6Value = document.getElementById("text6").value;

    const isNumericInRange = (value) => {
      return /^\d$/.test(value) && Number(value) >= 0 && Number(value) <= 9;
    };

    if (
      !isNumericInRange(input1Value) ||
      !isNumericInRange(input2Value) ||
      !isNumericInRange(input3Value) ||
      !isNumericInRange(input4Value) ||
      !isNumericInRange(input5Value) ||
      !isNumericInRange(input6Value)
    ) {
      alert("Mã Xác Thực Không Hợp Lệ")
    } else {
      const concatenatedString = `${input1Value}${input2Value}${input3Value}${input4Value}${input5Value}${input6Value}`;
      return concatenatedString;
    }
  };

  return (
    <div className={cx("rcWrapper")}>
      {show2FAInput && (
        <Fragment>
          <div className={cx("overlay")} onClick={() => handleCancel()}></div>
          <div className={cx("FAContainer")}>
            <div className={cx("FATitle")}>Nhập Mã Xác Thực 2FA: </div>
            <div className={cx("inputContainer")}>
              <OtpInput
                value={OTP2fa}
                onChange={setOTP2fa}
                numInputs={6}
                renderSeparator={<span></span>}
                renderInput={(props) => <input {...props} />}
              />
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

        <tbody>
          {paymentList.map((bill, index) => {
            let inputTime = bill.createdAt;
            let date = new Date(inputTime);
            let formattedTime =
              `${("0" + date.getHours()).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}
            ${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}`;
            return (
              <tr key={index}>
                <td>{formattedTime}</td>
                <td>{bill.user._id}</td>
                <td>{bill.user.userName}</td>
                <td>{bill.amount} k</td>
                <td>
                  {bill.status === "PENDING" && (
                    <button onClick={() => handleOpenOTPInput(bill._id)}>Xác Thực</button>
                  )}
                  {bill.status === "COMPLETED" && (
                    <strong>Nạp Tiền Thành Công</strong>
                  )
                  }
                  {bill.status === "CANCEL" && (
                    <strong>Đã Huỷ</strong>
                  )
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {paymentList.length !== 0 && (
        <div className={cx("rcPagination")}>
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
      )}

    </div>
  );
}

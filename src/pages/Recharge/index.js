import classNames from "classnames";
import styles from "./Recharge.scss";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import OtpInput from 'react-otp-input';
import { format, parse } from 'date-fns';
const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function Users() {
  const [paymentList, setPaymentList] = useState([]);
  const [paymentWITHDRAWList, setPaymentWITHDRAWList] = useState([])
  const [depositNotice, setDepositNotice] = useState(0)
  const [withdrawNotice, setWithDrawNotice] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const [currentWITHDRAWPage, setCurrentWITHDRAWPage] = useState(1);
  const [OTP2fa, setOTP2fa] = useState('');
  const [pageSize, setPageSize] = useState(8);
  const [pageWITHDRAWSize, setPageWITHDRAWSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalWITHDRAWPages, setTotalWITHDRAWPages] = useState(0);
  const [show2FAInput, setShow2FAInput] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [refreshList, setRefreshList] = useState(false);
  const [refreshWITHDRAWList, setRefreshWITHDRAWList] = useState(false);
  const [typeOfList, setTypeOfList] = useState("DEPOSIT")

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  //get payment DEPOSIT list
  useEffect(() => {
    //get list to display
    axios
      .get(`${beURL}/payment/allByOwner?type=DEPOSIT&page=${currentPage}&pageSize=${pageSize}`, config)
      .then((response) => {
        const data = response.data;
        setPaymentList(data.payments);
        setTotalPages(Math.ceil(data.totalCount / pageSize))
      })
      .catch((error) => {
        console.log(error);
      });
    //get notice number
    axios
      .get(`${beURL}/payment/allByOwner?type=DEPOSIT`, config)
      .then((response) => {
        const data = response.data
        if (data.payments.length > 0) {
          const pendingPayments = data.payments.filter(payment => payment.status === "PENDING");
          if (pendingPayments.length !== 0) {
            setDepositNotice(pendingPayments.length)
          } else {
            setDepositNotice(0)
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [totalPages, currentPage, refreshList]);

  //get payment WITHDRAW list
  useEffect(() => {
    //get list to display
    axios
      .get(`${beURL}/payment/allByOwner?type=WITHDRAW&page=${currentWITHDRAWPage}&pageSize=${pageWITHDRAWSize}`, config)
      // `${beURL}/payment/allByOwner?type=${typeOfList}page=${currentPage}&pageSize=${pageSize}`
      .then((response) => {
        const data = response.data;
        setPaymentWITHDRAWList(data.payments);
        setTotalWITHDRAWPages(Math.ceil(data.totalCount / pageSize))
      })
      .catch((error) => {
        console.log(error);
      });

    //get notice number
    axios
      .get(`${beURL}/payment/allByOwner?type=WITHDRAW`, config)
      // `${beURL}/payment/allByOwner?type=${typeOfList}page=${currentPage}&pageSize=${pageSize}`
      .then((response) => {
        const data = response.data
        if (data.payments.length > 0) {
          const pendingPayments = data.payments.filter(payment => payment.status === "PENDING");
          if (pendingPayments.length !== 0) {
            setWithDrawNotice(pendingPayments.length)
          } else {
            setWithDrawNotice(0)
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [totalWITHDRAWPages, currentWITHDRAWPage, refreshWITHDRAWList]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleWITHDRAWPageChange = (newPage) => {
    setCurrentWITHDRAWPage(newPage)
  }

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
      <div className={cx("rcTitleBox")}>
        <h3 className={cx("rcTitleFirst", typeOfList === "DEPOSIT" ? "activeTitle" : "")}
          onClick={() => setTypeOfList("DEPOSIT")}
        >
          Xác Thực Nạp Tiền
          {depositNotice !== 0 && (
            <p>{depositNotice < 99 ? depositNotice : "99+"}</p>
          )}

        </h3>
        <h3 className={cx("rcTitleSecond", typeOfList === "WITHDRAW" ? "activeTitle" : "")}
          onClick={() => setTypeOfList("WITHDRAW")}>
          Xác Thực Rút Tiền
          {withdrawNotice !== 0 && (
            <p>{withdrawNotice < 99 ? withdrawNotice : "99+"}</p>
          )}
        </h3>
      </div>
      {typeOfList === "DEPOSIT" && (
        <Fragment>
          <table id="DEPOSITTABLE">
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
                const dateString = bill.createdAt;

                // Chuyển đổi chuỗi thành đối tượng Date
                const dateObject = parse(dateString, "dd/MM/yyyy, HH:mm:ss", new Date());

                // Định dạng lại và hiển thị ngày, tháng, giờ và phút
                const formattedTime = format(dateObject, "dd/MM HH:mm");
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
        </Fragment>
      )}
      {typeOfList === "WITHDRAW" && (
        <Fragment>
          <table id="WITHDRAWTABLE">
            <thead>
              <tr>
                <th>Thời Gian</th>
                <th>Tên Tài Xế</th>
                <th>Tên Ngân Hàng</th>
                <th>Số Tài Khoản</th>
                <th>Chủ Tài Khoản</th>
                <th>SĐT Đăng Nhập</th>
                <th>Số Tiền</th>
                <th>Thao Tác</th>
              </tr>
            </thead>

            <tbody>
              {paymentWITHDRAWList.map((draw, index) => {
                // Chuỗi ngày đã cho
                const dateString = draw.createdAt;

                // Chuyển đổi chuỗi thành đối tượng Date
                const dateObject = parse(dateString, "dd/MM/yyyy, HH:mm:ss", new Date());

                // Định dạng lại và hiển thị ngày, tháng, giờ và phút
                const formattedDate = format(dateObject, "dd/MM HH:mm");
                return (
                  <tr key={index}>
                    <td>{formattedDate}</td>
                    <td>{draw.user.userName}</td>
                    <td>{draw.bankName}</td>
                    <td>{draw.bankAccountNumber}</td>
                    <td>{draw.bankOwner}</td>
                    <td>{draw.user.userName}</td>
                    <td><strong>{draw.amount}</strong> K</td>
                    <td>
                      {draw.status === "PENDING" && (
                        <button>Duyệt</button>
                      )}
                      {draw.status === "COMPLETED" && (
                        <strong>Đã Duyệt</strong>
                      )
                      }
                      {draw.status === "CANCEL" && (
                        <strong>Đã Huỷ</strong>
                      )
                      }
                    </td>
                  </tr>
                )

              })}
            </tbody>
          </table>
          {paymentWITHDRAWList.length !== 0 && (
            <div className={cx("rcPagination")}>
              {currentWITHDRAWPage > 3 && (
                <button
                >
                  ...
                </button>
              )}

              {currentWITHDRAWPage > 2 && (
                <button
                  onClick={() => handleWITHDRAWPageChange(currentWITHDRAWPage - 2)}
                >
                  {currentWITHDRAWPage - 2}
                </button>
              )}
              {currentWITHDRAWPage > 1 && (
                <button
                  onClick={() => handleWITHDRAWPageChange(currentWITHDRAWPage - 1)}
                >
                  {currentWITHDRAWPage - 1}
                </button>
              )}

              <button
                onClick={() => handleWITHDRAWPageChange(currentWITHDRAWPage)}
                className={cx({ active: currentWITHDRAWPage })}
              >
                {currentWITHDRAWPage}
              </button>
              {currentWITHDRAWPage < totalWITHDRAWPages && (
                <button
                  onClick={() => handleWITHDRAWPageChange(currentWITHDRAWPage + 1)}
                  className={cx()}
                >
                  {currentWITHDRAWPage + 1}
                </button>
              )}
              {(currentWITHDRAWPage + 1) < totalWITHDRAWPages && (
                <button
                  onClick={() => handleWITHDRAWPageChange(currentWITHDRAWPage + 2)}
                  className={cx()}
                >
                  {currentWITHDRAWPage + 2}
                </button>
              )}
              {currentWITHDRAWPage < (totalWITHDRAWPages - 2) && (
                <button
                >
                  ...
                </button>
              )}

            </div>
          )}
        </Fragment>
      )}


    </div>
  );
}

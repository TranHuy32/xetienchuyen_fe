import classNames from "classnames";
import styles from "./AdminPaymentManager.scss";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { format, parse } from 'date-fns';
import OtpInput from 'react-otp-input';

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function PaymentManager() {
    const [typeOfList, setTypeOfList] = useState("WITHDRAW")

    //WithDraw
    const [WithDrawList, setWithDrawList] = useState([])
    const [currentWithDrawPage, setCurrentWithDrawPage] = useState(1);
    const [pageSizeWithDraw, setPageSizeWithDraw] = useState(8);
    const [totalWithDrawPages, setTotalWithDrawPages] = useState(0);
    const [refreshWithDrawList, setRefreshWithDrawList] = useState(false)

    const [OTP2fa, setOTP2fa] = useState('');
    const [selectedPaymentId, setSelectedPaymentId] = useState("");
    const [show2FAInput, setShow2FAInput] = useState(false);
    const [typeForOTP, setTypeForOTP] = useState("")

    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    //get WithDraw List
    useEffect(() => {
        //get list to display
        axios
            .get(`${beURL}/payment/allByAdmin?type=WITHDRAW&page=${currentWithDrawPage}&pageSize=${pageSizeWithDraw}`, config)
            .then((response) => {
                const data = response?.data;
                if (!!data) {
                    setWithDrawList(data.payments)
                    setTotalWithDrawPages(Math.ceil(data.totalCount / pageSizeWithDraw))
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentWithDrawPage, totalWithDrawPages, refreshWithDrawList]);

    const handleWithDrawPageChange = (newPage) => {
        setCurrentWithDrawPage(newPage)
    }

    const handleOpenOTPInput = (paymentId, type) => {
        setTypeForOTP(type)
        setShow2FAInput(true)
        setSelectedPaymentId(paymentId)
    }

    const handleCancel = () => {
        setShow2FAInput(false)
        setSelectedPaymentId("")
        setTypeForOTP("")
        setOTP2fa('')
    }

    const handleSubmit2FACode = (type) => {
        const otp = OTP2fa;
        if (type === "ACCEPT") {
            console.log({
                "action": "ACCEPT",
                "twoFaCode": otp,
                "paymentId": selectedPaymentId,
            });
            axios
                .put(`${beURL}/payment/actionByAdmin`,
                    {
                        "action": "ACCEPT",
                        "twoFaCode": otp,
                        "paymentId": selectedPaymentId,
                    }
                    , config)
                .then((response) => {
                    const data = response?.data;
                    if (!!data && data.message === "SUCCESS") {
                        alert("Thành Công")
                        handleCancel()
                        setRefreshWithDrawList(!refreshWithDrawList)
                    } else if (!!data && data.message !== "SUCCESS") {
                        alert(data.message + ". Mã Lỗi: " + data.code)
                        handleCancel()
                        setRefreshWithDrawList(!refreshWithDrawList)
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error.message === "Request failed with status code 401") {
                        alert("Hãy Kiểm Tra Lại Mã Xác Thực")
                    }
                });
        } else if (type === "CANCEL") {
            console.log({
                "action": "CANCEL",
                "twoFaCode": otp,
                "paymentId": selectedPaymentId,
            });
            axios
                .put(`${beURL}/payment/actionByAdmin`,
                    {
                        "action": "CANCEL",
                        "twoFaCode": otp,
                        "paymentId": selectedPaymentId,
                    }
                    , config)
                .then((response) => {
                    const data = response?.data;
                    if (!!data && data.message === "SUCCESS") {
                        alert("Thành Công")
                        handleCancel()
                        setRefreshWithDrawList(!refreshWithDrawList)
                    } else if (!!data && data.message !== "SUCCESS") {
                        alert(data.message + ". Mã Lỗi: " + data.code)
                        handleCancel()
                        setRefreshWithDrawList(!refreshWithDrawList)
                    }
                })
                .catch((error) => {
                    console.log(error);
                    if (error.message === "Request failed with status code 401") {
                        alert("Hãy Kiểm Tra Lại Mã Xác Thực")
                    }
                });
        }
    }

    return (
        <div className={cx("apmWrapper")}>
            {show2FAInput && (
                <Fragment>
                    <div className={cx("overlay")} onClick={() => handleCancel()}></div>
                    <div className={cx("adminFAContainer")}>
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
                        <button id="submit" onClick={() => handleSubmit2FACode(typeForOTP)}>Xác Nhận</button>
                    </div>
                </Fragment>
            )}
            {typeOfList === "WITHDRAW" && (
                <Fragment>
                    <table id="apmWithDrawTable">
                        <thead>
                            <tr>
                                <th>Thời Gian</th>
                                <th>Tên Đăng Nhập</th>
                                <th>Ngân Hàng</th>
                                <th>Số Tài Khoản</th>
                                <th>Số Tiền</th>
                                <th>Nội Dung CK</th>
                                <th>Chấp Nhận</th>
                                <th>Huỷ Đơn</th>
                            </tr>
                        </thead>

                        <tbody>

                            {WithDrawList.map((bill, index) => {
                                const dateString = bill.createdAt;

                                // Chuyển đổi chuỗi thành đối tượng Date
                                const dateObject = parse(dateString, "dd/MM/yyyy, HH:mm:ss", new Date());

                                // Định dạng lại và hiển thị ngày, tháng, giờ và phút
                                const formattedTime = format(dateObject, "dd/MM HH:mm");
                                return (
                                    <tr key={index}>
                                        <td className={cx("time")}>{formattedTime}</td>
                                        <td className={cx("userName")}>{bill.user.userName}</td>
                                        <td className={cx("bankName")}>{bill.bankName}</td>
                                        <td className={cx("bankAccount")}>{bill.bankAccountNumber}</td>
                                        <td className={cx("amount")}><strong>{bill.amount}</strong> k</td>
                                        <td className={cx("memo")}>{bill.ND} </td>
                                        <td className={cx("done")}>
                                            {bill.status === "WAIT_ADMIN" && (
                                                <button onClick={() => handleOpenOTPInput(bill._id, "ACCEPT")}>Hoàn Thành</button>
                                            )}
                                            <strong>
                                                {/* {bill.status === "CANCELED" && "Đã Huỷ"} */}
                                                {bill.status === "COMPLETED" && "Đã Hoàn Thành"}
                                                {bill.status === "PENDING" && "Chờ Owner"}
                                            </strong>
                                        </td>
                                        <td className={cx("cancel")}>
                                            {bill.status === "WAIT_ADMIN" && (
                                                <button onClick={() => handleOpenOTPInput(bill._id, "CANCEL")}>Từ Chối</button>
                                            )}
                                            <strong>
                                                {bill.status === "CANCELED" && "Đã Huỷ"}
                                                {/* {bill.status === "COMPLETED" && "Đã Hoàn Thành"} */}
                                                {/* {bill.status === "PENDING" && "Chờ Owner"} */}
                                            </strong>

                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>


                    </table>

                    {WithDrawList.length !== 0 && (
                        <div className={cx("apmPagination")}>
                            {currentWithDrawPage > 3 && (
                                <button
                                >
                                    ...
                                </button>
                            )}

                            {currentWithDrawPage > 2 && (
                                <button
                                    onClick={() => handleWithDrawPageChange(currentWithDrawPage - 2)}
                                >
                                    {currentWithDrawPage - 2}
                                </button>
                            )}
                            {currentWithDrawPage > 1 && (
                                <button
                                    onClick={() => handleWithDrawPageChange(currentWithDrawPage - 1)}
                                >
                                    {currentWithDrawPage - 1}
                                </button>
                            )}

                            <button
                                onClick={() => handleWithDrawPageChange(currentWithDrawPage)}
                                className={cx({ active: currentWithDrawPage })}
                            >
                                {currentWithDrawPage}
                            </button>
                            {currentWithDrawPage < totalWithDrawPages && (
                                <button
                                    onClick={() => handleWithDrawPageChange(currentWithDrawPage + 1)}
                                    className={cx()}
                                >
                                    {currentWithDrawPage + 1}
                                </button>
                            )}
                            {(currentWithDrawPage + 1) < totalWithDrawPages && (
                                <button
                                    onClick={() => handleWithDrawPageChange(currentWithDrawPage + 2)}
                                    className={cx()}
                                >
                                    {currentWithDrawPage + 2}
                                </button>
                            )}
                            {currentWithDrawPage < (totalWithDrawPages - 2) && (
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

export default PaymentManager;
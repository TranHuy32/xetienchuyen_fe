import classNames from "classnames";
import styles from "./AdminWarningPayment.scss";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { format, parse } from 'date-fns';
import OtpInput from 'react-otp-input';

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function Adminwarningpayment() {

    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    const [typeOfList, setTypeOfList] = useState("WARNING")

    //warning list
    const [warningList, setWarningList] = useState([])
    const [currentWarningPage, setCurrentWarningPage] = useState(1);
    const [pageSizeWarning, setPageSizeWarning] = useState(8);
    const [totalWarningPages, setTotalWarningPages] = useState(0);
    const [refreshWarningList, setRefreshWarningList] = useState(false)
    const [showInputNewUserName, setShowInputNewUserName] = useState(false)
    const [newName, setNewName] = useState('')

    //otp 2fa
    const [OTP2fa, setOTP2fa] = useState('');
    const [selectedPaymentId, setSelectedPaymentId] = useState("");
    const [show2FAInput, setShow2FAInput] = useState(false);

    //wrong list
    const [wrongList, setWrongList] = useState([])
    const [currentWrongPage, setCurrentWrongPage] = useState(1);
    const [pageSizeWrong, setPageSizeWrong] = useState(8);
    const [totalWrongPages, setTotalWrongPages] = useState(0);
    const [refreshWrongList, setRefreshWrongList] = useState(false)

    //get warning list
    useEffect(() => {
        axios
            .get(`${beURL}/payment/allByAdmin?type=WARNING&page=${currentWarningPage}&pageSize=${pageSizeWarning}`, config)
            .then((response) => {
                const data = response.data;
                setWarningList(data.payments)
                setTotalWarningPages(Math.ceil(data.totalCount / pageSizeWarning))
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentWarningPage, totalWarningPages, refreshWarningList]);


    //get wrong deposit info list
    useEffect(() => {
        axios
            .get(`${beURL}/payment/allByAdmin?type=WRONG_DEPOSIT_INFO&page=${currentWrongPage}&pageSize=${pageSizeWrong}`, config)
            .then((response) => {
                const data = response.data;
                console.log(data);
                setWrongList(data.payments)
                setTotalWrongPages(Math.ceil(data.totalCount / pageSizeWrong))
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentWrongPage, totalWrongPages, refreshWrongList]);

    const handleWarningPageChange = (newPage) => {
        setCurrentWarningPage(newPage)
    }

    const handleWrongPageChange = (newPage) => {
        setCurrentWrongPage(newPage)
    }

    const handleShowNewUserNameInput = (id) => {
        setShowInputNewUserName(true)
        setSelectedPaymentId(id)
    }

    const handleCancel = () => {
        setShowInputNewUserName(false)
        setShow2FAInput(false)
        setSelectedPaymentId("")
        setOTP2fa('')
    }

    const handleSubmit2FACode = () => {
        const otp = OTP2fa;
        console.log({
            "userName": newName,
            "twoFaCode": otp
        });
        axios
            .put(`${beURL}/payment/update/${selectedPaymentId}`,
                {
                    "userName": newName,
                    "twoFaCode": otp
                }
                , config)
            .then((response) => {
                const data = response.data;
                if (data.message === "SUCCESS") {
                    alert("Thành Công")
                    handleCancel()
                    setRefreshWarningList(!refreshWarningList)
                } else if (data.message !== "SUCCESS") {
                    alert(data.message + ". Mã Lỗi: " + data.code)
                    handleCancel()
                    setRefreshWarningList(!refreshWarningList)
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
        <div className={cx("awpWrapper")}>
            {showInputNewUserName && (
                <Fragment>
                    <div className={cx("overlay")} onClick={() => handleCancel()}></div>
                    <div className={cx("adminUserNameContainer")}>
                        <div className={cx("title")}>Nhập Tên Đăng Nhập Của User: </div>
                        <div className={cx("inputContainer")}>
                            <input
                                required
                                // type="number"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                maxLength={10}
                            />
                        </div>
                        <button id="submit" onClick={() => setShow2FAInput(true)}>Xác Nhận</button>
                    </div>
                </Fragment>
            )}
            {show2FAInput && (
                <Fragment>
                    {/* <div className={cx("overlay")} onClick={() => handleCancel()}></div> */}
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
                        <button id="submit" onClick={() => handleSubmit2FACode()}>Xác Nhận</button>
                    </div>
                </Fragment>
            )}
            <div className={cx("switch-table-box")}>
                <div className={cx(typeOfList === "WARNING" ? "active-list" : "")} onClick={() => setTypeOfList("WARNING")}>Warning</div>
                <div className={cx(typeOfList === "WRONG_DEPOSIT_INFO" ? "active-list" : "")} onClick={() => setTypeOfList("WRONG_DEPOSIT_INFO")}>Wrong-Deposit-Info</div>
            </div>
            {typeOfList === "WARNING" && (
                <Fragment>
                    <table id="awmWarningTable">
                        <thead>
                            <tr>
                                <th>Thời Gian</th>
                                <th>Ngân Hàng</th>
                                <th>Số Tài Khoản</th>
                                <th>Số Tiền</th>
                                <th>Nội Dung CK</th>
                                <th>Số Dư</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>

                        <tbody>

                            {warningList.map((bill, index) => {
                                const dateString = bill.createdAt;

                                // Chuyển đổi chuỗi thành đối tượng Date
                                const dateObject = parse(dateString, "dd/MM/yyyy, HH:mm:ss", new Date());

                                // Định dạng lại và hiển thị ngày, tháng, giờ và phút
                                const formattedTime = format(dateObject, "dd/MM HH:mm");
                                return (
                                    <tr key={index}>
                                        <td className={cx("time")}>{formattedTime}</td>
                                        <td className={cx("bankName")}>{bill.bankName}</td>
                                        <td className={cx("bankAccount")}>{bill.bankAccountNumber}</td>
                                        <td className={cx("amount")}>
                                            <strong>{bill.depositIsAdd ? "" : "-"}  {bill.amount}</strong> k
                                        </td>
                                        <td className={cx("memo")}><strong>{bill.ND}</strong> </td>
                                        <td className={cx("value")}>{bill.SD} </td>
                                        <td className={cx("renew")}>
                                            <button onClick={() => handleShowNewUserNameInput(bill._id)}>Sửa Nội Dung</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>


                    </table>

                    {warningList.length !== 0 && (
                        <div className={cx("apmPagination")}>
                            {currentWarningPage > 3 && (
                                <button
                                >
                                    ...
                                </button>
                            )}

                            {currentWarningPage > 2 && (
                                <button
                                    onClick={() => handleWarningPageChange(currentWarningPage - 2)}
                                >
                                    {currentWarningPage - 2}
                                </button>
                            )}
                            {currentWarningPage > 1 && (
                                <button
                                    onClick={() => handleWarningPageChange(currentWarningPage - 1)}
                                >
                                    {currentWarningPage - 1}
                                </button>
                            )}

                            <button
                                onClick={() => handleWarningPageChange(currentWarningPage)}
                                className={cx({ active: currentWarningPage })}
                            >
                                {currentWarningPage}
                            </button>
                            {currentWarningPage < totalWarningPages && (
                                <button
                                    onClick={() => handleWarningPageChange(currentWarningPage + 1)}
                                    className={cx()}
                                >
                                    {currentWarningPage + 1}
                                </button>
                            )}
                            {(currentWarningPage + 1) < totalWarningPages && (
                                <button
                                    onClick={() => handleWarningPageChange(currentWarningPage + 2)}
                                    className={cx()}
                                >
                                    {currentWarningPage + 2}
                                </button>
                            )}
                            {currentWarningPage < (totalWarningPages - 2) && (
                                <button
                                >
                                    ...
                                </button>
                            )}

                        </div>
                    )}
                </Fragment>
            )}
            {typeOfList === "WRONG_DEPOSIT_INFO" && (
                <Fragment>
                    <table id="awmWrongTable">
                        <thead>
                            <tr>
                                <th>Thời Gian</th>
                                <th>Ngân Hàng</th>
                                <th>Số Tài Khoản</th>
                                <th>Số Tiền</th>
                                <th>Nội Dung CK</th>
                                <th>Số Dư</th>
                                <th>Deposit Bank Type</th>
                            </tr>
                        </thead>

                        <tbody>

                            {wrongList.map((bill, index) => {
                                const dateString = bill.createdAt;

                                // Chuyển đổi chuỗi thành đối tượng Date
                                const dateObject = parse(dateString, "dd/MM/yyyy, HH:mm:ss", new Date());

                                // Định dạng lại và hiển thị ngày, tháng, giờ và phút
                                const formattedTime = format(dateObject, "dd/MM HH:mm");
                                return (
                                    <tr key={index}>
                                        <td className={cx("time")}>{formattedTime}</td>
                                        <td className={cx("bankName")}>{bill.bankName}</td>
                                        <td className={cx("bankAccount")}>{bill.bankAccountNumber}</td>
                                        <td className={cx("amount")}>
                                            <strong>{bill.depositIsAdd ? "" : "-"}  {bill.amount}</strong> k
                                        </td>
                                        <td className={cx("memo")}><strong>{bill.ND}</strong> </td>
                                        <td className={cx("value")}>{bill.SD} </td>
                                        <td className={cx("bankType")}>{bill.depositBankType} </td>
                                    </tr>
                                );
                            })}
                        </tbody>


                    </table>

                    {wrongList.length !== 0 && (
                        <div className={cx("apmPagination")}>
                            {currentWrongPage > 3 && (
                                <button
                                >
                                    ...
                                </button>
                            )}

                            {currentWrongPage > 2 && (
                                <button
                                    onClick={() => handleWrongPageChange(currentWrongPage - 2)}
                                >
                                    {currentWrongPage - 2}
                                </button>
                            )}
                            {currentWrongPage > 1 && (
                                <button
                                    onClick={() => handleWrongPageChange(currentWrongPage - 1)}
                                >
                                    {currentWrongPage - 1}
                                </button>
                            )}

                            <button
                                onClick={() => handleWrongPageChange(currentWrongPage)}
                                className={cx({ active: currentWrongPage })}
                            >
                                {currentWrongPage}
                            </button>
                            {currentWrongPage < totalWrongPages && (
                                <button
                                    onClick={() => handleWrongPageChange(currentWrongPage + 1)}
                                    className={cx()}
                                >
                                    {currentWrongPage + 1}
                                </button>
                            )}
                            {(currentWrongPage + 1) < totalWrongPages && (
                                <button
                                    onClick={() => handleWrongPageChange(currentWrongPage + 2)}
                                    className={cx()}
                                >
                                    {currentWrongPage + 2}
                                </button>
                            )}
                            {currentWrongPage < (totalWrongPages - 2) && (
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

export default Adminwarningpayment;
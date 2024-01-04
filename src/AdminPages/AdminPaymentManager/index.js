import classNames from "classnames";
import styles from "./AdminPaymentManager.scss";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { format, parse } from 'date-fns';
const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function PaymentManager() {
    const [typeOfList, setTypeOfList] = useState("WITHDRAW")

    //WithDraw
    const [WithDrawList, setWithDrawList] = useState([])
    const [currentWithDrawPage, setCurrentWithDrawPage] = useState(1);
    const [pageSizeWithDraw, setPageSizeWithDraw] = useState(8);
    const [totalWithDrawPages, setTotalWithDrawPages] = useState(0);
    const [refreshWithDrawList, setRefreshWithDrawList]= useState(false)

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
                const data = response.data;
                // console.log(data.payments);
                setWithDrawList(data.payments)
                setTotalWithDrawPages(Math.ceil(data.totalCount / pageSizeWithDraw))
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentWithDrawPage, totalWithDrawPages, refreshWithDrawList]);

    const handleWithDrawPageChange = (newPage) => {
        setCurrentWithDrawPage(newPage)
    }

    return (
        <div className={cx("apmWrapper")}>
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
                                            <button >Hoàn Thành</button>
                                        </td>
                                        <td className={cx("cancel")}>
                                            <button >Từ Chối</button>
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
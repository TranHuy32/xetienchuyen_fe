import classNames from "classnames";
import styles from "./AdminPaymentManager.scss";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { format, parse } from 'date-fns';
const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function PaymentManager() {
    const [typeOfList, setTypeOfList] = useState("DEPOSIT")

    //deposit
    const [depositList, setDepositList] = useState([])
    const [currentDepositPage, setCurrentDepositPage]= useState(1);
    const [pageSizeDeposit, setPageSizeDeposit] = useState(8);
    const [totalDepositPage, setTotalDepositPages] = useState(0);

    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    //get deposit List
    useEffect(() => {
        //get list to display
        axios
          .get(`${beURL}/payment/allByAdmin?type=DEPOSIT&page=${currentDepositPage}&pageSize=${pageSizeDeposit}`, config)
          .then((response) => {
            const data = response.data;
            setDepositList(data.payments)
            setTotalDepositPages(Math.ceil(data.totalCount / pageSizeDeposit))
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

    return (
        <div className={cx("apmWrapper")}>
            <div className={cx("apmTypeSelectBox")}>
                <div className={cx(typeOfList === "DEPOSIT" ? "acitve" : "")}>Rút Tiền</div>
                <div className={cx(typeOfList === "WITHDRAW" ? "acitve" : "")}>Nạp Tiền</div>
            </div>
            {typeOfList === "DEPOSIT" && (
                <Fragment>
                    <table id="apmDepositTable">
                        <thead>
                            <tr>
                                {/* <th>Thời Gian</th>
                                <th>Tên Tài Xế</th>
                                <th>SĐT Đăng Nhập</th>
                                <th>Số Tiền</th>
                                <th>Thao Tác</th> */}
                            </tr>
                        </thead>

                        <tbody>
                            {/* {depositList.map((bill, index) => {
                                const dateString = bill.createdAt;

                                // Chuyển đổi chuỗi thành đối tượng Date
                                const dateObject = parse(dateString, "dd/MM/yyyy, HH:mm:ss", new Date());

                                // Định dạng lại và hiển thị ngày, tháng, giờ và phút
                                const formattedTime = format(dateObject, "dd/MM HH:mm");
                                return (
                                    <tr key={index}>
                                        <td>{formattedTime}</td>
                                        <td>{bill.user.name}</td>
                                        <td>{bill.user.userName}</td>
                                        <td>{bill.amount} k</td>
                                        <td>
                                            <button >Xác Thực</button>
                                        </td>
                                    </tr>
                                );
                            })} */}
                        </tbody>
                    </table>
                </Fragment>
            )}
        </div>
    );
}

export default PaymentManager;
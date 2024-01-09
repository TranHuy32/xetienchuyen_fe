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
                console.log(data);/*  */
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
                console.log(data);/*  */
                setWrongList(data.payments)
                setTotalWrongPages(Math.ceil(data.totalCount / pageSizeWrong))
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentWrongPage, totalWrongPages, refreshWrongList]);

    return (
        <div className={cx("awpWrapper")}>
            <div className={cx("switch-table-box")}>
                <div className={cx(typeOfList === "WARNING" ? "active-list" : "")} onClick={() => setTypeOfList("WARNING")}>Warning</div>
                <div className={cx(typeOfList === "WRONG_DEPOSIT_INFO" ? "active-list" : "")} onClick={() => setTypeOfList("WRONG_DEPOSIT_INFO")}>Wrong-Deposit-Info</div>
            </div>
            {typeOfList === "WARNING" && (
                <div>table of waning</div>
            )}
            {typeOfList === "WRONG_DEPOSIT_INFO" && (
                <div>table of WRONG_DEPOSIT_INFO</div>
            )}
        </div>
    );
}

export default Adminwarningpayment;
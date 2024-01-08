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

    //warning list
    const [warningList, setWarningList] = useState([])
    const [currentWarningPage, setCurrentWarningPage] = useState(1);
    const [pageSizeWarning, setPageSizeWarning] = useState(8);
    const [totalWarningPages, setTotalWarningPages] = useState(0);
    const [refreshWarningList, setRefreshWarningList] = useState(false)

    useEffect(() => {
        //get list to display
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

    return (
        <div>Chưa Có Gì</div>
    );
}

export default Adminwarningpayment;
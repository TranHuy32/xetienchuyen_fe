import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import styles from "./ruttien.scss";
import classNames from "classnames";
import { VietQR } from "vietqr";
const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;
const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
function RutTien() {
    const [allowedToDisplay, setAllowToDisplay] = useState(false)
    const [showConfirmInfo, setShowConfirmInfo] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState("")
    const [wdToken, setWdToken] = useState(null)
    const [userName, setUserName] = useState(null)
    const [bankList, setBankList] = useState([]);
    const [bankName, setBankName] = useState(null);
    const [bankOwner, setBankOwner] = useState(null);
    const [bankNumber, setBankNumber] = useState(null);
    const [amount, setAmount] = useState(null)
    const vietQR = new VietQR({
        clientID: '4244e11f-e282-4e3c-af39-6d9749c99e44',
        apiKey: '2f317b30-113a-45c5-aaf7-192d8926a15f',
    });

    //get allow to display
    useEffect(() => {
        axios
            .get(`${beURL}/users/depositStatus`)
            .then((response) => {
                const data = response.data;
                if (data.success === 1) {
                    setAllowToDisplay(true)
                    // setAllowToDisplay(false)
                } else {
                    setAllowToDisplay(false)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    //get info from url and get bank list
    useEffect(() => {
        //get bank list
        vietQR
            .getBanks()
            .then((banks) => {
                const shortNamesArray = banks.data.map((bank) => bank.shortName);

                setBankList(banks.data)
            })
            .catch((err) => {
                console.error('Error fetching banks:', err);
            })


        // Lấy URL hiện tại
        const currentUrl = window.location.href;

        // Phân tích đường link
        const url = new URL(currentUrl);

        // Lấy giá trị của tham số wdToken
        const Token = url.searchParams.get('wdToken');

        // Lấy giá trị của tham số userName
        const Name = url.searchParams.get('userName');

        // Sử dụng giá trị của các tham số tại đây
        setWdToken(Token)
        setUserName(Name)
        //Thông báo thiếu thông tin
        if (Token.length < 10 || Name.length < 10) {
            alert("Thông Tin Bị Thiếu! Hãy Mở Lại Trang Web Này Từ Ứng Dụng Của Bạn.")
            return
        }
    }, []);

    const handleSendWdRequest = (name, money, token) => {
        const amountNumber = parseInt(money, 10);
        if (amountNumber.toString().length > 2 && (amountNumber * 10) % 10 !== 0) {
            setShowConfirmInfo(false);
            setShowAlert(true);
            setAlertMsg("Số tiền phải chia hết cho 10");
            return;
        } else if (amountNumber.toString().length <= 2 && amountNumber % 10 !== 0) {
            setShowConfirmInfo(false);
            setShowAlert(true);
            setAlertMsg("Số tiền phải chia hết cho 10");
            return;
        }

        setShowConfirmInfo(false)
        axios
            .post(`${beURL}/payment/createWithdraw`, {
                "amount": amountNumber,
                "customerBankName": bankName,
                "customerBankAccountNumber": bankNumber,
                "customerBankOwner": bankOwner,
                "wdToken": token,
                "userName": name
            })
            .then((response) => {
                const data = response.data
                console.log(data);
                if (data.code === 101) {
                    setShowAlert(true)
                    setAlertMsg(
                        `Không Tìm Thây Tài Khoản ${userName}. Vui Lòng Tắt Và Mở Lại Trình Duyệt Trong Ứng Dụng Của Bạn.`
                    )
                    return
                } else if (data.code === 109) {
                    setShowAlert(true)
                    setAlertMsg(
                        `Thiếu Thông Tin Cần Thiết. Vui Lòng Tắt Và Mở Lại Trình Duyệt Trong Ứng Dụng Của Bạn.`
                    )
                    return
                } else if (data.code === 110) {
                    setShowAlert(true)
                    setAlertMsg(
                        `Mã Bảo Mật Sai. Vui Lòng Tắt Và Mở Lại Trình Duyệt Trong Ứng Dụng Của Bạn.`
                    )
                    return
                } else if (data.code === 111) {
                    setShowAlert(true)
                    setAlertMsg(
                        `Tài Khoản Hiện Tại Không Đủ Tiền. Vui Lòng Kiểm Tra Lại.`
                    )
                    return
                } else if (response.data.success === 1) {
                    setShowAlert(true)
                    setAlertMsg(
                        `Đã Gửi Yêu Cầu Thành Công. Xin Chờ Hệ Thống Xử Lý.`
                    );
                    // handleClearInfo()
                    return
                } else {
                    setShowAlert(true)
                    setAlertMsg("Yêu Cầu Rút Tiền Thất Bại.")
                    return
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // const handleClearInfo = () => {

    // }

    const handleCancelOverlay = () => {
        setShowConfirmInfo(false)
        setShowAlert(false)
        setAlertMsg("")
    }

    const handleInputOwnerNameChange = (e) => {
        const inputValue = e.target.value;
        const sanitizedValue = removeDiacritics(inputValue).toUpperCase();
        setBankOwner(sanitizedValue);
    };

    return (
        <div className={cx("wdWrapper", "mobile-only")}>
            {showAlert && (
                <Fragment>
                    <div className={cx("overlay")} onClick={() => handleCancelOverlay()}></div>
                    <div className={cx("alertMessage", "popup-box")}>{alertMsg}</div>
                </Fragment>
            )}
            {showConfirmInfo && (
                <Fragment>
                    <div className={cx("overlay")} onClick={() => handleCancelOverlay()}></div>
                    <div className={cx("popup-box", "showInfoRequestBox")}>
                        <div className={cx("rqAmount")}>Số Tiền Muốn Rút: {amount}.000đ</div>
                        <div className={cx("rqBankName")}>Ngân Hàng: {bankName}</div>
                        <div className={cx("rqBankNumber")}>STK Nhận: {bankNumber}</div>
                        <p>*Xin Hãy Kiểm Tra Lại Thông Tin.</p>
                        <button
                            onClick={() => handleSendWdRequest(userName, amount, wdToken)}
                        >Xác Nhận</button>
                    </div>
                </Fragment>
            )}
            <h2>Thông Tin Tài Khoản Nhận</h2>
            <div className={cx("loginName")}>Tên Đăng Nhập: <strong>{userName}</strong> </div>
            <div className={cx("selectBankShortNameBox")}>
                <select
                    value={(bankName !== null) ? bankName : ""}
                    onChange={(e) => {
                        const selectedValue = e.target.value;
                        setBankName(selectedValue)
                    }}
                >
                    <option value="" disabled>
                        Chọn Ngân Hàng
                    </option>
                    {bankList.map((bank) => (
                        <option key={bank.id} value={bank.shortName}>
                            {bank.shortName}
                        </option>
                    ))}
                </select>
            </div>
            <div className={cx("inputBankNumberBox")}>
                <input
                    className={bankNumber === null ? "active" : ""}
                    value={bankNumber}
                    placeholder="Nhập Số Tài Khoản"
                    onChange={(e) => setBankNumber(e.target.value)}
                    type="number"
                />
            </div>
            <div className={cx("inputBankOwnerBox")}>
                <input
                    className={bankOwner === null ? "active" : ""}
                    value={bankOwner}
                    placeholder="Tên Chủ Tài Khoản"
                    onChange={handleInputOwnerNameChange}
                    type="text"
                />
            </div>
            <div className={cx("inputAmountBox")}>
                <input
                    className={amount === null ? "active" : ""}
                    value={amount}
                    placeholder="Nhập Số Tiền Muốn Rút"
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                />
                <p> *đơn vị là nghìn đồng(K)</p>
                <p> *số tiền phải chia hết cho 10</p>
                <p>VD: Rút 100.000đ Thì Nhập 100</p>
            </div>
            <button
                className={(amount === null || bankName === null || bankOwner === null || bankNumber === null) ? 'disableButton' : ''}
                // onClick={() => handleSendWdRequest(userName, amount, wdToken)}
                onClick={() => setShowConfirmInfo(true)}
            >
                {(amount === null || bankName === null || bankOwner === null || bankNumber === null) && ("Hãy Điền Đủ Thông Tin")}
                {!(amount === null || bankName === null || bankOwner === null || bankNumber === null) && ("Gửi Yêu Cầu")}
            </button>
        </div>
    );
}

export default RutTien;
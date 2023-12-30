import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import styles from "./ruttien.scss";
import classNames from "classnames";
import { VietQR } from "vietqr";
const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;
function RutTien() {
    const [allowedToDisplay, setAllowToDisplay] = useState(true)
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
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className={cx("wdWrapper", "mobile-only")}>
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
                    value={bankNumber}
                    placeholder="Nhập Số Tài Khoản"
                    onChange={(e) => setBankNumber(e.target.value)}
                    type="number"
                />
            </div>
            <div className={cx("inputBankOwnerBox")}>
                <input
                    value={bankOwner}
                    placeholder="Tên Chủ Tài Khoản"
                    onChange={(e) => setBankOwner(e.target.value)}
                    type="text"
                />
            </div>
            <div className={cx("inputAmountBox")}>
                <input
                    value={amount}
                    placeholder="Nhập Số Tiền Muốn Rút"
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                />
                <p>*đơn vị là nghìn đồng(K)</p>
                <p>VD: muốn rút 100.000đ thì nhập 100</p>
            </div>
            <button
                className={(amount === null || bankName === null || bankOwner === null || bankNumber === null) ? 'disableButton' : ''}
                onClick={() => handleSendWdRequest(userName, amount, wdToken)}>
                Gửi Yêu Cầu
            </button>
        </div>
    );
}

export default RutTien;
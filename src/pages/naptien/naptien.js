import styles from "./naptien.scss";
import classNames from "classnames";
import arrowLeft from "~/assets/image/left-arrow.png";
import arrowDown from "~/assets/image/arrow-down.png";
import { VietQR } from "vietqr";
import { useEffect, useState } from "react";
const cx = classNames.bind(styles);

function NapTien() {
    const [userName, setUserName] = useState("");
    const [bankBin, setBankBin] = useState("");
    const [amount, setAmount] = useState(0);
    const [bankList, setBankList] = useState();
    const [adminName, setAdminName] = useState("Tòng Châu Bình");
    const [showBankInforName, setShowBankInforName] = useState("VietinBank");
    const [adminBankNumber, setAdminBankNumber] = useState("20869042001");
    const [submitted, setSubmitted] = useState(false);
    const [qrGenerated, setQrGenerated] = useState(false);
    const [showBankDropDownMenu, setShowBankDropDownMenu] = useState(false);
    const [qrURL, setQrURL] = useState(null);
    const vietQR = new VietQR({
        clientID: '4244e11f-e282-4e3c-af39-6d9749c99e44',
        apiKey: '2f317b30-113a-45c5-aaf7-192d8926a15f',
    });
    //admin bank info
    const adminBankName = ["VietinBank", "TPBank", "BIDV"];
    const adminBankAccountName = ["Tòng Châu Bình", "Châu Bình", "Bình"];
    const adminBankAccount = ["1234567890", "20869042001", "0987654321"]
    //get bank bin
    useEffect(() => {
        if (showBankInforName && adminBankNumber) {
            vietQR
                .getBanks()
                .then((banks) => {
                    setBankList(banks)
                    let filtedBank = banks.data.filter(bank => bank.shortName === showBankInforName);
                    if (filtedBank.length > 0) {
                        setBankBin(filtedBank[0].bin)
                    } else {
                        alert('Bank not found:', showBankInforName);
                    }
                })
                .catch((err) => {
                    console.error('Error fetching banks:', err);
                })
        }
    }, [showBankInforName]);

    //get qr image
    useEffect(() => {
        setQrGenerated(false)
        if (bankBin !== null && submitted) {
            vietQR
                .genQRCodeBase64({
                    "accountNumber": adminBankNumber,
                    "accountName": adminName,
                    "bank": bankBin,
                    "amount": amount,
                    "addInfo": userName,
                    "format": "text",
                    "template": "compact"
                })
                .then((data) => {
                    if (data.data.data) {
                        setQrURL(data.data.data.qrDataURL);
                        setQrGenerated(true);
                    }
                })
                .catch((err) => {
                    console.error('Error generating QR code:', err);
                });
        };
    }, [bankBin, submitted]);

    //lưu mã qr
    const handleSaveQR = () => {
        // Tạo một đối tượng <a> để tạo liên kết tải ảnh
        const a = document.createElement('a');
        a.href = qrURL;
        a.download = `PayByQrScanTo${showBankInforName}.png`; // Đặt tên cho tập tin được tải về

        a.click();
    };
    const changeUserNameHandler = (e) => {
        setUserName(e.target.value)
    };
    const changeAmountHandler = (e) => {
        setAmount(e.target.value)
    };
    const handleSubbmit = () => {
        setSubmitted(true)
    };

    const handleShowBankDropDownMenu = () => {
        setShowBankDropDownMenu(!showBankDropDownMenu)
    }
    const handleSetNewSelectedAccount = (bankName, name, account) => {
        setShowBankDropDownMenu(false);
        setAdminBankNumber(account);
        setAdminName(name);
        setShowBankInforName(bankName);
    }

    console.log(adminBankNumber, adminName, bankBin, amount, userName);

    return (
        <div className="ntWrapper">
            <div className={cx("infoContainer")}>
                <div className={cx("ntTitle")}>Thông Tin Thiết Lập Mã QR</div>
                <div className={cx("ntBox")}>
                    <div className={cx("select1")}>
                        <div className={cx("dropDownSelect")}
                            onClick={handleShowBankDropDownMenu}
                        >Chọn Ngân Hàng Nhận
                            {!showBankDropDownMenu && <img src={arrowLeft}></img>}
                            {showBankDropDownMenu && <img src={arrowDown}></img>}
                        </div>
                        <div className={cx("dropDownMenu")}>
                            {showBankDropDownMenu && (
                                adminBankName.map((name, index) => (
                                    <div className={cx("dropDownElement")}
                                        key={index}
                                        onClick={() => handleSetNewSelectedAccount(name, adminBankAccountName[index], adminBankAccount[index])}
                                    >{name}</div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className={cx("showAdminInfo1")}>Ngân Hàng: {showBankInforName}</div>
                    <div className={cx("showAdminInfo2")}>Số Tài Khoản Nhận: {adminBankNumber}</div>
                    <div className={cx("showAdminInfo3")}>Chủ Tài Khoản: {adminName}</div>
                    <div className={cx("inputBox1")}>
                        <label for="userName">Tên Tài Khoản: </label>
                        <input
                            maxLength="10"
                            id="userName"
                            required
                            placeholder="Tài Khoản Đăng Nhập"
                            type="tel"
                            pattern="[0-9]*"
                            // value={userName}
                            onChange={changeUserNameHandler}
                        ></input>
                    </div>
                    <div className={cx("inputBox2")}>
                        <label for="amount">Số Tiền: </label>
                        <input
                            id="amount"
                            required
                            placeholder="Số Tiền (vnđ)"
                            type="number"
                            // value={amount}
                            onChange={changeAmountHandler}
                        >
                        </input>
                    </div>
                        <button className={cx(userName.length > 9 && amount && "ready")} onClick={handleSubbmit}>Tạo Mã</button>
                </div>

            </div>
            <div className={cx("qrContainer")}>
                <div>Mã QR Của Bạn</div>
                {submitted && (
                    <img src={qrURL} alt="qr-code"></img>
                )}
            </div>
        </div>
    );
}
export default NapTien;
import styles from "./naptien.scss";
import classNames from "classnames";
import arrowLeft from "~/assets/image/left-arrow.png";
import arrowDown from "~/assets/image/arrow-down.png";
import { VietQR } from "vietqr";
import { Fragment, useEffect, useState } from "react";
const cx = classNames.bind(styles);

function NapTien() {
    const [userName, setUserName] = useState("");
    const [textForSelectBank, setTextForSelectBank] = useState("Chọn Ngân Hàng Nhận");
    const [bankBin, setBankBin] = useState("");
    const [amount, setAmount] = useState(0);
    const [moneyInputAmount, setMoneyInputAmount] = useState('');
    const [bankList, setBankList] = useState();
    const [adminName, setAdminName] = useState("Tòng Châu Bình");
    const [showBankInforName, setShowBankInforName] = useState("VietinBank");
    const [adminBankNumber, setAdminBankNumber] = useState("20869042001");
    const [allowedToDisplay, setAllowToDisplay] = useState(true)
    const [submitted, setSubmitted] = useState(false);
    const [qrGenerated, setQrGenerated] = useState(false);
    const [showBankDropDownMenu, setShowBankDropDownMenu] = useState(false);
    const [showInfor, setShowInfor] = useState(false);
    const [showAnotherOption, setShowAnotherOption] = useState(false)
    const [trackValidAmount, setTrackValidAmount] = useState(false)
    const [reloadQR, setReloadQR] = useState(false)
    const [qrURL, setQrURL] = useState(null);
    const vietQR = new VietQR({
        clientID: '4244e11f-e282-4e3c-af39-6d9749c99e44',
        apiKey: '2f317b30-113a-45c5-aaf7-192d8926a15f',
    });
    //admin bank info
    const adminBankName = ["TPBank", "VietinBank", "BIDV"];
    const chargeValue = [50000, 100000, 200000, 500000, 750000, 1000000];

    const adminBankAccountName = ["Tong Chau Binh", "Chau Binh", "Binh Chau"];
    //Tên tài khoản là tiếng Việt không dấu, viết hoa, tối thiểu 5 ký tự, tối đa 50 kí tự, không chứa các ký tự đặc biệt

    const adminBankAccount = ["20869042001", "1234567890", "0987654321"]
    //end admin bank info

    //get bank bin
    useEffect(() => {
        if (showBankInforName && adminBankNumber) {
            vietQR
                .getBanks()
                .then((banks) => {
                    setBankList(banks.data)
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
                    "template": "compact2"
                    //compact2 có thêm thông tin người nhận và số tiền trên ảnh
                    //compact thì không có 
                    //qr_only thì chỉ có mã, không có logo vietqr, napas cũng như ngan hàng
                })
                .then((data) => {
                    console.log(data);
                    if (data.data.data) {
                        setQrURL(data.data.data.qrDataURL);
                        setQrGenerated(true);
                    }
                })
                .catch((err) => {
                    console.error('Error generating QR code:', err);
                });
        };
    }, [bankBin, submitted, reloadQR]);

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
        let inputValue = e.target.value;

        // Loại bỏ tất cả các ký tự không phải là số
        inputValue = inputValue.replace(/[^0-9]/g, '');

        // Chuyển đổi giá trị thành số nguyên
        const numericValue = parseInt(inputValue, 10);

        // Kiểm tra nếu giá trị là một số hợp lệ
        if (!isNaN(numericValue)) {
            // Kiểm tra xem giá trị có chia hết cho 50000 không
            const isDivisibleBy50000 = numericValue % 50000 === 0;

            // Định dạng số với dấu phẩy ngăn cách phần nghìn
            const formattedValue = new Intl.NumberFormat('en-US').format(numericValue);

            // Cập nhật giá trị trong state với số thay vì chuỗi
            setAmount(numericValue);
            setMoneyInputAmount(formattedValue);

            // Cập nhật trạng thái trackValidAmount dựa trên kết quả kiểm tra
            setTrackValidAmount(isDivisibleBy50000);
        } else {
            // Nếu giá trị không hợp lệ, có thể xử lý hoặc báo lỗi
            // setAmount(null); // hoặc có thể giữ nguyên giá trị hiện tại của state
            setMoneyInputAmount('');
            setTrackValidAmount(false);
        }
    }
    const handleSelectAmount = (value) => {
        setReloadQR(!reloadQR)
        setAmount(value)
        setShowAnotherOption(false)
    }
    const handleSelectAnotherOption = () => {
        setAmount(0)
        setShowAnotherOption(!showAnotherOption)
    }
    const handleSubbmit = () => {
        setSubmitted(true)
    };
    const handleShowBankDropDownMenu = () => {
        setShowBankDropDownMenu(!showBankDropDownMenu)
    }
    const handleSetNewSelectedAccount = (bankName, name, account) => {
        setShowBankDropDownMenu(false);
        setShowInfor(true)
        setAdminBankNumber(account);
        setAdminName(name);
        setShowBankInforName(bankName);
        setTextForSelectBank(bankName)
    }

    return (
        <div className={cx("ntWrapper")}>
            <div className={cx(allowedToDisplay ? "" : "notAllowedToDisplay")}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                <div className={cx("infoContainer", "pc-only")}>
                    <div className={cx("ntTitle")}>Thông Tin Thiết Lập Mã QR</div>
                    <div className={cx("ntBox")}>
                        <div className={cx("select1")}>
                            <div className={cx("dropDownSelect")}
                                onClick={handleShowBankDropDownMenu}
                            >{textForSelectBank}
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
                                placeholder="Nhập Số Tiền"
                                type="text"
                                inputMode="numeric"
                                value={moneyInputAmount}
                                onChange={changeAmountHandler}
                                maxLength={13}
                                autoFocus
                            >
                            </input>
                        </div>
                        {!trackValidAmount && (
                            <div className={cx("warning-valid-amount-pc")}>*Số Tiền Phải Chia Hết Cho 50,000</div>
                        )}
                        <button className={cx(userName.length > 9 && trackValidAmount && "ready")} onClick={handleSubbmit}>Tạo Mã</button>
                    </div>

                </div>
                <div className={cx("qrContainer", "pc-only")}>
                    <div>Mã QR Của Bạn</div>
                    {submitted && (
                        <Fragment>
                            <img src={qrURL} alt="qr-code"></img>
                            <button id="save-qr-image-pc" onClick={handleSaveQR}>Lưu Mã QR(Ảnh)</button>
                        </Fragment>
                    )}
                </div>
            </div>

            <div className={cx(allowedToDisplay ? "" : "notAllowedToDisplay")}>
                {qrGenerated && (
                    <div className={cx("mbContainer2", "mobile-only")}>
                        <div>Mã QR Của Bạn</div>
                        <img src={qrURL} alt="qr-code"></img>
                        <button onClick={handleSaveQR}>Lưu Mã QR(Ảnh)</button>
                    </div>
                )}
                <div className={cx("mbContainer1", "mobile-only")}>
                    <div className={cx("mbTitle")}>Thông Tin Thiết Lập Mã QR</div>
                    <div className={cx("mbContent")}>
                        <div className={cx("mbInputBox1")}>
                            <label for="userName">Nội Dung Chuyển Khoản: </label>
                            <input
                                maxLength="10"
                                id="userName"
                                required
                                placeholder="Tên Đăng Nhập(Số Điện Thoại Đăng Kí)"
                                type="tel"
                                pattern="[0-9]*"
                                // value={userName}
                                onChange={changeUserNameHandler}
                            ></input>
                            {/* <div>*Không Thể Để Trống</div> */}
                        </div>
                        <div className={cx("chargeValueContainer")}>
                            {chargeValue.map((value, index) => (
                                <Fragment>
                                    <div
                                        className={cx(((value === amount) && !showAnotherOption) ? "selectedAmount" : "")}
                                        onClick={() => handleSelectAmount(value)}
                                        key={index}>
                                        {value.toLocaleString()}vnđ
                                    </div>

                                </Fragment>
                            ))}
                            <div
                                onClick={() => handleSelectAnotherOption()}
                                className={cx(showAnotherOption ? "another-option" : "")}>
                                Nhập Số Khác
                            </div>
                        </div>
                        {showAnotherOption && (
                            <div className={cx("mbInputBox2")}>
                                {/* <label for="amount">Nhập Số Tiền Khác: </label> */}
                                <input
                                    id="amount"
                                    required
                                    placeholder="Nhập Số Tiền"
                                    type="text"
                                    inputMode="numeric"
                                    value={moneyInputAmount}
                                    onChange={changeAmountHandler}
                                    maxLength={13}
                                    autoFocus
                                >
                                </input>
                            </div>
                        )}
                        {!trackValidAmount && showAnotherOption && (
                            <div className={cx("warning-valid-amount")}>*Số Tiền Phải Chia Hết Cho 50,000</div>
                        )}

                        <div className={cx("mbSelect1")}>
                            <div className={cx("dropDownSelect")}
                                onClick={handleShowBankDropDownMenu}
                            >{textForSelectBank}
                                {!showBankDropDownMenu && <img src={arrowLeft}></img>}
                                {showBankDropDownMenu && <img src={arrowDown}></img>}
                            </div>

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
                        {showInfor && (
                            <div className={cx("showAdminInfoBox")}>
                                <div className={cx("showAdminInfo1")}><p>{bankList.filter(bank => bank.shortName === showBankInforName)[0].name}</p></div>
                                <div className={cx("showAdminInfo2")}>Số Tài Khoản Nhận:&nbsp;<p>{adminBankNumber}</p></div>
                                <div className={cx("showAdminInfo3")}>Chủ Tài Khoản:&nbsp;<p>{adminName}</p></div>
                            </div>
                        )}

                        <button className={cx(userName.length > 9 && amount && "ready")} onClick={handleSubbmit}>Tạo Mã {qrGenerated && " (Đã Tạo)"}</button>
                    </div>
                </div>
            </div>

        </div>
    );
}
export default NapTien;
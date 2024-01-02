import styles from "./naptien.scss";
import classNames from "classnames";
import arrowLeft from "~/assets/image/left-arrow.png";
import arrowDown from "~/assets/image/arrow-down.png";
import { VietQR } from "vietqr";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import copyIcon from "~/assets/image/copy.png"
const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;
function NapTien() {
    const [paramId, setParamId] = useState("")
    const [textForSelectBank, setTextForSelectBank] = useState("TPBank");
    const [bankBin, setBankBin] = useState("");
    const [amount, setAmount] = useState(0);
    const [moneyInputAmount, setMoneyInputAmount] = useState('');
    const [bankList, setBankList] = useState([]);
    const [adminName, setAdminName] = useState("Tong Chau Binh");
    const [showBankInforName, setShowBankInforName] = useState("TPBank");
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

    const chargeValue = [50000, 100000, 200000, 500000, 750000, 1000000];
    //admin bank info
    const adminBankName = ["TPBank", "VietinBank", "BIDV"];

    const adminBankAccountName = ["Tong Chau Binh", "Chau Binh", "Binh Chau"];
    //Tên tài khoản là tiếng Việt không dấu, viết hoa, tối thiểu 5 ký tự, tối đa 50 kí tự, không chứa các ký tự đặc biệt

    const adminBankAccount = ["20869042001", "1234567890", "0987654321"]
    //end admin bank info

    //get info from url
    useEffect(() => {
        // Lấy URL hiện tại
        const currentUrl = window.location.href;

        // Phân tích đường link
        const url = new URL(currentUrl);

        // Lấy giá trị của tham số wdToken
        const Token = url.searchParams.get('wdToken');

        // Lấy giá trị của tham số userName
        const Name = url.searchParams.get('userName');

        // Sử dụng giá trị của các tham số tại đây
        // setWdToken(Token)
        setParamId(Name)
        // console.log(Token.length);
        console.log(Name.length);
        //Thông báo thiếu thông tin
        if (Name.length < 10) {
            alert("Thông Tin Bị Thiếu! Hãy Mở Lại Trang Web Này Từ Ứng Dụng Của Bạn.")
            return
        }
    }, []);

    //display naptien screen
    useEffect(() => {
        axios
            .get(`${beURL}/users/depositStatus`)
            .then((response) => {
                const data = response.data;
                if (data.success === 1) {
                    setAllowToDisplay(data.data.depositStatus)
                } else {
                    setAllowToDisplay(false)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

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
                        setShowInfor(true)
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
                    "memo": paramId,
                    // "format": "text",
                    "template": "print"
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

    // const changeUserNameHandler = (e) => {
    //     setUserName(e.target.value)
    // };
    
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
        setTrackValidAmount(true)
        setMoneyInputAmount('');
    }
    const handleSelectAnotherOption = () => {
        setAmount(0)
        setShowAnotherOption(true)
        setTrackValidAmount(false)
    }
    const handleSubbmit = () => {
        setSubmitted(true)
        setReloadQR(!reloadQR)
        setShowAnotherOption(false)
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

    const handleCopyInfo = (info) => {
        try {
            // Tạo một đối tượng ClipboardItem với một đối tượng { 'text/plain': info }
            const item = new ClipboardItem({ 'text/plain': new Blob([info], { type: 'text/plain' }) });

            // Sử dụng Clipboard API để sao chép nội dung vào clipboard
            navigator.clipboard.write([item]);

            console.log('Đã sao chép thành công!');
        } catch (error) {
            console.error('Không thể sao chép vào clipboard:', error);
        }
    };

    return (
        <div className={cx("ntWrapper")}>
            <div className={cx(allowedToDisplay ? "" : "notAllowedToDisplay")}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                {/* <div className={cx("infoContainer", "pc-only")}>
                    <div className={cx("ntTitle")}>Thông Tin Thiết Lập Mã QR</div>
                    <div className={cx("ntBox")}>
                        <div className={cx("select1")}>
                            <div className={cx("dropDownSelect")}
                                onClick={handleShowBankDropDownMenu}
                            >{textForSelectBank}
                                {!showBankDropDownMenu && <img src={arrowLeft} alt="arrow"></img>}
                                {showBankDropDownMenu && <img src={arrowDown} alt="arrow"></img>}
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
                        <button className={cx(trackValidAmount && "ready")} onClick={handleSubbmit}>Tạo Mã</button>
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
                </div> */}
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
                            <label for="userName">
                                Nội Dung Chuyển Khoản:
                                <strong>&nbsp;{paramId}</strong>
                                <img id="copy-icon" src={copyIcon} alt="copy" onClick={() => handleCopyInfo(paramId)}></img>
                            </label>
                            {/* <input
                                maxLength="10"
                                id="userName"
                                required
                                placeholder="Tên Đăng Nhập(Số Điện Thoại Đăng Kí)"
                                type="tel"
                                pattern="[0-9]*"
                                value={paramId}
                                onChange={changeUserNameHandler}
                            ></input> */}
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
                                <div className={cx("showAdminInfo1")}>
                                    <strong>{bankList.filter(bank => bank.shortName === showBankInforName)[0].name}</strong>
                                </div>
                                <div className={cx("showAdminInfo2")}>
                                    Số Tài Khoản Nhận:
                                    &nbsp;<strong>{adminBankNumber}</strong>
                                    <img id="copy-icon" src={copyIcon} alt="copy" onClick={() => handleCopyInfo(adminBankNumber)}></img>
                                </div>
                                <div className={cx("showAdminInfo3")}>
                                    Chủ Tài Khoản:&nbsp;<strong>{adminName}</strong>
                                </div>
                            </div>
                        )}

                        <button className={cx((paramId && trackValidAmount)? "ready" : "",(showAnotherOption && qrGenerated)? "readyToGenNewQR" : "")} onClick={handleSubbmit}>
                            {!qrGenerated && "Tạo Mã QR"} 
                            {(qrGenerated && !showAnotherOption) && "Tạo Mã QR Thành Công!"} 
                            {(showAnotherOption && qrGenerated) && "Tạo Mã QR Mới"}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
export default NapTien;
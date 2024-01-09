import styles from "./usermanual.scss";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import arrowLeft from "~/assets/image/left-arrow.png";
import arrowDown from "~/assets/image/arrow-down.png";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function UsersManual() {
    const navigate = useNavigate();
    const [allowedToDisplay, setAllowToDisplay] = useState(false)
    const [wdToken, setWdToken] = useState("")
    const [userName, setUserName] = useState("")
    const [showManual, setShowManual] = useState("")
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

    useEffect(() => {
        // Lấy URL hiện tại
        const currentUrl = window.location.href;

        // Phân tích đường link
        const url = new URL(currentUrl);

        // Lấy giá trị của tham số wdToken
        const Token = url.searchParams.get('wdToken');

        // Lấy giá trị của tham số userName
        const Name = url.searchParams.get('userName');
        if (Token !== null) {
            setWdToken(Token)
        }
        // Sử dụng giá trị của các tham số tại đây
        if (Name !== null) {
            setUserName(Name)
        }

        //Thông báo thiếu thông tin
        // if (Token.length < 10 || Name.length < 10) {
        //     // alert("Thông Tin Bị Thiếu! Hãy Mở Lại Trang Web Này Từ Ứng Dụng Của Bạn.")
        //     return
        // }
    }, []);

    const handleOpenManual = (id) => {
        if (showManual === id) {
            const activeElement = document.getElementById("active");
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: "smooth", marginTop: 120 });
            }
            return
        } else {
            setShowManual(id)
            const activeElement = document.getElementById("active");
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: "smooth", marginTop: 120 });
            }
            return
        }
    }

    const handleCloseManual = (id) => {
        if (showManual === id) {
            setShowManual("")
        } else {
            handleOpenManual(id)
        }
    }

    return (
        <div className={cx("manualWrapper")}>
            <h1>Hướng Dẫn Sử Dụng</h1>
            <div
                className={cx((
                    allowedToDisplay &&
                    (userName === null || userName.length === 10)) ? "" : "notAllowedToDisplay")}
            >
                <div className={cx("buttonContainer")}>
                    <button id="naptien" onClick={() => navigate(`/usermanual/naptien?userName=${userName}`)}>Nạp Tiền</button>
                    <button id="ruttien" onClick={() => navigate(`/usermanual/ruttien?wdToken=${wdToken}&userName=${userName}`)}>Rút Tiền</button>
                </div>
            </div>
            <div className={cx("userManualContainer")}>
                <div className={cx("manualContainer")} id={showManual === "NUMBER1" ? "active" : ""}>
                    <div className={cx("mTitle")} onClick={() => handleOpenManual("NUMBER1")}>
                        Hướng Dẫn Đổi Mật Khẩu
                        <img src={showManual === "NUMBER1" ? arrowDown : arrowLeft}
                            onClick={() => handleCloseManual("NUMBER1")}
                        ></img>
                    </div>
                    {showManual === "NUMBER1" && (
                        <div className={cx("mContent")}>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 1:</strong> Dưới đây là một số trang web phổ biến cung cấp hướng dẫn sử dụng phần mềm hoặc user manual với giao diện dành cho thiết bị di động:</div>
                                <div className={cx("stepImageBox")}>
                                    <div className={cx("img")}></div>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 2:</strong> làm abc xyz</div>
                                <div className={cx("stepImageBox")}>
                                    <div className={cx("img")}></div>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 3:</strong> làm abc xyz</div>
                                <div className={cx("stepImageBox")}>
                                    <div className={cx("img")}></div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
                <div className={cx("manualContainer")} id={showManual === "NUMBER2" ? "active" : ""}>
                    <div className={cx("mTitle")} onClick={() => handleOpenManual("NUMBER2")}>
                        Hướng Dẫn Tạo Đơn Chở Khách
                        <img src={showManual === "NUMBER2" ? arrowDown : arrowLeft}
                            onClick={() => handleCloseManual("NUMBER2")}
                        ></img>
                    </div>
                    {showManual === "NUMBER2" && (
                        <div className={cx("mContent")}>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 1:</strong> Dưới đây là một số trang web phổ biến cung cấp hướng dẫn sử dụng phần mềm hoặc user manual với giao diện dành cho thiết bị di động:</div>
                                <div className={cx("stepImageBox")}>
                                    <div className={cx("img")}></div>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 2:</strong> làm abc xyz</div>
                                <div className={cx("stepImageBox")}>
                                    <div className={cx("img")}></div>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 3:</strong> làm abc xyz</div>
                                <div className={cx("stepImageBox")}>
                                    <div className={cx("img")}></div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>

    );
}

export default UsersManual;
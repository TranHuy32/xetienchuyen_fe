import styles from "./usermanual.scss";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import arrowLeft from "~/assets/image/left-arrow.png";
import arrowDown from "~/assets/image/arrow-down.png";

// nhận chuyến
import q1step1 from "~/assets/image_for_usermanual/accept_ride/step1.png"
import q1step2 from "~/assets/image_for_usermanual/accept_ride/step2.png"
import q1step3 from "~/assets/image_for_usermanual/accept_ride/step3.png"
import q1step4 from "~/assets/image_for_usermanual/accept_ride/step4.png"
import q1step5 from "~/assets/image_for_usermanual/accept_ride/step5.png"

// tạo chuyến chở khách
import q2step1 from "~/assets/image_for_usermanual/create_ride/step1.png"
import q2step2 from "~/assets/image_for_usermanual/create_ride/step2.png"

//tạo chuyến giao hàng 
import q3step1 from "~/assets/image_for_usermanual/create_ship/step1.png"
import q3step2 from "~/assets/image_for_usermanual/create_ship/step2.png"
import q3step3 from "~/assets/image_for_usermanual/create_ship/step3.png"
import q3step4 from "~/assets/image_for_usermanual/create_ship/step4.png"
import q3step5 from "~/assets/image_for_usermanual/create_ship/step5.png"

//đổi mật khẩu
import q4step1 from "~/assets/image_for_usermanual/change_password/step1.png"
import q4step2 from "~/assets/image_for_usermanual/change_password/step2.png"
import q4step3 from "~/assets/image_for_usermanual/change_password/step3.png"


//đăng kí khu vực hoạt động
import q5step1 from "~/assets/image_for_usermanual/sign_place/step1.png"
import q5step2 from "~/assets/image_for_usermanual/sign_place/step2.png"
import q5step3 from "~/assets/image_for_usermanual/sign_place/step3.png"
import q5step4 from "~/assets/image_for_usermanual/sign_place/step4.png"

//kiểm tra đơn đã nhận/hoàn thành
import q6step1 from "~/assets/image_for_usermanual/check_ride/step1.png"
import q6step2 from "~/assets/image_for_usermanual/check_ride/step2.png"


const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function UsersManual() {
    const navigate = useNavigate();
    const [allowedToDisplay, setAllowToDisplay] = useState(false)
    const [wdToken, setWdToken] = useState("")
    const [userName, setUserName] = useState("")
    const [showManual, setShowManual] = useState("")
    //get display status
    useEffect(() => {
        axios
            .get(`${beURL}/users/depositStatus`)
            .then((response) => {
                const data = response.data;
                if (!!data && data.success === 1) {
                    setAllowToDisplay(data.data.depositStatus)
                } else {
                    setAllowToDisplay(false)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    //get token
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
                        Hướng Dẫn Nhận Đơn
                        <img src={showManual === "NUMBER1" ? arrowDown : arrowLeft}
                            onClick={() => handleCloseManual("NUMBER1")}
                        ></img>
                    </div>
                    {showManual === "NUMBER1" && (
                        <div className={cx("mContent")}>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}>
                                    <strong>bước 1: </strong>
                                    Ở màn hình chính ta có thể thấy các chuyến xe đã được tạo, bạn có thể nhấn vào chuyến xe muốn nhận:
                                </div>
                                <div className={cx("stepImageBox")}>
                                    {/* <div className={cx("img")}></div> */}
                                    <img src={q1step1} alt="step1"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 2: </strong>
                                    Ấn vào nút "Nhận Chuyến":
                                </div>
                                <div className={cx("stepImageBox")}>
                                    {/* <div className={cx("img")}></div> */}
                                    <img src={q1step2} alt="step2"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 3: </strong>
                                    Khi nhận chuyến thành công sẽ có thông báo như sau:
                                </div>
                                <div className={cx("stepImageBox")}>
                                    {/* <div className={cx("img")}></div> */}
                                    <img src={q1step3} alt="step3"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 4: </strong>
                                    Hãy ấn biểu tượng điện thoại để liên lạc với khách hàng, bạn có thể ấn nút "Xác Nhận" để chính thức nhận chuyến. Nếu không thể liên lạc với khách hàng, hãy ấn "Huỷ Chuyến":
                                </div>
                                <div className={cx("stepImageBox")}>
                                    {/* <div className={cx("img")}></div> */}
                                    <img src={q1step4} alt="step4"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 5: </strong>
                                    Sau khi đã hoàn thành chuyến đi, hãy ấn nút "Hoàn Thành":
                                </div>
                                <div className={cx("stepImageBox")}>
                                    {/* <div className={cx("img")}></div> */}
                                    <img src={q1step5} alt="step5"></img>
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
                                <div className={cx("stepText")}><strong>bước 1:</strong>
                                    Ấn vào nút "Tạo Cuốc" trên thanh điều hướng:
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q2step1} alt="step1"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 2:</strong>
                                    Kiểm tra nút "Tạo Chuyến". Nếu như hình tức là bạn đang ở trang tạo chuyến, nếu không, hãy ấn vào nút "Tạo Chuyến". sau đó bạn hãy điền thông tin cần thiết và ấn nút "Tạo Chuyến" ở dưới cùng:
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q2step2} alt="step2"></img>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={cx("manualContainer")} id={showManual === "NUMBER3" ? "active" : ""}>
                    <div className={cx("mTitle")} onClick={() => handleOpenManual("NUMBER3")}>
                        Hướng Dẫn Tạo Đơn Giao Hàng
                        <img src={showManual === "NUMBER3" ? arrowDown : arrowLeft}
                            onClick={() => handleCloseManual("NUMBER3")}
                        ></img>
                    </div>
                    {showManual === "NUMBER3" && (
                        <div className={cx("mContent")}>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 1:</strong>
                                    Ấn vào nút "Tạo Cuốc" trên thanh điều hướng:
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q3step1} alt="step1"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 2:</strong>
                                    Kiểm tra nút "Giao Hàng". Nếu như hình tức là bạn đang ở trang tạo chuyến, nếu không, hãy ấn vào nút "Giao Hàng".
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q3step2} alt="step2"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 3:</strong>
                                    Hãy điền các thông tin cần thiết rồi ấn nút "Tiêp Tục"
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q3step3} alt="step3"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 4:</strong>
                                    Bạn có thể điền thêm thông tin và kích thước hàng hoá, sau đó ấn "Tiếp Tục". Nếu muốn sửa thông tin ở bước trước, ấn "Quay Lại".
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q3step4} alt="step4"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 5:</strong>
                                    Tiếp theo bạn sẽ điền số tiền lái xe nhận được, hoa hồng cho môi giới.<br/>
                                    <strong>Thu hộ :</strong> Nếu tích chọn vào ô “Thu hộ” mà không tích chọn ô “Ưng” có nghĩa là người gửi sẽ nhờ tài
                                    xế thu hộ COD từ người nhận sau đó sẽ gửi lại cho người gửi<br/>
                                    <strong>Thu hộ có Ứng:</strong> Nếu tích cả ô “Thu hộ” và ô “Ưng” có nghĩa là tài xế sẽ phải ứng số tiền COD cho
                                    người gửi và thu lại từ người nhận<br/>
                                    <strong>COD: </strong>người tạo đơn nhập COD nếu đơn hàng có Thu hộ hoặc Thu hộ - Ưng , nếu không nhập tiền
                                    COD bằng 0đ<br/>
                                    Người trả cước mặc định là người gửi ,bạn có thể thay đổi thành người nhận trả cước<br/>
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q3step5} alt="step5"></img>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={cx("manualContainer")} id={showManual === "NUMBER4" ? "active" : ""}>
                    <div className={cx("mTitle")} onClick={() => handleOpenManual("NUMBER4")}>
                        Hướng Dẫn Đổi Mật Khẩu
                        <img src={showManual === "NUMBER4" ? arrowDown : arrowLeft}
                            onClick={() => handleCloseManual("NUMBER4")}
                        ></img>
                    </div>
                    {showManual === "NUMBER4" && (
                        <div className={cx("mContent")}>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 1:</strong>
                                    Ấn vào nút "Hỗ Trợ" trên thanh điều hướng:
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q4step1} alt="step1"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 2:</strong>
                                    Ấn "Đổi Mật Khẩu":
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q4step2} alt="step2"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 3:</strong>
                                    Hãy nhập thông tin cần thiết rồi ấn nút "Thay Đổi" để thiết lập mật khẩu mới:
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q4step3} alt="step3"></img>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={cx("manualContainer")} id={showManual === "NUMBER5" ? "active" : ""}>
                    <div className={cx("mTitle")} onClick={() => handleOpenManual("NUMBER5")}>
                        Đăng Kí Khu Vực Hoạt Động
                        <img src={showManual === "NUMBER5" ? arrowDown : arrowLeft}
                            onClick={() => handleCloseManual("NUMBER5")}
                        ></img>
                    </div>
                    {showManual === "NUMBER5" && (
                        <div className={cx("mContent")}>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 1:</strong>
                                    Ấn vào nút "Hỗ Trợ" trên thanh điều hướng:
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q5step1} alt="step1"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 2:</strong>
                                    Ấn "Lựa Chọn Địa Điểm Hay Đến":
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q5step2} alt="step2"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 3:</strong>
                                    Hãy lựa chọn tỉnh bạn muốn đăng kí:
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q5step3} alt="step3"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 4:</strong>
                                    Lựa chọn các thành phố/huyện bạn muốn đăng kí, sau đó ấn nút "Đồng Ý":
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q5step4} alt="step4"></img>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
                <div className={cx("manualContainer")} id={showManual === "NUMBER6" ? "active" : ""}>
                    <div className={cx("mTitle")} onClick={() => handleOpenManual("NUMBER6")}>
                        Kiểm Tra Đơn Hàng Của Bản Thân
                        <img src={showManual === "NUMBER6" ? arrowDown : arrowLeft}
                            onClick={() => handleCloseManual("NUMBER6")}
                        ></img>
                    </div>
                    {showManual === "NUMBER6" && (
                        <div className={cx("mContent")}>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 1:</strong>
                                    Ấn vào nút "Đã Nhận" trên thanh điều hướng:
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q6step1} alt="step1"></img>
                                </div>
                            </div>
                            <div className={cx("stepBox")}>
                                <div className={cx("stepText")}><strong>bước 2:</strong>
                                    Phía trên cùng màn hình, bạn có thể lựa chọn kiểm tra đơn "Đang Nhận" hoặc đơn "Hoàn Thành":
                                </div>
                                <div className={cx("stepImageBox")}>
                                    <img src={q6step2} alt="step2"></img>
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
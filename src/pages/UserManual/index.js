import styles from "./usermanual.scss";
import classNames from "classnames";
import arrowLeft from "~/assets/image/left-arrow.png";
import arrowDown from "~/assets/image/arrow-down.png";
import { Fragment, useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function UsersManual() {
    const navigate = useNavigate();
    const [allowedToDisplay, setAllowToDisplay] = useState(true)
    const [wdToken,setWdToken] =useState(null)
    const [userName, setUserName] = useState(null)
    useEffect(() => {
        axios
            .get(`${beURL}/users/depositStatus`)
            .then((response) => {
                const data = response.data;
                if(data.success === 1){
                    setAllowToDisplay(true)
                    // setAllowToDisplay(false)
                }else{
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

        // Sử dụng giá trị của các tham số tại đây
        setWdToken(Token)
        setUserName(Name)
        console.log(Token.length);
        console.log(Name.length);
        //Thông báo thiếu thông tin
        if(Token.length < 10 || Name.length < 10){
            alert("Thông Tin Bị Thiếu! Hãy Mở Lại Trang Web Này Từ Ứng Dụng Của Bạn.")
            return
        }
    }, []);



    return (
        <div className={cx("manualWrapper", allowedToDisplay ? "" : "notAllowedToDisplay")}>
            <div className={cx("buttonContainer")}>
                <button id="naptien" onClick={() => navigate(`/naptien?userName=${userName}`)}>Nạp Tiền</button>
                <button id="ruttien" onClick={() => navigate(`/ruttien?wdToken=${wdToken}&userName=${userName}`)}>Rút Tiền</button>
            </div>
            <div className={cx("userManualContainer")}></div>
        </div>
    );
}

export default UsersManual;
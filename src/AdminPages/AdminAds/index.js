import { Fragment, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./AdminAds.scss";
import axios from "axios";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function AdminAds() {
    const [adsList, setAdsList] = useState([])
    const [reloadList, setReloadList] = useState(false)
    const [showCreateAds, setShowCreateAds] = useState(false)
    const [state, setState] = useState({
        adsPhoneNumber: "",
        adsLink: "",
        image_ads: null,
    });

    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };


    useEffect(() => {
        axios
            .get(`${beURL}/ads/allAdsesByAdmin`, config)
            .then((response) => {
                const data = response.data;
                setAdsList(data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [reloadList]);

    const handleSetBanner = (isBanner, id) => {
        var newStatus = !isBanner
        axios
            .put(`${beURL}/ads/setBanner/${id}`,
                {
                    "isBanner": newStatus
                }
                , config)
            .then((response) => {
                const data = response.data;
                if (data.message === "SUCCESS") {
                    setReloadList(!reloadList)
                }

            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleSetActive = (isActive, id) => {
        var status = !isActive
        axios
            .put(`${beURL}/ads/activeAds/${id}`,
                {
                    "active": status
                }
                , config)
            .then((response) => {
                const data = response.data;
                if (data.message === "SUCCESS") {
                    setReloadList(!reloadList)
                }

            })
            .catch((error) => {
                console.log(error);
            });
    }

    const handleShowCreateAds = () => {
        setShowCreateAds(true)
    }

    const changeHandler = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const isImageFile = (file) => {
        const acceptedFormats = ["image/png", "image/jpeg", "image/jpg"];
        return acceptedFormats.includes(file.type);
    };

    const changeFileHandler = (event) => {
        const file = event.target.files[0];
        if (isImageFile(file)) {
            setState((prevState) => ({
                ...prevState,
                image_ads: file,
            }));
        } else {
            alert("Chọn Ảnh Có Định Dạng png / jpeg / jpg")
        }
    };

    const handleCreateNewAds = () => {
        if (state.adsPhoneNumber.length === 10) {
            if (isImageFile(state.image_ads)) {
                axios
                    .post(`${beURL}/ads/create`, state, config)
                    .then((response) => {
                        const data = response.data;
                        console.log(data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                alert("Chọn Ảnh Đúng Định Dạng")
            }
        } else {
            alert("Kiểm Tra Lại Số Điện Thoại")
        }
    }
    
    const handleCancel = () => {
        setShowCreateAds(false)
        setState({
            adsPhoneNumber: "",
            adsLink: "",
            image_ads: null,
        })
    }

    return (
        <Fragment>
            {showCreateAds && (
                <Fragment>
                    <div className={cx("overlay")} onClick={handleCancel}></div>
                    <div className={cx("createAdsBox")}>
                        <div className={cx("boxTitle")}>Thông Tin Quảng Cáo</div>
                        <div className={cx("boxInput1")}>
                            <label for="adsPhoneNumber">Số Điện Thoại:</label>
                            <input
                                id="adsPhoneNumber"
                                onChange={changeHandler}
                                name="adsPhoneNumber"
                                type="number"
                                value={state.adsPhoneNumber}
                                placeholder="Nhập Số Điện Thoại ..."
                                maxLength={10}
                            ></input>
                        </div>
                        <div className={cx("boxInput2")}>
                            <label for="adsLink">Link: </label>
                            <input
                                id="adsLink"
                                onChange={changeHandler}
                                name="adsLink"
                                type="text"
                                value={state.adsLink}
                                placeholder="Link Quảng Cáo ..."
                            ></input>
                        </div>
                        <div className={cx("boxInput3")}>
                            <label for="image_ads">Chọn Ảnh: </label>
                            <input
                                id="image_ads"
                                onChange={changeFileHandler}
                                name="image_ads"
                                type="file"
                                // value={state.image_ads}
                                placeholder="Chọn Ảnh Quảng Cáo..."
                            ></input>
                        </div>
                        <button onClick={handleCreateNewAds}>Tạo Quảng Cáo</button>
                    </div>
                </Fragment>
            )}
            <div className={cx("showCreateAds")} onClick={() => handleShowCreateAds()}>Tạo Quảng Cáo Mới +</div>
            <div className={cx("adsList")}>
                {adsList.map((ads, index) => (
                    <div key={index} className={cx("flex-row space-between box")}>
                        <div className={cx("inforBox")}>
                            <div className={cx("link")}>Link Quảng Cáo: <a href={ads.adsLink}>Ấn Để Xem</a></div>
                            <div className={cx("phoneNumber")}>Số Điện Thoại: {ads.adsPhoneNumber}</div>
                            <div className={cx("type")}>Type: {ads.type}</div>
                            <div className={cx("groupId")}>GroupId: {ads.groupId === null && ("Không có" || ads.groupId)}</div>
                            <div className={cx("flex-row space-between")}>
                                <p className={cx("isBanner")}>Banner:
                                    <strong> {ads.isBanner && (" Đã Set ")}</strong>
                                    {!ads.isBanner && (" Chưa Set ")}
                                </p>
                                <button onClick={() => handleSetBanner(ads.isBanner, ads._id)}>Thay Đổi</button>
                            </div>
                            <div className={cx("flex-row space-between")}>
                                <p className={cx("isActive")}>Kích Hoạt:
                                    <strong>{ads.active && (" Đã Active ")}</strong>
                                    {!ads.active && (" Chưa Active ")}
                                </p>
                                <button onClick={() => handleSetActive(ads.active, ads._id)}>Thay Đổi</button>
                            </div>
                        </div>

                        <img alt="ảnh" src={ads.image_ads.path} className={cx("Image")}></img>
                    </div>
                ))}
            </div>
        </Fragment>

    );
}

export default AdminAds;
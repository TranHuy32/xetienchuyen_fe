import { Fragment, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./AdminAds.scss";
import axios from "axios";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function AdminAds() {
    const [adsList, setAdsList] = useState([])
    const [reloadList, setReloadList] = useState(false)

    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    console.log(adsList);

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
    return (
        <Fragment>

            <div className={cx("adsList")}>
                {adsList.map((ads, index) => (
                    <div key={index} className={cx("flex-row space-between box")}>
                        <div className={cx("inforBox")}>
                            <div className={cx("link")}>Link Quảng Cáo: <a href={ads.adsLink}>Ấn Để Xem</a></div>
                            <div className={cx("phoneNumber")}>Số Điện Thoại: {ads.adsPhoneNumber}</div>
                            <div className={cx("type")}>Type: {ads.type}</div>
                            <div className={cx("groupId")}>GroupId: {ads.groupId === null && ("Không có" || ads.groupId)}</div>
                            <div className={cx("flex-row space-between")}>
                                <p className={cx("isBanner")}>Set Banner:
                                   <strong> {ads.isBanner && (" Đã Set ")}</strong>
                                    {!ads.isBanner && (" Chưa Set ")}
                                </p>
                                <button onClick={() => handleSetBanner(ads.isBanner, ads._id)}>Thay Đổi</button>
                            </div>
                            {/* <div className={cx("flex-row space-between")}>
                                <p className={cx("isActive")}>Kích Hoạt:
                                    {ads.isBanner && (" Đã Active ")}
                                    {!ads.isBanner && (" Chưa Active ")}
                                </p>
                                <button onClick={() => handleSetBanner(ads.isBanner, ads._id)}>Thay Đổi</button>
                            </div> */}
                        </div>

                        <img alt="ảnh" src={ads.image_ads.path} className={cx("Image")}></img>
                    </div>
                ))}
            </div>
        </Fragment>

    );
}

export default AdminAds;
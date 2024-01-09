import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import classNames from "classnames";
import styles from "~/AdminPages/AdminOwner/AdminOwner.scss";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function AdminOwner() {
    const [ownerList, setOwnerList] = useState([]);
    const [groupList, setGroupList] = useState([]);
    const [reloadList, setReloadList] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [showAddGmail, setShowAddGmail] = useState(false)
    const [gmail, setGmail] = useState({
        gmail: ""
    })
    const [selectedId, setSelectedId] = useState("")
    const [selectedGroupId, setSelectedGroupId] = useState("")
    const [selectedGroupName, setSelectedGroupName] = useState("")
    const [isTwoFa, setIsTwoFa] = useState()
    const [showCreateOwner, setShowCreateOwner] = useState(false)
    const [showGroupList, setShowGroupList] = useState(false)
    const [showQRFA, setShowQRFA] = useState(false)
    const [qrURL, setQrURL] = useState("")
    const [checkBox2FA, setCheckBox2FA] = useState(false)
    const [showInput2FaCode, setShowInput2FaCode] = useState(false)
    const [formTurnOn2Fa, setFormTurnOn2Fa] = useState({
        twoFaCode: "",
        ownerId: "",
    })

    const [formData, setFormData] = useState({
        name: "",
        userName: "",
        password: "",
        groupId: ""
    });

    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    //get group list
    useEffect(() => {
        axios
            .get(`${beURL}/group/all`, config)
            .then((response) => {
                const data = response.data;
                setGroupList(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [reloadList]);

    //get data owner
    useEffect(() => {
        axios
            .get(`${beURL}/users/allOwners?page=${currentPage}&pageSize=${pageSize}`, config)
            .then((response) => {
                const data = response.data;
                setOwnerList(data.users);
                setTotalPages(Math.ceil(data.totalCount / pageSize));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [reloadList, token, currentPage, pageSize]);

    const handleCreateOwner = () => {
        if (formData.name === "" || formData.userName === "" || formData.password === "" || formData.groupId === "") {
            alert("Điền Đầy Đủ Thông Tin")
            return
        }
        if (formData.userName.length !== 10) {
            alert("Tên Đăng Nhập Phải Là Số Điện Thoại")
            return
        }
        axios
            .post(`${beURL}/users-auth/registerOwner`, formData, config)
            .then((response) => {
                const data = response.data;
                if (data === "UserName Existed!") {
                    alert(data)
                }
                if (data.active === true) {
                    alert("Thành Công ")
                    handleCancel()
                }
                setReloadList(!reloadList)
            })
            .catch((error) => {
                console.log(error);
            });
    }



    const handleAddGmail = () => {
        if (!isTwoFa) {
            if (gmail.length !== "") {
                axios
                    .put(`${beURL}/users/updateOwner/${selectedId}`, gmail, config)
                    .then((response) => {
                        const data = response.data;
                        setReloadList(!reloadList)
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } else {
            alert("Hãy Tắt Bảo Mật 2FA Trước")
            handleCancel()
        }
    }


    const handleCancel = () => {
        setSelectedGroupName("")
        setShowAddGmail(false)
        setGmail("")
        setSelectedId("")
        setIsTwoFa()
        setShowCreateOwner(false)
        setSelectedGroupId("")
        setShowGroupList(false)
        setShowCreateOwner(false)
        setFormData({
            name: "",
            userName: "",
            password: "",
            groupId: ""
        })
        setCheckBox2FA(false)
        setShowQRFA(false)
        setShowInput2FaCode(false)
        setFormTurnOn2Fa({
            twoFaCode: "",
            ownerId: "",
        })
    }

    const handleShowAddGmail = (id, twoFA) => {
        setShowAddGmail(true)
        setSelectedId(id)
        setIsTwoFa(twoFA)
    }

    const handleSelectGroup = (id, name) => {
        setShowGroupList(false)
        setSelectedGroupId(id)
        setSelectedGroupName(name)
        setFormData({
            ...formData,
            groupId: id,
        })
    }

    const handleGetQR = (id) => {
        setShowQRFA(true)
        setCheckBox2FA(false)
        axios
            .get(`${beURL}/users-auth/2fa/qr/${id}`, config)
            .then((response) => {
                const data = response.data;
                setQrURL(data)
            })
            .catch((error) => {
                console.log(error);
            });

    }

    const handleCheck2FA = (status2fa, id) => {
        if (status2fa) {
            setCheckBox2FA(true)
            setSelectedId(id)
        } else {
            alert("Hãy Tạo Mã QR Và Cài Đặt GG Authenicator")
        }
    }

    const handleCheckTurnOn2Fa = (id) => {
        setShowInput2FaCode(true)
        setFormTurnOn2Fa({
            ...formTurnOn2Fa,
            ownerId: id,
        })
    }

    const handleTurnOn2FA = () => {
        axios
            .post(`${beURL}/users-auth/2fa/turn-on`, formTurnOn2Fa, config)
            .then((response) => {
                const data = response.data;
                console.log(data);
                if (data) {
                    setReloadList(!reloadList)
                    handleCancel()
                } else {
                    alert("Thất Bại")
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <Fragment>
            {showInput2FaCode && (
                <Fragment>
                    <div className={cx("overlay")} onClick={handleCancel}></div>
                    <div className={cx("input2FaCodeBox")}>
                        <label for="faCode">Nhập 2FA Code:</label>
                        <input
                            required
                            type="number"
                            maxLength={6}
                            id="faCode"
                            placeholder="Code 6 Chữ Số..."
                            onChange={(e) =>
                                setFormTurnOn2Fa({
                                    ...formTurnOn2Fa,
                                    twoFaCode: e.target.value,
                                })}
                        >
                        </input>
                        <button onClick={handleTurnOn2FA}>Xác Nhận</button>
                    </div>

                </Fragment>
            )}
            {showQRFA && (
                <Fragment>
                    <div className={cx("overlay")} onClick={handleCancel}></div>
                    <img src={qrURL} alt="QR-CODE" id="qr-2fa"></img>
                </Fragment>
            )}
            {checkBox2FA && (
                <Fragment>
                    <div className={cx("overlay")} onClick={handleCancel}></div>
                    <div className={cx("check2FABox")}>
                        <div className={cx("warning1")}>Nếu Tạo QR Mới Sẽ Vô Hiệu Hoá QR Trước Đó</div>
                        <div className={cx("warning2")}>Bạn Chắc Chắn Muốn Tạo Mới?</div>
                        <div className={cx("selectBox")}>
                            <div className={cx("cancel")} onClick={handleCancel}>Huỷ Bỏ</div>
                            <div className={cx("accept")} onClick={() => { handleGetQR(selectedId) }}>Tạo Mới</div>
                        </div>
                    </div>
                </Fragment>
            )}
            {showCreateOwner && (
                <Fragment>
                    <div className={cx("overlay")} onClick={handleCancel}></div>
                    <div className={cx("createNewOwnerBox")}>
                        <div className={cx("titleCreateBox")}>Nhập Thông Tin</div>
                        <div className={cx("inputNameBox")}>
                            <label for="name">Tên Người Dùng: </label>
                            <input
                                required
                                id="name"
                                type="text"
                                placeholder="Tên Owner..."
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })}
                            />
                        </div>
                        <div className={cx("inputUserNameBox")}>
                            <label for="userName">Tên Đăng Nhập: </label>
                            <input
                                required
                                maxLength={10}
                                id="userName"
                                type="number"
                                placeholder="Tên Tài Khoản..."
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        userName: e.target.value,
                                    })}

                            />
                        </div>
                        <div className={cx("inputPasswordBox")}>
                            <label for="password">Mật Khẩu: </label>
                            <input
                                required
                                id="password"
                                type="text"
                                placeholder="Mật Khẩu..."
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })}
                            />
                        </div>
                        <div className={cx("selectGroupBox")}>
                            <div className={cx("selectTitle")} onClick={() => setShowGroupList(!showGroupList)}>
                                {selectedGroupName !== "" && selectedGroupName}
                                {selectedGroupName === "" && "Chọn Group"}
                            </div>
                            {showGroupList && (
                                <div className={cx("selectGroupDropMenu")}>
                                    {groupList.map((group, index) => (
                                        <div className={cx("selectElement")} key={index} onClick={() => handleSelectGroup(group._id, group.name)}>{group.name}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={handleCreateOwner}>Xác Nhận</button>


                    </div>
                </Fragment>
            )}
            {showAddGmail && (
                <Fragment>
                    <div className={cx("overlay")} onClick={handleCancel}></div>
                    <div className={cx("addGmailBox")}>
                        <div className={cx("titleGmailBox")}>Thêm Địa Chỉ Gmail</div>
                        <div className={cx("inputGmailBox")}>
                            <label for="gmail">Gmail: </label>
                            <input
                                required
                                id="gmail"
                                value={gmail.gmail}
                                type="email"
                                onChange={(e) => setGmail({
                                    ...gmail,
                                    gmail: e.target.value
                                })}
                                placeholder="Nhập Gmail..."
                            />

                        </div>
                        <button onClick={handleAddGmail}>Xác Nhận</button>


                    </div>
                </Fragment>
            )}
            <div className={cx("adCreateOwnerDiv")} onClick={() => setShowCreateOwner(true)}>Tạo Tài Khoản Mới +</div>
            <div className={cx("adOwnerList")}>
                <table>
                    <thead>
                        <tr>
                            <th>Tên Owner</th>
                            <th>Tên Group</th>
                            <th>Tên Đăng Nhập</th>
                            <th>Gmail</th>
                            <th>Xác Thực 2 Lớp(2FA)</th>
                            <th>Get QR</th>

                        </tr>
                    </thead>
                    <tbody>
                        {ownerList.map((owner, index) => (
                            <tr key={index}>
                                <td>{owner.name}</td>
                                <td>{owner.groupName}</td>
                                <td>{owner.userName}</td>
                                <td>
                                    {owner.gmail === null && (
                                        <button onClick={() => handleShowAddGmail(owner._id, owner.isTwoFactorAuthenticationEnabled)}>Thêm Gmail</button>
                                    )}
                                    {owner.gmail !== null && (
                                        owner.gmail
                                    )}
                                </td>
                                <td>
                                    {!owner.isTwoFactorAuthenticationEnabled && (
                                        <button onClick={() => handleCheckTurnOn2Fa(owner._id)}>Bật 2FA</button>
                                    )}
                                    {owner.isTwoFactorAuthenticationEnabled && (
                                        <button>Tắt 2FA</button>
                                    )}
                                </td>
                                <td>
                                    {!owner.isTwoFactorAuthenticationEnabled && (
                                        <button onClick={() => handleGetQR(owner._id)}>Tạo QR</button>
                                    )}
                                    {owner.isTwoFactorAuthenticationEnabled && (
                                        <button onClick={() => handleCheck2FA(owner.isTwoFactorAuthenticationEnabled, owner._id)}>
                                            QR Mới
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}

export default AdminOwner;
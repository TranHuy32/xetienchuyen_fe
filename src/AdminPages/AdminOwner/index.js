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
    const [gmail, setGmail] = useState("")
    const [selectedId, setSelectedId] = useState("")
    const [selectedGroupId, setSelectedGroupId] = useState("")
    const [isTwoFa, setIsTwoFa] = useState()
    const [showCreateOwner, setShowCreateOwner] = useState(false)
    const [showGroupList, setShowGroupList] = useState(false)
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
        if(formData.name === "" || formData.userName === "" || formData.password === "" || formData.groupId === ""){
            alert("Điền Đầy Đủ Thông Tin")
            return
        }
        if(formData.userName.length !== 10){
            alert("Tên Đăng Nhập Phải Là Số Điện Thoại")
            return
        }
        axios
            .post(`${beURL}/users-auth/registerOwner`, formData,config)
            .then((response) => {
                const data = response.data;
                console.log(data);
                if(data === "UserName Existed!"){
                    alert(data)
                }
                if(data.active === true){
                    alert("Thành Công ")
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
                        console.log(data);
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
    }

    const handleShowAddGmail = (id, twoFA) => {
        setShowAddGmail(true)
        setSelectedId(id)
        setIsTwoFa(twoFA)
    }

    const handleSelectGroup = (id) => {
        setShowGroupList(false)
        setSelectedGroupId(id)
        setFormData({
            ...formData,
            groupId: id,
        })
    }

    return (
        <Fragment>
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
                            <div className={cx("selectTitle")} onClick={() => setShowGroupList(!showGroupList)}>Chọn Group</div>
                            {showGroupList && (
                                <div className={cx("selectGroupDropMenu")}>
                                    {groupList.map((group, index) => (
                                        <div className={cx("selectElement")} key={index} onClick={() => handleSelectGroup(group._id)}>{group.name}</div>
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
                                value={gmail}
                                type="email"
                                onChange={(e) => setGmail(e.target.value)}
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
                                        <button>Bật 2FA</button>
                                    )}
                                    {owner.isTwoFactorAuthenticationEnabled && (
                                        <button>Tắt 2FA</button>
                                    )}
                                </td>
                                <td>
                                    {!owner.isTwoFactorAuthenticationEnabled && (
                                        <button>Tạo QR</button>
                                    )}
                                    {owner.isTwoFactorAuthenticationEnabled && (
                                        <button>
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
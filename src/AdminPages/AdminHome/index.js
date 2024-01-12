import { Fragment } from "react";
import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./AdminHome.scss";
import axios from "axios";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function AdminHome() {
    const [groupList, setGroupList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [newAppFee, setNewAppFee] = useState(100);
    const [changeNameValue, setChangeNameValue] = useState('');
    const [reloadList, setReloadList] = useState(false);
    const [changeNameState, setChangeNameState] = useState("");
    const [showAppfeeSetting, setShowAppfeeSetting] = useState(false)
    const [selectedGroupToSetAppFee, setSelectedGroupToSetAppFee] = useState("")
    const [formGroupData, setFormGroupData] = useState({
        name: "",
    });
    const [formChangeNameData, setFormChangeNameData] = useState({
        name: "",
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
                const data = response?.data;
                if (!!data) {
                    setGroupList(data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [reloadList]);

    const handleCreateNewGroup = () => {
        if (formGroupData.name.length > 0) {
            axios
                .post(`${beURL}/group/create`,
                    formGroupData
                    , config)
                .then((response) => {
                    const data = response?.data;
                    if (!!data && data === "Group Existed!") {
                        alert("Group Này Đã Tồn Tại")
                    } else {
                        alert("Tạo Group Thành Công")
                    }
                    setReloadList(!reloadList)
                    handleClearInput()
                    setFormGroupData({
                        name: ""
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            alert("Nhập Tên Nhóm Muốn Tạo");
        }
    }

    const handleChangeName = (groupId) => {
        setChangeNameState("")
        handleClearChangeName()
        setReloadList(!reloadList)
    }

    const handleGroupNameChange = (e) => {
        setChangeNameValue(e.target.value)
        setFormChangeNameData({
            ...formChangeNameData,
            name: e.target.value,
        })
    };

    const handleClearChangeName = () => {
        setChangeNameValue('');
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setFormGroupData({
            ...formGroupData,
            name: e.target.value,
        })
    };

    const handleClearInput = () => {
        setInputValue('');
    };

    const handleCancel = () => {
        setShowAppfeeSetting(false)
        setSelectedGroupToSetAppFee("")
        setNewAppFee(100)
    }

    const handleSelectGroupToSetAppFee = (option) => {
        setSelectedGroupToSetAppFee(option);
        if (option.appFee !== 0) {
            alert(`Group ${option.name} Đã Có AppFee Là ${option.appFee}. Tiếp Tục Sẽ Làm Thay Đổi AppFee Hiện Tại.`)
        }
    };

    const handleGetAppFee = (name) => {
        const pickedGroup = groupList.find((option) => option.name === name);
        setNewAppFee(pickedGroup.appFee)
    }

    const handleSetNewAppFee = () => {
        if (selectedGroupToSetAppFee === "") {
            alert("Chọn Group Để Cài Đặt AppFee.")
            return
        }
        else if (selectedGroupToSetAppFee.appFee === newAppFee) {
            alert(`Hãy Nhập Giá Trị AppFee Mới!`)
            return
        }
        axios
            .put(`${beURL}/group/update/${selectedGroupToSetAppFee._id}`,
                { appFee: newAppFee }
                , config)
            .then((response) => {
                const data = response.data;
                if (data.appFee) {
                    alert("Cài Đặt AppFee Mới Thành Công.")
                    handleCancel()
                    setReloadList(!reloadList)
                }
            })
            .catch((error) => {
                console.log(error);
            });


    }

    return (
        <Fragment>
            {showAppfeeSetting && (
                <Fragment>
                    <div className={cx("overlay")} onClick={handleCancel}></div>
                    <div className={cx("settingAppFeeContainer")}>
                        <h1>Cài Đặt App Fee</h1>
                        <div className={cx("selectBox")}>
                            <select
                                value={(selectedGroupToSetAppFee !== "") ? selectedGroupToSetAppFee : ''}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    const selectedOption = groupList.find((option) => option.name === selectedValue);
                                    handleSelectGroupToSetAppFee(selectedOption);
                                    handleGetAppFee(selectedValue)
                                }}
                            >
                                <option value="" disabled>
                                    Chọn Group
                                </option>
                                {groupList.map((owner) => (
                                    <option key={owner.value} value={owner.value}>
                                        {owner.name}
                                    </option>
                                ))}
                            </select>
                            {/* <p>Selected option: {selectedGroupToSetAppFee ? selectedGroupToSetAppFee.label : 'None'}</p> */}
                        </div>
                        <div className={cx("inputBox")}>
                            <label for="newFee">AppFee Mới (Phần Trăm %): </label>
                            <input
                                id="newFee"
                                placeholder=" app phí"
                                required
                                type="number"
                                value={newAppFee}
                                onChange={(e) => setNewAppFee(e.target.value)}
                            ></input>
                        </div>
                        <button onClick={() => handleSetNewAppFee()}>Xác Nhận</button>
                    </div>
                </Fragment>
            )}
            <div className={cx("createGroupBox")}>
                <label>Tạo Group Mới: </label>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Nhập tên group"
                ></input>
                <button onClick={() => handleCreateNewGroup()}>
                    Tạo Group
                </button>
                <button onClick={() => setShowAppfeeSetting(true)}>Cài Đặt App Fee</button>
            </div>
            <div className={cx("adListGroup")}>
                <table>
                    <thead>
                        <tr>
                            <th>Tên Group</th>
                            {/* <th>tên owner</th> */}
                            {/* <th>Chưa Biết</th> */}
                            <th>App Phí</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupList.map((group, index) => (
                            <tr key={index}>
                                <td>
                                    {changeNameState !== group._id && (
                                        <Fragment>
                                            {group.name}
                                            {/* <button onClick={() => setChangeNameState(group._id)}>Đổi tên</button> */}
                                        </Fragment>
                                    )}
                                    {changeNameState === group._id && (
                                        <Fragment>
                                            <input
                                                type="text"
                                                value={changeNameValue}
                                                onChange={handleGroupNameChange}
                                                placeholder="Nhập Tên Group Mới"

                                            ></input>
                                            <button onClick={() => handleChangeName(group._id)}>Xác Nhận</button>
                                        </Fragment>
                                    )}
                                </td>
                                {/* <td>decoy </td> */}
                                {/* <td>decoy </td> */}
                                <td>{group.appFee}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}

export default AdminHome;
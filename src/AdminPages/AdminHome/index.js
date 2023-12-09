import { Fragment } from "react";
import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./AdminHome.scss";
import axios from "axios";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function AdminHome() {
    const [currentPage, setCurrentPage] = useState(1);
    const [groupList, setGroupList] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [changeNameValue, setChangeNameValue] = useState('');
    const [reloadList, setReloadList] = useState(false);
    const [changeNameState, setChangeNameState] = useState("");
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
                const data = response.data;
                setGroupList(data);
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentPage, reloadList]);

    const handleCreateNewGroup = () => {
        if (formGroupData.name.length > 0) {
            axios
                .post(`${beURL}/group/create`,
                    formGroupData
                    , config)
                .then((response) => {
                    const data = response.data;
                    if (data === "Group Existed!") {
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
        // console.log(groupId);
        // if (changeNameValue.length > 0) {
        //     axios
        //         .put(`${beURL}/group/update/${groupId}`,
        //             formChangeNameData
        //             , config)
        //         .then((response) => {
        //             const data = response.data;
        //             console.log(data);
        //         })
        //         .catch((error) => {
        //             console.log(error);
        //         });
        // }else{
        //     console.log("chua nhap ten");
        // }

        
        // // setChangeNameState("")
        // // handleClearChangeName()
        // // setReloadList(!reloadList)
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

    return (
        <Fragment>
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
            </div>
            <div className={cx("bảng list group")}>
                <table>
                    <thead>
                        <tr>
                            <th>Tên Group</th>
                            <th>tên owner</th>
                            <th>Chưa Biết</th>
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
                                            <button onClick={() => setChangeNameState(group._id)}>Đổi tên</button>
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
                                <td>decoy </td>
                                <td>decoy </td>
                                <td>{group.appFee}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}

export default AdminHome;
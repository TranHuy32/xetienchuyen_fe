import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import classNames from "classnames";
import styles from "~/AdminPages/AdminLogin/AdminLogin.scss";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

function AdminOwner() {
    const [ownerList, setOwnerList] = useState([]);
    const [reloadList, setReloadList] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);


    const token = localStorage.getItem("token") || [];
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

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
    return (
        <Fragment>
            <div className={cx("adOwnerList")}>
                <table>
                    <thead>
                        <tr>
                            <th>Tên Owner</th>
                            <th>Gmail</th>
                            <th>Xác Thực 2 Lớp(2FA)</th>
                            {/* <th>Chưa Biết</th> */}
                            
                        </tr>
                    </thead>
                    <tbody>
                        {ownerList.map((owner, index) => (
                            <tr key={index}>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}

export default AdminOwner;
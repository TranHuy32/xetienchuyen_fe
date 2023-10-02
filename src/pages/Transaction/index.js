import classNames from "classnames";
import styles from "./Transaction.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import * as moment from "moment";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [group, setGroup] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalPages, setTotalPages] = useState(0);

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const { group_id } = useParams();

  useEffect(() => {
    axios
      .get(`${beURL}/group/detail/${group_id}`, config)
      .then((response) => {
        const data = response.data;
        setGroup(data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        `${beURL}/transaction/all/${group_id}?page=${currentPage}&pageSize=${pageSize}`,
        config
      )
      .then((response) => {
        const data = response.data;
        if (!data || data.length === 0) {
          setTransactions([]);
        } else {
          setTransactions(data.transactions);
          setTotalPages(Math.ceil(data.totalCount / pageSize));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, group_id, currentPage, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const owner = JSON.parse(localStorage.getItem("token_state")) || [];

  if (transactions.length !== 0) {
    return (
      <div className={cx("uWrapper")}>
        <ul className={cx("uMenu")}>
          <li
            onClick={() => {
              navigate(`/users/${owner.groupId}`);
            }}
          >
            Thành viên
          </li>
          <li
            onClick={() => {
              navigate("/createUser");
            }}
          >
            Tạo tài khoản
          </li>
          <li
            onClick={() => {
              navigate("/followProvince");
            }}
          >
            Các tỉnh hay chạy
          </li>
          <li
            className={cx("fActived")}
            onClick={() => {
              navigate(`/transaction/${owner.groupId}`);
            }}
          >
            Giao dịch
          </li>
        </ul>
        <div>
          <h2 className={cx("uGroupName")}>Nhóm {group.name}</h2>
          <div className={cx("uContentBox")}>
            <div className={cx("uTitle")}>
              <p>Danh sách giao dịch :</p>
              {/* <button>Tạo tài khoản</button> */}
            </div>
            <ul className={cx("")}>
              <li className={cx("total-info")}>
                <div className={cx("uInfo")}>
                  {/* <p>id</p> */}
                  <p>Seller</p>
                  <p>Tài xế</p>
                  <p>Số tiền</p>
                  <p>Trạng thái</p>
                  <p>Giữ tiền</p>
                  <p>Đã chuyển</p>
                </div>
                {/* <p className={cx("uEdit")}>Chỉnh sửa</p> */}
              </li>
              {transactions.map((trans, index) => (
                <li key={index} className={cx("")}>
                  <div className={cx("uInfo")}>
                    {/* <p>{trans._id}</p> */}
                    <p>{trans.seller.userName}</p>
                    <p>{trans.driver.userName}</p>
                    <p className={cx("uAmount")}>{trans.amount} k</p>
                    <p>{trans.status}</p>
                    <p>
                      {trans.holdingAt !== null
                        ? moment(trans.holdingAt).format("HH:mm")
                        : ""}
                    </p>
                    <p>
                      {trans.transferredAt !== null
                        ? moment(trans.transferredAt).format("HH:mm")
                        : ""}
                    </p>
                  </div>
                  {/* <p
                    className={cx("uEdit", "uArrow")}
                    onClick={handleClickDetail}
                  >
                    {">"}
                  </p> */}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={cx("uPagination")}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={cx({ active: index + 1 === currentPage })}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return "loading ...";
}

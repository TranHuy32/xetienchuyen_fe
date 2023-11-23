import classNames from "classnames";
import styles from "./Recharge.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import searchIcon from "~/components/Image/search-icon.png";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [group, setGroup] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");

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
        `${beURL}/users/allGroupMembers/${group_id}?page=${currentPage}&pageSize=${pageSize}`,
        config
      )
      .then((response) => {
        const data = response.data;
        setUsers(data.users);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, group_id, currentPage, pageSize]);
  const handleClickDetail = (user_id) => {
    navigate(`/userDetail/${user_id}`);
  };
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    axios
      .get(
        `${beURL}/users/allGroupMembers/${group_id}?page=${currentPage}&pageSize=${pageSize}&search=${searchInput}`,
        config
      )
      .then((response) => {
        const data = response.data;
        console.log(response);

        setUsers(data.users);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (users) {
    return (
      <div className={cx("rWrapper")}>
        <div>
          <h2 className={cx("rGroupName")}></h2>
          <div className={cx("rContentBox")}>
            <div className={cx("rTitle")}>
              <p>Yêu Cầu Nạp Tiền:</p>
              <form onSubmit={handleSearchSubmit}>
                <div className={cx("dSearchBar")}>
                  <p>+84</p>
                  <input
                    placeholder="Nhập Số Điện Thoại..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    type="number"
                  ></input>
                </div>
                <img
                  src={searchIcon}
                  alt="Search"
                  className={cx("searchIcon")}
                  onClick={handleSearchSubmit}
                />
              </form>
            </div>
            <div className={cx("rUsersList")}>
              <div className={cx("rUsersName")}>
                <div className={cx("tableTitle")}>Tài Xế</div>
                {users.map((user, index) => (
                  <div className={cx("tableContent")}>{user.name}</div>
                ))}
              </div>
            
              <div className={cx("rUsersLoginName")}>
                <div className={cx("tableTitle")}>Tên Đăng Nhập</div>
                {users.map((user, index) => (
                  <div className={cx("tableContent")}>{user.userName}</div>
                ))}
              </div>
                <div className={cx("rUsersAmount")}>
                <div className={cx("tableTitle")}>Số Tiền</div>
                {users.map((user, index) => (
                  <div className={cx("tableContent")}>{user.amount}</div>
                ))}
              </div>
              <div className={cx("rUsersDetails")}>
                <div className={cx("tableTitle")}>Thời Gian</div>
                {users.map((user, index) => (
                  <div className={cx("tableContent")}>
                    <a
                      onClick={() => {
                        handleClickDetail(user._id);
                      }}
                    >
                      {"Xem Chi Tiết"}
                    </a>
                  </div>
                ))}
              </div>
              <div className={cx("rUsersActive")}>
                <div className={cx("tableTitle")}>Xác Nhận</div>
                {users.map((user, index) => (
                  <div className={cx("tableContent")}>
                    <p>
                      Xác Nhận
                    </p>
                  </div>
                ))}
              </div>
            </div>
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

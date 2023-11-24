import classNames from "classnames";
import styles from "./Users.scss";
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
  console.log(users);

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
      <div className={cx("uWrapper")}>
        <div>
          <h2 className={cx("uGroupName")}>{group.name}</h2>
          <div className={cx("uContentBox")}>
            <div className={cx("uTitle")}>
              <p>Thành viên trong nhóm:</p>
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
            <div className={cx("uUsersList")}>
              <div className={cx("uUsersName")}>
                <div className={cx("tableTitle")}>Tài Xế</div>
                {users.map((user, index) => (
                  <div className={cx("tableContent")}>{user.name}</div>
                ))}
              </div>
              <div className={cx("uUsersAmount")}>
                <div className={cx("tableTitle")}>Số Dư</div>
                {users.map((user, index) => (
                  <div className={cx("tableContent")}>{user.amount}</div>
                ))}
              </div>
              <div className={cx("uUsersLoginName")}>
                <div className={cx("tableTitle")}>Tên Đăng Nhập</div>
                {users.map((user, index) => (
                  <div className={cx("tableContent")}>{user.userName}</div>
                ))}
              </div>
              <div className={cx("uUsersDetails")}>
                <div className={cx("tableTitle")}>Chi Tiết</div>
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
              <div className={cx("uUsersActive")}>
                <div className={cx("tableTitle")}>Trạng Thái</div>
                {users.map((user, index) => (
                  <div className={cx("tableContent")}>
                    <p>
                      Chưa Kích Hoạt
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

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
  console.log(users);
  if (users) {
    return (
      <div className={cx("uWrapper")}>
        <ul className={cx("uMenu")}>
          <li
            className={cx("fActived")}
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
              <p>Danh sách thành viên trong nhóm:</p>
              <form onSubmit={handleSearchSubmit}>
                <div className={cx("dSearchBar")}>
                  <p>+84</p>
                  <input
                    placeholder="Tìm kiếm..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                  ></input>
                </div>
                <img
                  src={searchIcon}
                  alt="Search"
                  className={cx("searchIcon")}
                  onClick={handleSearchSubmit}
                />
              </form>
              {/* <button>Tạo tài khoản</button> */}
            </div>
            <ul className={cx("")}>
              <li className={cx("total-info")}>
                <div className={cx("uInfo")}>
                  <p>Tên</p>
                  <p>Số dư</p>
                  <p>Tên đăng nhập</p>
                  {/* <p>Loại xe</p>
                  <p>Số lượng ghế</p>
                  <p>Biển số xe</p> */}
                </div>
                <p className={cx("uEdit")}>Chi tiết</p>
              </li>
              {users.map((user, index) => (
                <li key={index} className={cx("")}>
                  <div className={cx("uInfo")}>
                    <p>{user.name}</p>
                    <p className={cx("uAmount")}>{user.amount} k</p>
                    <p>{user.userName}</p>
                    {/* <p>{user.manufacturer}</p>
                    <p>{user.carType}</p>
                    <p>{user.licensePlate}</p> */}
                  </div>
                  <p
                    className={cx("uEdit", "uArrow")}
                    onClick={() => {
                      handleClickDetail(user._id);
                    }}
                  >
                    {">"}
                  </p>
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

import classNames from "classnames";
import styles from "./DetailUser.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import searchIcon from "~/components/Image/search-icon.png";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;
export default function DetailUser() {
  const [user, setUser] = useState();
  const [rides, setRides] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const { user_id } = useParams();
  useEffect(() => {
    axios
      .get(`${beURL}/users/detailByOwner/${user_id}`, config)
      .then((response) => {
        const data = response.data;
        setUser(data);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(
        `${beURL}/ride/historyRideByOwner/${user_id}?page=${currentPage}&pageSize=${pageSize}`,
        config
      )
      .then((response) => {
        const data = response.data;
        setRides(data.rides);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token, user_id, pageSize, currentPage]);
  const handleClickDetail = () => {
    alert("ok");
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
        `${beURL}/ride/historyRideByOwner/${user_id}?page=${currentPage}&pageSize=${pageSize}&search=${searchInput}`,
        config
      )
      .then((response) => {
        const data = response.data;
        setRides(data.rides);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (user) {
    return (
      <div className={cx("dWrapper")}>
        <ul className={cx("dMenu")}>
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
        <div className={cx("dContentWrapper")}>
          <h2 className={cx("dUserName")}>Thành viên {user.name}</h2>
          <div className={cx("dContentBox")}>
            <div className={cx("dTitle")}></div>
            <ul className={cx("")}>
              <li></li>
              <li>
                <p>Tên</p>
                <p>{user.name}</p>
              </li>
              <li>
                <p>Số dư</p>
                <p className={cx("dAmount")}>{user.amount} k</p>
              </li>
              <li>
                <p>Tên đăng nhập</p>
                <p>{user.userName}</p>
              </li>
              <li>
                <p>Loại xe</p>
                <p>{user.name}</p>
              </li>
            </ul>
          </div>
          <div className={cx("dAllRidesWrapper")}>
            <div className={cx("dAllRidesBar")}>
              <h3 className={cx("dAllRidesTittle")}>Các chuyến đã nhận:</h3>
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
            </div>
            <ul className={cx("")}>
              <li className={cx("total-info")}>
                <div className={cx("dRideInfo")}>
                  <p>Khách hàng</p>
                  <p>Giá cước</p>
                  <p>Hoa hồng</p>
                  <p>Trạng thái</p>
                </div>
                <p className={cx("dRideDetail")}>Chi tiết</p>
              </li>
              {rides.map((ride, index) => (
                <li key={index} className={cx("")}>
                  <div className={cx("dRideInfo")}>
                    <p>{"+84" + ride.customerPhone}</p>
                    <p className={cx("dRideAmount")}>{ride.customerPrice} k</p>
                    <p className={cx("dRideAmount")}>
                      {ride.customerPrice - ride.appFee - ride.driverPrice} k
                    </p>
                    <p>
                      {ride.status === "COMPLETED"
                        ? "Đã hoàn thành"
                        : ride.status === "PENDING"
                        ? "Đang liên hệ"
                        : ride.status === "TAKED"
                        ? "Đang chạy"
                        : "Trạng thái khác"}
                    </p>
                  </div>
                  <p
                    className={cx("dRideDetail", "dRideArrow")}
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
          <div className={cx("dPagination")}>
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
      </div>
    );
  }
  return "loading ...";
}

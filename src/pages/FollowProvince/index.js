import classNames from "classnames";
import styles from "./FollowProvince.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function CreateUser() {
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];
  const [provinces, setProvinces] = useState([]);
  const [followrdProvinces, setFollowrdProvinces] = useState([]);
  const [provinceId, setProvinceId] = useState({
    provinceFollowId: "",
  });
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${beURL}/province/all`)
      .then((response) => {
        const data = response.data;
        if (!data || data.length === 0) {
          setProvinces([]);
        } else {
          setProvinces(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${beURL}/group/detail/${owner.groupId}`, config)
      .then((response) => {
        const data = response.data;
        setFollowrdProvinces(data.provinceFollow);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    setProvinceId({ provinceFollowId: selectedOption });
  };
  const submitFollowProvince = (e) => {
    if (!provinceId) {
      alert("Vui lòng chọn tỉnh thành muốn đăng ký");
      return;
    }
    e.preventDefault();
    const isAlreadyFollowed = followrdProvinces.some(
      (province) => province._id === provinceId.provinceFollowId
    );

    if (isAlreadyFollowed) {
      alert("Tỉnh thành này đã được đăng ký");
      return;
    }

    axios
      .put(`${beURL}/group/follow/${owner.groupId}`, provinceId, config)
      .then((response) => {
        console.log(response.data);
        if (
          response.data === "Group Not Existed!" ||
          response.data === "Province Not Existed!"
        ) {
          alert("Lỗi đăng ký");
        } else if (response.data === "Province Already Followed!") {
          alert("Tỉnh thành này đã được đăng ký");
        } else {
          const newProvince = provinces.find(
            (province) => province._id === provinceId.provinceFollowId
          );
          if (newProvince) {
            setFollowrdProvinces([...followrdProvinces, newProvince]);
          }
          alert("Đăng ký thành công");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUnfollowProvince = (province) => {
    const isConfirmed = window.confirm(`Bạn muốn hủy tỉnh ${province.name} ?`);
    if (isConfirmed) {
      console.log(province);
      alert(`Đã hủy tỉnh ${province.name}`);

      // Gửi yêu cầu unfollow đến API
      //   axios
      //     .post(
      //       `${beURL}/users/unFollowTopic`,
      //       { districtId: provinceId },
      //       config
      //     )
      //     .then((response) => {
      //       console.log(response.data);
      //       setFollowrdProvinces((prevProvinces) =>
      //         prevProvinces.filter((province) => province._id !== provinceId)
      //       );
      //       alert(`Đã hủy tỉnh ${provinceId}`);
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //       alert("Lỗi khi hủy tỉnh");
      //     });
    }
  };

  return (
    <div className={cx("fWrapper")}>
      <div className={cx("fContent")}>
        <h2 className={cx("fTitle")}>Các tỉnh hay chạy</h2>
        <div className={cx("fFormSelect")}>
          <select className={cx("fSelect")} onChange={handleSelectChange}>
            <option value="">Chọn tỉnh thành</option>
            {provinces.map((province, index) => (
              <option key={index} value={province._id} className={cx("")}>
                {province.name}
              </option>
            ))}
          </select>
          <button onClick={submitFollowProvince}>Đăng ký</button>
        </div>
        <div className={cx("fProvinceFollowed")}>
          <p>Các tỉnh đã đăng ký:</p>
          <ul>
            {followrdProvinces.map((province, index) => (
              <li
                key={index}
                className={cx("")}
                onClick={() => handleUnfollowProvince(province)}
              >
                {province.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

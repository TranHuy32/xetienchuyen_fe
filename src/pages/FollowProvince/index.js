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
  const [reload, setReload] = useState(true);
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
  }, [reload]);
  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    setProvinceId({ provinceFollowId: selectedOption });
  };
  const submitFollowProvince = (e) => {
    if (provinceId.provinceFollowId === "") {
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

  console.log(followrdProvinces);

  const handleUnfollowProvince = (province) => {
    const isConfirmed = window.confirm(`Bạn muốn hủy tỉnh ${province.name} ?`);
    if (isConfirmed) {
      console.log(province);

      // Gửi yêu cầu unfollow đến API
        axios
          .put(
            `${beURL}/group/unFollow/${owner.groupId}`,
            { provinceUnFollowId: province },
            config
          )
          .then((response) => {
            console.log(response.data);
            setReload(!reload);
            alert(`Đã Huỷ Đăng Kí`);
          })
          .catch((error) => {
            console.log(error);
            alert("Lỗi khi hủy tỉnh");
          });
    }
  };

  return (
    <div className={cx("fWrapper")}>
      <div className={cx("fContent")}>
        <div className={cx("fFormSelect")}>
          <select className={cx("fSelect")} onChange={handleSelectChange}>
            <option value="">Chọn Tỉnh Thành</option>
            {provinces.map((province, index) => (
              <option key={index} value={province._id} className={cx("")}>
                {province.name}
              </option>
            ))}
          </select>
          <button onClick={submitFollowProvince}>Đăng Ký</button>
        </div>
        <div className={cx("fProvinceFollowed")}>
          <p>đã đăng ký :</p>
          <ul>
            {provinces.map((province, index) => (
              <li key={index} className={cx("")}>
                {followrdProvinces.map((provinceFollowed, followedIndex) => {
                  if (province.name === provinceFollowed.name) {
                    return (
                      <div key={followedIndex}>
                        {province.name}
                        <p className={cx("deleteButton")} onClick={() => handleUnfollowProvince(province._id)}>X</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </li>
            ))}

          </ul>
        </div>
      </div>
    </div>
  );
}

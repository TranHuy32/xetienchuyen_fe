import classNames from "classnames";
import styles from "./CreateGroup.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function CreateGroup() {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState({
    name: "",
  });
  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const handleCreateGroup = (e) => {
    e.preventDefault();
    axios
      .post(`${beURL}/group/create`, name, config)
      .then((response) => {
        const data = response?.data
        if (!!data) {
        } else if (data === "Group Existed!") {
          alert("Group đã tồn tại");
        } else {
          alert("Tạo thành công");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={cx("wrapper")}>
      <h2>Create Group</h2>
      <form onSubmit={handleCreateGroup}>
        <input
          required
          className={cx("")}
          placeholder="Tên group"
          type="text"
          onChange={(e) =>
            setName({
              name: e.target.value,
            })
          }
        ></input>
        <button className={cx("")} type="submit">
          Tạo group
        </button>
      </form>
    </div>
  );
}

import classNames from "classnames";
import styles from "./Users.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [group, setGroup] = useState([]);

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
      .get(`${beURL}/group/detail/${group_id}`, config)
      .then((response) => {
        const data = response.data;
        if (!data || data.length === 0) {
          setUsers([]);
        } else {
          setUsers([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  const handleClickDetail = () => {
    alert("ok");
  };

  return (
    <div className={cx("wrapper")}>
      <h2>List Users</h2>
      <div>
        <div>
          <h2>Các người dùng trong group {group.name}</h2>
        </div>
        <div>
          <ul>
            {users.map((user, index) => (
              <li key={index} className={cx("")}>
                <p>{user.name}</p>
                <p onClick={handleClickDetail}>-{">"}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

import classNames from "classnames";
import styles from "./Home.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;

export default function Home() {
  const [groups, setGroups] = useState([]);

  const token = localStorage.getItem("token") || [];
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const navigate = useNavigate();
  const owner = JSON.parse(localStorage.getItem("token_state")) || [];

  useEffect(() => {
    axios
      .get(`${beURL}/group/all`, config)
      .then((response) => {
        const data = response.data;
        if (!data || data.length === 0) {
          setGroups([]);
        } else {
          setGroups(data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  const handleClickDetail = (group) => {
    navigate(`/users/${group._id}`);
  };

  return (
    <div className={cx("wrapper")}>
      <h2>Home</h2>
      <div>
        <div>
          <h2>All group:</h2>
          <button onClick={() => navigate("/createGroup")}>Create Group</button>
        </div>
        <div>
          <ul>
            {groups.map((group, index) => (
              <li key={index} className={cx("")}>
                <p>{group.name}</p>
                <p onClick={() => handleClickDetail(group)}>-{">"}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

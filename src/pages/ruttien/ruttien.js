import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import styles from "./ruttien.scss";
import classNames from "classnames";

const cx = classNames.bind(styles);
const beURL = process.env.REACT_APP_BE_URL;
function RutTien() {
    return (
        <div>Rút Tiền</div>
    );
}

export default RutTien;
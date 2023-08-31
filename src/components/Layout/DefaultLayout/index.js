import "./DefaultLayout.scss";
import Footer from "../Footer/Footer";
import React, { memo } from 'react';

function DefaultLayout({ children }) {
  return (
    <div>
      <h2>DefaultLayout</h2>
    </div>
  );
}

export default memo(DefaultLayout);

/** @format */

import React from "react";
import { formatNumber, unFormatNumber } from "./format";

/*
  API
  * value=4152008333
  * onChange=(value) => // 4152008333
*/

export const PhoneInput = ({ value, onChange }) => {
  const formattedValue = formatNumber(value);
  const handleOnChange = (event) => {
    const rawNumber = unFormatNumber(event.target.value);
    onChange(rawNumber);
  };
  return <input value={formattedValue} onChange={handleOnChange} />;
};

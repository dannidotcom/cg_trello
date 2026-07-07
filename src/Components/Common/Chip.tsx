import React from "react";
import { X } from "react-feather";
import { ILabel } from "../../Interfaces/Trello";
interface ChipProps {
  item: ILabel;
  removeLabel?: (label: ILabel) => void;
}
export default function Chips(props: ChipProps) {
  const { item, removeLabel } = props;
  return (
    <label style={{ backgroundColor: item.color, color: "#fff" }}>
      {item.text}
      {removeLabel && <X onClick={() => removeLabel(item)} />}
    </label>
  );
}

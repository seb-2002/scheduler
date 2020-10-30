// import { action } from "@storybook/addon-actions/dist/preview";
import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  // const [day, setDay] = useState();

  const { days } = props;
  const listItems = days.map((day) => {
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        setDay={props.setDay}
      />
    );
  });

  return <ul>{[...listItems]}</ul>;
}

import React from "react";

import classNames from "classnames";

import "./DayListItem.scss";

export default function DayListItem(props) {
  const { name, spots, selected, setDay } = props;
  const full = spots === 0 && true;

  const className = classNames(
    "day-list__item",
    { "day-list__item--selected": selected },
    { "day-list__item--full": full }
  );

  const formatSpots = (number) => {
    let spotsRemaining = number > 0 ? number : "no";
    spotsRemaining += number === 1 ? " spot" : " spots";
    spotsRemaining += " remaining";
    return spotsRemaining;
  };

  return (
    <li data-testid="day" className={className} onClick={() => setDay(name)}>
      <h2 className="text--regular">{name}</h2>
      <h2 className="text--light">{formatSpots(spots)}</h2>
    </li>
  );
}

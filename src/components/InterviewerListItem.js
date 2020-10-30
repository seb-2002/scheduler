import React, { useState } from "react";
import classNames from "classnames";

import "./InterviewerListItem.scss";

export default function InterviewListItem(props) {
  const { name, avatar, setInterviewer, selected, id } = props;
  const className = classNames("interviewers__item", {
    "interviewers__item--selected": selected,
  });

  return (
    <li className={className} onClick={() => setInterviewer(id)}>
      <img className="interviewers__item-image" src={avatar} alt={name} />
      {selected && name}
    </li>
  );
}

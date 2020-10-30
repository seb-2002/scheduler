import React from "react";

import InterviewerListItem from "./InterviewerListItem";
import "./InterviewerList.scss";

export default function InterviewerList(props) {
  const { interviewers, interviewer, setInterviewer } = props;

  const interviewerListItems = interviewers.map((childProps) => {
    const { name, id, avatar } = childProps;
    return (
      <InterviewerListItem
        name={name}
        key={id}
        id={id}
        avatar={avatar}
        selected={interviewer === id && true}
        setInterviewer={setInterviewer}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerListItems}</ul>
    </section>
  );
}

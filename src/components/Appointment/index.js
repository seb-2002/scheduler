import React from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import useVisualMode from "../../hooks/useVisualMode";

import "./styles.scss";

export default function Appointment(props) {
  const {
    time,
    interview,
    interviewers,
    bookInterview,
    cancelInterview,
    id,
  } = props;
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVE = "SAVE";
  const DELETE = "DELETE";
  const CONFIRM = "CONFIRM";
  const CONFIRM_DELETE = "CONFIRM_DELETE";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    transition(SAVE, true);

    if (interviewer && name) {
      const interview = {
        student: name,
        interviewer,
      };

      bookInterview(id, interview)
        .then((res) => transition(SHOW))
        .catch((err) => {
          transition(ERROR_SAVE, true);
          console.log(err);
        });
    } else {
      setTimeout(() => {
        transition(CREATE);
      }, 1000);
    }
  }

  function del(id) {
    transition(DELETE, true);

    cancelInterview(id, null)
      .then((res) => transition(EMPTY))
      .catch((err) => {
        transition(ERROR_DELETE, true);
        console.log(err);
      });
  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onDelete={() => transition(CONFIRM_DELETE)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVE && <Status message="Saving" />}
      {mode === DELETE && <Status message="Deleting" />}
      {mode === ERROR_SAVE && <Error message="Could not save" onClose={back} />}
      {mode === ERROR_DELETE && (
        <Error message="Could not delete" onClose={back} />
      )}
      {mode === CONFIRM && (
        <Confirm
          onCancel={back}
          onConfirm={() => del(id)}
          message="Are you sure you want to cancel?"
        />
      )}
      {mode === CONFIRM_DELETE && (
        <Confirm
          onCancel={back}
          onConfirm={() => del(id)}
          message="Are you sure you want to delete?"
        />
      )}
      {mode === CREATE && (
        <Form
          create
          interviewers={interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form
          edit
          name={interview.student}
          interviewer={interview.interviewer.id}
          interviewers={interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
    </article>
  );
}

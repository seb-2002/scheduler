import React, { useState } from "react";
import classNames from "classnames";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  const { interviewers, onSave, onCancel, create, edit } = props;

  const className = classNames(
    "appointment__card",
    {
      "appointment__card--create": create || edit,
    }
    // { "appointment__card--show": edit }
  );

  const reset = () => {
    setName("");
    setInterviewer(null);
    return;
  };

  const cancel = () => {
    reset();
    onCancel();
  };

  function validate(name, interviewer) {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    setError("");
    onSave(name, interviewer);
  }

  return (
    <main className={className}>
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList
          interviewers={interviewers}
          interviewer={interviewer}
          setInterviewer={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button confirm onClick={() => validate(name, interviewer)}>
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}

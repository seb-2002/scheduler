import React from "react";

import useApplicationData from "../hooks/useApplicationData";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay,
  getInterviewersForDay,
} from "../helpers/selectors";

import "components/Application.scss";

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  } = useApplicationData();

  // each time the application is rendered, it will fetch
  // the appointments and interviewers for state.day (the selected day,
  // Monday by default)
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  // in the props passed the Appointment component, bookInterview and
  // cancelInterview are coming from the useApplicationData hook
  return (
    <main className="layout">
      <section className="sidebar">
        <DayList days={state.days} day={state.day} setDay={setDay} />
      </section>
      <section className="schedule">
        {dailyAppointments.length &&
          dailyAppointments.map((appointment) => {
            return (
              <Appointment
                interviewers={dailyInterviewers}
                bookInterview={bookInterview}
                cancelInterview={cancelInterview}
                key={appointment.id}
                {...appointment}
              />
            );
          })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

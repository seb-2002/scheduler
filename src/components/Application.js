import React, { useState, useEffect } from "react";
import axios from "axios";

import useApplicationData from "../hooks/useApplicationData";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay,
  getInterviewersForDay,
} from "../helpers/selectors";

import "components/Application.scss";

// const appointments = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       },
//     },
//   },
// ];

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day: day });
  // const setDays = (days) => setState((prev) => ({ ...prev, days: [...days] }));
  // const setAppointments = (appointments) =>
  //   setState((prev) => ({ ...prev, appointments: { ...appointments } }));
  // const setInterviewers = (interviewers) =>
  //   setState((prev) => ({ ...prev, interviewers: { ...interviewers } }));

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ])
      .then((all) => {
        setState((state) => ({
          ...state,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }));
      })
      .catch((err) => console.log(err));
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const newState = {
      ...state,
      appointments,
    };

    const putData = axios.put(`http://localhost:8001/api/appointments/${id}`, {
      interview,
    });

    putData.then((res) => {
      setState(newState);
    });

    return putData;
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    const newState = {
      ...state,
      appointments,
    };

    const deleteData = axios.delete(
      `http://localhost:8001/api/appointments/${id}`,
      {
        interview,
      }
    );

    deleteData.then((res) => {
      setState(newState);
    });

    return deleteData;
  }

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

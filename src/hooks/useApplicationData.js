import { useState, useEffect } from "react";
import axios from "axios";

import { getAppointmentById } from "../helpers/selectors";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day: day });

  // formatting an appointments object with which to
  // update the state, given the appointment id and the interview
  // object
  // helper function for book / delete
  const updateAppointment = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return appointments;
  };

  // updateDays increments or decrements the value of
  // days[thisDay].spots
  // it gets thisDay based on an appointment id
  // helper function to book / delete
  const updateDays = (appointmentId, increment) => {
    const thisDay = state.days.find((dayEntry) =>
      dayEntry.appointments.includes(appointmentId)
    );

    const updatedDay = {
      ...thisDay,
      spots: thisDay.spots + increment,
    };

    const updatedDays = state.days.map((day) => {
      if (day.id === updatedDay.id) {
        return updatedDay;
      } else {
        return day;
      }
    });

    return updatedDays;
  };

  // is called when an interview is booked
  // or edited
  function bookInterview(id, interview) {
    let newState = {};
    // getAppointmentById comes from helpers/selectors
    const thisAppointment = getAppointmentById(state, id);

    // checking whether this is a new booking or an edit
    if (thisAppointment && thisAppointment.interview) {
      newState = {
        ...state,
        appointments: updateAppointment(id, interview),
      };
    } else if (thisAppointment) {
      // if this is a new booking, adjust days[today].spots
      newState = {
        ...state,
        appointments: updateAppointment(id, interview),
        days: updateDays(id, -1),
      };
    } else return;

    const putData = axios.put(`http://localhost:8001/api/appointments/${id}`, {
      interview,
    });

    putData.then((res) => {
      setState(newState);
    });

    return putData;
  }

  // called when an interview is deleted
  function cancelInterview(id, interview = null) {
    // formats a new state object with
    // interview set to null for this
    // appointment and increment the spots for that day
    const newState = {
      ...state,
      appointments: updateAppointment(id, interview),
      days: updateDays(id, 1),
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

  return { state, setDay, bookInterview, cancelInterview };
}

import { useState, useEffect } from "react";
import axios from "axios";

import { countInterviews } from "../helpers/selectors";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day: day });

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

  function bookInterview(id, interview) {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview,
    // };

    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment,
    // };

    const newState = {
      ...state,
      appointments: updateAppointment(id, interview),
      days: updateDays(id, -1),
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

  const remainingSpots = countInterviews(state, state.day);
  console.log(remainingSpots);

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

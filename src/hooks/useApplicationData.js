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

    const thisDay = state.days.find((dayEntry) =>
      dayEntry.appointments.includes(id)
    );

    const updatedDay = {
      ...thisDay,
      spots: thisDay.spots - 1,
    };

    const updatedDays = state.days.map((day) => {
      if (day.id === updatedDay.id) {
        return updatedDay;
      } else {
        return day;
      }
    });

    const newState = {
      ...state,
      appointments,
      days: updatedDays,
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

  function updateSpots(number, dayId) {
    const day = {
      ...state.days[dayId],
      spots: number,
    };

    const days = {
      ...state.days,
      [dayId]: day,
    };

    const newState = {
      ...state,
      days,
    };

    //axios request??

    setState(newState);
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

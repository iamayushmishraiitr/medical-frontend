import React, { useState, useEffect } from "react";
import {
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { toast } from "react-hot-toast";
import { api } from "../services/api";
import "./DoctorDashboard.css";

const DoctorDashboard = ({ user, onLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("today");
  const [appointments, setAppointments] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);


  const getCurrentIST = () => {
    const now = new Date();
    return new Date(now.getTime() + (5 * 60 + 30) * 60000); 
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoadingAppointments(true);
      try {
        const appointmentsData = await api.getAppointments();
        const formattedAppointments = appointmentsData?.appointments?.map(
          (apt) => {
            const appointmentDateTime = new Date(
              `${apt.date.slice(0, 10)}T${apt.time}`
            );
            const nowIST = getCurrentIST();

            let finalStatus = apt.status;
            if (appointmentDateTime < nowIST) {
              finalStatus = "completed";
            }

            return {
              ...apt,
              date: apt.date.slice(0, 10),
              patientName: apt.patient.name,
              patientImage:
                apt.patient.profileImage ||
                `https://via.placeholder.com/40x40/0d6efd/ffffff?text=${apt.patient.name[0]}`,
              id: apt._id,
              status: finalStatus,
            };
          }
        );
        setAppointments(formattedAppointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error(error.message || "Failed to fetch appointments");
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, []);

  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments.filter((apt) => apt.date === dateStr);
  };

  const handleDateSelect = (date) => setSelectedDate(date);

  const handleMarkUnavailable = () => {
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    setUnavailableDates((prev) =>
      prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
    );
  };

  const isDateUnavailable = (date) =>
    unavailableDates.includes(format(date, "yyyy-MM-dd"));

  const handleAccept = async (id) => {
    try {
      await api.updateAppointmentStatus(id, "confirmed");
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === id ? { ...apt, status: "confirmed" } : apt
        )
      );
      toast.success("Appointment confirmed");
    } catch (error) {
      console.error("Error accepting appointment:", error);
      toast.error(error.message || "Failed to confirm appointment");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteAppointment(id);
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
      toast.success("Appointment deleted");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(error.message || "Failed to delete appointment");
    }
  };

  const getStatusColor = (status) => {
    if (status === "confirmed") return "#198754";
    if (status === "completed") return "#6c757d"; 
    return "#ffc107";
  };

  const getStatusText = (status) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  const filteredAppointments =
    activeTab === "today"
      ? getAppointmentsForDate(selectedDate)
      : appointments.filter((apt) => new Date(apt.date) < new Date());

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">MediCare</h1>
          <span className="portal-badge">Doctor Portal</span>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, {user.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="sidebar">
            <div className="calendar-section">
              <div className="section-header">
                <Calendar size={20} />
                <h3>Calendar</h3>
              </div>
              <p className="section-description">
                Select a date to view appointments.
              </p>
              <div className="calendar">
                <div className="calendar-header">
                  <button
                    className="calendar-nav-btn"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <h4>{format(currentDate, "MMMM yyyy")}</h4>
                  <button
                    className="calendar-nav-btn"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="calendar-weekdays">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="weekday">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="calendar-days">
                  {getDaysInMonth(currentDate).map((date, i) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isCurrentMonth = isSameMonth(date, currentDate);
                    const isUnavailable = isDateUnavailable(date);
                    const hasAppointments =
                      getAppointmentsForDate(date).length > 0;
                    return (
                      <button
                        key={i}
                        className={`calendar-day ${
                          isSelected ? "selected" : ""
                        } ${!isCurrentMonth ? "other-month" : ""} ${
                          isUnavailable ? "unavailable" : ""
                        } ${hasAppointments ? "has-appointments" : ""}`}
                        onClick={() => handleDateSelect(date)}
                        disabled={!isCurrentMonth}
                      >
                        {format(date, "d")}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="availability-section">
              <div className="section-header">
                <Settings size={20} />
                <h3>Availability Settings</h3>
              </div>
              <p className="section-description">Manage your availability.</p>
              <div className="selected-date-info">
                Selected Date: {format(selectedDate, "EEE MMM d yyyy")}
              </div>
              <button
                className={`availability-btn ${
                  isDateUnavailable(selectedDate) ? "available" : "unavailable"
                }`}
                onClick={handleMarkUnavailable}
              >
                {isDateUnavailable(selectedDate)
                  ? "Mark as Available"
                  : "Mark as Unavailable"}
              </button>
            </div>
          </div>
          <div className="content-area">
            <div className="appointment-tabs">
              <button
                className= "tab-btn active"
                onClick={() => setActiveTab("today")}
              >
                Appointments
              </button>
            </div>
            <div className="appointments-section">
              <div className="appointments-header">
                <h3>
                  Appointments for {format(selectedDate, "EEE MMM d yyyy")}
                </h3>
                <p>{filteredAppointments.length} appointments scheduled</p>
              </div>
              <div className="appointments-list">
                {loadingAppointments ? (
                  <p>Loading appointments...</p>
                ) : filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt) => (
                    <div key={apt.id} className="appointment-card">
                      <div className="appointment-header">
                      <User size={14} className="patient-avatar" />
                        <div className="patient-info">
                          <h4 className="patient-name">{apt.patientName}</h4>
                          <p className="patient-details">
                            {apt.type ? `Type: ${apt.type}` : ""}
                          </p>
                        </div>
                        <div className="appointment-time">{apt.time}</div>
                      </div>
                      <div className="appointment-footer">
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(apt.status),
                          }}
                        >
                          {getStatusText(apt.status)}
                        </span>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            className="accept-btn"
                            onClick={() => handleAccept(apt.id)}
                            disabled={
                              apt.status === "confirmed" ||
                              apt.status === "completed"
                            }
                          >
                            {apt.status === "confirmed"
                              ? "Accepted"
                              : apt.status === "completed"
                              ? "Completed"
                              : "Accept"}
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(apt.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-appointments">
                    <p>No appointments for this date.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;

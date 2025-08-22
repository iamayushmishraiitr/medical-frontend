import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  MapPin,
  Clock,
  LogOut,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-hot-toast";
import AppointmentModal from "./AppointmentModal";
import { api } from "../services/api";
import "./PatientDashboard.css";

const PatientDashboard = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showHistory, setShowHistory] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const specializations = [
    "All",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "Oncology",
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1200);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setShowHistory(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const doctorsResponse = await api.getDoctors();
        if (doctorsResponse.doctors) {
          setDoctors(doctorsResponse.doctors);
          setFilteredDoctors(doctorsResponse.doctors);
        }

        const appointmentsResponse = await api.getAppointments();
        if (appointmentsResponse.appointments) {
          setAppointmentHistory(appointmentsResponse.appointments);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = doctors;
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialization !== "All") {
      filtered = filtered.filter(
        (doctor) => doctor.specialization === selectedSpecialization
      );
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialization, doctors]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleScheduleAppointment = async (appointmentData) => {
    try {
      const response = await api.createAppointment({
        doctorId: selectedDoctor._id,
        date: appointmentData.date,
        time: appointmentData.time,
        symptoms: appointmentData.symptoms,
        notes: appointmentData.notes,
      });

      if (response.appointment) {
        toast.success(
          `Appointment scheduled successfully with ${selectedDoctor.name} on ${appointmentData.date} at ${appointmentData.time}`
        );
        const appointmentsResponse = await api.getAppointments();
        if (appointmentsResponse.appointments) {
          setAppointmentHistory(appointmentsResponse.appointments);
        }

        setIsModalOpen(false);
        setSelectedDoctor(null);
      } else {
        toast.error(response.message || "Failed to schedule appointment");
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error("Failed to schedule appointment. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={14} className="status-icon confirmed" />;
      case "pending":
        return <ClockIcon size={14} className="status-icon pendin" />;
      case "cancelled":
        return <XCircle size={14} className="status-icon cancelled" />;
      default:
        return <ClockIcon size={14} className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "confirmed";
      case "pending":
        return "pending";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  if (isLoading) {
    return (
      <div className="patient-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  const randomRating = (Math.random() * (4.6 - 4.1) + 4.1).toFixed(1);
  return (
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">MediCare</h1>
          <span className="portal-badge">Patient Portal</span>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, {user.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-layout">
          <div className="main-content">
            <div className="container">
              <h2 className="page-title">Find Your Doctor</h2>
              <div className="search-section">
                <div className="search-bar">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by doctor name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              <div className="specialization-filters">
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    className={`filter-btn ${
                      selectedSpecialization === spec ? "active" : ""
                    }`}
                    onClick={() => setSelectedSpecialization(spec)}
                  >
                    {spec}
                  </button>
                ))}
              </div>
              <div className="doctors-grid">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor._id} className="doctor-card">
                    <div className="doctor-header">
                      <div className="doctor-avatar">
                        <img
                          src="https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
                          alt={`Avatar of Dr. ${doctor.name}`}
                        />
                      </div>
                      <div className="doctor-info">
                        <h3 className="doctor-name">Dr. {doctor.name}</h3>
                        <p className="doctor-specialization">
                          {doctor.specialization}
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        marginBottom: "10px",
                        gap: "10px",
                      }}
                    >
                      <Star size={18} className="star-icon" />
                      <h5>{randomRating}</h5>
                    </div>
                    <div className="doctor-location">
                      <MapPin size={16} className="location-icon" />
                      <span>{doctor.address || "Location not specified"}</span>
                    </div>

                    <div className="doctor-footer">
                      <button
                        className="book-btn"
                        onClick={() => handleBookAppointment(doctor)}
                      >
                        <Clock size={16} />
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDoctors.length === 0 && (
                <div className="no-results">
                  <p>No doctors found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
          <div className="history-sidebar">
            <div className="history-header">
              <h3 className="history-title">
                <Calendar size={18} />
                Recent Appointments
              </h3>
              {isMobile && (
                <button
                  className="mobile-toggle-btn"
                  onClick={toggleHistory}
                  aria-label={
                    showHistory ? "Hide appointments" : "Show appointments"
                  }
                >
                  {showHistory ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              )}
            </div>

            {showHistory && (
              <div className="history-content">
                <div className="history-stats">
                  <div className="stat-item">
                    <span className="stat-number">
                      {
                        appointmentHistory.filter(
                          (apt) => apt.status === "confirmed"
                        ).length
                      }
                    </span>
                    <span className="stat-label">Confirmed</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">
                      {
                        appointmentHistory.filter(
                          (apt) => apt.status === "pending"
                        ).length
                      }
                    </span>
                    <span className="stat-label">Pending</span>
                  </div>
                </div>

                <div className="appointments-list">
                  {appointmentHistory.slice(0, 5).map((appointment) => (
                    <div key={appointment._id} className="appointment-item">
                      <div className="appointment-header">
                        <div className="appointment-doctor">
                          <User size={14} className="doctor-icon" />
                          <div className="doctor-details">
                            <h4 className="doctor-name">
                              {appointment.doctor?.name || "Unknown Doctor"}
                            </h4>
                            <p className="specialization">
                              {appointment.doctor?.specialization || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="appointment-status">
                          {getStatusIcon(appointment.status)}
                          <span className={`status-text ${appointment.status}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                      </div>

                      <div className="appointment-details">
                        <div className="detail-row">
                          <Calendar size={12} className="detail-icon" />
                          <span className="detail-text">
                            {formatDate(appointment.date)} at {appointment.time}
                          </span>
                        </div>
                        {appointment.symptoms && (
                          <div className="detail-row">
                            <span className="detail-icon">🏥</span>
                            <span className="detail-text notes">
                              {appointment.symptoms}
                            </span>
                          </div>
                        )}
                        {appointment.notes && (
                          <div className="detail-row">
                            <span className="detail-icon">📝</span>
                            <span className="detail-text notes">
                              {appointment.notes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {appointmentHistory.length === 0 && (
                  <div className="no-appointments">
                    <p>No appointments found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={
          selectedDoctor
            ? {
                doctorName: selectedDoctor.name,
                specialization: selectedDoctor.specialization,
                location: selectedDoctor.address || "Location not specified",
              }
            : null
        }
        onSchedule={handleScheduleAppointment}
        isPatient={true}
      />
    </div>
  );
};

export default PatientDashboard;

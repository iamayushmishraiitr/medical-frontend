import React, { useState, useEffect } from 'react';
import { Calendar, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { toast } from 'react-hot-toast';
import AppointmentModal from './AppointmentModal';
import './DoctorDashboard.css';

const DoctorDashboard = ({ user, onLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('today');
  const [appointments, setAppointments] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock appointments data
  useEffect(() => {
    const mockAppointments = [
      {
        id: 1,
        patientName: 'John Doe',
        age: 35,
        type: 'Consultation',
        time: '09:00 AM',
        status: 'confirmed',
        date: '2025-08-18',
        patientImage: 'https://via.placeholder.com/40x40/20c997/ffffff?text=JD'
      },
      {
        id: 2,
        patientName: 'Jane Smith',
        age: 28,
        type: 'Follow-up',
        time: '10:30 AM',
        status: 'confirmed',
        date: '2025-08-18',
        patientImage: 'https://via.placeholder.com/40x40/0d6efd/ffffff?text=JS'
      },
      {
        id: 3,
        patientName: 'Mike Johnson',
        age: 42,
        type: 'Check-up',
        time: '02:00 PM',
        status: 'pending',
        date: '2025-08-18',
        patientImage: 'https://via.placeholder.com/40x40/198754/ffffff?text=MJ'
      },
      {
        id: 4,
        patientName: 'Sarah Wilson',
        age: 31,
        type: 'Consultation',
        time: '11:00 AM',
        status: 'confirmed',
        date: '2025-08-19',
        patientImage: 'https://via.placeholder.com/40x40/dc3545/ffffff?text=SW'
      },
      {
        id: 5,
        patientName: 'David Brown',
        age: 45,
        type: 'Follow-up',
        time: '03:30 PM',
        status: 'confirmed',
        date: '2025-08-19',
        patientImage: 'https://via.placeholder.com/40x40/fd7e14/ffffff?text=DB'
      }
    ];
    setAppointments(mockAppointments);
  }, []);

  const getDaysInMonth = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dateStr);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleMarkUnavailable = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    if (unavailableDates.includes(dateStr)) {
      setUnavailableDates(unavailableDates.filter(d => d !== dateStr));
    } else {
      setUnavailableDates([...unavailableDates, dateStr]);
    }
  };

  const isDateUnavailable = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return unavailableDates.includes(dateStr);
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleScheduleAppointment = (appointmentData) => {
    // Here you would typically update the appointment in your backend
    console.log('Updating appointment:', {
      appointmentId: appointmentData.appointmentId,
      ...appointmentData
    });
    
    // Show success message
    toast.success(`Appointment updated successfully for ${selectedAppointment.patientName} on ${appointmentData.date} at ${appointmentData.time}`);
  };

  const getStatusColor = (status) => {
    return status === 'confirmed' ? '#198754' : '#ffc107';
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredAppointments = activeTab === 'today' 
    ? getAppointmentsForDate(selectedDate)
    : appointments.filter(apt => new Date(apt.date) < new Date());

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">MediCare</h1>
          <span className="portal-badge">Doctor Portal</span>
        </div>
        <div className="header-right">
          <span className="welcome-text">Welcome, {user.name}</span>
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Left Sidebar */}
          <div className="sidebar">
            {/* Calendar Section */}
            <div className="calendar-section">
              <div className="section-header">
                <Calendar size={20} />
                <h3>Calendar</h3>
              </div>
              <p className="section-description">Select a date to view appointments.</p>
              
              <div className="calendar">
                <div className="calendar-header">
                  <button 
                    className="calendar-nav-btn"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <h4>{format(currentDate, 'MMMM yyyy')}</h4>
                  <button 
                    className="calendar-nav-btn"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="calendar-weekdays">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="weekday">{day}</div>
                  ))}
                </div>
                
                <div className="calendar-days">
                  {getDaysInMonth(currentDate).map((date, index) => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isCurrentMonth = isSameMonth(date, currentDate);
                    const isUnavailable = isDateUnavailable(date);
                    const hasAppointments = getAppointmentsForDate(date).length > 0;
                    
                    return (
                      <button
                        key={index}
                        className={`calendar-day ${isSelected ? 'selected' : ''} ${!isCurrentMonth ? 'other-month' : ''} ${isUnavailable ? 'unavailable' : ''} ${hasAppointments ? 'has-appointments' : ''}`}
                        onClick={() => handleDateSelect(date)}
                        disabled={!isCurrentMonth}
                      >
                        {format(date, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Availability Settings */}
            <div className="availability-section">
              <div className="section-header">
                <Settings size={20} />
                <h3>Availability Settings</h3>
              </div>
              <p className="section-description">Manage your availability.</p>
              
              <div className="selected-date-info">
                Selected Date: {format(selectedDate, 'EEE MMM d yyyy')}
              </div>
              
              <button 
                className={`availability-btn ${isDateUnavailable(selectedDate) ? 'available' : 'unavailable'}`}
                onClick={handleMarkUnavailable}
              >
                {isDateUnavailable(selectedDate) ? 'Mark as Available' : 'Mark as Unavailable'}
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="content-area">
            {/* Tabs */}
            <div className="appointment-tabs">
              <button
                className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
                onClick={() => setActiveTab('today')}
              >
                Today's Appointments
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Appointment History
              </button>
            </div>

            {/* Appointments List */}
            <div className="appointments-section">
              <div className="appointments-header">
                <h3>Appointments for {format(selectedDate, 'EEE MMM d yyyy')}</h3>
                <p>{filteredAppointments.length} appointments scheduled</p>
              </div>

              <div className="appointments-list">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map(appointment => (
                    <div key={appointment.id} className="appointment-card">
                      <div className="appointment-header">
                        <img 
                          src={appointment.patientImage} 
                          alt={appointment.patientName} 
                          className="patient-avatar" 
                        />
                        <div className="patient-info">
                          <h4 className="patient-name">{appointment.patientName}</h4>
                          <p className="patient-details">
                            Age: {appointment.age} · {appointment.type}
                          </p>
                        </div>
                        <div className="appointment-time">
                          {appointment.time}
                        </div>
                      </div>
                      
                      <div className="appointment-footer">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(appointment.status) }}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                        <button 
                          className="view-details-btn"
                          onClick={() => handleViewDetails(appointment)}
                        >
                          View Details
                        </button>
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

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        onSchedule={handleScheduleAppointment}
        isPatient={false}
      />
    </div>
  );
};

export default DoctorDashboard;

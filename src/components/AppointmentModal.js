import React, { useState } from 'react';
import { X, Calendar, Clock, User, MapPin } from 'lucide-react';
import './AppointmentModal.css';

const AppointmentModal = ({ isOpen, onClose, appointment, onSchedule, isPatient = false }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  // Set initial values if editing an existing appointment
  React.useEffect(() => {
    if (appointment && !isPatient) {
      // For doctor viewing existing appointments, show current appointment details
      setSelectedDate(appointment.date || '');
      setSelectedTime(appointment.time || '');
    }
  }, [appointment, isPatient]);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      onSchedule({
        date: selectedDate,
        time: selectedTime,
        notes: notes.trim(),
        appointmentId: appointment?.id
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isPatient ? 'Schedule Appointment' : 'View/Edit Appointment'}</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Appointment Details */}
          {appointment && (
            <div className="appointment-details">
              <h3>{isPatient ? 'Doctor Details' : 'Appointment Details'}</h3>
              {isPatient ? (
                <>
                  <div className="detail-item">
                    <User size={16} />
                    <span><strong>Doctor:</strong> {appointment.doctorName}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span><strong>Specialization:</strong> {appointment.specialization}</span>
                  </div>
                  <div className="detail-item">
                    <span><strong>Location:</strong> {appointment.location}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-item">
                    <User size={16} />
                    <span><strong>Patient:</strong> {appointment.patientName}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span><strong>Type:</strong> {appointment.type}</span>
                  </div>
                  {appointment.age && (
                    <div className="detail-item">
                      <span><strong>Age:</strong> {appointment.age}</span>
                    </div>
                  )}
                  {appointment.status && (
                    <div className="detail-item">
                      <span><strong>Status:</strong> 
                        <span className={`status-indicator ${appointment.status}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Scheduling Form */}
          <form onSubmit={handleSubmit} className="scheduling-form">
            <div className="form-group">
              <label htmlFor="appointment-date">
                <Calendar size={16} />
                Appointment Date
              </label>
              <input
                type="date"
                id="appointment-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointment-time">
                <Clock size={16} />
                Preferred Time
              </label>
              <select
                id="appointment-time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="appointment-notes">Additional Notes (Optional)</label>
              <textarea
                id="appointment-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or notes for the appointment..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {isPatient ? 'Schedule Appointment' : 'Update Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;

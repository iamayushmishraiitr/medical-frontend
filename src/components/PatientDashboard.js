import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Clock, LogOut, Calendar, User, CheckCircle, XCircle, Clock as ClockIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppointmentModal from './AppointmentModal';
import './PatientDashboard.css';

const PatientDashboard = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const specializations = ['All', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'Oncology'];

  // Mock appointment history data
  const [appointmentHistory, setAppointmentHistory] = useState([
    {
      id: 1,
      doctorName: 'Dr. Sarah Smith',
      specialization: 'Cardiology',
      date: '2024-01-10',
      time: '10:00 AM',
      status: 'completed',
      location: 'New York Medical Center',
      notes: 'Regular checkup, blood pressure normal'
    },
    {
      id: 2,
      doctorName: 'Dr. Michael Johnson',
      specialization: 'Dermatology',
      date: '2024-01-05',
      time: '2:30 PM',
      status: 'completed',
      location: 'Downtown Clinic',
      notes: 'Skin rash treatment, prescribed medication'
    },
    {
      id: 3,
      doctorName: 'Dr. Emily Davis',
      specialization: 'Pediatrics',
      date: '2024-01-15',
      time: '11:00 AM',
      status: 'upcoming',
      location: 'Children\'s Hospital',
      notes: 'Annual physical examination'
    },
    {
      id: 4,
      doctorName: 'Dr. Robert Wilson',
      specialization: 'Orthopedics',
      date: '2024-01-08',
      time: '9:00 AM',
      status: 'cancelled',
      location: 'Sports Medicine Center',
      notes: 'Knee pain consultation'
    }
  ]);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1200);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set initial state based on screen size
  useEffect(() => {
    setShowHistory(!isMobile);
  }, [isMobile]);

  // Mock doctor data
  useEffect(() => {
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Sarah Smith',
        specialization: 'Cardiology',
        rating: 4.8,
        experience: 15,
        location: 'New York Medical Center',
        nextAvailable: '2024-01-15',
        price: 150,
        image: 'https://via.placeholder.com/60x60/20c997/ffffff?text=SS'
      },
      {
        id: 2,
        name: 'Dr. Michael Johnson',
        specialization: 'Dermatology',
        rating: 4.9,
        experience: 12,
        location: 'Downtown Clinic',
        nextAvailable: '2024-01-16',
        price: 120,
        image: 'https://via.placeholder.com/60x60/0d6efd/ffffff?text=MJ'
      },
      {
        id: 3,
        name: 'Dr. Emily Davis',
        specialization: 'Pediatrics',
        rating: 4.7,
        experience: 10,
        location: 'Children\'s Hospital',
        nextAvailable: '2024-01-17',
        price: 100,
        image: 'https://via.placeholder.com/60x60/198754/ffffff?text=ED'
      },
      {
        id: 4,
        name: 'Dr. Robert Wilson',
        specialization: 'Orthopedics',
        rating: 4.6,
        experience: 18,
        location: 'Sports Medicine Center',
        nextAvailable: '2024-01-18',
        price: 180,
        image: 'https://via.placeholder.com/60x60/6c757d/ffffff?text=RW'
      },
      {
        id: 5,
        name: 'Dr. Lisa Chen',
        specialization: 'Neurology',
        rating: 4.9,
        experience: 20,
        location: 'Neurological Institute',
        nextAvailable: '2024-01-19',
        price: 200,
        image: 'https://via.placeholder.com/60x60/dc3545/ffffff?text=LC'
      },
      {
        id: 6,
        name: 'Dr. James Brown',
        specialization: 'Oncology',
        rating: 4.8,
        experience: 16,
        location: 'Cancer Treatment Center',
        nextAvailable: '2024-01-20',
        price: 250,
        image: 'https://via.placeholder.com/60x60/fd7e14/ffffff?text=JB'
      }
    ];
    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  useEffect(() => {
    let filtered = doctors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization
    if (selectedSpecialization !== 'All') {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialization);
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialization, doctors]);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleScheduleAppointment = (appointmentData) => {
    // Here you would typically send the appointment data to your backend
    console.log('Scheduling appointment:', {
      doctor: selectedDoctor.name,
      ...appointmentData
    });
    
    // Show success message
    toast.success(`Appointment scheduled successfully with ${selectedDoctor.name} on ${appointmentData.date} at ${appointmentData.time}`);
    
    // Close modal
    setIsModalOpen(false);
    
    // Reset selected doctor
    setSelectedDoctor(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={14} className="status-icon completed" />;
      case 'upcoming':
        return <ClockIcon size={14} className="status-icon upcoming" />;
      case 'cancelled':
        return <XCircle size={14} className="status-icon cancelled" />;
      default:
        return <ClockIcon size={14} className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'upcoming':
        return 'Upcoming';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="patient-dashboard">
      {/* Header */}
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

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-layout">
          {/* Left Column - Main Content */}
          <div className="main-content">
            <div className="container">
              <h2 className="page-title">Find Your Doctor</h2>

              {/* Search Bar */}
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

              {/* Specialization Filters */}
              <div className="specialization-filters">
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    className={`filter-btn ${selectedSpecialization === spec ? 'active' : ''}`}
                    onClick={() => setSelectedSpecialization(spec)}
                  >
                    {spec}
                  </button>
                ))}
              </div>

              {/* Doctors Grid */}
              <div className="doctors-grid">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="doctor-card">
                    <div className="doctor-header">
                      <img src={doctor.image} alt={doctor.name} className="doctor-avatar" />
                      <div className="doctor-info">
                        <h3 className="doctor-name">{doctor.name}</h3>
                        <p className="doctor-specialization">{doctor.specialization}</p>
                      </div>
                    </div>

                    <div className="doctor-rating">
                      <div className="rating-info">
                        <Star size={16} className="star-icon" />
                        <span className="rating">{doctor.rating}</span>
                      </div>
                      <span className="experience">{doctor.experience} years</span>
                    </div>

                    <div className="doctor-location">
                      <MapPin size={16} className="location-icon" />
                      <span>{doctor.location}</span>
                    </div>

                    <div className="doctor-availability">
                      <Clock size={16} className="clock-icon" />
                      <span>Next available: {doctor.nextAvailable}</span>
                    </div>

                    <div className="doctor-footer">
                      <span className="price">${doctor.price}</span>
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

          {/* Right Column - Appointment History Sidebar */}
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
                  aria-label={showHistory ? 'Hide appointments' : 'Show appointments'}
                >
                  {showHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              )}
            </div>
            
            {showHistory && (
              <div className="history-content">
                <div className="history-stats">
                  <div className="stat-item">
                    <span className="stat-number">{appointmentHistory.filter(apt => apt.status === 'completed').length}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{appointmentHistory.filter(apt => apt.status === 'upcoming').length}</span>
                    <span className="stat-label">Upcoming</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{appointmentHistory.filter(apt => apt.status === 'cancelled').length}</span>
                    <span className="stat-label">Cancelled</span>
                  </div>
                </div>
                
                <div className="appointments-list">
                  {appointmentHistory.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="appointment-item">
                      <div className="appointment-header">
                        <div className="appointment-doctor">
                          <User size={14} className="doctor-icon" />
                          <div className="doctor-details">
                            <h4 className="doctor-name">{appointment.doctorName}</h4>
                            <p className="specialization">{appointment.specialization}</p>
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
                          <span className="detail-text">{formatDate(appointment.date)} at {appointment.time}</span>
                        </div>
                        <div className="detail-row">
                          <MapPin size={12} className="detail-icon" />
                          <span className="detail-text">{appointment.location}</span>
                        </div>
                        {appointment.notes && (
                          <div className="detail-row">
                            <span className="detail-icon">📝</span>
                            <span className="detail-text notes">{appointment.notes}</span>
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

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedDoctor ? {
          doctorName: selectedDoctor.name,
          specialization: selectedDoctor.specialization,
          location: selectedDoctor.location
        } : null}
        onSchedule={handleScheduleAppointment}
        isPatient={true}
      />
    </div>
  );
};

export default PatientDashboard;
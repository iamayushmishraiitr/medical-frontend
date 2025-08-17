import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Clock, LogOut } from 'lucide-react';
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

  const specializations = ['All', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'Oncology'];

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

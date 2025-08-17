# MediCare - Professional Medical Care Platform

A responsive React.js medical application with separate patient and doctor portals, featuring appointment management, doctor search, and availability scheduling.

## Features

### 🔐 Authentication System
- **Dual Login**: Separate login flows for patients and doctors
- **Demo Credentials**: Pre-configured accounts for testing
- **Secure Routing**: Protected routes based on user role

### 👨‍⚕️ Patient Portal
- **Doctor Search**: Browse and search for doctors by name or specialization
- **Specialization Filters**: Filter doctors by medical specialties
- **Doctor Profiles**: View ratings, experience, location, and availability
- **Appointment Booking**: Interface for scheduling appointments (demo functionality)

### 🏥 Doctor Portal
- **Interactive Calendar**: Monthly calendar view with date selection
- **Appointment Management**: View daily appointments and patient details
- **Availability Control**: Mark specific dates as unavailable
- **Appointment History**: Switch between current and historical appointments
- **Patient Information**: View patient details, appointment types, and status

### 🎨 Design Features
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Modern UI**: Clean, professional medical interface
- **Color-coded Status**: Visual indicators for appointment statuses
- **Interactive Elements**: Hover effects, smooth transitions, and intuitive navigation

## Screenshots

The application is designed based on the provided screenshots:
- **Login Page**: Clean login interface with account type selection
- **Patient Dashboard**: Doctor search with filtering and grid layout
- **Doctor Dashboard**: Calendar view with appointment management

## Demo Credentials

### Patient Account
- **Email**: patient@demo.com
- **Password**: password123

### Doctor Account
- **Email**: doctor@demo.com
- **Password**: password123

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Step 1: Clone and Install
```bash
# Navigate to project directory
cd medical

# Install dependencies
npm install
```

### Step 2: Start Development Server
```bash
# Start the application
npm start
```

The application will open in your browser at `http://localhost:3000`

### Step 3: Build for Production
```bash
# Create production build
npm run build
```

## Project Structure

```
src/
├── components/           # React components
│   ├── Login.js         # Authentication component
│   ├── Login.css        # Login styles
│   ├── PatientDashboard.js    # Patient portal
│   ├── PatientDashboard.css   # Patient styles
│   ├── DoctorDashboard.js     # Doctor portal
│   └── DoctorDashboard.css    # Doctor styles
├── App.js               # Main application component
├── App.css              # Global styles
├── index.js             # Application entry point
└── index.css            # Global CSS reset
```

## Key Technologies

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Date-fns**: Date manipulation and formatting
- **Lucide React**: Modern icon library
- **CSS Grid & Flexbox**: Responsive layout system
- **CSS Custom Properties**: Theme consistency

## Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px
- **Large Desktop**: > 1200px

## Customization

### Colors
The application uses a consistent color palette:
- **Primary Green**: #198754 (MediCare branding)
- **Secondary Blue**: #0d6efd (Interactive elements)
- **Neutral Grays**: #6c757d, #495057, #212529
- **Status Colors**: Green (confirmed), Yellow (pending), Red (unavailable)

### Styling
- All components use CSS modules for scoped styling
- Responsive design with mobile-first approach
- Consistent spacing using 8px grid system
- Smooth transitions and hover effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live appointment updates
- **Database Integration**: Connect to backend services
- **User Authentication**: JWT tokens and secure sessions
- **File Uploads**: Patient document management
- **Notifications**: Email/SMS appointment reminders
- **Video Consultations**: Telemedicine integration
- **Payment Processing**: Online payment for appointments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Note**: This is a demo application with mock data. For production use, integrate with real backend services and implement proper security measures.
# medical-app
# medical-app

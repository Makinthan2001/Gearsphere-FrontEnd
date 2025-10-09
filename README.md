# GearSphere 🛠️💻

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PHP Version](https://img.shields.io/badge/PHP-7.4%2B-blue.svg)](https://php.net)
[![React](https://img.shields.io/badge/React-18.0%2B-61dafb.svg)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-orange.svg)](https://mysql.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com)

A comprehensive PC building and marketplace platform that connects customers with quality components and professional technicians for custom PC builds.

## ✨ Overview

GearSphere revolutionizes the PC building experience by providing an integrated platform where users can:
- 🔧 Build custom PCs with intelligent component suggestions
- 🛍️ Browse and purchase PC components from verified sellers
- 👨‍🔧 Connect with certified technicians for professional assembly
- 📊 Compare components and get budget-optimized recommendations

## 🚀 Key Features

### 🎯 PC Builder
- **Intelligent Recommendations**: AI-powered component suggestions based on budget and usage
- **Compatibility Checking**: Automatic validation of component compatibility
- **Budget Optimization**: Smart allocation across different price ranges
- **Real-time Comparison**: Side-by-side component analysis

### 🛒 Marketplace
- **Verified Sellers**: Curated marketplace with trusted component suppliers
- **Advanced Search**: Filter by specifications, price, brand, and compatibility
- **Secure Transactions**: Protected payment processing and order management
- **Reviews & Ratings**: Community-driven feedback system

### 👥 Multi-Role System
- **Customers**: Browse, build, and purchase PC components
- **Sellers**: Manage inventory, track sales, and analytics
- **Technicians**: Offer assembly services and manage appointments
- **Admins**: Platform oversight, user management, and analytics

### 🔧 Professional Services
- **Technician Assignment**: Connect with verified PC building professionals
- **Service Tracking**: Real-time updates on build progress
- **Quality Assurance**: Professional assembly with warranty support
- **Technical Support**: Ongoing assistance and maintenance

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Bootstrap 5** - Responsive design framework
- **React Bootstrap** - Component library
- **Axios** - HTTP client
- **Chart.js** - Data visualization

### Backend
- **PHP 7.4+** - Server-side scripting
- **MySQL 8.0+** - Relational database
- **PHPMailer** - Email functionality
- **Custom REST API** - Backend services

### Development Tools
- **Vite** - Build tool and development server
- **Git** - Version control
- **XAMPP** - Local development environment

## 📦 Installation

### Prerequisites
- [XAMPP](https://www.apachefriends.org/) (Apache, MySQL, PHP 7.4+)
- [Node.js](https://nodejs.org/) (16.0 or higher)
- [Git](https://git-scm.com/)

### 1. Clone Repository
```bash
git clone https://github.com/Makinthan2001/gearsphere.git
cd gearsphere
```

### 2. Backend Setup
```bash
# Copy backend files to XAMPP htdocs
cp -r GearSphere-BackEnd/ /xampp/htdocs/gearsphere_api/

# Start XAMPP services
# - Apache
# - MySQL

# Import database
# Open http://localhost/phpmyadmin
# Create database 'gearsphere'
# Import gearsphere.sql file
```

### 3. Frontend Setup
```bash
cd GearSphere-FrontEnd
npm install
npm run dev
```

### 4. Configuration
Update database connection in [`DbConnector.php`](GearSphere-BackEnd/DbConnector.php):
```php
$host = "localhost";
$dbname = "gearsphere";
$username = "root";
$password = "";
```

## 🖥️ Usage

### Access the Platform
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost/gearsphere_api/GearSphere-BackEnd/
- **Database**: http://localhost/phpmyadmin

### User Roles & Access
- **Admin**: Full platform management and analytics
- **Customer**: Browse, build PCs, and make purchases
- **Seller**: Manage products and view sales data
- **Technician**: Accept build requests and manage services

## 📋 Project Structure

```
gearsphere/
├── GearSphere-BackEnd/              # PHP Backend
│   ├── Main Classes/                # Core business logic
│   │   ├── Admin.php               # Admin operations
│   │   ├── Customer.php            # Customer management
│   │   ├── Product.php             # Product operations
│   │   ├── Technician.php          # Technician services
│   │   └── Mailer.php              # Email services
│   ├── API Endpoints/              # REST API endpoints
│   ├── uploads/                    # File uploads
│   ├── profile_images/             # User avatars
│   └── gearsphere.sql              # Database schema
│
├── GearSphere-FrontEnd/             # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── pages/                  # Page components
│   │   │   ├── customer/          # Customer interface
│   │   │   ├── seller/            # Seller dashboard
│   │   │   ├── technician/        # Technician panel
│   │   │   └── admin/             # Admin console
│   │   ├── context/               # React Context
│   │   └── utils/                 # Utility functions
│   ├── public/                    # Static assets
│   └── package.json               # Dependencies
│
└── Documentation/                  # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /login.php` - User authentication
- `POST /customersignup.php` - Customer registration
- `POST /techniciansignup.php` - Technician registration

### PC Builder
- `GET /suggestBuild.php` - Get AI recommendations
- `GET /getCPUs.php` - Fetch CPU components
- `GET /getGPUs.php` - Fetch GPU components
- `GET /getMemory.php` - Fetch memory components

### Products & Orders
- `GET /getProducts.php` - Fetch all products
- `POST /addProduct.php` - Add new product
- `POST /createOrder.php` - Create order
- `GET /getOrders.php` - Fetch user orders

### Admin Operations
- `GET /getAdmin.php` - Admin dashboard data
- `POST /moderateReview.php` - Review moderation
- `GET /getAllCustomers.php` - Customer management

## 🛡️ Security Features

- **Input Validation**: Comprehensive sanitization
- **SQL Injection Prevention**: Prepared statements
- **Password Hashing**: Secure bcrypt implementation
- **Session Management**: Secure session handling
- **File Upload Security**: Type validation and restrictions
- **CORS Configuration**: Proper cross-origin setup

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Interface**: Clean, intuitive design
- **Dark/Light Themes**: User preference support
- **Loading States**: Smooth user experience
- **Toast Notifications**: Real-time feedback
- **Interactive Charts**: Data visualization

## 🧪 Testing

```bash
# Frontend tests
cd GearSphere-FrontEnd
npm test

# Backend API testing
# Use Postman or similar tools to test endpoints
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PSR-4 standards for PHP
- Use functional components for React
- Maintain consistent code formatting
- Add comments for complex logic
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Support & Contact

- **Email**: support@gearsphere.com
- **GitHub Issues**: [Report a Bug](https://github.com/Makinthan2001/gearsphere/issues)
- **Documentation**: Check `/Documentation` folder
- **Response Time**: Within 24 hours

## 🙏 Acknowledgments

- React community for excellent documentation
- Bootstrap team for responsive components
- PHP community for robust backend solutions
- PHPMailer for reliable email services
- Chart.js for beautiful data visualization
- All contributors and beta testers

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] AI-powered price predictions
- [ ] 3D PC build visualizer
- [ ] Advanced inventory management
- [ ] Multi-language support
- [ ] Cryptocurrency payment integration

---

<div align="center">

**GearSphere** - Building PCs, Building Dreams 🚀💻

Made with ❤️ by the GearSphere Team

[Website](https://gearsphere.com) • [Documentation](./Documentation) • [Report Bug](https://github.com/Makinthan2001/gearsphere/issues) • [Feature Request](https://github.com/Makinthan2001/gearsphere/issues)

</div>

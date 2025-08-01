# GearSphere - PC Building & Marketplace Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PHP Version](https://img.shields.io/badge/PHP-7.4%2B-blue.svg)](https://php.net)
[![React](https://img.shields.io/badge/React-18.0%2B-61dafb.svg)](https://reactjs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-orange.svg)](https://mysql.com)

GearSphere is a comprehensive web application that revolutionizes the PC building experience by connecting customers with quality components and professional technicians. The platform serves as both a marketplace for PC parts and a service hub for custom PC builds.

## 🚀 Features

### 🎯 Core Functionality
- **PC Builder Tool**: Interactive component selection with budget-based recommendations
- **Marketplace**: Browse and purchase PC components from verified sellers
- **Technician Services**: Connect with professional PC builders and technicians
- **Multi-User System**: Separate dashboards for customers, sellers, technicians, and administrators

### 👥 User Roles

#### 🛒 **Customers**
- Build custom PCs with intelligent component recommendations
- Browse and purchase PC components
- Assign technicians for professional PC assembly
- Track orders and build progress
- Leave reviews and feedback

#### 🏪 **Sellers**
- Manage product inventory and listings
- Track sales analytics and performance
- Update product information and pricing
- Handle customer orders

#### 🔧 **Technicians**
- Receive and manage build requests
- Update assignment status and progress
- Communicate with customers
- Showcase specializations and experience

#### 👨‍💼 **Administrators**
- Manage all users and their permissions
- Monitor platform analytics and statistics
- Moderate reviews and content
- Oversee system operations

### 💻 PC Builder Features
- **Budget-Based Recommendations**: Get component suggestions based on your budget (LKR 200,000 - 1,000,000+)
- **Usage-Specific Builds**: Optimized configurations for gaming, workstation, and multimedia use
- **Component Categories**: 
  - CPUs, GPUs, Motherboards, Memory (RAM)
  - Storage, Power Supplies, PC Cases, CPU Coolers
  - Monitors, Operating Systems
- **Real-time Price Calculation**: Dynamic total pricing with budget validation
- **Component Comparison**: Side-by-side comparison of similar components

### 🛍️ Marketplace Features
- **Comprehensive Product Catalog**: Wide range of PC components and peripherals
- **Advanced Filtering**: Filter by category, price range, and specifications
- **Shopping Cart**: Add multiple items and manage quantities
- **Secure Checkout**: Integrated payment processing
- **Product Reviews**: Customer feedback and ratings system

### 🔧 Technician Services
- **Professional Assignment**: Connect with verified PC building technicians
- **Build Tracking**: Monitor progress from assignment to completion
- **Communication System**: Direct messaging between customers and technicians
- **Specialization Matching**: Find technicians based on specific expertise

## 🏗️ Technical Architecture

### Frontend (React.js)
- **Framework**: React 18+ with Vite build tool
- **UI Library**: React Bootstrap for responsive design
- **Routing**: React Router for navigation
- **State Management**: Context API for order management
- **Icons**: React Bootstrap Icons

### Backend (PHP)
- **Language**: PHP 7.4+
- **Architecture**: Object-oriented with MVC pattern
- **Database**: MySQL 8.0+
- **Email Service**: PHPMailer for notifications
- **Session Management**: PHP sessions with CORS support

### Database Structure
- **Users Management**: Multi-role user system
- **Product Catalog**: Detailed component specifications
- **Order Processing**: Complete order lifecycle management
- **Review System**: Customer feedback and ratings
- **Notification System**: Real-time updates and alerts

## 📋 Prerequisites

Before installing GearSphere, ensure you have:

- **XAMPP** (Apache, MySQL, PHP 7.4+)
- **Node.js** (16.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/gearsphere.git
cd gearsphere
```

### 2. Backend Setup (PHP/MySQL)

#### Configure XAMPP
1. Start Apache and MySQL services in XAMPP Control Panel
2. Place the project in `C:\xampp\htdocs\gearsphere_api`

#### Database Setup
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `gearsphere`
3. Import the database schema:
   ```sql
   -- Import the provided SQL file
   SOURCE C:\xampp\htdocs\gearsphere_api\GearSphere-BackEnd\gearsphere.sql
   ```

#### Configure Database Connection
Update database credentials in `GearSphere-BackEnd/DbConnector.php`:
```php
private $host = 'localhost';
private $db_name = 'gearsphere';
private $username = 'root';
private $password = ''; // Your MySQL password
```

### 3. Frontend Setup (React)

Navigate to the frontend directory:
```bash
cd GearSphere-FrontEnd
```

Install dependencies:
```bash
npm install
```

Install additional required packages:
```bash
npm install react-bootstrap bootstrap react-bootstrap-icons
npm install react-router-dom
```

### 4. Start the Application

#### Start Backend (XAMPP)
- Ensure Apache and MySQL are running in XAMPP

#### Start Frontend Development Server
```bash
cd GearSphere-FrontEnd
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost/gearsphere_api/GearSphere-BackEnd

## 🎮 Usage Guide

### Getting Started
1. **Register an Account**: Choose your role (Customer, Seller, or Technician)
2. **Explore the Platform**: Browse components or start building your PC
3. **Use PC Builder**: Select budget range and usage type for recommendations
4. **Shop Components**: Add items to cart and proceed to checkout
5. **Assign Technicians**: Get professional help for PC assembly

### PC Builder Workflow
1. **Select Usage Type**: Gaming, Workstation, or Multimedia
2. **Choose Budget Range**: From budget-friendly to premium builds
3. **Review Recommendations**: AI-suggested components based on your preferences
4. **Customize Build**: Replace any component with alternatives
5. **Proceed to Checkout**: Complete purchase or assign a technician

### For Sellers
1. **Add Products**: List your PC components with detailed specifications
2. **Manage Inventory**: Update stock levels and pricing
3. **Track Orders**: Monitor sales and customer orders
4. **Analytics Dashboard**: View performance metrics and insights

### For Technicians
1. **Complete Profile**: Add specializations and experience details
2. **Receive Assignments**: Get notified of new build requests
3. **Update Progress**: Keep customers informed about build status
4. **Build Portfolio**: Accumulate reviews and ratings

## 📁 Project Structure

```
gearsphere_api/
│
├── GearSphere-BackEnd/           # PHP Backend
│   ├── Main Classes/             # Core PHP classes
│   │   ├── Admin.php            # Admin management
│   │   ├── Customer.php         # Customer operations
│   │   ├── Product.php          # Product management
│   │   ├── Technician.php       # Technician services
│   │   ├── Seller.php           # Seller operations
│   │   ├── Mailer.php           # Email services
│   │   └── ...
│   ├── API Endpoints/           # REST API endpoints
│   │   ├── login.php
│   │   ├── addProduct.php
│   │   ├── suggestBuild.php
│   │   └── ...
│   ├── uploads/                 # File uploads
│   ├── profile_images/          # User profile images
│   └── gearsphere.sql          # Database schema
│
├── GearSphere-FrontEnd/         # React Frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/              # Page components
│   │   │   ├── customer/       # Customer pages
│   │   │   ├── seller/         # Seller pages
│   │   │   ├── technician/     # Technician pages
│   │   │   └── admin/          # Admin pages
│   │   ├── context/            # React Context
│   │   └── utils/              # Utility functions
│   ├── public/                 # Static assets
│   ├── package.json           # Dependencies
│   └── vite.config.js         # Vite configuration
│
├── Documentation/              # Project documentation
└── README.md                  # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /login.php` - User authentication
- `POST /logout.php` - User logout
- `POST /customersignup.php` - Customer registration
- `POST /techniciansignup.php` - Technician registration

### PC Builder
- `GET /suggestBuild.php` - Get component recommendations
- `GET /getCPUs.php` - Fetch CPU components
- `GET /getGPUs.php` - Fetch GPU components
- `GET /getMemory.php` - Fetch memory components

### Products & Orders
- `GET /getProducts.php` - Fetch all products
- `POST /addProduct.php` - Add new product (Seller)
- `POST /createOrder.php` - Create new order
- `GET /getOrders.php` - Fetch user orders

### Technician Services
- `POST /assignTechnician.php` - Assign technician to build
- `GET /getBuildRequests.php` - Get technician assignments
- `POST /updateAssignmentStatus.php` - Update build status

## 🔒 Security Features

- **Input Validation**: Comprehensive sanitization of user inputs
- **SQL Injection Prevention**: Prepared statements for database queries
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Session Management**: Secure session handling and validation
- **File Upload Security**: Restricted file types and validation
- **Password Hashing**: Secure password storage

## 🎨 Responsive Design

GearSphere features a fully responsive design that works seamlessly across:
- **Desktop**: Full-featured experience with advanced controls
- **Tablet**: Optimized layout for touch interaction
- **Mobile**: Streamlined interface for mobile users

## 🛠️ Development

### Adding New Features
1. **Backend**: Create new PHP classes in `Main Classes/` directory
2. **Frontend**: Add components in appropriate `src/pages/` subdirectory
3. **Database**: Update schema and create migration scripts
4. **API**: Implement new endpoints following existing patterns

### Code Standards
- **PHP**: Follow PSR-4 autoloading standards
- **React**: Use functional components with hooks
- **Database**: Use descriptive table and column names
- **CSS**: Utilize Bootstrap classes for consistency

## 🤝 Contributing

We welcome contributions to GearSphere! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Support

For support and questions:
- **Email**: mahinthan2001a@gmail.com
- **Issues**: Create an issue on GitHub
- **Documentation**: Check the `/Documentation` folder

## 🙏 Acknowledgments

- React community for excellent documentation
- Bootstrap team for responsive components
- PHP community for robust backend solutions
- All contributors and testers

---

**GearSphere** - Building PCs, Building Dreams 🚀💻
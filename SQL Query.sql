CREATE DATABASE Salon;
USE Salon;

CREATE TABLE Customer (
    customerId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    gender VARCHAR(10)
);

CREATE TABLE Staff (
    staffId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30),
    phone VARCHAR(15)
);

CREATE TABLE Service (
    serviceId INT AUTO_INCREMENT PRIMARY KEY,
    serviceName VARCHAR(50),
    price DECIMAL(10,2),
    duration INT
);

CREATE TABLE Appointment (
    appointmentId INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT,
    staffId INT,
    serviceId INT,
    date DATE,
    time TIME,
    status VARCHAR(20),
    FOREIGN KEY (customerId) REFERENCES Customer(customerId),
    FOREIGN KEY (staffId) REFERENCES Staff(staffId),
    FOREIGN KEY (serviceId) REFERENCES Service(serviceId)
);

INSERT INTO Service (serviceName, price, duration) VALUES 
('Hair Cut', 1500, 30),
('Beard Trim', 800, 20),
('Facial', 3000, 60),
('Full Package', 5000, 90);

INSERT INTO Staff (name, email, password, role, phone) VALUES 
('Admin Manager', 'admin@luxe.com', 'admin123', 'Manager', '0300-0000000'),
('Ali Khan', 'ali@salon.com', '1234', 'Barber', '0300-1111111');

INSERT INTO Customer (name, email, password, phone, gender) VALUES 
('Test Customer', 'customer@gmail.com', '1234', '0300-9999999', 'Male');

INSERT INTO Service (serviceName, price, duration) VALUES 
('Hair Coloring', 4000.00, 120),
('Manicure', 2000.00, 45),
('Pedicure', 2500.00, 60),
('Head Massage', 1200.00, 30),
('Bridal Makeup', 15000.00, 180),
('Keratin Treatment', 8000.00, 150);

INSERT INTO Staff (name, email, password, role, phone) VALUES 
('Sara Smith', 'sara@salon.com', '1234', 'Colorist', '0300-3333333'),
('Zara Ali', 'zara@salon.com', '1234', 'Makeup Artist', '0300-4444444'),
('Omar Khan', 'omar@salon.com', '1234', 'Senior Stylist', '0300-5555555'),
('Hina Riaz', 'hina@salon.com', '1234', 'Nail Tech', '0300-6666666');
# Smart Home Dashboard 🏠

A comprehensive smart home monitoring and control application. Manage your home's temperature, lighting, climate control, and energy consumption from a single, intuitive dashboard.

## 📋 About the Project

Smart Home Dashboard is a centralized control system for managing various aspects of your smart home. The application provides real-time monitoring of room temperatures, lighting control with brightness adjustment, climate system management, and daily energy consumption tracking.

## 🚀 Technologies

- **Next.js** - React framework for production
- **Sass** - CSS preprocessor for styling
- **Prisma** - ORM for database management
- **MongoDB** - NoSQL database

## ✨ Features

- 🌡️ Real-time temperature monitoring for each room
- 🔥 Adjustable room temperature controls
- 💡 Light control system (on/off switching)
- 🔆 Brightness adjustment for lights
- ❄️ Air conditioning target temperature settings
- ⚡ Daily energy consumption display
- 📱 Responsive user interface
- 🎨 Modern and intuitive design

## 🎯 Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
smart-home-dashboard/
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── styles/        # Sass stylesheets
│   └── lib/           # Utility functions
├── prisma/
│   └── schema.prisma  # Database schema
├── public/            # Static assets
└── package.json
```

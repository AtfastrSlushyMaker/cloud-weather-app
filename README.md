# Cloud Weather App 🌤️

> **Personal Learning Project**: My journey to master Flask, Angular, and cloud computing through hands-on development.

This is my learning project where I'm building a modern weather application to gain practical experience with:
- **Flask** (Python backend development)
- **Angular** (TypeScript frontend framework) 
- **Docker** (containerization and deployment)
- **Cloud platforms** (production deployment with Render)

The app fetches real-time weather data using Flask backend and displays it through a responsive Angular frontend, all containerized with Docker for cloud deployment.

## 🌐 Live Demo

**Live App**: [https://cloud-weather-app.onrender.com/weather](https://cloud-weather-app.onrender.com/weather)

> **Note**: This app is hosted on Render's free tier, which spins down after 15 minutes of inactivity. The first load may take 30-60 seconds to wake up the service. For immediate testing, use the Docker setup below.

## 🚀 Features

- **Real-time Weather Data**: Get current weather information for any city using OpenWeatherMap API
- **Modern UI**: Clean, responsive Angular frontend with beautiful weather cards
- **RESTful API**: Flask backend with proper CORS configuration
- **Containerized**: Docker multi-stage build for production deployment
- **Cloud Ready**: Optimized for cloud deployment with environment configuration

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Requests** - HTTP library for API calls
- **OpenWeatherMap API** - Weather data provider

### Frontend
- **Angular 18** - Modern TypeScript framework
- **Angular Router** - Client-side routing
- **HTTP Client** - API communication
- **Responsive CSS** - Mobile-friendly design

### DevOps
- **Docker** - Containerization with multi-stage builds
- **Node.js 20** - Build environment for Angular
- **Python 3.11** - Runtime environment for Flask

## 📋 Prerequisites

- **Docker** (for containerized deployment)
- **Node.js 18+** and **npm** (for local development)
- **Python 3.11+** and **pip** (for local development)
- **OpenWeatherMap API Key** (free at [openweathermap.org](https://openweathermap.org/api))

## 🚀 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cloud-weather-app
   ```

2. **Build the Docker image**
   ```bash
   docker build -t weather-app .
   ```

3. **Run with your API key**
   ```bash
   docker run -p 5000:5000 -e OPENWEATHER_API_KEY=your_openweathermap_api_key_here weather-app
   ```

4. **Access the application**
   - Open your browser to `http://localhost:5000`
   - Enter a city name to get weather information

> **Note**: The Docker container uses environment variables instead of `.env` files for security and portability.

## 🔧 Local Development Setup

### Backend Setup
```bash
cd backend
pip install -r ../requirements.txt
# Create .env file with your API key
echo "API_KEY=your_api_key_here" > .env
python app.py
```

### Frontend Setup
```bash
cd weather-frontend
npm install
npm start
```

The frontend will run on `http://localhost:4200` and proxy API calls to the backend on `http://localhost:5000`.

## 📁 Project Structure

```
cloud-weather-app/
├── Dockerfile                 # Multi-stage Docker build
├── requirements.txt          # Python dependencies
├── backend/
│   ├── app.py               # Flask application
│   └── .env                 # Environment variables (API key)
└── weather-frontend/
    ├── src/
    │   ├── app/
    │   │   ├── weather/     # Weather component
    │   │   └── services/    # Weather service
    │   └── environments/    # Configuration files
    └── package.json         # Node.js dependencies
```

## 🌐 API Endpoints

### GET `/api/weather`
Get weather data for a specific city.

**Query Parameters:**
- `city` (required) - Name of the city

**Example:**
```bash
curl "http://localhost:5000/api/weather?city=London"
```

**Response:**
```json
{
  "city": "London",
  "temperature": 15.2,
  "description": "Partly cloudy",
  "humidity": 65,
  "windSpeed": 3.1
}
```

## 🐳 Docker Architecture

The application uses a multi-stage Docker build:

1. **Stage 1 (Node.js)**: Builds the Angular frontend
2. **Stage 2 (Python)**: Serves the Flask backend with Angular static files

This approach optimizes the final image size and separates build dependencies from runtime dependencies.

## 🔒 Environment Configuration

### Development
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:5000`
- API URL: `http://127.0.0.1:5000`

### Production (Docker)
- Application: `http://localhost:5000`
- Static files served by Flask
- API URL: `/api` (relative)

## 🚀 Deployment

### Local Docker
```bash
# Build the image
docker build -t weather-app .

# Run with API key as environment variable
docker run -p 5000:5000 -e OPENWEATHER_API_KEY=your_api_key_here weather-app
```

### Cloud Deployment
This application is ready for deployment to:
- **AWS** (EC2, ECS, or App Runner) - use environment variables for API keys
- **Azure** (Container Instances or App Service) - configure app settings
- **Google Cloud** (Cloud Run or Compute Engine) - use secret manager
- **Heroku** (Container Registry) - set config vars

All cloud platforms support secure environment variable injection without exposing API keys in the image.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 My Learning Journey

### What I'm Learning:
- **Flask Web Development**: Building RESTful APIs, handling CORS, environment configuration
- **Angular Framework**: Components, services, routing, HTTP client, TypeScript best practices
- **Docker Containerization**: Multi-stage builds, image optimization, container networking
- **Cloud Deployment**: Environment variables, production configuration, continuous deployment
- **Full-Stack Integration**: Connecting frontend and backend, API design, error handling

### Skills I'm Developing:
- **Python backend development** with Flask framework
- **Modern Angular** (v18+) with standalone components and TypeScript
- **Docker** containerization workflows and best practices
- **Cloud deployment** strategies and environment management
- **API integration** with external services (OpenWeatherMap)
- **Cross-origin resource sharing** (CORS) configuration
- **Environment-based configuration** for development vs production

### Technologies Mastered So Far:
✅ Flask backend with proper CORS setup  
✅ Angular frontend with routing and services  
✅ Docker multi-stage builds  
✅ Cloud deployment on Render  
✅ Environment variable management  
✅ API integration and error handling  

## 🎯 Learning Objectives

This project demonstrates:
- **Full-stack development** with Flask backend and Angular frontend
- **RESTful API** design and consumption with proper error handling
- **Modern Angular** architecture with standalone components and TypeScript
- **Docker containerization** with optimized multi-stage builds
- **Cloud deployment** with environment-based configuration
- **Real-world debugging** including browser compatibility issues (Brave shields)

## 🎯 Educational Value for Other Learners

Perfect for developers learning:
- **Python web development** with Flask
- **Modern Angular** (v18+) with standalone components
- **TypeScript** best practices and type safety
- **Docker** containerization workflows
- **Full-stack integration** patterns
- **RESTful API** design and consumption
- **Environment-based configuration** management

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing weather data API
- [Angular](https://angular.io/) team for the excellent framework
- [Flask](https://flask.palletsprojects.com/) community for the lightweight web framework
# Analyse WebApp

A web application for analyzing website performance metrics with React frontend and Node.js backend.

## 🔗 Live Links

- **Frontend**: [https://analyse-app.netlify.app/](https://analyse-app.netlify.app/)
- **Backend API**: [https://analyse-webapp-production.up.railway.app/api](https://analyse-webapp-production.up.railway.app/api)
- **GitHub Repository**: [https://github.com/sidgangs99/analyse-webapp](https://github.com/sidgangs99/analyse-webapp)

## 🛠️ Tech Stack

### Frontend

- **React** - Frontend framework
- **Axios** - Data fetching
- **Shadcn** - UI component library
- **Tanstack Table** - Data table display

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework

## 📁 Project Structure

```

analyse-webapp/
├── server/ # Backend code
└── / # Frontend code

```

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
CRUX_API_KEY="AIzaSyAga2HliLqx32ID00tbdpY1vClPtLmH0s8"
```

### Frontend (`.env`)

```env
VITE_BASE_API_ROUTE="https://analyse-webapp-production.up.railway.app/api"
```

## 🚀 Installation & Setup

### Frontend

1. Clone the repository:

   ```bash
   git clone https://github.com/sidgangs99/analyse-webapp.git
   cd analyse-webapp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment:

   ```bash
   cp sample.env .env
   ```

4. Start development server:

   ```bash
   npm run start
   ```

### Backend

1. Navigate to server directory:

   ```bash
   cd server/
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment:

   ```bash
   cp sample.env .env
   ```

   Edit `.env` and add your CrUX API key:

   ```env
   CRUX_API_KEY="AIzaSyAga2HliLqx32ID00tbdpY1vClPtLmH0s8"
   ```

4. Start server:

   ```bash
   npm run start
   ```

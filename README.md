# 🎬 Cinémathèque (Cin-math-que)

> **A modern, interactive film database, actor analytics dashboard, and relational database schema visualizer inspired by classic world cinema.**

[![React](https://img.shields.io/badge/React-19.2.4-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15.0-22b5bf.svg)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)

---

## 🌟 Overview

**Cinémathèque** is an elegant, full-featured web application designed for film enthusiasts, researchers, and developers. It brings together rich filmography metadata, interactive user rating systems, deep actor analytics with radar charts, and an interactive database ER schema inspector—all encapsulated within a luxurious obsidian and antique gold cinematic aesthetic.

---

## ✨ Features

### 🍿 1. Interactive Film Catalog & Explorer
* **Real-time Search**: Instantly filter films by title or director name.
* **Genre Filtering**: Toggle between Drama, Crime, Sci-Fi, Thriller, Action, Fantasy, and Mystery genres.
* **Multi-Criteria Sorting**: Sort film lists seamlessly by rating, release year, or alphabetical title.
* **Interactive Star Rating Engine**: Rate movies dynamically with immediate score feedback and session tracking.

### 🎭 2. Actor & Cast Profiles
* **Deep Cast Analysis**: Inspect filmographies and key roles for iconic actors.
* **Genre Affinity Radar Charts**: Visualize an actor's performance distribution across 6 distinct genres (Drama, Thriller, Action, Comedy, Sci-Fi, Crime) using multi-axis radar visualizations.

### 📊 3. Data Analytics & Visualizations
* **Score Distribution**: Bar charts depicting 1★ through 10★ IMDb rating frequencies with custom tooltips.
* **Rating Trends Over Time**: Line chart analysis tracking average ratings across production years (2018–2024).
* **Genre Breakdown**: Proportional pie chart visualizing film genre density.
* **Statistical Overviews**: Overview cards summarizing total catalog count, average ratings, vote counts, and top genres.

### 🗄️ 4. Relational Database & ER Schema Inspector
* **Visual Relational Diagram**: Interactive schema visualizer showcasing tables: `Movie`, `Actor`, `MovieActor`, `UserRating`, and `Genre`.
* **Field-Level Inspection**: Inspect primary keys (`@id`), unique constraints (`@unique`), foreign key relationships, and data types.
* **Schema Code Exporter**: Integrated viewer for SQL DDL definitions and Prisma ORM schemas.

### 🎨 5. Handcrafted Dark Luxury Design
* **Cinephile Aesthetic**: Rich obsidian black (`#0A0804`) background paired with antique gold (`#C9A84C`) typography and accents.
* **Typography**: Integrated `Playfair Display` serif headers and monospace technical data labels.
* **Micro-Animations**: Smooth hover states, card elevations, and panel transition animations.

---

## 🛠️ Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/)
* **Build Tool & Dev Server**: [Vite 5](https://vitejs.dev/)
* **Data Visualization**: [Recharts](https://recharts.org/)
* **Typography**: Google Fonts (`Playfair Display`, Monospace)
* **Styling**: Pure Modular CSS3 with CSS Variables & Responsive Flex/Grid Layouts

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Sri-explorer-007/Cin-math-que.git
   cd Cin-math-que
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

In the project directory, you can run:

* `npm run dev` — Launches the Vite development server with Hot Module Replacement (HMR).
* `npm run build` — Compiles and optimizes assets into the `dist/` directory for production deployment.
* `npm run preview` — Previews the production build locally.
* `npm run lint` — Runs ESLint to check for code quality and syntax issues.

---

## 📁 Directory Structure

```text
Cin-math-que/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx           # Main Application Component (Catalog, Analytics, Schema)
│   ├── index.css         # Design System & Theme Reset
│   └── main.jsx          # Entry point
├── index.html            # Main HTML Shell with Google Fonts
├── package.json          # Dependencies and Scripts
├── vite.config.js        # Vite Configuration
└── README.md             # Project Documentation
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Sri-explorer-007/Cin-math-que/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

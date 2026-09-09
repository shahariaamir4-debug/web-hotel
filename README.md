# Antix Hotel - Luxury Room Booking System

A modern luxury hotel room booking web application with Pay-at-Hotel reservations, instant booking vouchers, live filters, and guest management.

---

## 🚀 How to Run on Localhost (নিজের কম্পিউটারে চালানোর নিয়ম)

Modern web applications built with **React & Vite** cannot be opened simply by double-clicking the `index.html` file (doing so uses the `file:///` protocol which browsers block for security reasons, resulting in a blank page).

To run the project on your local machine (`http://localhost:3000`), follow these simple steps:

### Prerequisites:
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Step 1: Open Terminal / Command Prompt
Extract the downloaded ZIP file, open the folder, and open **Terminal** (Mac/Linux) or **Command Prompt / PowerShell / VS Code Terminal** inside this folder.

### Step 2: Install Dependencies
Run the following command in terminal:
```bash
npm install
```

### Step 3: Start Local Server
Run this command:
```bash
npm run dev
```

### Step 4: Open in Browser
You will see output in the terminal like:
```text
  VITE v6.2.3  ready in 300 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```
Now open your browser and go to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📦 How to Build for Static Hosting (Production)

If you want to generate a static distribution folder to upload to GitHub Pages, cPanel, or static hosting:

```bash
npm run build
```
This generates the compiled static files inside the `dist/` folder.

You can preview the production build locally with:
```bash
npm run preview
```

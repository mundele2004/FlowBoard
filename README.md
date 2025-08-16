# FlowBoard

A lightweight, front-end Task Management demo built with plain HTML, CSS and vanilla JavaScript.
This small app demonstrates a task dashboard, filters, modal-based task create/edit, and an in-memory simulated API layer.

> The app's UI and title are defined in `index.html`. The app logic is implemented in `app.js` and styles live in `style.css`. :contentReference[oaicite:4]{index=4} :contentReference[oaicite:5]{index=5} :contentReference[oaicite:6]{index=6}

---

## Features

- Task dashboard with stats (Total, Pending, In Progress, Completed). :contentReference[oaicite:7]{index=7}  
- Add / edit / delete tasks using a modal form. :contentReference[oaicite:8]{index=8}  
- In-memory simulated API methods inside `app.js` (create, read, update, delete). :contentReference[oaicite:9]{index=9}  
- Export tasks as JSON file. :contentReference[oaicite:10]{index=10}  
- Light/Dark theme toggle.

---

## File structure
/ FlowBoard

├─ index.html # App shell and markup. 

├─ app.js # Main JavaScript application logic. 

├─ style.css # Styles and design tokens. 

└─ README.md



---

## Run locally

This is a static front-end app — no build step required.

**Option A — open in browser**
1. Open `index.html` in your browser (double-click or right-click → Open with…).

**Option B — serve with simple HTTP server (recommended)**
From the project root:

```bash
# Python 3
python -m http.server 8000
# Then open http://localhost:8000

# OR using Node.js http-server (if installed)
npx http-server -c-1
# Then open the printed URL


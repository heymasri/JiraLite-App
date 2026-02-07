# JiraLite 👩‍💻

**A lightweight Jira‑style project & issue tracker**
**JiraLite** is a full‑stack web application inspired by Jira, built to manage **projects**, **issues**, and **workflow states**.
This is a **hands‑on, production‑style project**, not a tutorial demo.

***

## 🛠 Tech Stack

### Backend

*   ASP.NET Core Web API (.NET 7)
*   Entity Framework Core
*   SQL Server
*   JWT Authentication
*   RESTful API design

### Frontend

*   Angular 16
*   Standalone Components
*   Reactive Forms
*   Angular CDK (Drag & Drop)
*   SCSS (custom, no UI libraries)

### Tooling

*   Visual Studio / VS Code
*   Node.js & npm
*   SQL Server Management Studio
*   Git

***

## 🔧 Backend Features

*   **Projects API**
    *   Create, edit, delete projects
    *   Ownership enforced at API level
    *   Safe deletes with issue dependency handling

*   **Issues API**
    *   Create, edit, delete issues
    *   Kanban‑style status workflow:
        *   `ToDo`
        *   `InProgress`
        *   `Done`
    *   Optimized endpoints for board rendering

*   **Authentication & Security**
    *   JWT‑based authentication
    *   Secure endpoints with `[Authorize]`
    *   Owner‑only edit/delete rules
    *   Clear `403 Forbidden` responses

***

## 🎨 Frontend Features

### Projects Page

*   Clean card‑based layout
*   Inline edit using a minimal edit bar
*   Hover‑only Edit / Delete actions
*   Ownership‑aware error feedback
*   Optimistic UI updates for delete

### Issues Board

*   Kanban‑style board with 3 columns
*   Drag & drop between workflow states
*   Issue cards with hover elevation
*   Hover‑only Edit / Delete actions
*   Subtle background layers for clarity

### UI & UX Highlights

*   Black & white design system
*   Light background surfaces
*   Consistent interaction patterns
*   No heavy UI frameworks
*   Focus on clarity and usability

***

## 🔐 Ownership & Permissions

JiraLite intentionally models **real‑world authorization rules**:

*   Only the **project owner** can edit or delete a project
*   Backend strictly enforces ownership
*   UI provides clear feedback when an action is forbidden

This mirrors how tools like **Jira, GitHub, and Linear** behave.

***


## ▶️ Running the Project (Local)

Frontend runs on `http://localhost:4200`  
Backend runs on `https://localhost:7284`

***

## 📌 Why This Project Exists

JiraLite was built to practice and demonstrate:

*   Full‑stack application design
*   Clean separation of concerns
*   Ownership‑based authorization
*   Thoughtful UI/UX decisions
*   Code that feels **close to production**

***

## 🚧 Future Enhancements

*   Role‑based access (Admin / Member)
*   Comments on issues
*   Issue assignment to users
*   Search & filtering
*   Soft deletes and audit logs

***
## 🌐 Screenshots
<img width="1903" height="674" alt="image" src="https://github.com/user-attachments/assets/8a8e7603-d78c-4462-8cf1-02eccea56680" />
<img width="1915" height="784" alt="image" src="https://github.com/user-attachments/assets/95e1c3f7-1101-48f2-9f62-2b25f6773ab5" />
<img width="1888" height="751" alt="image" src="https://github.com/user-attachments/assets/4568efde-40b4-45e5-bb14-fbe33ffac655" />
<img width="1908" height="767" alt="image" src="https://github.com/user-attachments/assets/4ab7d9f8-b751-4791-b46a-36b9cce9d676" />


## 🙌💻  Final Note

JiraLite is not meant to replace Jira —  
it’s meant to **understand how tools like Jira are built**.

Every feature here exists because it mirrors a real product decision.



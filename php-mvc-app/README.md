# PHP MVC App (Starter)

This project organizes your existing HTML/CSS/JS into a PHP MVC structure with routing via `index.php?page=...`.

## Folder structure

```
php-mvc-app/
├── config/
│   └── config.php
├── core/
│   ├── Controller.php
│   ├── Database.php
│   └── Router.php
├── controllers/
│   ├── AuthController.php
│   ├── DashboardController.php
│   └── TaskController.php
├── models/
│   ├── Task.php
│   └── User.php
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assets/
├── sql/
│   └── schema.sql
├── views/
│   ├── auth/
│   │   └── login.php
│   ├── dashboard/
│   │   └── index.php
│   ├── errors/
│   │   └── 404.php
│   ├── layout/
│   │   └── main.php
│   └── tasks/
│       ├── create.php
│       ├── edit.php
│       └── index.php
└── index.php
```

## Setup

1. Install PHP (>=7.4) and MySQL.
2. Create the database and seed data:
   - Import `sql/schema.sql` into MySQL (e.g., using phpMyAdmin or CLI `mysql -u root -p < sql/schema.sql`).
3. Configure database credentials in `config/config.php` if needed.
4. Place your existing CSS/JS into `public/css` and `public/js`. Keep file names the same to preserve styles/behavior.
5. Move the HTML bodies of your pages into the corresponding view files under `views/` (keep the DOM structure to preserve styling). The layout `views/layout/main.php` already includes `style.css` and `app.js`.
6. Start a dev server in the project root:
   - PHP built-in: `php -S 127.0.0.1:8000` and open `http://127.0.0.1:8000/index.php`.

## Routing

- `index.php?page=login`
- `index.php?page=dashboard`
- `index.php?page=tasks` (list)
- `index.php?page=tasks&action=create`
- `index.php?page=tasks&action=edit&id=123`
- `index.php?page=tasks&action=delete&id=123`

## Auth

- Default admin user:
  - username: `admin`
  - password: `password`

Change the seeded password by replacing the bcrypt hash in `sql/schema.sql`.

## Notes

- All database operations use prepared statements (PDO) to prevent SQL injection.
- Keep using your existing CSS and JS by dropping them into `public/` and adjusting `views/layout/main.php` if the filenames differ.
- If your app runs under a subfolder, set `BASE_PATH` in `config/config.php` accordingly.
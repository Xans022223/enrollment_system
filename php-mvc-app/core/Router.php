<?php
/**
 * Router: maps query params to controller actions
 * - index.php?page=login
 * - index.php?page=dashboard
 * - index.php?page=tasks&action=create
 */
class Router
{
    public function dispatch(): void
    {
        $page = $_GET['page'] ?? '';
        $action = $_GET['action'] ?? 'index';

        if ($page === '') {
            // Default landing: if logged-in go dashboard else login
            if (!empty($_SESSION['user'])) {
                $page = 'dashboard';
            } else {
                $page = 'login';
            }
        }

        switch ($page) {
            case 'login':
                $controller = new AuthController();
                if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                    $controller->login();
                } else {
                    $controller->showLogin();
                }
                break;

            case 'logout':
                (new AuthController())->logout();
                break;

            case 'dashboard':
                $this->requireAuth();
                (new DashboardController())->index();
                break;

            case 'tasks':
                $this->requireAuth();
                $controller = new TaskController();
                if ($action === 'create') {
                    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                        $controller->store();
                    } else {
                        $controller->create();
                    }
                } elseif ($action === 'edit') {
                    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                        $controller->update();
                    } else {
                        $controller->edit();
                    }
                } elseif ($action === 'delete') {
                    $controller->delete();
                } else {
                    $controller->index();
                }
                break;

            default:
                http_response_code(404);
                include __DIR__ . '/../views/errors/404.php';
        }
    }

    private function requireAuth(): void
    {
        if (empty($_SESSION['user'])) {
            header('Location: index.php?page=login');
            exit;
        }
    }
}
?>
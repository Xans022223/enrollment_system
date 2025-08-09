<?php
class TaskController extends Controller
{
    private Task $taskModel;

    public function __construct()
    {
        $this->taskModel = new Task();
    }

    public function index(): void
    {
        $userId = $_SESSION['user']['id'];
        $tasks = $this->taskModel->getAllByUserId($userId);
        $this->render('tasks/index', ['tasks' => $tasks, 'title' => 'My Tasks']);
    }

    public function create(): void
    {
        $this->render('tasks/create', ['title' => 'Create Task']);
    }

    public function store(): void
    {
        $userId = $_SESSION['user']['id'];
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');

        if ($title === '') {
            $this->render('tasks/create', ['error' => 'Title is required']);
            return;
        }

        $this->taskModel->create($userId, $title, $description);
        header('Location: index.php?page=tasks');
        exit;
    }

    public function edit(): void
    {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        $userId = $_SESSION['user']['id'];
        $task = $this->taskModel->findByIdAndUserId($id, $userId);
        if (!$task) {
            http_response_code(404);
            $this->render('errors/404', [], false);
            return;
        }
        $this->render('tasks/edit', ['task' => $task, 'title' => 'Edit Task']);
    }

    public function update(): void
    {
        $id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
        $userId = $_SESSION['user']['id'];
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $status = trim($_POST['status'] ?? 'open');

        if ($title === '') {
            $task = $this->taskModel->findByIdAndUserId($id, $userId);
            $this->render('tasks/edit', ['task' => $task, 'error' => 'Title is required']);
            return;
        }

        $this->taskModel->update($id, $userId, $title, $description, $status);
        header('Location: index.php?page=tasks');
        exit;
    }

    public function delete(): void
    {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        $userId = $_SESSION['user']['id'];
        $this->taskModel->delete($id, $userId);
        header('Location: index.php?page=tasks');
        exit;
    }
}
?>
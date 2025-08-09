<?php
/**
 * Base Controller with view rendering helper
 */
abstract class Controller
{
    /**
     * Render a PHP view inside the main layout
     */
    protected function render(string $viewPath, array $data = [], bool $useLayout = true): void
    {
        extract($data, EXTR_SKIP);
        $fullViewPath = __DIR__ . '/../views/' . $viewPath . '.php';
        if (!file_exists($fullViewPath)) {
            http_response_code(404);
            $fullViewPath = __DIR__ . '/../views/errors/404.php';
        }

        if ($useLayout) {
            $contentViewPath = $fullViewPath; // used by layout to include the content
            include __DIR__ . '/../views/layout/main.php';
        } else {
            include $fullViewPath;
        }
    }

    /**
     * Redirect helper
     */
    protected function redirect(string $path): void
    {
        header('Location: ' . $path);
        exit;
    }
}
?>
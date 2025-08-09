<?php
class Task
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function getAllByUserId(int $userId): array
    {
        $stmt = $this->db->prepare('SELECT id, title, description, status, created_at, updated_at FROM tasks WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findByIdAndUserId(int $id, int $userId): ?array
    {
        $stmt = $this->db->prepare('SELECT id, title, description, status, created_at, updated_at FROM tasks WHERE id = :id AND user_id = :user_id LIMIT 1');
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(int $userId, string $title, string $description): int
    {
        $stmt = $this->db->prepare('INSERT INTO tasks (user_id, title, description, status, created_at, updated_at) VALUES (:user_id, :title, :description, "open", NOW(), NOW())');
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':title', $title, PDO::PARAM_STR);
        $stmt->bindValue(':description', $description, PDO::PARAM_STR);
        $stmt->execute();
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, int $userId, string $title, string $description, string $status): bool
    {
        $stmt = $this->db->prepare('UPDATE tasks SET title = :title, description = :description, status = :status, updated_at = NOW() WHERE id = :id AND user_id = :user_id');
        $stmt->bindValue(':title', $title, PDO::PARAM_STR);
        $stmt->bindValue(':description', $description, PDO::PARAM_STR);
        $stmt->bindValue(':status', $status, PDO::PARAM_STR);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM tasks WHERE id = :id AND user_id = :user_id');
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
?>
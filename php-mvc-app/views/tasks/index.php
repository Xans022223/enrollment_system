<section class="tasks">
  <div class="header">
    <h2>My Tasks</h2>
    <a class="btn" href="index.php?page=tasks&action=create">+ New Task</a>
  </div>

  <?php if (!empty($tasks)): ?>
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Created</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($tasks as $t): ?>
          <tr>
            <td><?= htmlspecialchars($t['title']) ?></td>
            <td><?= htmlspecialchars($t['status']) ?></td>
            <td><?= htmlspecialchars($t['created_at']) ?></td>
            <td class="actions">
              <a href="index.php?page=tasks&action=edit&id=<?= (int)$t['id'] ?>">Edit</a>
              <a class="danger" href="index.php?page=tasks&action=delete&id=<?= (int)$t['id'] ?>" onclick="return confirm('Delete this task?');">Delete</a>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php else: ?>
    <p>No tasks yet. Create your first one!</p>
  <?php endif; ?>
</section>
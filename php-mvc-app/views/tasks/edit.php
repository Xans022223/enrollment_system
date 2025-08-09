<section class="task-edit">
  <h2>Edit Task</h2>
  <?php if (!empty($error)): ?>
    <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
  <?php endif; ?>
  <form method="post" action="index.php?page=tasks&action=edit">
    <input type="hidden" name="id" value="<?= (int)$task['id'] ?>" />
    <div class="form-group">
      <label for="title">Title</label>
      <input type="text" id="title" name="title" required value="<?= htmlspecialchars($task['title']) ?>" />
    </div>
    <div class="form-group">
      <label for="description">Description</label>
      <textarea id="description" name="description" rows="5"><?= htmlspecialchars($task['description']) ?></textarea>
    </div>
    <div class="form-group">
      <label for="status">Status</label>
      <select id="status" name="status">
        <?php $statuses = ['open', 'in_progress', 'done']; ?>
        <?php foreach ($statuses as $s): ?>
          <option value="<?= $s ?>" <?= $task['status'] === $s ? 'selected' : '' ?>><?= ucfirst(str_replace('_',' ', $s)) ?></option>
        <?php endforeach; ?>
      </select>
    </div>
    <button type="submit">Save</button>
    <a class="btn-secondary" href="index.php?page=tasks">Cancel</a>
  </form>
</section>
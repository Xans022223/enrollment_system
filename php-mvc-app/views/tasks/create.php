<section class="task-create">
  <h2>Create Task</h2>
  <?php if (!empty($error)): ?>
    <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
  <?php endif; ?>
  <form method="post" action="index.php?page=tasks&action=create">
    <div class="form-group">
      <label for="title">Title</label>
      <input type="text" id="title" name="title" required />
    </div>
    <div class="form-group">
      <label for="description">Description</label>
      <textarea id="description" name="description" rows="5"></textarea>
    </div>
    <button type="submit">Create</button>
    <a class="btn-secondary" href="index.php?page=tasks">Cancel</a>
  </form>
</section>
<section class="auth auth-login">
  <h2>Login</h2>
  <?php if (!empty($error)): ?>
    <div class="alert alert-error"><?= htmlspecialchars($error) ?></div>
  <?php endif; ?>
  <form method="post" action="index.php?page=login">
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" name="username" required />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required />
    </div>
    <button type="submit">Sign In</button>
  </form>
</section>
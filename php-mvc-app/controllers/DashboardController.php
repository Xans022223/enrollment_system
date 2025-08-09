<?php
class DashboardController extends Controller
{
    public function index(): void
    {
        $this->render('dashboard/index', [
            'title' => 'Dashboard'
        ]);
    }
}
?>
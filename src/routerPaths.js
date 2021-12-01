const router = {
  auth: {
    getUrl: () => router.auth.path,
    path: '/auth',
  },
  dashboard: {
    getUrl: () => router.dashboard.path,
    path: '/',
  },
};

export default router;

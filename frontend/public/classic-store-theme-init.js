(() => {
  try {
    const savedTheme = window.localStorage.getItem('classic-store-theme');
    document.documentElement.setAttribute('data-theme', savedTheme === 'dark' ? 'dark' : 'light');
  } catch {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

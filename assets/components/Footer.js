function Footer() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-gray-500 dark:text-gray-400 flex-wrap">
      <span>Copyright © The Oficial Hub {new Date().getFullYear()}</span>
      <span className="hidden sm:inline">|</span>
      <a href="privacy.html" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
        Política de Privacidade
      </a>
      <a href="terms.html" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
        Termos de Serviço
      </a>
    </footer>
  );
}

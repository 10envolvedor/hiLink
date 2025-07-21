function ThemeToggler() {
  // 1. Conecta-se ao nosso ThemeProvider para obter o estado e a função de alteração.
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-lg gap-1">
      <SquareIcon
        icon="fa-solid fa-sun"
        onClick={() => setTheme("light")}
        className={`text-lg p-2 rounded-full transition-colors duration-200 ${
          theme === "light"
            ? "bg-blue-500 text-white"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
        title="Modo Claro"
      />

      <SquareIcon
        icon="fa-solid fa-moon"
        onClick={() => setTheme("dark")}
        className={`text-lg p-2 rounded-full transition-colors duration-200 ${
          theme === "dark"
            ? "bg-blue-500 text-white"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
        title="Modo Escuro"
      />

      <SquareIcon
        icon={
          theme === "system"
            ? "fa-solid fa-wand-magic-sparkles"
            : "fa-solid fa-wand-magic"
        }
        onClick={() => setTheme("system")}
        className={`text-lg p-2 rounded-full transition-colors duration-200 ${
          theme === "system"
            ? "bg-blue-500 text-white"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
        title="Usar preferência do Sistema"
      />
    </div>
  );
}

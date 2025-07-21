function Header() {
  const { isSignedIn, signIn, signOut, backupToDrive, restoreFromDrive, isLoading } = useGoogleDrive();


  return (
    <header className="dark:bg-gray-800 pt-6 pb-4 px-8 flex flex-row flex-nowrap justify-between items-center">
      <div className="flex flex-row items-center content-center align-center justify-center gap-4">
        <h1 className="flex flex-col justify-between items-center text-2xl font-bold dark:text-white"><img src="assets/icon/hiLink.png" alt="hiLink Logo" className="w-16 h-16" /> hiLink</h1>
        <h2 className="text-gray-600 dark:text-gray-300 hidden md:block">Salve e tenha em mãos os <span className="underline">Links</span> que mais te importam.</h2>
      </div>

      <div className="flex items-center gap-4">
        {isLoading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>}
        
        {isSignedIn ? (
          <>
            <Button onClick={backupToDrive} disabled={isLoading} title="Salvar backup no Google Drive">
              <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
              Backup
            </Button>
            <Button onClick={restoreFromDrive} disabled={isLoading} title="Restaurar a partir de um backup">
              <i className="fa-solid fa-cloud-arrow-down mr-2"></i>
              Restaurar
            </Button>
            <Button onClick={signOut} disabled={isLoading}>
              <i className="fa-brands fa-google mr-2"></i>
              Sair
            </Button>
          </>
        ) : (
          <Button onClick={signIn} disabled={isLoading}>
            <i className="fa-brands fa-google mr-2"></i>
            Login com Google
          </Button>
        )}

        {/* <ThemeToggler /> */}
      </div>
    </header>
  );
}

function Header() {
  const {
    isSignedIn,
    signIn,
    signOut,
    backupToDrive,
    restoreFromDrive,
    isLoading,
  } = useGoogleDrive();

  return (
    <header className="w-full flex flex-row max-[320px]:flex-col justify-between items-center gap-4 pt-6">
      <h1 className="flex flex-col items-center font-black text-2xl">
        <img
          src="assets/icon/hiLink.png"
          title="Nosso logotipo oficial"
          alt="hiLink Logotipo"
          className="h-16 w-16"
        />
        hiLink
      </h1>

      <div className="w-full flex flex-col md:flex-row justify-end md:justify-between item-start md:items-center gap-2">
        <h2 className="text-gray-600 text-end max-[320px]:text-center">
          Salve e consulte seus <span className="font-black">Links</span> mais
          importantes.
        </h2>

        <nav className="flex items-center max-[320px]:justify-center">
          {isLoading && (
            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></span>
          )}

          {isSignedIn ? (
            <ul className="flex flex-row justify-end max-[320px]:justify-center items-center gap-4">
              <li>
                <Button
                  className="flex flex-col md:flex-row items-center gap-1"
                  onClick={backupToDrive}
                  disabled={isLoading}
                  title="Salvar backup no Drive"
                >
                  <SquareIcon icon="fa-solid fa-cloud-arrow-up" />
                  Backup
                </Button>
              </li>
              <li>
                <Button
                  className="flex flex-col md:flex-row items-center gap-1"
                  onClick={restoreFromDrive}
                  disabled={isLoading}
                  title="Restaurar a partir de um backup no Drive"
                >
                  <SquareIcon icon="fa-solid fa-cloud-arrow-down" />
                  Restaurar
                </Button>
              </li>
              <li>
                <Button
                  className="flex flex-col md:flex-row items-center gap-1"
                  onClick={signOut}
                  disabled={isLoading}
                  title="Deslogar do Google"
                >
                  <SquareIcon icon="fa-brands fa-google" />
                  Logout
                </Button>
              </li>
            </ul>
          ) : (
            <ul className="w-full flex flex-row justify-end max-[320px]:justify-center items-center gap-4">
              <li>
                <Button
                  className="flex flex-row items-center gap-1"
                  onClick={signIn}
                  disabled={isLoading}
                  title="Logar no Google"
                >
                  <SquareIcon icon="fa-brands fa-google" />
                  Login com Google
                </Button>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
}

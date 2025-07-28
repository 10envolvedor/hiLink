const GoogleDriveContext = React.createContext();

// As credenciais agora são carregadas do arquivo config.js, que não está no Git.
// Isso evita que suas chaves secretas sejam expostas no repositório.
const CLIENT_ID = window.GOOGLE_CLIENT_ID;
const API_KEY = window.GOOGLE_API_KEY;

const SCOPES = "https://www.googleapis.com/auth/drive.appdata"; // Escopo para a pasta de dados do aplicativo (oculta)

function GoogleDriveProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const [confirmation, setConfirmation] = React.useState(null);

  // Usamos useRef para armazenar o cliente de token para que ele persista entre as renderizações.
  const tokenClientRef = React.useRef(null);

  // Efeito para carregar os scripts do Google, inicializar os clientes e restaurar a sessão.
  React.useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () =>
          reject(new Error(`Falha ao carregar o script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const initializeApis = async () => {
      try {
        // 1. Espera que ambos os scripts do Google sejam carregados.
        await Promise.all([
          loadScript("https://apis.google.com/js/api.js"),
          loadScript("https://accounts.google.com/gsi/client"),
        ]);

        // 2. Inicializa o GAPI client (para interagir com a API do Drive).
        await new Promise((resolve) => gapi.load("client", resolve));
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
          ],
        });

        // 3. Inicializa o GIS client (para autenticação).
        tokenClientRef.current = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              gapi.client.setToken(tokenResponse);
              setIsSignedIn(true);
            } else {
              // Não é um erro se o usuário não estiver logado, então não definimos o estado de erro aqui.
            }
          },
          error_callback: (error) => {
            // Este callback é acionado se houver um erro durante a obtenção do token (ex: popup bloqueado, consentimento necessário, etc.)
            console.warn(
              "GoogleDriveProvider: Erro no callback de autenticação:",
              error
            );
          },
        });

        // 4. Tenta restaurar a sessão silenciosamente.
        tokenClientRef.current.requestAccessToken({ prompt: "" });
      } catch (err) {
        console.error("Erro ao inicializar as APIs do Google", err);
        setError(
          "Falha ao carregar os serviços do Google. Por favor, recarregue a página."
        );
      }
    };

    initializeApis();
  }, []);

  const signIn = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken({ prompt: "select_account" });
    } else {
      setError("Cliente de autenticação não está pronto.");
    }
  };

  const signOut = () => {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        gapi.client.setToken("");
        setIsSignedIn(false);
      });
    }
  };

  // Função para exportar os dados do Dexie para um JSON
  const exportarDatabaseParaJson = async () => {
    const links = await db.links.toArray();
    const backupData = {
      appName: "hiLink",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: { links },
    };
    return JSON.stringify(backupData, null, 2);
  };

  // Função para importar um JSON para o Dexie
  const importarJsonParaDatabase = async (jsonData) => {
    const backup = JSON.parse(jsonData);
    if (backup.appName !== "hiLink" || !backup.data?.links) {
      throw new Error("Arquivo de backup inválido ou incompatível.");
    }
    setConfirmation({
      title: "Confirmar Substituição",
      text: "Todos os seus dados locais atuais serão substituídos por este backup. Deseja continuar?",
      onConfirm: async () => {
        setConfirmation(null);
        await db.links.clear();
        await db.links.bulkPut(backup.data.links);
        setAlert({ title: "Sucesso", text: "Dados restaurados com sucesso! A página será recarregada." });
        setTimeout(() => window.location.reload(), 2000);
      },
      onCancel: () => setConfirmation(null),
    });
  };

  const backupToDrive = async () => {
    if (!isSignedIn) return setAlert({ title: "Atenção", text: "Você precisa fazer login com o Google primeiro." });
    setIsLoading(true);
    try {
      const jsonData = await exportarDatabaseParaJson();
      const fileName = `hiLink-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;

      const metadata = {
        name: fileName,
        mimeType: "application/json",
        parents: ["appDataFolder"], // Salva na pasta de dados do aplicativo (oculta para o usuário)
      };

      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      form.append("file", new Blob([jsonData], { type: "application/json" }));

      // Usamos fetch diretamente para mais controle sobre o upload multipart.
      // Isso garante que o nome do arquivo seja enviado corretamente.
      const accessToken = gapi.client.getToken().access_token;
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: form,
        }
      );

      if (!response.ok) {
        // Se a resposta não for OK, tentamos ler o corpo do erro.
        const errorBody = await response.json();
        throw new Error(errorBody.error.message || "Falha no upload");
      }

      setAlert({ title: "Backup Concluído", text: "Seu backup foi salvo com sucesso na pasta de dados do aplicativo no seu Google Drive!" });
    } catch (err) {
      console.error("Erro no backup:", err);
      setAlert({ title: "Erro no Backup", text: `Falha ao realizar o backup: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const restoreFromDrive = async () => {
    if (!isSignedIn) return setAlert({ title: "Atenção", text: "Você precisa fazer login com o Google primeiro." });
    setIsLoading(true);
    try {
      // 1. Lista os arquivos da pasta de dados do aplicativo
      const response = await gapi.client.drive.files.list({
        spaces: "appDataFolder",
        fields: "files(id, name, modifiedTime)",
        pageSize: 10,
        orderBy: "modifiedTime desc",
      });

      const files = response.result.files;
      if (!files || files.length === 0) {
        setAlert({ title: "Nenhum Backup", text: "Nenhum arquivo de backup foi encontrado na sua conta do Google Drive." });
        return;
      }

      // 2. Pede confirmação para restaurar o backup mais recente
      const latestFile = files[0];
      setConfirmation({
        title: "Restaurar Backup?",
        text: `Deseja restaurar o backup mais recente de ${new Date(latestFile.modifiedTime).toLocaleString()}?`,
        onConfirm: async () => {
          setConfirmation(null);
          // 3. Baixa o conteúdo do arquivo
          const fileResponse = await gapi.client.drive.files.get({
            fileId: latestFile.id,
            alt: "media",
          });
          await importarJsonParaDatabase(fileResponse.body);
        },
        onCancel: () => setConfirmation(null),
      });
    } catch (err) {
      console.error("Erro na restauração:", err);
      setAlert({ title: "Erro na Restauração", text: `Falha ao restaurar: ${err.result?.error?.message || err.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    isSignedIn,
    isLoading,
    error,
    signIn,
    signOut,
    backupToDrive,
    restoreFromDrive,
  };

  return (
    <GoogleDriveContext.Provider value={contextValue}>
      {children}
      {alert && <AlertModal content={alert} onClose={() => setAlert(null)} />}
      {confirmation && <ConfirmationModal content={confirmation} onConfirm={confirmation.onConfirm} onCancel={confirmation.onCancel} />}
    </GoogleDriveContext.Provider>
  );
}

function useGoogleDrive() {
  const context = React.useContext(GoogleDriveContext);
  if (context === undefined) {
    throw new Error("useGoogleDrive must be used within a GoogleDriveProvider");
  }
  return context;
}

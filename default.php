<!DOCTYPE html>
<html>
  <head>
    <!-- @todo mudar tudo de site pra link -->
     <!-- @todo mudar tudo de url pra link -->

    <title>hiLink</title>

    <link rel="icon" href="assets/icon/hiLink.png" />

    <!-- fazer seo -->
    <meta charset="UTF-8" />
    <meta name="lan" content="Free Web tutorials">
    <meta name="description" content="Free Web tutorials">
  <meta name="keywords" content="HTML, CSS, JavaScript">
  <meta name="author" content="John Doe">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" href="css/default.css" />

    <script src="http://localhost:8097"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

    <!-- Don't use this in production: -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <script src="https://unpkg.com/dexie@4.0.7/dist/dexie.min.js"></script>
    <script src="config/database.js"></script>

    <!-- Carrega as chaves de API de um arquivo não versionado -->
    <!-- Este arquivo precisa ser criado manualmente no ambiente de produção -->
    <script src="config.js"></script>

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Istok+Web:ital,wght@0,400;0,700;1,400;1,700&display=swap"
      rel="stylesheet"
    />

    <!-- Trocado para o script padrão do Tailwind Play CDN, que é mais estável e confiável -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      // A única configuração necessária para o Tailwind é esta:
      tailwind.config = {
        darkMode: 'class',
      }
    </script>

    <script src="https://unpkg.com/@popperjs/core@2"></script>

    <script src="https://unpkg.com/react-popper/dist/index.umd.js"></script>

    <link rel="stylesheet" href="css/popper.css" />

    <link rel="stylesheet" href="css/animations.css" />

    
  </head>
  <body className="bg-white">
    <!-- upvote e downvote -->

    <!-- @todo fazer o primeiro aviso de que precisa usar no mesmobrowser, epois criar segmentação por conta, e fazer já integração com o drive -->

    <noscript>
      <p>Seu navegador não suporta JavaScript ou ele está desativado.</p>
    </noscript>

    <div id="root"></div>

    <!-- <script type="text/babel" src="assets/components/ThemeProvider.js"></script> -->
    <script type="text/babel" src="assets/components/GoogleDriveProvider.js"></script>
    <script type="text/babel" src="assets/components/LinksProvider.js"></script>

    <script type="text/babel" src="assets/components/SquareIcon.js"></script>

    <script
      type="text/babel"
      src="assets/components/TooltipExample.js"
    ></script>

    <script type="text/babel" src="assets/components/Button.js"></script>
    <script type="text/babel" src="assets/components/ShareButton.js"></script>
    <!-- <script type="text/babel" src="assets/components/ThemeToggler.js"></script> -->

    <script type="text/babel" src="assets/components/ActionMenu.js"></script>
    <script type="text/babel" src="assets/components/Tooltip.js"></script>

    <script type="text/babel" src="assets/components/MenuItem.js"></script>
    <script type="text/babel" src="assets/components/Header.js"></script>

    <script type="text/babel" src="assets/components/LinkManager.js"></script>
    <script type="text/babel" src="assets/components/SaveUrl.js"></script>
    <script type="text/babel" src="assets/components/LinkCounter.js"></script>
    <script type="text/babel" src="assets/components/UrlItem.js"></script>
    <script type="text/babel" src="assets/components/Main.js"></script>

    <script type="text/babel" src="assets/components/Footer.js"></script>

    <script type="text/babel" src="App.js"></script>

    <script type="text/babel">
      const container = document.getElementById("root");
      const root = ReactDOM.createRoot(container);
      root.render(<MyApp />);
    </script>
    <!--
      Note: this page is a great way to try React but it's not suitable for production.
      It slowly compiles JSX with Babel in the browser and uses a large development build of React.

      Read this page for starting a new React project with JSX:
      https://react.dev/learn/start-a-new-react-project

      Read this page for adding React with JSX to an existing project:
      https://react.dev/learn/add-react-to-an-existing-project
    -->
  </body>
</html>

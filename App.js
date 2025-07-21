function MyApp() {
  return (
    // Usamos um Fragment <>...</> para agrupar os elementos
    // <ThemeProvider>
      <GoogleDriveProvider>
        <LinksProvider>
          <div className="flex flex-col min-h-screen font-['Istok_Web']">
            <Header />
            <Main />
            <Footer />
          </div>
        </LinksProvider>
      </GoogleDriveProvider>
    // </ThemeProvider>
  );
}

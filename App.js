function App() {
  return (
    <GoogleDriveProvider>
      <LinksProvider>
        <div className="min-h-screen min-w-screen bg-white font-['Istok_Web']">
          <div className="max-w-[1024px] xl:w-[80dvw] xl:max-w-[1344px] flex flex-col min-h-screen mx-auto gap-8 py-4 px-8">
            <Header />
            <Main />
            <Footer />
          </div>
        </div>
      </LinksProvider>
    </GoogleDriveProvider>
  );
}

import { Route, Routes } from "react-router-dom";
import { IndexVentanaChat } from "./components/IndexVentanaChat";
import { Documentos } from "./pages/Documentos";

function App() {
  return (
    <>
      <div className="min-h-screen bg-zinc-900 text-white">
        <Routes>
          <Route path="/" element={<IndexVentanaChat />} />
          <Route path="/documentos" element={<Documentos />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

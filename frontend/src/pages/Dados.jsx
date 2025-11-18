import React from "react";
import { useAuth } from "../context/AuthContext";
import { Header, Footer } from "../components/LandingSections";

// Componente que exibirá os gráficos, tabelas, etc.
import DadosDashboard from "../components/DadosDashboard";

export default function Dados() {
  const { token, profile, setToken, setProfile } = useAuth();

  const handleLogout = () => {
    setToken(null);
    setProfile(null);
  };

  return (
    <>
      <Header
        onLoginClick={() => {}}
        isAuthenticated={Boolean(token)}
        role={profile?.role}
        onLogout={handleLogout}
        activeSection="dados"
      />

      <main className="section">
        <div className="container">
          <DadosDashboard />
        </div>
      </main>

      <Footer />
    </>
  );
}

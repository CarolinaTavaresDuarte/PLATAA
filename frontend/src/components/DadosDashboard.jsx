import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi"; 
import BrazilMapD3 from './BrazilMapD3'; 

export default function DadosDashboard() {
  const { get } = useApi(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [geoData, setGeoData] = useState([]); 
  const [ibgeData, setIbgeData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. BUSCA DADOS DA SUA API
        const ibgeDataRaw = await get("/api/v1/ibge/autism-indigenous");
        const dataArray = Array.isArray(ibgeDataRaw) ? ibgeDataRaw : (ibgeDataRaw.data || []);
        setIbgeData(dataArray); 

        // 2. BUSCA O MAPA DO BRASIL (GeoJSON Online)
        const geoResponse = await fetch('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson');
        
        if (!geoResponse.ok) {
            throw new Error(`Falha ao baixar o mapa: ${geoResponse.statusText}`);
        }
        
        const mapJson = await geoResponse.json();
        
        if (mapJson && mapJson.features) {
            setGeoData(mapJson.features); 
        } else {
            throw new Error("Formato do GeoJSON inválido.");
        }

      } catch (e) {
        console.error("Erro no Dashboard:", e);
        setError("Não foi possível carregar os dados. Verifique se o backend está rodando.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [get]); 

  // --- LÓGICA DE FILTRO ---
  // Cria uma nova lista contendo apenas os estados que batem com a pesquisa
  const filteredData = ibgeData.filter(item => 
    item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
      return (
          <div className="container section">
              <h2>Dashboard de Dados</h2>
              <p>Carregando visualizações...</p>
          </div>
      );
  }
  
  if (error) {
      return (
          <div className="container section">
              <h2>Dashboard de Dados</h2>
              <h3 style={{ color: 'red' }}>{error}</h3>
          </div>
      );
  }
  
  return (
    <div className="container section">
      <h2>Dashboard de Dados do IBGE</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
          Visão geral do autismo na população indígena. Utilize o campo ao lado para filtrar por estado.
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start' }}>
        
       
        <div style={{ flex: '2', minWidth: '400px', border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
           {geoData.length > 0 ? (
            <BrazilMapD3 ibgeData={ibgeData} geoData={geoData} />
          ) : (
            <p>Carregando mapa...</p>
          )}
        </div>

        <div style={{ flex: '2', minWidth: '400px' }}>
            
            {/* Barra de Pesquisa */}
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
                    Pesquisar Estado:
                </label>
                <input 
                    type="text" 
                    placeholder="Ex: Amazonas..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        fontSize: '16px'
                    }}
                />
            </div>

            {/* Tabela com Scroll */}
            <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                {filteredData.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0, zIndex: 1 }}>
                            <tr>
                                <th style={thStyle}>Estado</th>
                                <th style={thStyle}>População</th>
                                <th style={thStyle}>Casos Diagnosticados  </th>
                                <th style={thStyle}>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}><strong>{item.location}</strong></td>
                                    {/* .toLocaleString() formata os números (ex: 1.000) */}
                                    <td style={tdStyle}>{item.indigenous_population.toLocaleString()}</td>
                                    <td style={tdStyle}>{item.autism_count.toLocaleString()}</td>
                                    <td style={{
                                        ...tdStyle, 
                                        color: '#d1584fff', 
                                        fontWeight: 'bold'
                                    }}>
                                        {item.autism_percentage.toFixed(2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                        Nenhum estado encontrado para "{searchTerm}"
                    </div>
                )}
            </div>
            
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#888', textAlign: 'right' }}>
                Mostrando {filteredData.length} resultados.
            </div>
        </div>

      </div>
    </div>
  );
}

// Estilos simples para as células da tabela
const thStyle = { padding: '12px 10px', textAlign: 'left', color: '#444', borderBottom: '2px solid #ddd' };
const tdStyle = { padding: '10px', verticalAlign: 'middle' };
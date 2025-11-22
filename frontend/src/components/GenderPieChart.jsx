import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Definições de tamanho
const width = 300;
const height = 300;
const radius = Math.min(width, height) / 2;

export default function GenderPieChart({ malePercentage, femalePercentage }) {
    const svgRef = useRef(null);

    // Estrutura de dados para o D3 Pie Layout
    const data = [
        { label: 'Homens', value: malePercentage || 0, color: '#DC3545' }, // Vermelho/Laranja (Alto)
        { label: 'Mulheres', value: femalePercentage || 0, color: '#007BFF' } // Azul (Baixo)
    ];

    useEffect(() => {
        // Checagem de segurança
        if (!svgRef.current) return;

        // Limpa o SVG anterior
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            // Move o centro para o meio do SVG
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // 1. O Gerador de Pie: Define como os dados serão transformados em arcos
        const pie = d3.pie()
            .value(d => d.value) // Usa o campo 'value' (a porcentagem)
            .sort(null); // Não ordena os dados

        // 2. O Gerador de Arco: Desenha o caminho SVG do arco
        const arc = d3.arc()
            .innerRadius(0) // Gráfico de Pizza (Não Donut)
            .outerRadius(radius * 0.8); // 80% do raio para deixar margem

        // 3. O Gerador de Arco Externo para Rótulos
        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        // Gera os arcos (paths) a partir dos dados formatados pelo pie()
        const arcs = pie(data);

        // Desenho dos arcos
        svg.selectAll('allSlices')
            .data(arcs)
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => data[i].color)
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.9);

        // Adiciona os rótulos de porcentagem dentro do arco
        svg.selectAll('allLabels')
            .data(arcs)
            .enter()
            .append('text')
            .text(d => {
                // Exibe o valor apenas se for significativo
                return d.data.value > 0 ? `${d.data.label}: ${d.data.value.toFixed(1)}%` : '';
            })
            .attr('transform', d => {
                // Coloca o texto no centro do arco
                const pos = arc.centroid(d);
                return `translate(${pos})`;
            })
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .style("fill", "white")
            .style("font-weight", "bold");

    }, [malePercentage, femalePercentage]); // Refaz o gráfico se as porcentagens mudarem

    return (
        <div style={{ margin: '20px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '15px' }}>
                <span role="img" aria-label="Gênero">👨‍🦱👩‍🦱</span> Distribuição de Casos por Sexo
            </h3>
            <div style={{ display: 'inline-block', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                <svg ref={svgRef}></svg>
            </div>
            <p style={{ fontSize: '12px', color: '#6c757d', marginTop: '10px' }}>
                *Baseado no total de casos diagnosticados no conjunto de dados.
            </p>
        </div>
    );
}
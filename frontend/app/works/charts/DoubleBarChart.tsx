import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TimestepData {
  year: string | number;
  total_results: number;
  total_citations: number;
}

interface TimeSeriesProps {
  data: TimestepData[];
  containerId: string;
  width: number;
  height?: number;
}

export const TimeSeriesChart: React.FC<TimeSeriesProps> = ({
  data,
  containerId,
  width,
  height = Math.min(width * 0.5, 400),
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Get the actual container width
    const containerWidth = chartRef.current.getBoundingClientRect().width;
    const actualWidth = Math.min(width, containerWidth);

    const margin = {
      top: 40,
      right: actualWidth < 600 ? 80 : 100,
      bottom: 50,
      left: actualWidth < 400 ? 60 : 60,
    };
    const innerWidth = actualWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Remove previous SVG if any
    d3.select(chartRef.current).selectAll("svg").remove();

    // Create SVG container
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", actualWidth)
      .attr("height", height)
      .style("max-width", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => String(d.year))) // Ensure year is treated as string for x-axis
      .range([0, innerWidth])
      .padding(0.4);

    // Format y-axis ticks for better readability
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.total_results, d.total_citations)) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Format y-axis values as 'k' or 'M' for readability
    const formatYAxis = (value: number) => {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
      return value.toString();
    };

    // Bar width for the grouped bars
    const barWidth = xScale.bandwidth() / 2;

    // Bars for Total Results
    svg.selectAll<SVGRectElement, TimestepData>(".total-results-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "total-results-bar")
      .attr("x", d => xScale(String(d.year)) ?? 0)
      .attr("y", d => yScale(d.total_results))
      .attr("width", barWidth)
      .attr("height", d => innerHeight - yScale(d.total_results))
      .attr("rx", 4)
      .style("fill", "#4C9AFF")
      .on("mouseover", function () {
        d3.select(this).style("opacity", 0.8);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
      });

    // Bars for Total Citations
    svg.selectAll<SVGRectElement, TimestepData>(".total-citations-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "total-citations-bar")
      .attr("x", d => (xScale(String(d.year)) ?? 0) + barWidth)
      .attr("y", d => yScale(d.total_citations))
      .attr("width", barWidth)
      .attr("height", d => innerHeight - yScale(d.total_citations))
      .attr("rx", 4)
      .style("fill", "#FF8B00")
      .on("mouseover", function () {
        d3.select(this).style("opacity", 0.8);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 1);
      });

    // X-axis
    svg.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style("font-size", actualWidth < 400 ? "10px" : "12px");

    // Y-axis with formatted ticks
    svg.append("g")
      .call(d3.axisLeft(yScale)
        .ticks(actualWidth < 400 ? 5 : 8)
        .tickFormat(d => formatYAxis(d as number)))
      .style("font-size", actualWidth < 400 ? "10px" : "12px");

    // Legend
    const legend = svg.append("g")
      .attr("font-size", actualWidth < 400 ? "10px" : "12px")
      .attr("text-anchor", "start")
      .selectAll("g")
      .data(["Total Results", "Total Citations"])
      .enter()
      .append("g")
      .attr("transform", (d, i) => `translate(${innerWidth + 10},${i * 20})`);

    legend.append("rect")
      .attr("x", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d, i) => i === 0 ? "#4C9AFF" : "#FF8B00")
      .attr("rx", 2);

    legend.append("text")
      .attr("x", 20)
      .attr("y", 12)
      .text(d => d);

  }, [data, width, height]);

  // Match the styling of the StackedBarChart container
  return (
    <div
      id={containerId}
      ref={chartRef}
      style={{
        width: '100%',
        maxWidth: width,
        overflow: 'hidden'
      }}
    />
  );
};

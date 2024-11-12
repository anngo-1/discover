import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TimestepData {
  year: number; // 'year' for the x-axis instead of 'period'
  articles: number;
  preprints: number;
  datasets: number;
}

interface StackedBarChartProps {
  data: TimestepData[];
  containerId: string;
  width: number;
  height?: number;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  containerId,
  width,
  height = Math.min(width * 0.5, 400),
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !d3) return;

    try {
      // Get the actual container width
      const containerWidth = chartRef.current.getBoundingClientRect().width;
      // Use the smaller of the provided width or container width
      const actualWidth = Math.min(width, containerWidth);
      
      const margin = {
        top: 40,
        right: actualWidth < 600 ? 80 : 100,
        bottom: 50,
        left: actualWidth < 400 ? 40 : 60,
      };
      
      const innerWidth = actualWidth - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Clear existing SVG
      d3.select(chartRef.current).selectAll("svg").remove();

      const svg = d3.select(chartRef.current)
        .append("svg")
        .attr("width", actualWidth)
        .attr("height", height)
        .style("max-width", "100%") // Add max-width constraint
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Keys for stacking the data
      const keys = ['articles', 'preprints', 'datasets'];

      // Stack the data using the keys
      const stack = d3.stack<TimestepData>().keys(keys);
      const stackedData = stack(data);

      const colors = ["#4C9AFF", "#FF8B00", "#36B37E"];
      const colorScale = d3.scaleOrdinal<string>()
        .domain(keys)
        .range(colors);

      // X scale for the year (time steps)
      const xScale = d3.scaleBand()
        .domain(data.map(d => d.year.toString())) // Change to use 'year' for the x-axis
        .range([0, innerWidth])
        .padding(0.1);

      // Y scale for the stacked values
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(stackedData[stackedData.length - 1], d => d[1]) || 0])
        .nice()
        .range([innerHeight, 0]);

      // Create the layers for each stack segment
      const layers = svg.selectAll("g.layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "layer")
        .style("fill", (d, i) => colors[i]);

      // Add rectangles for each segment in the stacked bar
      layers.selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.data.year.toString()) ?? 0) // Correctly use 'year' for x-position
        .attr("y", d => yScale(d[1])) // Y position based on the cumulative value
        .attr("height", d => yScale(d[0]) - yScale(d[1])) // Calculate height as the difference
        .attr("width", xScale.bandwidth())
        .attr("rx", 4)
        .on("mouseover", function() {
          d3.select(this).style("opacity", 0.8);
        })
        .on("mouseout", function() {
          d3.select(this).style("opacity", 1);
        });

      // X-axis for the year
      svg.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .style("font-size", actualWidth < 400 ? "10px" : "12px");

      // Y-axis for the stacked values
      svg.append("g")
        .call(d3.axisLeft(yScale))
        .style("font-size", actualWidth < 400 ? "10px" : "12px");

      // Add a legend
      const legend = svg.append("g")
        .attr("font-size", actualWidth < 400 ? "10px" : "12px")
        .attr("text-anchor", "start")
        .selectAll("g")
        .data(keys)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(${innerWidth + 10},${i * 20})`);

      legend.append("rect")
        .attr("x", 0)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => colorScale(d))
        .attr("rx", 2);

      legend.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text(d => d.charAt(0).toUpperCase() + d.slice(1));

    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  }, [data, width, height]);

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

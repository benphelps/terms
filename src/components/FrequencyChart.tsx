import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { AudioTerm } from "../types";
import { harmanCurve, frequencyMapping } from "../data";

interface FrequencyChartProps {
  terms: AudioTerm[];
  onTermClick: (term: AudioTerm) => void;
  selectedTerm?: AudioTerm | null;
}

export function FrequencyChart({
  terms,
  onTermClick,
  selectedTerm,
}: FrequencyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const svg = d3.select(svgRef.current);

    const drawChart = () => {
      // Clear previous content
      svg.selectAll("*").remove();

      // Chart dimensions
      const containerWidth = svgRef.current?.clientWidth || 800;
      const height = 500;
      const margin = { top: 40, right: 60, bottom: 60, left: 90 };
      const chartWidth = containerWidth - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      // Create main group
      const g = svg
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", `0 0 ${containerWidth} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Scales
      const xScale = d3.scaleLog().domain([20, 20000]).range([0, chartWidth]);
      const yScale = d3.scaleLinear().domain([-1, 1]).range([chartHeight, 0]);

      // Axes
      const xAxis = d3
        .axisBottom(xScale)
        .tickValues([20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000])
        .tickFormat((d) =>
          Number(d) >= 1000 ? `${Number(d) / 1000}k` : String(d)
        );

      const yAxis = d3
        .axisLeft(yScale)
        .tickValues([-1, -0.5, 0, 0.5, 1])
        .tickFormat((d) => {
          const labels: Record<string, string> = {
            "-1": "Very Negative",
            "-0.5": "Negative",
            "0": "Neutral",
            "0.5": "Positive",
            "1": "Very Positive",
          };
          return labels[String(d)] || String(d);
        });

      // Grid lines
      g.append("g")
        .attr("class", "grid x-grid")
        .selectAll("line")
        .data([20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000])
        .enter()
        .append("line")
        .attr("x1", (d) => xScale(d))
        .attr("x2", (d) => xScale(d))
        .attr("y1", 0)
        .attr("y2", chartHeight)
        .attr("stroke", "var(--color-neutral-800)")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");

      g.append("g")
        .attr("class", "grid y-grid")
        .selectAll("line")
        .data([-1, -0.5, 0, 0.5, 1])
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", chartWidth)
        .attr("y1", (d) => yScale(d))
        .attr("y2", (d) => yScale(d))
        .attr("stroke", "var(--color-neutral-800)")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");

      // Add frequency band backgrounds
      const frequencyBands = [
        {
          name: "Sub Bass",
          start: 20,
          end: 60,
          color: "color-mix(in oklab, var(--color-violet-500) 2%, transparent)",
        }, // Muted purple
        {
          name: "Bass",
          start: 60,
          end: 250,
          color:
            "color-mix(in oklab, var(--color-emerald-500) 2%, transparent)",
        }, // Muted green
        {
          name: "Low Mids",
          start: 250,
          end: 500,
          color: "color-mix(in oklab, var(--color-yellow-500) 2%, transparent)",
        }, // Muted yellow
        {
          name: "Mids",
          start: 500,
          end: 2000,
          color: "color-mix(in oklab, var(--color-orange-500) 2%, transparent)",
        }, // Muted orange
        {
          name: "High Mids",
          start: 2000,
          end: 4000,
          color: "color-mix(in oklab, var(--color-rose-500) 2%, transparent)",
        }, // Muted red
        {
          name: "Treble",
          start: 4000,
          end: 8000,
          color: "color-mix(in oklab, var(--color-sky-500) 2%, transparent)",
        }, // Muted blue
        {
          name: "Air",
          start: 8000,
          end: 20000,
          color: "color-mix(in oklab, var(--color-violet-500) 2%, transparent)",
        }, // Muted purple
      ];

      frequencyBands.forEach((band) => {
        const startX = Math.max(0, xScale(band.start));
        const endX = Math.min(chartWidth, xScale(band.end));

        g.append("rect")
          .attr("x", startX)
          .attr("y", 0)
          .attr("width", endX - startX)
          .attr("height", chartHeight)
          .attr("fill", band.color)
          .attr("opacity", 0.8);
      });

      // Add axes
      g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "var(--color-neutral-600)")
        .attr("font-size", "12px");

      g.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .selectAll("text")
        .attr("fill", "var(--color-neutral-600)")
        .attr("font-size", "12px");

      // Remove axis domain lines
      g.selectAll(".x-axis path.domain, .y-axis path.domain").attr(
        "stroke",
        "none"
      );

      // Draw Harman curve
      const harmanLine = d3
        .line<{ frequency: number; db: number }>()
        .x((d) => xScale(d.frequency))
        .y((d) => yScale(d.db / 25)) // Scale dB to sentiment range
        .curve(d3.curveMonotoneX);

      g.append("path")
        .datum(harmanCurve)
        .attr("class", "harman-curve")
        .attr("d", harmanLine)
        .attr("fill", "none")
        .attr("stroke", "var(--color-purple-400)")
        .attr("stroke-width", 2)
        .attr("opacity", 0.4)
        .style("filter", "drop-shadow(0 0 2px var(--color-purple-400))");

      // Prepare term data for plotting
      const processedTerms: Array<
        AudioTerm & {
          frequency: number;
          relevance: number;
          range: [number, number];
          x?: number;
          y?: number;
        }
      > = [];

      terms.forEach((term) => {
        const freqData = frequencyMapping[term.term];
        if (freqData) {
          processedTerms.push({
            ...term,
            frequency: freqData.frequency,
            relevance: freqData.relevance,
            range: freqData.range,
          });
        }
      });

      // Position simulation to avoid overlaps
      const simulation = d3
        .forceSimulation(processedTerms)
        .force("x", d3.forceX((d: typeof processedTerms[0]) => xScale(d.frequency)).strength(0.8))
        .force("y", d3.forceY((d: typeof processedTerms[0]) => yScale(d.sentiment)).strength(0.8))
        .force("collide", d3.forceCollide().radius(10).strength(1))
        .stop();

      // Run simulation
      for (let i = 0; i < 120; i++) {
        simulation.tick();
      }

      // Color and size functions
      const getColorForSentiment = (sentiment: number) => {
        if (sentiment > 0.5) return "var(--color-emerald-400)";
        if (sentiment > 0) return "var(--color-green-400)";
        if (sentiment === 0) return "var(--color-neutral-400)";
        if (sentiment > -0.5) return "var(--color-amber-400)";
        return "var(--color-amber-400)";
      };

      // Icon generator (reuse sentiment color)
      const getSentimentIcon = (value: number) => {
        const color = getColorForSentiment(value);
        let iconClass = "fa-grin-beam";
        if (value > 0.7) iconClass = "fa-smile";
        else if (value > 0) iconClass = "fa-smile";
        else if (value === 0) iconClass = "fa-meh";
        else if (value > -0.7) iconClass = "fa-frown";
        else iconClass = "fa-sad-tear";
        return `<i class="fas ${iconClass}" style="color: ${color};"></i>`;
      };

      // Create frequency ranges group
      const rangeGroup = g.append("g").attr("class", "frequency-ranges");
      const pointsGroup = g.append("g").attr("class", "term-points");

      // Radius scale
      const minR = 4,
        maxR = 10;
      const relExtent = d3.extent(processedTerms, (d) => d.relevance) as [
        number,
        number
      ];
      const rScale = d3
        .scalePow()
        .exponent(2)
        .domain(relExtent)
        .range([minR, maxR]);

      // Add term points (with touch support for mobile)
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      let lastHoverTerm: typeof processedTerms[0] | null = null;
      const tooltipSel = d3.select(tooltipRef.current!);
      tooltipSel.style("pointer-events", isTouchDevice ? "auto" : "none");
      if (isTouchDevice) {
        tooltipSel.on("click", () => {
          if (lastHoverTerm) {
            hideTooltip(tooltipSel);
            onTermClick(lastHoverTerm);
          }
        });
      }

      const circles = pointsGroup
        .selectAll(".term-point")
        .data(processedTerms)
        .enter()
        .append("circle")
        .attr("class", "term-point")
        .attr("cx", (d: typeof processedTerms[0]) => d.x!)
        .attr("cy", (d: typeof processedTerms[0]) => d.y!)
        .attr("r", (d) => rScale(d.relevance))
        .attr("fill", (d) => getColorForSentiment(d.sentiment))
        .attr(
          "stroke",
          "color-mix(in oklab, var(--color-neutral-200) 30%, transparent)"
        )
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .style(
          "filter",
          (d) => `drop-shadow(0 2px 8px ${getColorForSentiment(d.sentiment)})`
        );
      if (isTouchDevice) {
        circles.on("click", (event, d) => {
          lastHoverTerm = d;
          // Show frequency range on touch
          showFrequencyRange(d, xScale, yScale, rangeGroup);
          showTooltip(event, d, tooltipSel);
        });
      } else {
        circles
          .on("mouseover", function (event, d) {
            lastHoverTerm = d;
            showFrequencyRange(d, xScale, yScale, rangeGroup);
            pointsGroup
              .selectAll(".term-point")
              .classed("dimmed", function(this: any, pd: any) { return pd.term !== d.term; });
            pointsGroup
              .selectAll(".term-label")
              .classed("dimmed", function(this: any, pd: any) { return pd.term !== d.term; });
            showTooltip(event, d, tooltipSel);
          })
          .on("mouseout", function () {
            rangeGroup.selectAll("*").remove();
            pointsGroup.selectAll(".term-point").classed("dimmed", false);
            pointsGroup.selectAll(".term-label").classed("dimmed", false);
            hideTooltip(tooltipSel);
          })
          .on("click", (_, d) => {
            hideTooltip(tooltipSel);
            onTermClick(d);
          });
      }

      // Add term labels
      pointsGroup
        .selectAll(".term-label")
        .data(processedTerms)
        .enter()
        .append("text")
        .attr("class", "term-label")
        .attr("x", (d: typeof processedTerms[0]) => d.x!)
        .attr("y", (d: typeof processedTerms[0]) => d.y! + 22)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "var(--color-neutral-300)")
        .text((d) => d.term);

      // Add chart title
      svg
        .append("text")
        .attr("x", containerWidth / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "var(--color-neutral-300)")
        .text("Frequency Relevancy Chart");

      // Add axes labels
      svg
        .append("text")
        .attr("x", containerWidth / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "var(--color-neutral-300)")
        .text("Frequency (Hz)");

      svg
        .append("text")
        .attr("transform", `rotate(-90, ${margin.left - 40}, ${height / 2})`)
        .attr("x", margin.left - 40)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "var(--color-neutral-300)")
        .text("Sentiment");

      // Hide tooltip and clear range when clicking outside points (blank areas)
      svg.on("click.clearTooltip", function (event) {
        // If click target is not a term-point circle, hide tooltip and clear range
        if (!(event.target instanceof SVGCircleElement)) {
          hideTooltip(tooltipSel);
          rangeGroup.selectAll("*").remove();
          lastHoverTerm = null;
        }
      });

      // Helper functions
      function showFrequencyRange(
        termData: typeof processedTerms[0],
        xScale: d3.ScaleLogarithmic<number, number, never>,
        yScale: d3.ScaleLinear<number, number, never>,
        rangeGroup: d3.Selection<SVGGElement, unknown, null, undefined>
      ) {
        rangeGroup.selectAll("*").remove();

        // Safety check for range data
        if (
          !termData.range ||
          !Array.isArray(termData.range) ||
          termData.range.length < 2
        ) {
          return;
        }

        const [minFreq, maxFreq] = termData.range;

        // Safety check for valid frequency values
        if (
          typeof minFreq !== "number" ||
          typeof maxFreq !== "number" ||
          isNaN(minFreq) ||
          isNaN(maxFreq) ||
          minFreq >= maxFreq
        ) {
          return;
        }

        const startX = xScale(minFreq);
        const endX = xScale(maxFreq);

        // Safety check for valid x coordinates
        if (isNaN(startX) || isNaN(endX)) {
          return;
        }

        // Animate frequency range highlight
        const rect = rangeGroup
          .append("rect")
          .attr("class", "frequency-range")
          .attr("x", startX)
          .attr("y", 0)
          .attr("width", 0)
          .attr("height", yScale(-1) - yScale(1))
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("fill", "rgba(255, 255, 255, 0.08)")
          .attr("stroke", "rgba(255, 255, 255, 0.25)")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "3, 2")
          .attr("opacity", 0);
        rect
          .transition()
          .duration(300)
          .attr("width", endX - startX)
          .attr("opacity", 1);
      }

      function showTooltip(event: MouseEvent | TouchEvent, termData: typeof processedTerms[0], tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>) {
        const freqData = frequencyMapping[termData.term];
        const sentimentValue = termData.sentiment;

        // Format frequency range
        const minFreq = freqData.range[0];
        const maxFreq = freqData.range[1];
        const formattedMinFreq =
          minFreq >= 1000
            ? (minFreq / 1000).toFixed(1) + "kHz"
            : minFreq + "Hz";
        const formattedMaxFreq =
          maxFreq >= 1000
            ? (maxFreq / 1000).toFixed(1) + "kHz"
            : maxFreq + "Hz";

        // Sentiment icon
        const sentimentIcon = getSentimentIcon(sentimentValue);

        // Get mouse position relative to the SVG container
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) return;

        const mouseX = event.clientX - svgRect.left;
        const mouseY = event.clientY - svgRect.top;

        // Set content and prepare for fade-in
        tooltip
          .html(
            `
          <strong>${termData.term}</strong>
          <div class="tooltip-content">
            <div style="margin: 8px 0;">${termData.summary}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <span style="font-size: 16px;">${sentimentIcon}</span>
              <span style="color: #60a5fa;">${formattedMinFreq} - ${formattedMaxFreq}</span>
            </div>
          </div>
        `
          )
          .style("opacity", 0);

        // Get tooltip dimensions
        const tooltipNode = tooltip.node() as HTMLElement;
        const tooltipRect = tooltipNode.getBoundingClientRect();
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        // Check if tooltip would go off the right edge
        let finalX = mouseX + 10;
        if (mouseX + tooltipWidth + 20 > svgRect.width) {
          finalX = mouseX - tooltipWidth - 10;
        }

        // Check if tooltip would go off the bottom edge
        let finalY = mouseY - 10;
        if (mouseY + tooltipHeight + 10 > svgRect.height) {
          finalY = mouseY - tooltipHeight - 10;
        }

        // Position and fade in tooltip
        tooltip
          .style("left", finalX + "px")
          .style("top", finalY + "px")
          .style("visibility", "visible")
          .transition()
          .duration(200)
          .style("opacity", 1);
      }

      function hideTooltip(tooltip: d3.Selection<HTMLDivElement, unknown, null, undefined>) {
        tooltip.style("visibility", "hidden").style("opacity", 0);
      }
    };

    // Initial draw
    drawChart();

    // Add resize listener
    const handleResize = () => {
      drawChart();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [terms, onTermClick]);

  // Hide tooltip when modal open/close (selectedTerm change)
  useEffect(() => {
    if (tooltipRef.current) {
      d3.select(tooltipRef.current)
        .style("visibility", "hidden")
        .style("opacity", 0);
    }
  }, [selectedTerm]);

  return (
    <section className="mb-8">
      <div className="relative">
        <svg
          ref={svgRef}
          className="w-full overflow-hidden"
          style={{ minHeight: "500px" }}
        />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none bg-neutral-800/95 text-neutral-200 p-3 rounded-lg text-xs border border-neutral-700 shadow-lg backdrop-blur-sm max-w-[280px] leading-relaxed transition-opacity duration-100 opacity-0 invisible z-50"
          style={{ lineHeight: 1.5 }}
        />
      </div>

      <p className="text-neutral-500 text-center mt-4 text-xs max-w-5xl mx-auto leading-relaxed opacity-80">
        This interactive chart plots audiophile terms by their primary frequency
        relevance (X-axis) and sentiment polarity (Y-axis). Circle size
        indicates relevance strength. Click any point to view detailed term
        information. The purple line shows the Harman target curve as a
        frequency response reference. Use the filters above to explore terms by
        sentiment category and specific subcategories like &quot;Bass Character&quot; or
        &quot;Treble Character&quot;.
      </p>
    </section>
  );
}

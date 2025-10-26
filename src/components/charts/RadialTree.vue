<template>
    <div class="chart-container">
      <button v-if="canGoBack" @click="goBack" class="back-btn">⬅ Back</button>
      <div ref="chartRef" class="radial-chart"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, reactive } from "vue";
  import * as d3 from "d3";
  
  const chartRef = ref(null);
  const state = reactive({ history: [], canGoBack: false });
  const canGoBack = ref(false);
  
  const data = {
    name: "Hội Thánh Mẹ",
    color: "green",
    big: true,
    children: [
      {
        name: "Chi nhánh 1",
        color: "red",
        big: false,
        children: [
          { name: "Nhánh 1.1", color: "green", big: false },
          { name: "Nhánh 1.2", color: "red", big: true }
        ]
      },
      { name: "Chi nhánh 2", color: "green", big: false },
      {
        name: "Chi nhánh 3",
        color: "red",
        big: false,
        children: [
          { name: "Nhánh 3.1", color: "green", big: true },
          { name: "Nhánh 3.2", color: "red", big: false }
        ]
      },
      { name: "Chi nhánh 4", color: "green", big: false },
      { name: "Chi nhánh 5", color: "red", big: true }
    ]
  };
  
  onMounted(() => {
    const width = 900, height = 900, radius = width / 2;
  
    const tree = d3.cluster().size([2 * Math.PI, radius - 150]);
    const root = d3.hierarchy(data);
  
    const svg = d3.select(chartRef.value)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);
  
    // Zoom
    svg.call(d3.zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform.translate(width / 2, height / 2));
      })
    );
  
    function project(x, y) {
      return [Math.cos(x - Math.PI / 2) * y, Math.sin(x - Math.PI / 2) * y];
    }
  
    function line(d) {
      const s = project(d.source.x, d.source.y);
      const t = project(d.target.x, d.target.y);
      return `M${s[0]},${s[1]} L${t[0]},${t[1]}`;
    }
  
    function update(source) {
      tree(root);
  
      const nodes = root.descendants();
      const links = root.links();
  
      // Vẽ links (đường thẳng)
      const link = g.selectAll("path.link")
        .data(links, d => d.target.data.name);
  
      link.join(
        enter => enter.append("path")
          .attr("class", "link")
          .attr("stroke", "#aaa")
          .attr("stroke-width", 1.5)
          .attr("fill", "none")
          .attr("d", d => {
            const s = project(source.x || 0, source.y || 0);
            return `M${s[0]},${s[1]} L${s[0]},${s[1]}`;
          })
          .transition().duration(500)
          .attr("d", line),
        update => update.transition().duration(500).attr("d", line),
        exit => exit.transition().duration(500)
          .attr("d", d => {
            const s = project(source.x || 0, source.y || 0);
            return `M${s[0]},${s[1]} L${s[0]},${s[1]}`;
          })
          .remove()
      );
  
      // Vẽ nodes
      const node = g.selectAll("g.node")
        .data(nodes, d => d.data.name);
  
      const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", d => {
          const pos = project(source.x || 0, source.y || 0);
          return `translate(${pos[0]},${pos[1]})`;
        })
        .on("click", (event, d) => {
          state.history.push(root.data);
          canGoBack.value = true;
  
          const newRoot = d3.hierarchy(d.data);
          root.children = newRoot.children; // focus vào nhánh
          update(d);
        });
  
      nodeEnter.append("circle")
        .attr("r", 1e-6)
        .attr("fill", d => d.data.color === "red" ? "tomato" : "limegreen")
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5)
        .transition().duration(500)
        .attr("r", d => d.data.big ? 10 : 5);
  
      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", 12)
        .attr("text-anchor", "start")
        .text(d => d.data.name)
        .style("font", "12px sans-serif")
        .style("user-select", "none")
        .attr("pointer-events", "none");
  
      const nodeUpdate = nodeEnter.merge(node);
      nodeUpdate.transition().duration(500)
        .attr("transform", d => {
          const pos = project(d.x, d.y);
          return `translate(${pos[0]},${pos[1]})`;
        });
  
      node.exit().transition().duration(500)
        .attr("transform", d => {
          const s = project(source.x || 0, source.y || 0);
          return `translate(${s[0]},${s[1]})`;
        })
        .remove();
    }
  
    update(root);
  
    // Back button
    function goBack() {
      if (state.history.length > 0) {
        const prev = state.history.shift(); // lấy gốc cũ
        root.children = d3.hierarchy(prev).children;
        update(root);
        if (state.history.length === 0) canGoBack.value = false;
      }
    }
  
    // expose ra template
    Object.assign(window, { goBack });
  });
  </script>
  
  <style>
  .chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .radial-chart svg {
    border: 1px solid #eee;
  }
  .back-btn {
    margin-bottom: 10px;
    padding: 6px 12px;
    background: #eee;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
  }
  </style>
  
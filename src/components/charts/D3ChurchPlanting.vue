<template>
    <v-container>
      <div id="infovis" class="jit-chart" style="width: 100%; height: 600px; position: relative;"></div>
    </v-container>
  </template>
  
  <script setup lang="ts">
import { onMounted } from "vue";

// ========== Tooltip Helper ==========
function createTooltip(containerId: string) {
  const tooltip = document.createElement("div");
  tooltip.id = "jit-tooltip";
  Object.assign(tooltip.style, {
    position: "absolute",
    padding: "6px 10px",
    background: "rgba(0,0,0,0.8)",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "12px",
    pointerEvents: "none",
    opacity: 0,
    transition: "opacity 0.2s",
    zIndex: 1000,
    maxWidth: "220px",
  });

  const container = document.getElementById(containerId);
  if (container) container.appendChild(tooltip);

  return {
    show(content: string, event: MouseEvent) {
      tooltip.innerHTML = content;
      const rect = container?.getBoundingClientRect();
      if (!rect) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      tooltip.style.left = x + 15 + "px";
      tooltip.style.top = y + 15 + "px";
      tooltip.style.opacity = "1";
    },
    hide() {
      tooltip.style.opacity = "0";
    },
  };
}

// ========== Demo data ==========
function buildDemoJson() {
  const json: any = {
    id: "root",
    name: "Global Church Planting",
    children: [],
  };
  let churchId = 1;

  ["Asia", "Africa"].forEach((continentName, i) => {
    const continent = {
      id: `continent${i + 1}`,
      name: continentName,
      children: [],
    };

    for (let c = 1; c <= 2; c++) {
      const country = {
        id: `country${i + 1}-${c}`,
        name: `${continentName} Country ${c}`,
        children: [],
      };

      for (let r = 1; r <= 2; r++) {
        const region = {
          id: `region${i + 1}-${c}-${r}`,
          name: `Region ${r}`,
          children: [],
        };

        for (let t = 1; t <= 2; t++) {
          const city = {
            id: `city${i + 1}-${c}-${r}-${t}`,
            name: `City ${t}`,
            children: [],
          };

          for (let h = 1; h <= 4; h++) {
            if (churchId > 80) break;
            const members = Math.floor(Math.random() * 3000) + 20;
            city.children.push({
              id: `church${churchId}`,
              name: `Church ${churchId}`,
              data: {
                health: Math.random() > 0.5 ? "good" : "bad",
                members,
              },
              children: [],
            });
            churchId++;
          }

          region.children.push(city);
        }

        country.children.push(region);
      }

      continent.children.push(country);
    }

    json.children.push(continent);
  });

  return json;
}

// ========== API giả lập ==========
async function fetchChurchDetail(nodeId: string) {
  // Ở thực tế bạn thay chỗ này bằng call API thật
  console.log("📡 Fetching details for:", nodeId);
  await new Promise((r) => setTimeout(r, 600));
  alert(`Loaded detail for ${nodeId}`);
}

onMounted(() => {
  const containerId = "infovis";
  const json = buildDemoJson();
  const tooltip = createTooltip(containerId);

  const rgraph = new $jit.RGraph({
    injectInto: containerId,
    background: { CanvasStyles: { strokeStyle: "#ccc" } },
    Navigation: { enable: true, panning: true, zooming: 10 },
    Node: { overridable: true },
    Edge: { color: "#888", lineWidth: 1.2 },

    // Label create
    onCreateLabel: function (domElement, node) {
      domElement.innerHTML = node.name;
      domElement.style.cursor = "pointer";

      // click => expand + load API
      domElement.onclick = async function (event: MouseEvent) {
        rgraph.onClick(node.id, { hideLabels: false });
        await fetchChurchDetail(node.id);
      };

      // hover => tooltip
      domElement.onmouseover = function (event: MouseEvent) {
        const data = node.data || {};
        const html = `
          <b>${node.name}</b><br/>
          Members: ${data.members ?? "N/A"}<br/>
          Health: ${data.health ?? "-"}
        `;
        tooltip.show(html, event);
      };
      domElement.onmousemove = function (event: MouseEvent) {
        tooltip.show(tooltip.innerHTML, event);
      };
      domElement.onmouseout = function () {
        tooltip.hide();
      };
    },

    // Label style
    onPlaceLabel: function (domElement, node) {
      const style = domElement.style;
      style.fontSize = node._depth <= 1 ? "0.8em" : "0.7em";
      style.color = "#333";
      const left = parseInt(style.left);
      const w = domElement.offsetWidth;
      style.left = left - w / 2 + "px";
    },
  });

  // Load JSON
  rgraph.loadJSON(json);

  // Set màu & size
  rgraph.graph.eachNode(function (n) {
    const members = n.data.members ?? 0;
    let color = "#ccc";
    if (members < 50) color = "#C93C47";
    else if (members < 150) color = "#58AC45";
    else if (members < 300) color = "#8FCAF0";
    else if (members < 500) color = "#4687C1";
    else if (members < 1000) color = "#756CB7";
    else if (members < 3000) color = "#D171B8";
    else color = "#D1E015";

    n.setData("color", color);
    n.setData("dim", Math.min(6 + members / 250, 25));
    const pos = n.getPos();
    pos.setc(-200, -200);
  });

  rgraph.compute("end");
  rgraph.fx.animate({ modes: ["polar"], duration: 2000 });
});
</script>
  
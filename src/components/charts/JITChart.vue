<template>
    <v-container>
      <div id="infovis" style="width:100%; height:600px;"></div>
    </v-container>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  
  function buildDemoJson() {
    const json = {
      id: "root",
      name: "Global Church Planting",
      children: []
    };
  
    let churchId = 1;
  
    ["Asia", "Africa"].forEach((continentName, i) => {
      const continent = {
        id: `continent${i + 1}`,
        name: continentName,
        children: []
      };
  
      for (let c = 1; c <= 2; c++) {
        const country = {
          id: `country${i + 1}-${c}`,
          name: `${continentName} Country ${c}`,
          children: []
        };
  
        for (let r = 1; r <= 2; r++) {
          const region = {
            id: `region${i + 1}-${c}-${r}`,
            name: `Region ${r}`,
            children: []
          };
  
          for (let t = 1; t <= 2; t++) {
            const city = {
              id: `city${i + 1}-${c}-${r}-${t}`,
              name: `City ${t}`,
              children: []
            };
  
            for (let h = 1; h <= 7; h++) {
              if (churchId > 100) break;
              city.children.push({
                id: `church${churchId}`,
                name: `Church ${churchId}`,
                data: {
                  health: Math.random() > 0.5 ? "good" : "bad",
                  members: Math.floor(Math.random() * 200) + 20
                },
                children: []
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
  
  onMounted(() => {
    const json = buildDemoJson();
  
    const rgraph = new $jit.RGraph({
      injectInto: "infovis",
      background: {
        CanvasStyles: { strokeStyle: "#ccc" }
      },
      Navigation: {
        enable: true,
        panning: true,
        zooming: 10
      },
      Node: {
        overridable: true
      },
      Edge: {
        color: "#888",
        lineWidth: 1.2
      },
      // Khi tạo label
      onCreateLabel: function (domElement, node) {
        domElement.innerHTML = node.name;
        // Click vào node -> expand/collapse
        domElement.onclick = function () {
          rgraph.onClick(node.id, {
            hideLabels: false,
            onComplete: function () {
              // có thể log hoặc update gì đó
            }
          });
        };
      },
      // Style label
      onPlaceLabel: function (domElement, node) {
        const style = domElement.style;
        style.fontSize = node._depth <= 1 ? "0.8em" : "0.7em";
        style.color = "#333";
        style.cursor = "pointer";
        const left = parseInt(style.left);
        const w = domElement.offsetWidth;
        style.left = left - w / 2 + "px";
      }
    });
  
    // load JSON
    rgraph.loadJSON(json);
  
    // set màu & size node theo data
    rgraph.graph.eachNode(function (n) {
      n.setData("color", n.data.health === "good" ? "green" : "red");
      n.setData("dim", n.data.members > 100 ? 20 : 10);
      const pos = n.getPos();
      pos.setc(-200, -200);
    });
  
    // render chart
    rgraph.compute("end");
    rgraph.fx.animate({
      modes: ["polar"],
      duration: 2000
    });
  });
  </script>
  
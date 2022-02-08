const viz = new Viz();
const outputEl = document.getElementById("output");

let svg;

function center() {
  if (!svg) {
    return;
  }
  const vpWidth = outputEl.clientWidth;
  const vpHeight = outputEl.clientHeight;
  const svgWidth = svg.getSizes().width;
  const svgHeight = svg.getSizes().height;
  if (vpWidth > svgWidth && vpHeight > svgHeight) {
    svg.resetZoom();
    return;
  }
  let scaleDown = Math.min(vpHeight / svgHeight, vpWidth / svgWidth);
  svg.zoom(scaleDown, true);
  svg.pan({x: 0, y: 0});
  svg.resize();
}

function render() {
  if (svg) {
    svg.destroy();
  }
  const content = document.getElementById('raw_graphviz').innerText;
  const filterOut = document.getElementById('filter_out').value;
  const filterIn = document.getElementById('filter_in').value;
  const lines = content.split('\n');
  const filteredLines = ["digraph G {"];
  for (const line of lines) {
    if (filterOut) {
      const filterOutRegex = new RegExp(filterOut);
      if (line.match(filterOutRegex)) {
        continue;
      }
    }
    if (filterIn) {
      const filterInRegex = new RegExp(filterIn);
      if (!line.match(filterInRegex)) {
        continue;
      }
    }
    filteredLines.push(line);
  }
  filteredLines.push("}");
  const filteredGraphviz = filteredLines.join('\n');
  viz.renderSVGElement(filteredGraphviz)
    .then(function(element) {
      outputEl.innerHTML = "";
      outputEl.appendChild(element);
      const panOptions = {
        panEnabled: true,
        controlIconsEnabled: true,
        zoomScaleSensitivity: 0.4,
        zoomEnabled: true,
        minZoom: 0.3,
        fit: false,
        center: true,
      };
      svg = svgPanZoom(element, panOptions);
      center();      
    })
    .catch(error => {
      // Possibly display the error
      console.error(error);
      console.log(filteredGraphviz);
    });
}

function registerEventListeners() {
  document.getElementById('filter_out').addEventListener("keydown", (event) => {
    render();
  }); 
  document.getElementById('filter_in').addEventListener("keydown", (event) => {
    render();
  }); 
}

registerEventListeners();
render();

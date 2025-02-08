import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');
const projectsTitle = document.querySelector('.projects-title');

if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`;
}

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let selectedIndex = -1;



// arcs.forEach((arc, idx) => {
//     // TODO, fill in step for appending path to svg using D3
//     d3.select('svg').append('path').attr('d', arc).attr('fill', colors(idx) );
// })

// let colors = d3.scaleOrdinal(d3.schemeTableau10);



// let rolledData = d3.rollups(
//     projects,
//     (v) => v.length,
//     (d) => d.year,
//   );

// console.log(rolledData);


// let data = rolledData.map(([year, count]) => {
//     return { value: count, label: year };
//   });
  
// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);
// let arcs = arcData.map((d) => arcGenerator(d));

// let colors = d3.scaleOrdinal(d3.schemeObservable10);

// arcs.forEach((arc, idx) => {
//     // TODO, fill in step for appending path to svg using D3
//     d3.select('svg').append('path').attr('d', arc).attr('fill', colors(idx) );
// })




// let selectedIndex = -1;
// //4.4
// function renderPieChart(projectsGiven) {
//   // Clear existing paths and legend items before re-rendering

//   let svg = d3.select('svg')
//   svg.selectAll('path').remove(); // Remove old pie slices
//   d3.select('.legend').selectAll('li').remove(); // Remove old legend items

//   // re-calculate rolled data
//   let newRolledData = d3.rollups(
//     projectsGiven,
//     (v) => v.length,
//     (d) => d.year,
//   );
//   // re-calculate data
//   let newData = newRolledData.map(([year, count]) => {
//     return { value: count, label: year };
//   });
//   // re-calculate slice generator, arc data, arc, etc.
//   let newSliceGenerator = d3.pie().value((d) => d.value);
//   let newArcData = newSliceGenerator(newData);
//   let newArcs = newArcData.map((d) => arcGenerator(d));

//   let colors = d3.scaleOrdinal(d3.schemeTableau10);

//   // TODO: clear up paths and legends
//   let legend = d3.select('.legend');
// //   newLegend.selectAll('li').remove();

//   arcsGiven.forEach((arc, idx) => {
//         let path = d3.select('svg')
//           .append('path')
//           .attr('d', arc)
//           .attr('fill', colors(idx));

//         path.on('click', () => {
//             selectedIndex = selectedIndex === idx ? -1 : idx;
//             renderPieChart(projectsGiven);
//         });

//         if(selectedIndex === idx) {
//             path.classed('selected', true);
//         }else{
//             path.classed('selected', false);
//         }
//     });


function recalculate(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
    return newData;
}

function addClick(arcsGiven, projectsGiven, dataGiven) {
   
    // Clear previous selections and update elements
    const updateSelection = (idx) => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        renderPieChart(projectsGiven);
    };

// Render Pie Chart Sections
    const svg = d3.select('svg');
    // Clear previous paths
    svg.selectAll('path').remove(); 

    arcsGiven.forEach((arc, idx) => {
        let path = svg.append('path')
            .attr('d', arc)
            .attr('fill', colors(idx))
            .classed('selected', selectedIndex === idx)
            .on('click', () => updateSelection(idx));
    });

// Render Legend Items
    const newLegend = d3.select('.legend');
    newLegend.selectAll('li').remove(); // Clear previous legend items

    dataGiven.forEach((d, idx) => {
        let leg = newLegend.append('li')
            .attr('style', `--color:${colors(idx)}`)
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .classed('selected', selectedIndex === idx)
            .on('click', () => updateSelection(idx));
    });

// Filter and Render Projects
    const selectedYear = selectedIndex !== -1 ? dataGiven[selectedIndex].label : null;
    const filteredProjects = selectedYear ? projectsGiven.filter(project => project.year === selectedYear) : projectsGiven;

    renderProjects(filteredProjects, projectsContainer, 'h2');
}

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
    let newData = recalculate(projectsGiven);

    // re-calculate slice generator, arc data, arc, etc.
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    
    // clear up paths and legends
    let newSVG = d3.select('svg'); 
    newSVG.selectAll('path').remove();

    let newLegend = d3.select('.legend');
    newLegend.selectAll('li').remove();
    addClick(newArcs, projectsGiven, newData);
}
  
// Call this function on page load
renderPieChart(projects);
  
let query = '';
let searchInput = document.querySelector('.searchBar');

function setQuery(query) {
    return projects.filter((project) => {
      let values = Object.values(project).join(' ').toLowerCase();
      return values.includes(query.toLowerCase());
    });
}

searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    
    let filteredProjects = setQuery(event.target.value);
    
    // re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

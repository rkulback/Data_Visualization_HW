function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

  var meta_url = `/metadata/${sample}`

  d3.json(meta_url).then(function(meta_obj){

    // Use d3 to select the panel with id of `#sample-metadata`

    var selector = d3.select("#sample-metadata");

    console.log(Object.entries(meta_obj))

    // Use `.html("") to clear any existing metadata

    selector.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(meta_obj).forEach(function([key, value]){
      console.log(`${key}, ${value}`)
      selector.append("p").text(`${key}, ${value}`)
    });

    // build the gauge chart 

    var wash_data = meta_obj.WFREQ;
    console.log(meta_obj.WFREQ);

    // Trig to calc meter point
    var degrees = 10 - wash_data,
        radius = .5;
    var radians = degrees * Math.PI / 10;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    console.log('LOOk!!')
    console.log(radians)
    console.log(x)
    console.log(y)

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'Belly Button Washing Frequency',
        text: wash_data, 
        hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(70, 139, 11, .5)', 'rgba(110, 154, 22, .5)',
      'rgba(140, 176, 30, .5)', 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
       'rgba(210, 206, 145, .5)','rgba(221, 218, 182, .5)', 'rgba(232, 226, 202, .5)',
      'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 550,
      width: 550,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout);
  });
};

// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
  var sample_url = `/samples/${sample}`;

  d3.json(sample_url).then(function(response) {

    // console.log(response.sample_values.slice(0, 10));

    console.log('check it')

    // console.log(response.otu_ids.slice(0, 10));

    var pie_data = Object.values(response.sample_values.slice(0, 10))

    console.log(Object.values(response.otu_ids.slice(0, 10)));

    console.log(pie_data);

    console.log(Object.values(pie_data));

    var pie_trace = {
      type: "pie",
      labels: Object.values(response.otu_ids.slice(0, 10)),
      values: response.sample_values.slice(0, 10),
      hoverinfo: pie_data
    };

    pie_data = [pie_trace];

    var layout = {
      legend: response.otu_ids.slice(0, 10)
    };

    Plotly.newPlot("pie", pie_data, layout);

    // my shot at drawing a bubble chart w/in the code

    var bubble_trace = {
      x: response.otu_ids,
      y: response.sample_values, 
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        size: response.sample_values,
        color: response.otu_ids
      }
    };

    bubble_data = [bubble_trace];

    var bubble_layout = {
    };

    Plotly.newPlot("bubble", bubble_data, bubble_layout);

    // GOTO figure out how to lable my chart 

    // ADD hovertext thingy

  });

};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
console.log("initialized")

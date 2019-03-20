function buildMetadata(sample) {

  // Use `d3.json` to fetch metadata for a sample
  var metadataURL = `/metadata/${sample}`;
    // Use d3 to select panel with id of `#sample-metadata`
    d3.json(metadataURL).then(function(sample){
      var sampleData = d3.select(`#sample-metadata`);
    // Use `.html("") to clear existing metadata
      sampleData.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
      Object.entries(sample).forEach(function([key,value]){
        var row = sampleData.append("p");
        row.text(`${key}:${value}`)
      })
    });
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var plotData = `/samples/${sample}`;
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(plotData).then(function(data){
    var x_axis = data.otu_ids;
    var y_axis = data.sample_values;
    var texts = data.otu_labels;
    var color = data.otu_ids;
    var size = data.sample_values;
  
    var bubble = {
      x: x_axis,
      y: y_axis,
      text: texts,
      mode: `markers`,
      marker: {
        size: size,
        color: color
      }
    };

    var data = [bubble];
    var layout = {
      title: "Belly Button Bacteria",
      xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    d3.json(plotData).then(function(data){
      var labels = data.otu_ids.slice(0,10);
      var display = data.otu_labels.slice(0,10);
      var values = data.sample_values.slice(0,10);

      var pie_chart = [{
        lables: labels,
        hovertext: display,
        values: values,
        type: "pie"
      }];
      Plotly.newPlot('pie',pie_chart);
    });
  });
};


function init() {
  console.log('hello');
  // Grab a reference to dropdown select element
  var selector = d3.select("#selDataset");

  // Use list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use first sample from list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

init();
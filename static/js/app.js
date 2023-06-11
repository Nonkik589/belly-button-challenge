// Initialize the url
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Log the data to the console
d3.json(url).then(data => {
    console.log(data);
    // Grab the info used for plotting and log it to the console
    let otuID = data.samples[0].otu_ids;
    console.log("ID's", otuID);
    let sampleValues = data.samples[0].sample_values;
    console.log("Values",sampleValues);
    let labels = data.samples[0].otu_labels;
    console.log("Labels",labels);
});

// Create the drop down menu
var dropDownMenu = d3.select("#selDataset");
var demoPanel = d3.select("#sample-metadata");

// Establishing initial function
function init() {
    // Accessing data to populate teh dropDownMenu
    d3.json(url).then(data => {
        // Assigning names to a variable
        let IDs = data.names;
        // Adding each name to the menu
        IDs.forEach((ID) => {
            dropDownMenu.append("option").text(ID).property("value", ID)
        });
        
        let first = IDs[0];
        updatePlots(first);
        updateMetaData(first);
    });
}


// create the function for the change event
function optionChanged(id) {
    updatePlots(id);
    updateMetaData(id);
}

// Make the function to update the demo panel
function updateMetaData(idNo) {
    d3.json(url).then(data => {
        // Only use the entry chosen
        let metadataFiltered = data.metadata.filter(item => item.id == idNo);
        // Clear the log first
        demoPanel.html("")
        // log the data to the panel
        Object.entries(metadataFiltered[0]).forEach(([key, value]) =>  demoPanel.append("h6").text(`${key}: ${value}`) );
    
    });
}

// Make the fuction to update plots based on selection
function updatePlots(idNo) {
    d3.json(url).then(data => {
        // Only use the entry chosen
        let samplesFiltered = data.samples.filter(item => item.id == idNo );
        // Grab the info for plotting
        let otuID = samplesFiltered[0].otu_ids;
        let sampleValues = samplesFiltered[0].sample_values;
        let labels = samplesFiltered[0].otu_labels;

        
        // Making bar chart
        let trace1 = {
            x:sampleValues.slice(0,11).reverse(),
            y:otuID.slice(0,11).reverse(),
            text:labels.slice(0,11).reverse(),
            type:"bar"
        };
        let input = [trace1];
        let layout = {
            title: "Top 10 OTUs",
            margin:{l: 100, r: 100, t: 100, b: 100}
        };
        Plotly.newPlot("bar",input,layout)
        
        // Making the bubble plot
        let trace2 = {
            x: otuID,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuID
            },
            text: labels
        };
        let input2 = [trace2];
        let layout2 = {
            title: "Bacteria Cultures per Sample",
            showlegend: false,
            height: 600,
            width: 600,
            hovermode: "closest"
        };
        Plotly.newPlot('bubble',input2,layout2,)
    });

}


init()
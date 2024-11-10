let topologyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let topologyData
let educationData

let canvas= d3.select("#canvas")

let tooltipArray = [];
const addToolTip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background-color", "rgb(171, 190, 217)")
    .style("border-radius", "5px")
    .style("visibility", "hidden")

let drawMap = () => {
    canvas.selectAll("path")
        .data(topologyData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("class", "county")
        .attr("fill", (d)=> {
            let id = d["id"]
            let county = educationData.find((item) => {
                return item["fips"] === id;
            })
            let percentage = county["bachelorsOrHigher"]
            if(percentage <= 16) {
                return "yellow"
            } else if(percentage <= 32) {
                return "orange"
            } else if(percentage <= 48) {
                return "green"
            } else {
                return "blue"
            }
         })
        .attr("data-fips", (d)=> d["id"])
        .attr("data-education", (d)=>{
            let id = d["id"]
            let county = educationData.find((item) => {
                return item["fips"] === id;
            })
            let percentage = county["bachelorsOrHigher"]
            return percentage;
        })
        .attr("stroke", "black")
        .attr("stroke-width", ".2px")
        .on("mouseover", (e , d ) => {
            let id = d["id"]
            let county = educationData.find((item) => {
                return item["fips"] === id;
            })

            tooltipArray = [`State: ${county.state}`, `County: ${county.area_name}, FIPS: ${county.fips}`, `Percentage: ${county.bachelorsOrHigher}%`];
            addToolTip.style('visibility', 'visible')
                .style("opacity", 1)
                .style("position", 'absolute')
                .attr("data-education", county.bachelorsOrHigher)
                .style("top", `${e.clientY}px`)
                .style("left", `${e.clientX}px`)
                .selectAll("h1")
                .data(tooltipArray)
                .join("h1")
                .style("font-size", "10px")
                .text((text) => text)
                .style("visibility", "visible")
        })
        .on("mouseout", function () {
            addToolTip.style("visibility", "hidden")
                .style("opacity", 0)
        })

    let legendData= [0,16,32,48]
    var x = d3.scaleLinear()
        .domain([0,64])
        .range([0,64]);
    var axis = d3.axisBottom(x).ticks(4).tickValues([0,16,32,48,64]);

    canvas.append("g")
        .attr("id", "legend")
        .selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", (d)=> 700 + d)
        .attr("y", 60)
        .attr("width", 16)
        .attr("height", 8)
        .attr("fill", (d) => (d) >= 48 && d < 64 ? "blue" : (d) >= 32 && (d) < 48 ? "green" : (d) >= 16 && (d) < 32 ? "orange" : (d) >= 0 && (d) < 16 ? "yellow" : "white")


    canvas.append("g")
        .data(legendData)
        .attr("transform",(d)=>{
            return "translate( 700 ,60)"
        })
        .call(axis)

}


d3.json(topologyURL)
    .then((data, error) => {
        if(error) {
            console.log(error)
        } else {
            topologyData = topojson.feature(data, data.objects.counties).features;
            console.log(topologyData);

            d3.json(educationURL)
                .then((data, error) => {
                    if(error) {
                        console.log(error);
                    } else {
                        educationData = data;
                        console.log(educationData);
                        drawMap();
                    }

            })
        }
    }
)



/** Data structure for the data associated with an individual country. */
class PlotData {
    /**
     *
     * @param country country name from the x data object
     * @param xVal value from the data object chosen for x at the active year
     * @param yVal value from the data object chosen for y at the active year
     * @param id country id
     * @param region country region
     * @param circleSize value for r from data object chosen for circleSizeIndicator
     */
    constructor(country, xVal, yVal, id, region, circleSize) {
        this.country = country;
        this.xVal = xVal;
        this.yVal = yVal;
        this.id = id;
        this.region = region;
        this.circleSize = circleSize;
    }
}

/** Class representing the scatter plot view. */
class GapPlot {

    /**
     * Creates an new GapPlot Object
     *
     * For part 2 of the homework, you only need to worry about the first parameter.
     * You will be updating the plot with the data in updatePlot,
     * but first you need to draw the plot structure that you will be updating.
     *
     * Set the data as a variable that will be accessible to you in updatePlot()
     * Call the drawplot() function after you set it up to draw the plot structure on GapPlot load
     *
     * We have provided the dimensions for you!
     *
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     * @param updateYear a callback function used to notify other parts of the program when a year was updated
     * @param activeYear the year for which the data should be drawn initially
     */
    constructor(data, updateCountry, updateYear, activeYear) {

        // ******* TODO: PART 2 *******
        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 810 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.activeYear = activeYear;
        this.updateYear = updateYear;
        this.data = data;

        this.defaultXIndicator = 'fertility-rate';
        this.defaultYIndicator = 'gdp';
        this.defaultCircleSizer = 'population';

        this.updateCountry = updateCountry;

        this.drawPlot();
        
        this.drawDropDown(this.defaultXIndicator, this.defaultYIndicator, this.defaultCircleSizer);
        
        this.updatePlot(this.activeYear, this.defaultXIndicator, this.defaultYIndicator, this.defaultCircleSizer);
        //YOUR CODE HERE  


        // ******* TODO: PART 3 *******
        /**
         For part 4 of the homework, you will be using the other 3 parameters.
         * assign the highlightUpdate function as a variable that will be accessible to you in updatePlot()
         * assign the dragUpdate function as a variable that will be accessible to you in updatePlot()
         */

        //YOUR CODE HERE  


    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot() {
        // ******* TODO: PART 2 *******
        /**
         You will be setting up the plot for the scatterplot.
         Here you will create axes for the x and y data that you will be selecting and calling in updatePlot
         (hint): class them.

         Main things you should set up here:
         1). Create the x and y axes
         2). Create the activeYear background text


         The dropdown menus have been created for you!

         */

        d3.select('#scatter-plot')
            .append('div').attr('id', 'chart-view');

        d3.select('#year-view')
            .classed('activeYear-background', true)
            .append('text')
            .text(this.activeYear);

        d3.select('#scatter-plot')
           .append('div').attr('id', 'activeYear-bar');
        
        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);

        //YOUR CODE HERE  

        let wrapperGroup = d3.select('.wrapper-group');

        const xAxisGroup = wrapperGroup.append('g').classed('xaxis', true).attr('transform', `translate(0, ${this.height})`);
        const yAxisGroup = wrapperGroup.append('g').classed('yaxis', true).attr('transform', `translate(${this.margin.left}, 0)`);
        wrapperGroup.append('g').classed('year-view', true)
        .attr('transform', 'translate(20, 20) ');
        /* This is the setup for the dropdown menu- no need to change this */

        let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);

        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        d3.select('#chart-view')
            .append('div')
            .classed('circle-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');

        this.drawYearBar();  

    }

    /**
     * Renders the plot for the parameters specified
     *
     * @param activeYear the year for which to render
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    updatePlot(activeYear, xIndicator, yIndicator, circleSizeIndicator) {

        let yearView = d3.select('.year-view');
        let year = yearView.selectAll('text');

        year.remove();

        let wrapperGroup = d3.select('.wrapper-group');

        let yearHolder = d3.select('#yearHolder');

        let arrayOfPlotData = new Array();
        
        let xIndicatorData = this.data[xIndicator];
        let yIndicatorData = this.data[yIndicator];
        let circleIndicatorData = this.data[circleSizeIndicator];

        let populatingArray = (xIndicatorData.length > yIndicatorData.length) ? xIndicatorData : yIndicatorData;

        for(var i = 0; i < populatingArray.length; i++) {
            var xValue = this.findValueByGeo(populatingArray[i]['geo'], xIndicatorData, activeYear);
            var yValue = this.findValueByGeo(populatingArray[i]['geo'], yIndicatorData, activeYear);
            var sizeValue = this.findValueByGeo(populatingArray[i]['geo'], circleIndicatorData, activeYear);
            var regionValue = this.findRegionByGeo(populatingArray[i]['geo']);
            arrayOfPlotData.push(new PlotData(populatingArray[i]['country'], 
                xValue, yValue, populatingArray[i]['geo'], regionValue, sizeValue));
        }

        let xMin = this.findMinimumValue(xIndicatorData);
        let yMin = this.findMinimumValue(yIndicatorData);
        let minSize = this.findMinimumValue(circleIndicatorData);

        let xMax = this.findMaximumValue(xIndicatorData);
        let yMax = this.findMaximumValue(yIndicatorData);
        let maxSize = this.findMaximumValue(circleIndicatorData);

        let xAxisGroup = d3.select('.xaxis');
        let yAxisGroup = d3.select('.yaxis');

        const xScale = d3.scaleLinear().domain([xMin, xMax]).range([this.margin.left, this.width])

        const yScale = d3.scaleLinear().domain([yMin, yMax+1]).range([this.height, 0])

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
       
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);  

        /**
         *  Function to determine the circle radius by circle size
         *  This is the function to size your circles, you don't need to do anything to this
         *  but you will call it and pass the circle data as the parameter.
         * 
         * @param d the data value to encode
         * @returns {number} the radius
         */
        let circleSizer = function(d) {
            let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        };

        let text = yearHolder.selectAll('text').data(activeYear);

        let textEnter = text.enter().append('text');

        text.exit().remove();

        text = text.merge(textEnter);

        text.text(activeYear);

        let circles = wrapperGroup.selectAll('circle').data(arrayOfPlotData);
        
        let titles = circles.selectAll('title');

        titles.remove();

        let circlesEnter = circles.enter().append('circle');

        circles.exit().remove();

        circles = circles.merge(circlesEnter);

        circles
            .transition()
            .duration(100)
            .attr('cx', d => xScale(d.xVal))
            .attr('cy', d => yScale(d.yVal))
            .attr('r', d => circleSizer(d))
            .attr('id', d => "circle"+d.id.toUpperCase())
            .attr('class', d => {return d.region});

        circles.on("click", d => this.updateCountry(d.id.toUpperCase()));
            
        circles.append("title").text( d => this.tooltipRender(d));

        yearView
            .classed('activeYear-background', true)
            .append('text')
            .attr('x', 100)
            .attr('y', 50)
            .text(activeYear);

        this.drawLegend(minSize, maxSize);

        // ******* TODO: PART 2 *******

        /*
        You will be updating the scatterplot from the data. hint: use the #chart-view div
        
        *** Structuring your PlotData objects ***
        You need to start by mapping the data specified by the parameters to the PlotData Object
        Your PlotData object is specified at the top of the file
        You will need get the data specified by the x, y and circle size parameters from the data passed
        to the GapPlot constructor

        *** Setting the scales for your x, y, and circle data ***
        For x and y data, you should get the overall max of the whole data set for that data category,
        not just for the activeYear.

        ***draw circles***
        draw the circles with a scaled area from the circle data, with cx from your x data and cy from y data
        You need to size the circles from your circleSize data, we have provided a function for you to do this
        called circleSizer. Use this when you assign the 'r' attribute.

        ***Tooltip for the bubbles***
        You need to assign a tooltip to appear on mouse-over of a country bubble to show the name of the country.
        We have provided the mouse-over for you, but you have to set it up
        Hint: you will need to call the tooltipRender function for this.

        *** call the drawLegend() and drawDropDown()
        These will draw the legend and the drop down menus in your data
        Pay attention to the parameters needed in each of the functions
        
        */

        ///////////////////////////////////////////////////////////////////

        //YOUR CODE HERE  

    }

    /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    drawDropDown(xIndicator, yIndicator, circleSizeIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');
        let dropData = [];

        for (let key in this.data) {
            dropData.push({
                indicator: key,
                indicator_name: this.data[key][0].indicator_name
            });
        }

        /* CIRCLE DROPDOWN */
        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(dropData);


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsCEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function(d, i) {
            let cValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let yValue = dropY.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(dropData);

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsXEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function(d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(dropData);

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d.indicator_name);

        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function(d, i) {
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

    }

    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar() {

        // ******* TODO: PART 2 *******
        //The drop-down boxes are set up for you, but you have to set the slider to updatePlot() on activeYear change

        // Create the x scale for the activeYear;
        // hint: the domain should be max and min of the years (1800 - 2020); it's OK to set it as numbers
        // the plot needs to update on move of the slider

        /* ******* TODO: PART 3 *******
        You will need to call the updateYear() function passed from script.js in your activeYear slider
        */
        let that = this;
        //Slider to change the activeYear of the data
        let yearScale = d3.scaleLinear().domain([1800, 2020]).range([30, 730]);

        let yearSlider = d3.select('#activeYear-bar')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 1800)
            .attr('max', 2020)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 25);
        
        yearSlider.on('input', function() {
            let dropX = document.getElementById('dropdown_x');
            let xIndicator = dropX.childNodes[0].childNodes[0].value;
            let dropY = document.getElementById('dropdown_y');
            let yIndicator = dropY.childNodes[0].childNodes[0].value;
            let dropC = document.getElementById('dropdown_c');
            let cIndicator = dropC.childNodes[0].childNodes[0].value;
            let year = this.value;
            sliderText.text(year);
            sliderText.attr('x', yearScale(year));
            that.updatePlot(year, xIndicator, yIndicator, cIndicator); 
            that.updateYear(year);
        });
    }

    /**
     * Draws the legend for the circle sizes
     *
     * @param min minimum value for the sizeData
     * @param max maximum value for the sizeData
     */
    drawLegend(min, max) {
        // ******* TODO: PART 2*******
        //This has been done for you but you need to call it in updatePlot()!
        //Draws the circle legend to show size based on health data
        let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

        let circleData = [min, max];

        let svg = d3.select('.circle-legend').select('svg').select('g');

        let circleGroup = svg.selectAll('g').data(circleData);
        circleGroup.exit().remove();

        let circleEnter = circleGroup.enter().append('g');
        circleEnter.append('circle').classed('neutral', true);
        circleEnter.append('text').classed('circle-size-text', true);

        circleGroup = circleEnter.merge(circleGroup);

        circleGroup.attr('transform', (d, i) => 'translate(' + ((i * (5 * scale(d))) + 20) + ', 25)');

        circleGroup.select('circle').attr('r', (d) => scale(d));
        circleGroup.select('circle').attr('cx', '0');
        circleGroup.select('circle').attr('cy', '0');
        let numText = circleGroup.select('text').text(d => new Intl.NumberFormat().format(d));

        numText.attr('transform', (d) => 'translate(' + ((scale(d)) + 10) + ', 0)');
    }

    /**
     * Reacts to a highlight/click event for a country; draws that country darker
     * and fades countries on other continents out
     * @param activeCountry
     */
    updateHighlightClick(activeCountry) {

        let populationData = this.data['population'];
        let countryCircle = d3.select('#circle'+activeCountry);
        let region = countryCircle.attr("class");

        for(var pop of populationData) {
            let countryID = pop['geo'].toUpperCase();
            let countryPath = d3.select('#circle'+countryID);
            if(region != pop['region']) countryPath.classed('not-selected-country', true);
        }

        
        switch(region) {
            case 'asia':
                         countryCircle.classed('selected-country', true);
                         break;
            case 'africa': 
                           countryCircle.classed('selected-country', true);
                           break;
            case 'europe': 
                           countryCircle.classed('selected-country', true);
                           break;
            case 'americas': 
                             countryCircle.classed('selected-country', true);
                             break;
           }

    }

    /**
     * Clears any highlights
     */
    clearHighlight() {
        
        let populationData = this.data['population'];

        for(var pop of populationData) {
            let countryID = pop['geo'].toUpperCase();
            let countryPath = d3.select('#circle'+countryID);
            countryPath.classed('not-selected-country', false);
            countryPath.classed('selected-country', false);
        }

    }

    /**
     * Returns html that can be used to render the tooltip.
     * @param data 
     * @returns {string}
     */
    tooltipRender(data) {
        let text = data['country'];
        return text;
    }

    findValueByGeo(geo, data, year) {
        for(var datum of data) 
            if(datum['geo'] == geo) return datum[year];
        return 0;
    }

    findRegionByGeo(geo) {
        for(var datum of this.data['population']) {
            if(datum['geo'] == geo) return datum['region'];
        }
        return 'default';
    }

    findMinimumValue(data) {
        let arrayOfMin = new Array();
        for(var datum of data) {
            var temp = Object.values(datum).slice(0, 221);
            arrayOfMin.push(Math.min.apply(Math, temp));
        }
        return Math.min.apply(Math, arrayOfMin);
    }

    findMaximumValue(data) {
        let arrayOfMax = new Array();
        for(var datum of data) {
            var temp = Object.values(datum).slice(0, 221);
            arrayOfMax.push(Math.max.apply(Math, temp));
        }
        return Math.max.apply(Math, arrayOfMax);
    }

}
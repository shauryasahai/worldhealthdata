/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCountry, activeYear) {

        let countryDetailsHolder = d3.select("#country-detail");
        let arrayOfInfoBoxData = new Array();

        for(let [key, propArray] of Object.entries(this.data)) {
            // population would always be returned as the first one
            for(var element of propArray) {
                if(element['geo'].toUpperCase() == activeCountry)
                    arrayOfInfoBoxData.push(new InfoBoxData(element['country'], 
                    element['region'], key, element[activeYear]));
            }
        } 

        if(arrayOfInfoBoxData) {
            countryDetailsHolder.append('text').text(arrayOfInfoBoxData[0]['country']);
            let countryDetailSVG = countryDetailsHolder.append('svg').attr("width", 500).attr("height", 600).attr('id', 'details-holder');
            
            countryDetailSVG.append('g').attr("width", 100).attr("height", 100).classed('icon-holder', true);
            countryDetailSVG.append('g').attr("width", 100).attr("height", 100).classed('name-holder', true);
            countryDetailSVG.append('g').attr("width", 500).attr("height", 500).classed('value-holder', true);
            
            let icon = d3.selectAll('.icon-holder').selectAll('text').data(arrayOfInfoBoxData);
            let name = d3.selectAll('.name-holder').selectAll('text').data(arrayOfInfoBoxData);
            let values = d3.selectAll('.value-holder').selectAll('text').data(arrayOfInfoBoxData);
            
            let iconEnter = icon.enter().append('text');

            icon.exit().remove();

            icon = icon.merge(iconEnter);

            icon
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .style('font-family','FontAwesome')
                .style('font-size','20px')
                .attr('x', 40)
                .attr('y', 10)
                .text(function (d) {
                    return '\uf0ac';
                })
                .classed('text-'+arrayOfInfoBoxData[0]['region'], true);
                
            let nameEnter = name.enter().append('text');

            name.exit().remove();

            name = name.merge(nameEnter);

            name
                .attr('transform', 'translate(20, 0)')
                .attr('x', 35)
                .attr('y', 20)
                .text(arrayOfInfoBoxData[0]['country']);

            let valuesEnter = values.enter().append('text');

            values.exit().remove();

            values = values.merge(valuesEnter);

            values
                .attr('transform', 'translate(20, 0)')
                .attr('x', 10)
                .attr('y', (d, i) => (i+1.5)*30)
                .text(d => {return (this.getIndicatorName(d.indicator_name) + ': ' + d.value)});
        }
        
        // ******* TODO: PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected country, region, population and stats associated with the country.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCountry data from each array
         * you will then pass the data as paramters to make an InfoBoxData object for each category
         *
         */

        //TODO - Your code goes here - 


    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {

        //TODO - Your code goes here - 
        let icon = d3.select('.icon-holder').selectAll('text');
        icon.remove();
        let values = d3.select('.value-holder').selectAll('text');
        values.remove();
        let name = d3.select('.name-holder').selectAll('text');
        name.remove();

    }

    getIndicatorName(name) {
        switch(name) {
            case 'population': return 'Population';
            case 'fertility-rate': return 'Total Fertility Rate';
            case 'gdp' : return 'GDP per capita';
            case 'child-mortality': return 'Child Mortality (under age five)';
            case 'life-expectancy': return 'Life Expectancy';
        }
    }

    getIconUnicode(region) {
        console.log(region);
        switch(region) {
            case 'africa': return '\uf57c';
            case 'americas': return '\uf57d';
            case 'europe': return '\uf7a2';
            case 'asia': return '\uf57e';
        }
    }
}
module.exports ={
	getHeaderIndex : function(filteredArray)
	{
	// if (counter === 1) {
	let headerIndexData={
    indexCountry : filteredArray.indexOf('CountryName'),
    indexYear : filteredArray.indexOf('Year'),
    indexIndicatorCode : filteredArray.indexOf('IndicatorCode'),
    indexValue : filteredArray.indexOf('Value'),
    indexCountryCode : filteredArray.indexOf('CountryCode')
	}
	return headerIndexData;
    }
}    	 	
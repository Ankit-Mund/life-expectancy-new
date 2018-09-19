		var labelWithTime = "label " + Date.now();
    console.time(labelWithTime);

		/** ********  variable to store CSV File   ******** */
		const csvFile = './Indicators.csv';

		/** ********  variable to store modules   ******** */
		const fs = require('fs');
		const readline = require('readline');
		const headerIndex = require("./headerIndex.js");
		const createJson = require("./createJson");
		/** ********  variable to store column header index   ******** */
		let indexYear;
		let indexCountry;
		let indexValue;
		let indexIndicatorCode;
		let indexCountryCode;
		let headerIndexObj={};

		/** ********  Array variable to store Filtered Array of Objects  ******** */
		const multiLine = []; // multi-line


		/** ********  Array variables to store specific Objects ******* */
		const lifeExpectancyMale = [];
		const lifeExpectancyFemale = [];
		const birthRate = [];
		const deathRate = [];
		const countries = ['India', 'Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei',
			'Cambodia', 'China', 'Cyprus', 'Georgia', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan',
			'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman',
			'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Russia', 'Saudi Arabia', 'Singapore', 'South Korea',
			'Sri Lanka', 'Syria', 'Taiwan', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkey', 'Turkmenistan',
			'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'];

		let sortedLifeExpectancy = []; // bar
		const StackArray = []; // stacked
		const finalLifeExpectancy = []; // bar
		
		/** ********  Custom Remove function to remove specific array elements   ******** */
		function remove(array, element) {
			return array.filter(e => e !== element);
		}

		/** ********  Reading CSV File by creating Read Stream Interface   ******** */
		const rl = readline.createInterface({
			input: fs.createReadStream(csvFile),
		});
		/** ********  counter variable for  storing header indexes   ******** */
		let counter = 0;
		/** ********  Reading the Stream Line by Line ******** */
		rl.on('line', (line) => {
			counter++;

			/** ********  Array to store each line of CSV  ;   Using Regex to ignore commas between double quotes ******** */
			const unfilteredArray = line.split((/(".*?"|[^",]+)(?=,|$)+/g));

			/** ********  Filtered Array by removing nulls & commas   ******** */
			let filteredArray = remove(unfilteredArray, ',');
			filteredArray = remove(filteredArray, '');

			/** ********  Using counter to store header indexes   ******** */
			if (counter === 1) {
			headerIndexObj = headerIndex.getHeaderIndex(filteredArray); 
			} 
			/** ********  Filtering the dataset according to Country-India and IndicatorName******** */

			if (filteredArray[headerIndexObj.indexCountry] === 'India') { // multi line
				if (filteredArray[headerIndexObj.indexIndicatorCode] === 'SP.DYN.CBRT.IN') {
					const temp_obj = {
						year: filteredArray[headerIndexObj.indexYear],
						birth: filteredArray[headerIndexObj.indexValue],
					};
					birthRate.push(temp_obj);
				} else if (filteredArray[headerIndexObj.indexIndicatorCode] === 'SP.DYN.CDRT.IN') {
					const temp_obj = {
						year: filteredArray[headerIndexObj.indexYear],
						death: filteredArray[headerIndexObj.indexValue],
					};
          deathRate.push(temp_obj);
				}
			}
			if (filteredArray[headerIndexObj.indexCountry] === 'India') { // filtration for stacked
				if (filteredArray[headerIndexObj.indexIndicatorCode] === 'SP.DYN.LE00.FE.IN') {
					const temp_obj = {
						year: filteredArray[headerIndexObj.indexYear],
						female1: filteredArray[headerIndexObj.indexValue],
					};
					lifeExpectancyFemale.push(temp_obj);
				} else if (filteredArray[headerIndexObj.indexIndicatorCode] === 'SP.DYN.LE00.MA.IN') {
					const temp_obj = {
						year: filteredArray[headerIndexObj.indexYear],
						male1: filteredArray[headerIndexObj.indexValue],
					};
					lifeExpectancyMale.push(temp_obj);
				}
			}

			for (let i = 0; i < countries.length; i++) {
				if (countries[i] === filteredArray[headerIndexObj.indexCountry]) {
					if (filteredArray[headerIndexObj.indexYear] === '2000') {
						if (filteredArray[headerIndexObj.indexIndicatorCode] === 'SP.DYN.LE00.IN') {
							const outobj = {
								country: filteredArray[headerIndexObj.indexCountry],
								le_total: filteredArray[headerIndexObj.indexValue],
							};
							sortedLifeExpectancy.push(outobj); // bar chart(array of all countries)
						}
					}
				}
			}
		}).on('close', () => {
			//console.log('here.....');
			for (i = 0; i < birthRate.length; i++) {
				for (j = 0; j < deathRate.length; j++) {
					if (i === j) {
						const tempObj = Object.assign(birthRate[j], deathRate[j]);
						/** ********  pushing the objects to Array of Objects  ******** */
						multiLine.push(tempObj);
					}
				}
			}

			for (i = 0; i < lifeExpectancyFemale.length; i++) {
				for (j = 0; j < lifeExpectancyMale.length; j++) {
					if (i === j) {
						const tempObj = Object.assign(lifeExpectancyFemale[j], lifeExpectancyMale[j]);
						StackArray.push(tempObj);
					}
				}
			}
			sortedLifeExpectancy = sortedLifeExpectancy.sort((a, b) => b.le_total - a.le_total);
			for (i = 0; i < 5; i++) {
				finalLifeExpectancy[i] = sortedLifeExpectancy[i];
			}


			/** ********  creating JSON file from Array of Objects  ******** */
	  

    createJson.write(fs,JSON.stringify(StackArray, 1,1),"output3.json");
    createJson.write(fs,JSON.stringify(multiLine, 1, 1),"output.json");
    createJson.write(fs,JSON.stringify(finalLifeExpectancy, 1, 1),"output2.json");

    console.timeEnd(labelWithTime);

		});

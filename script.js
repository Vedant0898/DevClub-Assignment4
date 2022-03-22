console.log("Loaded script.js");

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
let url = "https://api.covid19api.com/" ;
let country_names=[];
let country_dict = {};
let country_dict2 = {};
let testarr=[];
let BarChart;

getSummary();
getCountryNames();
getDailyCasesByCountry();
setFromDate();

function newBarChart(){
    let country_name = document.getElementById("countryname").value;
    let status = document.getElementById("status").value;
    
    getDailyCasesByCountry(country_name,status);
}

function setFromDate(){
    var initial_from_date = new Date(new Date().setDate(new Date().getDate() - 30));
    var fromdateselector = document.getElementById("fromdate");
    fromdateselector.valueAsDate = initial_from_date;
}

function getCountryNames(){
    extension = 'countries';
    getResponse(extension);
}

function getSummary(){
    extension = 'summary';
    getResponse(extension);
}

function getDailyCasesByCountry(country_name = 'india', status = 'confirmed'){
    extension = 'dayone/country/'+country_name+'/status/'+status;
    getResponse(extension);
}


async function getResponse(extension){
    
    fetch(url+extension, requestOptions)
        .then(response => response.text())
        .then(result => processResponse(JSON.parse(result),extension))
        .catch(error => console.log('error', error));
    
}

function processResponse(obj,extension){
    
    console.log('Received Response: ',extension);

    if (extension=='countries')
    {
        for (const c of obj) {
            country_names.push(c['Country']);
            //country_slug.push(c['Slug']);
            country_dict[c['Country']] = c['Slug'];
            country_dict2[c['Slug']] = c['Country'];
        }
        country_names.sort();
        addCountryinDropdown();
    }
    else if (extension == 'summary')
    {   
        
        piechart(obj,'TotalConfirmed','Chart-3',"Total confirmed Cases by Country");
        piechart(obj,'TotalDeaths','Chart-4',"Total deaths by Country");
        piechart(obj,'NewConfirmed','Chart-1',"Today's confirmed cases by Country");
        piechart(obj,'NewDeaths','Chart-2',"Today's deaths by Country");
        
        //barchart(obj,'TotalConfirmed','BarChart',"Total confirmed Cases by Country");
    }
    else if(extension.includes('dayone/country')){
        let title_text = "Daily "

        if (extension.includes('confirmed')){
            title_text+="confirmed cases ";
        }
        else{
            title_text +="deaths ";
        }
        let country_name = country_dict2[document.getElementById("countryname").value];
        console.log("CN",country_name);
        title_text +="in "+String(country_name);

        barchart(obj,"BarChart",title_text);
        object = obj;
    }
    
}

function addCountryinDropdown(){

    for (const country_name of country_names) {
        var dropdown = document.getElementById('countryname');
        var option = document.createElement("OPTION");
        option.innerHTML = country_name;
        option.value = country_dict[country_name];
        dropdown.options.add(option);
    }
    console.log('Added countries in dropdown');
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function piechart(obj,type_of_data,chart_id,title_text,size=10){


    var sorter = {};

    var xValues = [];
    var yValues = [];
    var barColors = ["red", "green","blue","orange","brown"];

    for (let index = barColors.length; index < size; index++) {
        barColors[index] = getRandomColor();        
    }

    for (const c of obj['Countries']) {
        yValues.push(parseInt(c[type_of_data]));
        sorter[c[type_of_data]] = c['Country'];
    }

    let value_sum=0;
    yValues.sort(function(a, b){return b - a});
    yValues = yValues.slice(0,size);
    for (const param_val of yValues) {
        xValues.push(sorter[param_val.toString()]);
        value_sum+=param_val;
    }
    //add others
    xValues.push('Others');
    let othercount = obj['Global'][type_of_data]-value_sum;
    yValues.push(othercount);
    barColors.push('#FFD700');

    new Chart(chart_id, {
        type: "pie",
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        },
        options: {
            plugins:{
                title: {
                    display: true,
                    text: title_text,
                    padding:{
                        top:20,
                        bottom:20
                    },
                    font:{
                        size:32
                    }
                  }
                 , paddingBelowLegends: false
            }
          
        },
        config: {
            plugins: {
              paddingBelowLegends: false
            }
          }
      });

}

function barchart(obj,chart_id,title_text){
    console.log("TT",title_text);
    if (BarChart!=undefined){
        BarChart.destroy();
    }
    
    //console.log(obj);
    //var sorter = {};
    let from_date = document.getElementById("fromdate").valueAsDate.toISOString();
    
    var xValues = [];
    var yValues = [];
    var barColors = ['red'];

    

    for (let i = obj.length-1; i >0; i--) {
        let dte = obj[i]['Date'];
        let b = dte>=from_date;         //check if date is greater than start date
        
        let cases = obj[i]['Cases']-obj[i-1]['Cases'];
        if (cases<=0){
            cases = 0;
        }
        if (b){
            let date = new Date(dte);
            let xval = String(date.getDate())+"-"+String(date.getMonth()+1)+"-"+String(date.getFullYear());
            xValues.unshift(xval);
            yValues.unshift(cases);
        }
        
        
    }
    for (let i = 1; i < yValues.length; i++) {
        if (yValues[i]>yValues[i-1]){
            barColors.push("red");
        }
        else{
            barColors.push("green");
        }
    }
    
    

    BarChart = new Chart(chart_id, {
        type: "bar",
        data: {
          labels: xValues,
          datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        },
        options: {
            plugins:{
                title: {
                    display: true,
                    text: title_text,
                    padding:{
                        top:20,
                        bottom:20
                    },
                    font:{
                        size:32
                    }
                    },
                    legend:{
                      display:false
                    },
                    paddingBelowLegends: false
            },
            responsive: true,
            maintainAspectRatio: false
          
        },
        config: {
            plugins: {
              paddingBelowLegends: false
            }
          }
      });

}

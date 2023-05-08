import React, { useState } from 'react';
import {Bar, Line} from 'react-chartjs-2';
import { Chart as ChartJS } from "chart.js/auto";
import TextField from '@material-ui/core/TextField';
import water from './water.png';
import watercolored from './watercolored.png';
import './App.css';

// Data uploads
import activityData from './data/activity.json';
import dailyWater from './data/dailyWater.json';
import temperature from './data/temperature.json';
import totalWater from './data/totalWater.json';
import weeklyWater from './data/weeklyWater.json';

const state = {
  dailyConsumption: {
    datasets: [
      {
        label: 'Daily Consumption Times',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: dailyWater,
      }
    ]
  },
  monthlyConsumption: {
    datasets: [
      {
        label: 'Weekly Consumption',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: weeklyWater
      }
    ]
  },
  dailyTemperature: {
    datasets: [
      {
        label: 'Temperature Exposure',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: temperature,
        pointRadius: .5,
      }
    ]
  },
  dailyActivity: {
    datasets: [{
      label: "Steps Taken",
      fill: false,
      lineTension: 0.5,
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      borderWidth: 2,
      data: activityData
  }]
  },
  waterDrank: totalWater[0]['total']
}

function App() {
  var stepsTaken = 0
  if (activityData.length != 0) {
    stepsTaken = activityData[activityData.length - 1]['y']
  }
  const [age, setAge] = useState(21);
  const [weight, setWeight] = useState(180);
  const [gender, setGender] = useState("M");
  const [activity, setActivity] = useState(stepsTaken);
  const [temperature, setTemperature] = useState("Warm")
  var waterRequired; 
  if (gender == "M") {
    if (temperature == "Warm") {
      waterRequired = (weight * .5) * 1.1;
    } else if (temperature == "Mild") {
      waterRequired = (weight * .5) * 1.05
    } else if (temperature == "Cold") {
      waterRequired = (weight * .5) * 1
    }
  } else {
    if (temperature == "Warm") {
      waterRequired = (weight * .45) * 1.1;
    } else if (temperature == "Mild") {
      waterRequired = (weight * .45) * 1.05
    } else if (temperature == "Cold") {
      waterRequired = (weight * .45) * 1
    }
  }
  waterRequired = waterRequired + (activity/2500) * 8
  const [recWater, setRecWater] = useState(waterRequired);
  
  const handleWeightChange = e => {
    setWeight(e.target.value)
    if (gender == "M") {
      if (temperature == "Warm") {
        waterRequired = (e.target.value * .5) * 1.1;
      } else if (temperature == "Mild") {
        waterRequired = (e.target.value * .5) * 1.05
      } else if (temperature == "Cold") {
        waterRequired = (e.target.value * .5) * 1
      }
    } else {
      if (temperature == "Warm") {
        waterRequired = (e.target.value * .45) * 1.1;
      } else if (temperature == "Mild") {
        waterRequired = (e.target.value * .45) * 1.05
      } else if (temperature == "Cold") {
        waterRequired = (e.target.value * .45) * 1
      }
    }
    waterRequired = waterRequired + (activity/2500) * 8
    setRecWater(waterRequired)
  }
  const handleGenderChange = e => {
    setGender(e.target.value)
    if (e.target.value == "M") {
      if (temperature == "Warm") {
        waterRequired = (weight * .5) * 1.1;
      } else if (temperature == "Mild") {
        waterRequired = (weight * .5) * 1.05
      } else if (temperature == "Cold") {
        waterRequired = (weight * .5) * 1
      }
    } else {
      if (temperature == "Warm") {
        waterRequired = (weight * .45) * 1.1;
      } else if (temperature == "Mild") {
        waterRequired = (weight * .45) * 1.05
      } else if (temperature == "Cold") {
        waterRequired = (weight * .45) * 1
      }
    }
    waterRequired = waterRequired + (activity/2500) * 8
    setRecWater(waterRequired)
  }
  return (
    <div className="App">
      <div className="dashboard-header">
        <h1>Water Bottle Metrics</h1>
      </div>
      <div className="dashboard-body">
        <div className="dashboard-body-div1">
          <Bar
              data={{
                labels: ['Adam', 'Recommended Amount'],
                datasets: [
                  {
                    label: 'Total Water Drank',
                    backgroundColor: 'rgba(75,192,192,1)',
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 2,
                    data: [state.waterDrank, recWater]
                  }
                ]
              }}
              options={{
                title:{
                  display:true,
                  text:'Average Rainfall per month',
                  fontSize:20
                },
                legend:{
                  display:true,
                  position:'right'
                }
              }}
            />
        </div>
        <div className="dashboard-body-div2">
          <Line
            data={state.dailyConsumption}
            options={{
              title:{
                display:true,
                text:'Average Rainfall per month',
                fontSize:20
              },
              legend:{
                display:true,
                position:'right'
              },
              options:{
                responsive:true,
                maintainAspectRatio:false,
              }
          }}
        /></div>
        <div className="dashboard-body-div3"> 
          <Line
            data={state.monthlyConsumption}
            options={{
              title:{
                display:true,
                text:'Average Rainfall per month',
                fontSize:20
              },
              legend:{
                display:true,
                position:'right'
              },
              options:{
                responsive:true,
                maintainAspectRatio:false,
              }
          }}
        /></div>
        <div className="dashboard-body-div4"> 
          <div className="dashboard-body-div4-header">
            <h1>Recommended Water Consumption:</h1>
            <h2>{recWater}</h2>
          </div>
          <div className="dashboard-body-div4-body">
            <TextField id="standard-helperText" label="Age" defaultValue={age} helperText="Years"/>
            <TextField id="standard-helperText" onChange = {handleWeightChange} label="Weight" defaultValue={weight} helperText="Pounds"/>
            <TextField id="standard-helperText" onChange = {handleGenderChange} label="Gender" defaultValue={gender} helperText="M/F"/>
            <TextField disabled id="standard-disabled" label="Activity" defaultValue={activity} helperText="Steps"/>
            <TextField disabled id="standard-disabled" label="Temperature" defaultValue={temperature} helperText="Weather"/>
          </div>
        </div>
        <div className="dashboard-body-div5"> 
          <img src={state.waterDrank > recWater ? watercolored: water}/>
        </div>
        <div className="dashboard-body-div6"> 
          <Line
            data={state.dailyActivity}
            options={{
              title:{
                display:true,
                text:'Activity Monitor',
                fontSize:20
              },
              legend:{
                display:true,
                position:'right'
              },
              options:{
                responsive:true,
                maintainAspectRatio:false,
                scales: {
                  x: {
                      min: '2021-11-06 00:00:00',
                      max: '2021-11-07 00:00:00',
                      type: 'time'
                  }
              }
              }
          }}
        /></div>
        <div className="dashboard-body-div7"> 
          <Line
            data={state.dailyTemperature}
        /></div>
      </div>
    </div>
  );
}

export default App;

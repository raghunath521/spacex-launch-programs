import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './spacexlp.css';


function Spacexlp(){
    const baseURL=new URL('https://api.spacexdata.com/v3/launches?limit=100');

    // const [defaultProgramInfo,setdefaultProgramInfo] = useState([]);
    const [programInfo,setProgramInfo] = useState([]);
    const [launchDates, setLaunchDates] = useState([]);
    const [activeBtn, setActiveButton] = useState('');

    var years=[];

    // Adding params to the URL and firing an API call
    const changeFilter=(event)=>{
        baseURL.searchParams.delete(event.target.id);
        if(event.target.value!==activeBtn){
            baseURL.searchParams.append(event.target.id,event.target.value);
        }
        setActiveButton(event.target.value);
        getLaunchPrograms();
    }
    // API end point for the first-time page load without any Filters:
    const getLaunchPrograms=()=>{
        axios.get(baseURL).then(function(response){
            if(!years.length){
                let min=response.data[0].launch_year;
                let max=response.data[response.data.length-1].launch_year;
                for(let year=min;year<=max;year++){
                    let yearButton = <button  className={`btn ${activeBtn?activeBtn===year?"active":"activeC":''}`} id='launch_year' onClick={changeFilter} value={year} key={year} >{year}</button>
                    years.push(yearButton);
                }
            }
            console.log("hello");
            setProgramInfo(response.data);
        });
    }
    // const setYears=()=>{
    // }
    useEffect(()=>{
        let isMounted = true;
        console.log("hello");

        if(isMounted){
             getLaunchPrograms();
             setLaunchDates(years); 
        }
        // if(isMounted)  setYears();
        return () => {
            isMounted = false;
        }

    },[])
    var booleanLaunchButtons = <React.Fragment><button id='launch_success'  value='true' className='btn' onClick={changeFilter}>True</button>
                        <button  id='launch_success' value='false' className='btn' onClick={changeFilter}>False</button></React.Fragment>;
    var booleanLandButtons = <React.Fragment><button id='land_success' value='true' className='btn' onClick={changeFilter}>True</button>
                        <button  id='land_success' value='false' className='btn' onClick={changeFilter}>False</button></React.Fragment>;

    return (
        <div className="spacexlp">
            <div className='filter-programs'>
                <h3>Filters</h3>
                <p className='filter-type'>Launch Year</p>
                <div className='filter-buttons'>
                    {launchDates?launchDates:null}
                </div>
                <p  className='filter-type'>Successful Launch</p>
                <div className='filter-buttons'>
                    {booleanLaunchButtons}
                </div>
                <p  className='filter-type'>Successful Landing</p>
                <div className='filter-buttons'>
                    {booleanLandButtons}
                </div>
            </div>
            <div className="flights-grid">
                {programInfo?programInfo.map((flight)=>{
                    return (
                        <div className='flight-info' key={flight.flight_number}> 
                            <div className='flight-image-bg'>
                                <img  className='flight-image' src={flight.links.mission_patch_small} alt={flight.mission_name}></img>
                            </div>
                            <h4 className='flight-name'>{flight.mission_name}&nbsp;#{flight.flight_number}</h4>
                            <label className='flight-label'><strong>Mission ids:</strong></label>
                            <ul className='flight-list'>
                                {flight.mission_id.map((mission)=>{
                                    return <li key={mission}>{mission}</li>
                                })}
                            </ul>
                            <label className='flight-label'><strong>Launch Year:</strong> {flight.launch_year}</label>
                            <label className='flight-label'><strong>Successful Launch:</strong>{flight.launch_success?'true':'false'}</label>
                            <label className='flight-label'><strong>Successful Landing:</strong>{flight.rocket.cores?flight.rocket.cores[0].land_success?'true':'false':null}</label>
                        </div>
                    )
                }):null}
            </div>
            
        </div>  
    );
}

export default Spacexlp;
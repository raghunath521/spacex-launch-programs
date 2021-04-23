import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './spacexlp.css';


function Spacexlp(){
    const [baseURL]=useState(new URL('https://api.spacexdata.com/v3/launches?limit=100'));

    const [programInfo,setProgramInfo] = useState([]);
    const [launchYears, setLaunchYears] = useState([]);
    const [activeBtn, setActiveBtn] = useState({launch_year:'',launch_success:'',land_success:''});



    // Adding params to the URL and firing an API call
    const changeFilter=(event,param,activeType)=>{
        baseURL.searchParams.delete(param);
        if(activeType!==activeBtn[param]){
            baseURL.searchParams.append(param,event.target.value);
            setActiveBtn({...activeBtn,[param]:activeType});
        }
        else setActiveBtn({...activeBtn,[param]:''});
        getLaunchPrograms(baseURL);
    }
    // API end point for the first-time page load without any Filters:
    const getLaunchPrograms=(baseURL)=>{
        axios.get(baseURL).then(function(response){
            setProgramInfo(response.data);
        });
    }

    useEffect(()=>{
        let isMounted = true;
        let noFilter = 'https://api.spacexdata.com/v3/launches?limit=100';
        if(isMounted){
             getLaunchPrograms(noFilter);
        }
        return () => {
            isMounted = false;
        }

    },[])
    //Setting the filter launch year from the response
    useEffect(()=>{
        axios.get('https://api.spacexdata.com/v3/launches?limit=100').then(function(response){
            let min=response.data[0].launch_year;
            let max=response.data[response.data.length-1].launch_year;
            let years=[];
            for(let year=min;year<=max;year++){
                years.push(year);
            }
            setLaunchYears(years); 
        });
    },[]);

    var booleanLaunchButtons = <React.Fragment><button id='filter'  className={`btn ${activeBtn.launch_success?activeBtn.launch_success==='launch_success'?"active":"":''}`} value='true'  onClick={(event)=>changeFilter(event,'launch_success','launch_success')}>True</button>
                        <button  id='filter' value='false' className={`btn ${activeBtn.launch_success?activeBtn.launch_success==='no_launch_success'?"active":"":''}`} onClick={(event)=>changeFilter(event,'launch_success','no_launch_success')}>False</button></React.Fragment>;
    var booleanLandButtons = <React.Fragment><button id='filter' className={`btn ${activeBtn.land_success?activeBtn.land_success==='land_success'?"active":"":''}`} value='true' onClick={(event)=>changeFilter(event,'land_success','land_success')}>True</button>
                        <button  id='filter' value='false' className={`btn ${activeBtn.land_success?activeBtn.land_success==='no_land_success'?"active":"":''}`} onClick={(event)=>changeFilter(event,'land_success','no_land_success')}>False</button></React.Fragment>;
    

    return (
        <div className="spacexlp">
            <div className='filter-programs'>
                <h2>Filters</h2>
                <p className='filter-type'>Launch Year</p>
                <div className='filter-buttons'>
                    {launchYears?launchYears.map((year)=>{
                        return <button  className={`btn ${activeBtn.launch_year?activeBtn.launch_year===year?"active":"":''}`} 
                        id='filter' onClick={(event)=>changeFilter(event,'launch_year',year)} value={year} key={year} >{year}</button>
                    }):null}
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
                        <div className='flight-info' key={flight.mission_name}> 
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
                            {/* 'launch_landing' attribute not found  and land_success was also not clear*/}
                            <label className='flight-label'><strong>Successful Landing:</strong>{flight.rocket.cores?flight.rocket.cores[0].land_success?'true':'false':null}</label>
                        </div>
                    )
                }):null}
            </div>
            
        </div>  
    );
}

export default Spacexlp;
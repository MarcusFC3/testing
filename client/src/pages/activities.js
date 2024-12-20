
import { useState } from 'react'
import Activity from "../components/Activity";

import { postActivityData, getActivityData } from '../hooks/requests';

let activityCount = 0

const Activities = () => {
    const [activities, setActivities] = useState(generateActivity)

    // This function is what will pull the activities the user already has
    function generateActivity() {
        const activityArray = []

        activityArray[0] = { key:activityCount++, Name:"Activity Name", descr: "Activity Description", amount: 4, progress: 0}

        return activityArray
    }

    function createNewActivity(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const activityKey = activityCount
        const activityName = formData.get("activityName");
        const activityDescr = formData.get("activityDescr");
        const activityAmount = formData.get("activityAmount");

        const activityData = {
            Name: activityName,
            descr: activityDescr,
            amount: activityAmount
        }

        postActivityData(activityData);

        activityCount++;

        setActivities(prevActivities => [
            ...prevActivities, {
                key: activityKey,
                Name: activityName,
                descr: activityDescr,
                amount: activityAmount, 
                progress: 0}
        ])
    }

    function alignKeys(key){
        console.log("Running alignKeys function")
        activities.forEach((activityObj) => {
            if(activityObj.key > key){
                activityObj.key--;
            } 
        })
    }
    
    // There is an error with the delete and increaseprogress 
    // functions that has to do with the fact it is stored in 
    // an object in an array
    const activityElements = activities.map(activityObj => 
    <Activity 
        key={activityObj.key} 
        id={activityObj.key}
        Name={activityObj.Name} 
        descr={activityObj.descr}
        amount={activityObj.amount} 
        progress={activityObj.progress}
        delete={function deleteActivity() {
            console.log("Running deleteActivity function")
            setActivities(prevActivities => {
                activityCount--;
                prevActivities.splice(prevActivities[activityObj.key].key, 1);
                alignKeys(activityObj.key);
                return [
                ...prevActivities,
                ]
            })
        }}
        increaseProgress={function increaseProgress() {
            console.log("Running increaseProgress function")
            setActivities(prevActivities => {
                console.log(prevActivities[activityObj.key].progress += activityObj.progress < activityObj.amount? 1 : 0)
                return [
                ...prevActivities,
                ]
            })
        }}

        /> )

        function openForm() {
            document.getElementById("activity_form_container").style.display = "block"
        }

        function closeForm() {
            document.getElementById("activity_form_container").style.display = "none"
        }

    return <div>
        <div className="row">
            <h1>Activities</h1>

            <button onClick={openForm} >Create Activity</button>

            <div id="activity_form_container" className="activityForm">
                <form  id="activity_form" onSubmit={createNewActivity}>
                    <h1>Create an Activity</h1>

                    <label>Activity Name</label>
                    <input id="acitivity_name" name="activityName" type="text"></input>

                    <label>Reps/Duration of Activity</label>
                    <input id="acitivity_descr" name="activityDescr" type="text"></input>

                    <label>Amount to complete</label>
                    <input id="acitivity_amount" name="activityAmount" type="text"></input>

                    <button>Create Activity</button>
                    <button type="button" onClick={closeForm}>Close</button>
                </form>
            </div>

            <div className="activity-container">
                {activityElements}
            </div>
        </div>
    </div>
}
export default Activities;


import { useState } from 'react'
import Activity from "../components/Activity";

import { postActivityData } from '../hooks/requests';

let activityCount = 1

const Activities = () => {
    const [activities, setActivities] = useState(generateActivity())

    // This function is what will pull the activities the user already has
    function generateActivity() {
        const activityArray = []

        activityArray[0] = { key:0, Name:"Activity Name", descr: "Activity Description", amount: 43}

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
                amount: activityAmount }
        ])
    }

    

    const activityElements = activities.map(activityObj => 
    <Activity 
        key={activityObj.key} 
        Name={activityObj.Name} 
        descr={activityObj.descr}
        amount={activityObj.amount} 
        delete={function deleteActivity() {
            setActivities(prevActivities => {
                prevActivities.splice(prevActivities[activityObj.key], 1)
                return [
                ...prevActivities,
                ]
        })
        }
    }
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

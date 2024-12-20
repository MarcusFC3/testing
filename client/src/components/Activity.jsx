
export default function Activity(props) {

    
    
    return (
        <div className="col-12 col-md-4 Activity">
                <h2>{props.Name}</h2>
                <h3>Reps/Duration: {props.descr}</h3>
                <h4>Progress: {props.progress} / {props.amount}</h4>

                {/* 
                 We could change the words on these buttonsinto icons.
                 ex. trash can for the delete button 
                */}
                <button onClick={props.increaseProgress}>Complete Rep</button>
                <button onClick={null}>Edit Activity</button>
                <button onClick={props.delete}>Delete Activity</button>
        </div>
    )
}
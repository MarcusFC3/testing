
export default function Activity(props) {

    return (
        <div className="col-12 col-md-4 Activity">
                <h2>{props.Name}</h2>
                <h3>Reps/Duration: {props.descr}</h3>
                <h4>Amount to complete: {props.amount}</h4>
                <div className="progress-bar-holder"><div className="progress_bar"></div></div>
                <button onClick={props.delete}>Delete Activity</button>
        </div>
    )
}
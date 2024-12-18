const Home = () => {
    return <div>
        <div className="row">
            <div className="col-12">
                <div className="homebackgroundimage">
                    <div className="homebackgroundimagetext">Welcome</div>
                </div>
            </div>
        </div>
        <div className="row d-flex home_text">
            <div className="col-12 col-md-4">
                <h2>Easy Habit Tracking</h2>
                <p>Simply Health makes it easy to track your habits</p>
            </div>
            <div className="col-12 col-md-4">
                <h2>Teams</h2>
                <p>You work together with your coworkers to compete against other teams</p>
            </div>
            <div className="col-12 col-md-4">
                <h2>Goals</h2>
                <p>Your team managers can set habit goals for you to meet</p>
            </div>
        </div>
    </div>
}
export default Home;


import { useState } from "react"
import LeaderboardRow from "../components/LeaderboardRow"

import { getForLeaderboard } from "../hooks/requests"

const Leaderboard = () => {
    const [leaderboardRows, setLeaderboardRows] = useState(generateTableBody())

    function generateTableBody(){

        // getForLeaderboard()

        return [{key: 0, Rank: 1, Team: "IT Academy", Company: "Four County Career Center", ActivityComplete: 5},{key: 1, Rank: 2, Team: "Culinary", Company: "Four County Career Center", ActivityComplete: 3}]
    }

    const leaderboardRowElements = leaderboardRows.map(leaderboardRowObj => 
        <LeaderboardRow 
        key={leaderboardRowObj.key}
        Rank={leaderboardRowObj.Rank}
        Team={leaderboardRowObj.Team}
        Company={leaderboardRowObj.Company}
        ActivityComplete={leaderboardRowObj.ActivityComplete}
        /> 
    )

    return <div>
        <div className="row">
            <div className="col-12 col-md-8">
                <h2>Teams</h2>
                <div id="TeamRankTable">

                    {/* To Do
                    set up a leaderboard row component
                    have it automatically set up the leaderboard with data
                    add a button that adds more teams to the leaderboard
                    add more content to the leaderboards page
                    add the ability to sort/search through the teams 
                    */}

                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Team</th>
                                <th>Company</th>
                                <th>Different Activities Completed</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardRowElements}
                        </tbody>
                    </table>
                </div>
                {/* <button onClick={null}>More</button> */}
            </div>
            <div className="col-12 col-md-4">
                <h2>Something else</h2>
                <p>Desc</p>
            </div>
        </div>
    </div>
}
export default Leaderboard;

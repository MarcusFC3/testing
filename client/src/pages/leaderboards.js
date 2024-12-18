
import { useState } from "react"
import LeaderboardRow from "../components/LeaderboardRow"

const Leaderboard = () => {
    // const [leaderboardRows, setLeaderboardRows] = useState(generateTableBody())

    // function generateTableBody(){
    //     return [{Rank: 1, Team: "IT Academy", Company: F, ActiviyCompletes},{Rank: 2, Team: , Company: , ActiviyCompletes}]
    // }

    // const leaderboardRowElements = leaderboardRows.map(leaderboardRowObj => 
    //     <LeaderboardRow /> )

    return <div>
        <div className="row">
            <div className="col-12 col-md-8">
                <h2>Teams</h2>
                <div>

                    {/* To Do
                    add more content to the leaderboards.
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
                            {/* {createTableBody()} */}
                            <tr>
                                <td>2</td>
                                <td>Culinary</td>
                                <td>Four County Career Center</td>
                                <td>3</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>team name</td>
                                <td>company name</td>
                                <td>activities  completed</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-12 col-md-4">
                <h2>Something else</h2>
                <p>Desc</p>
            </div>
        </div>
    </div>
}
export default Leaderboard;

import { React } from "react"
import { checkAccount } from "../hooks/account"

export default function Login() {

    return <div>
        <div className="row">
            <div className="col-12 col-md-4 mx-auto">
            <form id="login_form" onSubmit={checkAccount}>

                    <h4>Login</h4>

                    <p>
                        <label htmlFor="email">Email: </label>
                        <input 
                            type="text" 
                            name="email" 
                            id="email"
                        />
                    </p>

                    <p>
                        <label htmlFor="password">Password: </label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password"
                        />
                    </p>

                    <button id="Submit">Login</button>
                </form>
            </div>
        </div>
    </div>

}
import { React } from 'react';
import {registerAccount} from '../hooks/account';

export default function signUp() {

    return <div>
        <div className="row">
            <div className="col-12 col-md-4 mx-auto">
            <form id="sign_up_form" onSubmit={registerAccount}>

                    <h4>Sign Up</h4>

                    <p>
                        <label htmlFor="first_name">First Name: </label>
                        <input 
                            type="text" 
                            name="firstName" 
                            id="first_name" 
                        />
                        
                    </p>
                    
                    <p>
                        <label htmlFor="last_name">Last Name: </label>
                        <input 
                            type="text" 
                            name="lastName" 
                            id="last_name" 
                        />
                        
                    </p>

                    <p>
                        <label htmlFor="email">Email: </label>
                        <input 
                            type="text" 
                            name="email" 
                            id="email"
                        />
                    </p>
                    
                    <p>
                        <label htmlFor="username">Username: </label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username"
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

                    <p>
                        <label htmlFor="password_verify">Verify Password: </label>
                        <input 
                            type="password" 
                            name="password_verify" 
                            id="password_verify"
                        />
                    </p>

                    <button id="Submit">Sign Up</button>
                </form>
            </div>
        </div>
    </div>
}
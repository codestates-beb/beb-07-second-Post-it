import axios from 'axios';
import React, { useState } from 'react';


function Login() {

    const [login, loginSet] = useState({nickname : "", password : ""});

    async function IDChange(e: React.ChangeEvent<HTMLInputElement>) {
        login.nickname = e.target.value;
        loginSet(login)
    }

    async function PWChange(e: React.ChangeEvent<HTMLInputElement>) {
        login.password = e.target.value;
        loginSet(login)
    }

    async function submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        await axios.post("http://localhost:4000/users/login",
            login //param
        ).then((response) => {
            if(response.data){
                // eslint-disable-next-line no-restricted-globals
                location.href="/";
                sessionStorage.setItem("user_id", login.nickname);
                loginSet({nickname : "", password : ""});
            }
        })
    }

    async function moveSignUp(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        // eslint-disable-next-line no-restricted-globals
        location.href="/signup"
    }
    
    return (
        <main>
            <section>
                <blockquote>
                    <p>
                        <h1>Login</h1>
                        <input placeholder='ID' onChange={e => IDChange(e)} />
                        <input placeholder='PW' type="password" onChange={e => PWChange(e)} />
                        <button onClick={e => submit(e)}><b>Login</b></button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={e => moveSignUp(e)}><b>SignUp</b></button>

                    </p>

                </blockquote>
            </section>
        </main>
    )
}

export default Login
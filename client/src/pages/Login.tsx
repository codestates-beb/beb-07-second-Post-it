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

    async function submint(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        // axios.post("http://localhost:4000/login",
        //     {login}
        // ).then((response) => {
        //     console.log(response.data);
        // })
        sessionStorage.setItem("user_id", login.nickname);

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
                        <button onClick={e => submint(e)}><b>Create</b></button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button onClick={e => moveSignUp(e)}><b>SignUp</b></button>

                    </p>

                </blockquote>
            </section>
        </main>
    )
}

export default Login
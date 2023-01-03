import axios from 'axios';
import React, { useEffect, useState } from 'react';

function SignUp() {

    const [signUp, signUpSet] = useState({nickname : "", password : ""});

    async function IDChange(e: React.ChangeEvent<HTMLInputElement>) {
        signUp.nickname = e.target.value;
        signUpSet(signUp)
    }

    async function PWChange(e: React.ChangeEvent<HTMLInputElement>) {
        signUp.password = e.target.value;
        signUpSet(signUp)
    }


    async function submint(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        axios.post("http://localhost:4000/users/signup",
            {signUp}
        ).then((response) => {
            console.log(response.data);
        })
        sessionStorage.setItem("user_id", signUp.nickname);
    }

    return (
        <main>
            <section>
                <blockquote>
                    <h1>Create Accout</h1>
                    <input placeholder='ID' onChange={e => IDChange(e)} />
                    <input placeholder='PW' type="password" onChange={e => PWChange(e)} />
                    <button onClick={e => submint(e)}>Create</button>
                </blockquote>
            </section>
        </main>
    )
}

export default SignUp;
import axios from 'axios';
import React, { useState } from 'react';

// import "./Mint.css"

function Mint() {
    const [uri, setUri] = useState("");

    function setURI(e: React.ChangeEvent<HTMLInputElement>): void {
        setUri(e.target.value)
    }

    async function submit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        await axios.post("http://localhost:4000/users/minting", {uri:uri});
        console.log("click submit button")
    }
    return (
        <main>
            <section>
                <blockquote>
                    <p>
                        <h1>Minting</h1>
                        <input placeholder='URI' onChange={e => setURI(e)} className="input__uri" />
                        <button onClick={e => submit(e)}><b>Create</b></button>
                    </p>
                </blockquote>
            </section>
        </main>
    )
}

export default Mint;
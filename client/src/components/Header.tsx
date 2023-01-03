import React from 'react';

interface propsType {
    isLogin : boolean   
}

function Header({isLogin} : propsType) {

    return (
        <header>
            <nav>
                <a href='/'>logo</a>
                <ul>
                    <li>
                        <a href="/mint">Mint</a>
                    </li>
                    <li>
                        <a href="/market">Market</a>
                    </li>
                    <li>
                        {
                            isLogin ?  <a href="/mypage">MyPage</a> :<a href="/login">Login/Signup</a>
                        }
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
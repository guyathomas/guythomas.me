import React from "react"
import styled from "@emotion/styled"

import Hamburger from './icons/hamburger.svg';

const Nav = styled.nav`
    position: absolute;
    width: 100%;
    z-index: 1;
`

const HamburgerWrapper = styled.div`
    height: 3.8rem;
    display: flex;
    justify-content: flex-end;
    padding: 1.8rem 1rem 0;
    & svg {
        height: 100%;
        width: unset;
    }
`

export const Header = () => {
    return (
        <Nav>
            <HamburgerWrapper>
                <Hamburger />
            </HamburgerWrapper>
        </Nav>
    )
}

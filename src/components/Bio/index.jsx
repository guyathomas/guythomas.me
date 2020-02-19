import React from "react"
import styled from "@emotion/styled"
import avatarImage from "assets/images/avatar.jpg"

const Avatar = styled.img`
  border-radius: 50%;
  width: 11rem;
  margin-bottom: 0;
  grid-area: avatar;
`

const Header = styled.header`
  display: grid;
  grid-template-areas:
    "avatar avatar"
    "main   main";

  grid-template-columns: 30% 1fr;
  @media (min-width: 1024px) {
    grid-template-areas:
      "avatar main"
      "avatar main";
  }
  width: 100%;
  padding: 2rem 3.5rem 0.4rem;
  max-width: 1276px;
`

const Description = styled.div`
  padding: 1.75rem 3.5rem 1.4rem;
`

const SocialIcons = styled.div`
s`

const FullName = styled.h1`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  @media (min-width: 1024px) {
    align-itmes: flex-start;
  }
`

const Name = styled.span`
  color: gray;
`

const SecondName = styled(Name)`
  text-transform: uppercase;
  font-weight: 700;
  color: #f8bb10;
`

const Tagline = styled.h5`
  margin: 0;
  margin-top: 1rem;
`

const ContactDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 760px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`

const ContactDetail = styled.div`
  @media (max-width: 760px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const Divider = styled.div`
  margin-top: 1rem;
  border-bottom: 1px solid gray;
  width: 100%;
`

const Main = styled.main`
  grid-area: main;
`

export const Bio = () => (
  <Header>
    <Avatar src={avatarImage} />
    <Main>
      <Description>
        <FullName>
          <Name>Guy</Name>
          <SecondName>Thomas</SecondName>
        </FullName>
        <Tagline>Full Stack Developer and Front End Expert</Tagline>
        <SocialIcons />
      </Description>
      <ContactDetails>
        <ContactDetail>
          <h4>Location</h4>
          <div>San Francisco</div>
        </ContactDetail>
        <ContactDetail>
          <h4>Phone</h4>
          <div>415 200 8333</div>
        </ContactDetail>
        <ContactDetail>
          <h4>Web</h4>
          <div>
            <a href="https://guythomas.me">guythomas.me</a>
          </div>
        </ContactDetail>
        <ContactDetail>
          <h4>Email</h4>
          <div>
            <a href="mailto:guythomas721@gmail.com">guythomas721@gmail.com</a>
          </div>
        </ContactDetail>
      </ContactDetails>
    </Main>
  </Header>
)

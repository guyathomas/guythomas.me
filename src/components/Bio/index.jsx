import React from "react"
import styled from "@emotion/styled"
import avatarImage from "assets/images/avatar.jpg"

const Avatar = styled.img`
  border-radius: 50%;
  width: 11rem;
  margin-bottom: 0;
`

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: avatar;
`

const Header = styled.header`
  display: grid;
  height: 100vh;
  grid-template-areas:
    "avatar avatar"
    "main   main";

  grid-template-columns: 30% 1fr;
  grid-template-rows: min-content 1fr;
  @media (min-width: 1024px) {
    grid-template-areas:
      "avatar main"
      "avatar main";
  }
  width: 100%;
  padding-top: 2rem;
  max-width: 1276px;
`

const Description = styled.div`
  padding: 1.75rem 3.5rem 1.4rem;
  text-align: center;
  @media (min-width: 1024px) {
    text-align: left;
  }
`

const SocialIcons = styled.div``

const FullName = styled.h1`
  margin: 0;
`

const Name = styled.div`
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
  text-align: inherit;
`

const ContactDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 760px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: 1.75rem 3.5rem 1.4rem;
  }
  @media (min-width: 1024px) {
    bottom: 1rem;
    position: absolute;
  }
`

const ContactDetail = styled.div`
  padding-bottom: 1.75rem;
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
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
`

const ContactDetailHeader = styled.h4`
  margin-top: 0;
  margin-bottom: 0.5rem;
`

export const Bio = () => (
  <Header>
    <AvatarWrapper>
      <Avatar src={avatarImage} />
    </AvatarWrapper>
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
          <ContactDetailHeader>Location</ContactDetailHeader>
          <div>San Francisco</div>
        </ContactDetail>
        <ContactDetail>
          <ContactDetailHeader>Phone</ContactDetailHeader>
          <div>415 200 8333</div>
        </ContactDetail>
        <ContactDetail>
          <ContactDetailHeader>Web</ContactDetailHeader>
          <div>
            <a href="https://guythomas.me">guythomas.me</a>
          </div>
        </ContactDetail>
        <ContactDetail>
          <ContactDetailHeader>Email</ContactDetailHeader>
          <div>
            <a href="mailto:guythomas721@gmail.com">guythomas721@gmail.com</a>
          </div>
        </ContactDetail>
      </ContactDetails>
    </Main>
  </Header>
)

import React from "react"
import styled from "@emotion/styled"

const PageContainer = styled.div`
  background-color: black;
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: 1024px) {
    grid-template-columns: auto auto;
  }
`

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: blue;
  @media (min-width: 1024px) {
    width: 300px;
    height: 300px;
    background-color: lightgray;
  }
`

const SectionTitle = styled.div`
  background-color: gray;
  text-transform: uppercase;
  @media (min-width: 1024px) {
    &:nth-child(odd) {
      background-color: lightgray;
    }
  }
`

const AvatarContainer = styled.div`
  background-color: gray;
  display: flex;
  justify-content: center;
  @media (min-width: 1024px) {
    background-color: white;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 10rem;
    padding-right: 3rem;
  }
`

const Titles = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @media (min-width: 1024px) {
    flex-grow: 1;
    text-align: initial;
    flex-direction: row;
    justify-content: space-between;
  }
`
const Contacts = styled.div`
  border-top: 1px solid gray;
  text-align: center;
  @media (min-width: 1024px) {
    text-align: initial;
    padding-bottom: 1.75rem;
    display: flex;
    justify-content: space-between;
  }
`

const ContactWrapper = styled.div``

const Contact: React.FC<{
  title: string
  detail: string
  detailLink?: string
}> = ({ title, detail, detailLink }) => {
  const detailContent = detailLink ? <a href={detailLink}>{detail}</a> : detail
  return (
    <ContactWrapper>
      <h3>{title}</h3>
      <span>{detailContent}</span>
    </ContactWrapper>
  )
}

const SocialTile = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 5px;
  background-color: lightgray;
  margin: 0.5rem 0.5rem 0;
`
const SocialTilesWrapper = styled.div`
  display: flex;
`

const SocialTiles: React.FC = () => (
  <SocialTilesWrapper>
    {[1, 2, 3, 4].map((num) => (
      <SocialTile key={num} />
    ))}
  </SocialTilesWrapper>
)

const FirstName = styled.h1`
  margin: 0;
`
const TitlesWrapper = styled.div`
  width: 100%;
`
const LastName = styled(FirstName)`
  font-weight: bold;
`

const DescriptionAndSocial = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 2rem;
  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`

const Bio = styled.div`
  padding: 3.15rem 3.5rem 1.4rem;
  @media (min-width: 1024px) {
    padding: 4.375rem 5.25rem 1.6625rem;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
`

const Description = styled.h2`
  margin-bottom: 0;
`
interface SectionProps {
  title: string
  children: React.ReactNode
}

const SectionContent = styled.div``
const Section: React.FC<SectionProps> = ({ title, children }) => (
  <>
    <SectionTitle>
      <div>{title}</div>
    </SectionTitle>
    <SectionContent>{children}</SectionContent>
  </>
)

const Resume: React.FC = () => {
  return (
    <PageContainer>
      <AvatarContainer>
        <Avatar />
      </AvatarContainer>
      <Bio>
        <Titles>
          <TitlesWrapper>
            <FirstName>Guy</FirstName>
            <LastName>Thomas</LastName>
            <DescriptionAndSocial>
              <Description>
                Full Stack Developer &amp; Front-end Expert
              </Description>
              <SocialTiles />
            </DescriptionAndSocial>
          </TitlesWrapper>
        </Titles>
        <Contacts>
          <Contact title="Location" detail="San Francisco" />
          <Contact title="Location" detail="San Francisco" />
          <Contact title="Location" detail="San Francisco" />
        </Contacts>
      </Bio>
      <Section title="First!">Some Content</Section>
      <Section title="Second!">Some Content</Section>
      <Section title="Third!">Some Content</Section>
    </PageContainer>
  )
}

export default Resume

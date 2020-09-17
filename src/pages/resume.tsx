import React from "react"
import styled from "@emotion/styled"
import { COLOR_PALETTE } from "~styles"
import { ThemeProvider } from "../templates/GlobalLayout"

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  color: ${() => COLOR_PALETTE.primary.color};
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2fr;
  }
`

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: wheat;
  @media (min-width: 1024px) {
    width: 300px;
    height: 300px;
  }
`

const SectionTitle = styled.div`
  display: flex;
  justify-content: center;
  text-transform: uppercase;
  background-color: ${() => COLOR_PALETTE.backgroundSecondary.color};
  padding: 1.75rem;
  border-top: 1px solid ${() => COLOR_PALETTE.strokePrimary.color};
  border-bottom: 1px solid ${() => COLOR_PALETTE.strokePrimary.color};
  @media (min-width: 1024px) {
    border: 0;
    justify-content: flex-end;
    padding: 4.375rem 5.25rem 1.6625rem;
    &:nth-child(4n + 1) {
      background-color: ${() => COLOR_PALETTE.backgroundSecondary.color};
    }
    &:nth-child(4n + 3) {
      background-color: ${() => COLOR_PALETTE.backgroundTertiary.color};
    }
  }
`

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${() => COLOR_PALETTE.backgroundSecondary.color};
  @media (min-width: 1024px) {
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 10rem;
    padding-right: 3rem;
    height: 100vh;
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
const SectionContent = styled.div`
  background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
  @media (min-width: 1024px) {
    justify-content: flex-end;
    &:nth-child(4n) {
      background-color: ${() => COLOR_PALETTE.backgroundSecondary.color};
    }
    &:nth-child(4n + 2) {
      background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
    }
  }
`

const SectionContentInner = styled.div`
  padding: 3.15rem 3.5rem 1.4rem;
  max-width: 1400px;
  @media (min-width: 1024px) {
    padding: 4rem 5rem;
  }
`

const Bio = styled(SectionContentInner)`
  @media (min-width: 1024px) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`

const Description = styled.h2`
  margin-bottom: 0;
`
interface SectionProps {
  title: string
  children: React.ReactNode
}

const TimelineOuter = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`

const TimelineTitles = styled.div``
const TimelineDetails = styled.div``

const TimelinePre = styled.h5`
  opacity: 0.6;
  font-size: 0.7rem;
  margin: 1rem 0 1rem;
`
const TimelineTitle = styled.h3`
  margin: 1rem 0 1rem;
`
const TimelineSubtitle = styled.h4`
  margin: 0;
  font-size: 0.8rem;
  margin: 1rem 0 1rem;
`
const TimelineDescription = styled.span`
  font-style: italic;
  margin: 1rem 0 1rem;
`

const TimelineListItem = styled.li``

const TimelineList = styled.ul`
  margin-left: 0;
  margin-top: 1rem;
  list-style-position: outside;
`
interface TimelineProps {
  titlePre: string
  title: string
  subtitle: string
  description?: string
  bullets: string[]
}
const Timeline: React.FC<TimelineProps> = ({
  titlePre,
  title,
  subtitle,
  description,
  bullets,
}) => (
  <TimelineOuter>
    <TimelineTitles>
      <TimelinePre>{titlePre}</TimelinePre>
      <TimelineTitle>{title}</TimelineTitle>
      <TimelineSubtitle>{subtitle}</TimelineSubtitle>
      {description && <TimelineDescription>{description}</TimelineDescription>}
    </TimelineTitles>
    <TimelineDetails>
      <TimelineList>
        {bullets.map((bullet) => (
          <TimelineListItem key={bullet}>{bullet}</TimelineListItem>
        ))}
      </TimelineList>
    </TimelineDetails>
  </TimelineOuter>
)

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <>
    <SectionTitle>
      <div>{title}</div>
    </SectionTitle>
    <SectionContent>
      <SectionContentInner>{children}</SectionContentInner>
    </SectionContent>
  </>
)

const Resume: React.FC = () => {
  return (
    <ThemeProvider>
      <PageContainer>
        <AvatarContainer>
          <Avatar />
        </AvatarContainer>
        <SectionContent>
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
              <Contact
                title="Web"
                detail="guythomas.me"
                detailLink="https://guythomas.me"
              />
              <Contact
                title="Email"
                detail="guythomas721@gmail.com"
                detailLink="mailto:guythomas@gmail.com"
              />
            </Contacts>
          </Bio>
        </SectionContent>
        <Section title="Intro">
          I live and breathe Javascript, Typescript, React, HTML and CSS.
          I&apos;m a Software Engineer agnostic of languages &amp; frameworks
          and have worked with all sorts of tech including GraphQL, Cypress and
          much more - just ask me.
        </Section>
        <Section title="Experience">
          <Timeline
            title="Lyft"
            titlePre="15th April, 2019 – Present"
            subtitle="Senior Software Engineer"
            description="Frontend Lead"
            bullets={[
              "Built a Marketplace experience dynamic navigation with React & X-State",
              "Linked our teams data model to the Lyft Graphql server in Go to enable a dynamic frontend",
              "Built an ecosystem of npm packages that enabled zero configuration I18n and CMS content for all Frontend services",
              "Lead several technology changes with the with the introduction of Graphql, Cypress and auto generated Typescript types",
            ]}
          />
        </Section>
        <Section title="Education">Some Content</Section>
        <Section title="Education">Some Content</Section>
        <Section title="Education">Some Content</Section>
        <Section title="Education">Some Content</Section>
      </PageContainer>
    </ThemeProvider>
  )
}

export default Resume

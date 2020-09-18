import React from "react"
import styled from "@emotion/styled"
import { COLOR_PALETTE } from "~styles"
import { ThemeProvider } from "../templates/GlobalLayout"

const BREAKPOINT = "1024px"
const DESKTOP = `(min-width: ${BREAKPOINT})`
const MOBILE = `(max-width: ${BREAKPOINT})`

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  color: ${() => COLOR_PALETTE.primary.color};
  @media ${DESKTOP} {
    grid-template-columns: 1fr 2fr;
  }
`

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: wheat;
  @media ${DESKTOP} {
    width: 300px;
    height: 300px;
  }
`

const SectionTitle = styled.div`
  display: flex;
  text-transform: uppercase;
  background-color: ${() => COLOR_PALETTE.backgroundSecondary.color};
  justify-content: center;
  padding: 1.75rem;
  @media ${MOBILE} {
    position: sticky;
    top: 0;
    z-index: 1;
    border-top: 1px solid ${() => COLOR_PALETTE.strokePrimary.color};
    border-bottom: 1px solid ${() => COLOR_PALETTE.strokePrimary.color};
  }
  @media ${DESKTOP} {
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
  padding-top: 5rem;
  background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
  @media ${DESKTOP} {
    background-color: ${() => COLOR_PALETTE.backgroundSecondary.color};
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 10rem;
    padding-right: 3rem;
    height: 100vh;
  }
`

const Titles = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  @media ${MOBILE} {
    text-align: center;
  }
  @media ${DESKTOP} {
    flex-grow: 1;
    flex-direction: row;
    justify-content: space-between;
  }
`
const Contacts = styled.div`
  border-top: 1px solid ${() => COLOR_PALETTE.strokePrimary.color};
  @media ${MOBILE} {
    text-align: center;
  }
  @media ${DESKTOP} {
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
  @media ${DESKTOP} {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`
const SectionContent = styled.div`
  background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
  @media ${DESKTOP} {
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
  padding: 3rem 1rem 1rem;
  max-width: 1400px;
  @media ${DESKTOP} {
    padding: 3rem 3rem 1rem;
    padding: 4rem 5rem;
  }
`

const Bio = styled(SectionContentInner)`
  @media ${DESKTOP} {
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
  @media ${DESKTOP} {
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
  padding-left: 0.5rem;
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
          <Timeline
            title="Reflektive"
            titlePre="26th June, 2017 – 28th February, 2019"
            subtitle="Software Engineer"
            bullets={[
              "Planned, developed and maintained many of our core products with React and Redux",
              "Lead migration from Backbone to React",
              "Cut build time by 50% by migrating Webpack 3 > 4",
              "Migrated ~500 tests to Jest to reduce testing feedback loop",
            ]}
          />
          <Timeline
            title="IBM"
            titlePre="7th July, 2014 – 3rd June, 2016"
            subtitle="Software Engineer"
            bullets={[
              "Developed internal websites to pitch solutions",
              "Developed data models to target customer behavior",
            ]}
          />
        </Section>
        <Section title="Education">
          <Timeline
            title="Bradfield CS"
            titlePre="2017"
            subtitle="Computer Architecture"
            bullets={[
              "Building a strong mental model of the actual execution of programs by a microprocessor to better reason about the code I write",
            ]}
          />
          <Timeline
            title="Monash University"
            titlePre="2011 - 2013"
            subtitle="Bachelor of Commerce"
            description="Major in Finance &amp; Information Technology"
            bullets={[
              "Built systems for business administration with VBA & Excel",
              "Architected and Implemented relational databases",
              "Modelled publically available financial data to provide company valuations",
            ]}
          />
        </Section>
      </PageContainer>
    </ThemeProvider>
  )
}

export default Resume

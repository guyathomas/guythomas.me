import React from "react"
import styled from "@emotion/styled"
import { COLOR_PALETTE } from "~styles"
import { ThemeProvider } from "../templates/GlobalLayout"
import lightResumePdf from "../../static/resume-light.pdf"
import darkResumePdf from "../../static/resume-dark.pdf"
import useDarkMode from "use-dark-mode"

const BREAKPOINT = "1024px"
const DESKTOP = `(min-width: ${BREAKPOINT})`
const MOBILE = `(max-width: ${BREAKPOINT})`

interface SVGProps {
  className?: string
}
const DownloadSvg: React.FC<SVGProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 8 11"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.64645 8.35355C3.84171 8.54882 4.15829 8.54882 4.35355 8.35355L7.53553 5.17157C7.7308 4.97631 7.7308 4.65973 7.53553 4.46447C7.34027 4.2692 7.02369 4.2692 6.82843 4.46447L4 7.29289L1.17157 4.46447C0.976311 4.2692 0.659728 4.2692 0.464466 4.46447C0.269204 4.65973 0.269204 4.97631 0.464466 5.17157L3.64645 8.35355ZM3.5 2.18557e-08L3.5 8L4.5 8L4.5 -2.18557e-08L3.5 2.18557e-08Z"
      fill="inherit"
    />
    <path d="M0 10H8V11H0V10Z" fill="inherit" />
  </svg>
)

const StyledSvg = styled(DownloadSvg)`
  height: 1.5rem;
  width: 1.5rem;
  margin-left: 1rem;
  display: inline-block;
  fill: ${() => COLOR_PALETTE.interactive.color};
  &:hover {
    fill: ${() => COLOR_PALETTE.interactiveActive.color};
  }
  @media print {
    display: none;
  }
`

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  color: ${() => COLOR_PALETTE.primary.color};
  color-adjust: exact; /* Tries to print background images */
  @media ${DESKTOP} {
    grid-template-columns: 1fr 2fr;
  }
  @media only print {
    grid-template-columns: repeat(6, 1fr);
    min-height: 100vh;
    grid-template-areas:
      "profile profile bio bio bio bio"
      "intro-content intro-content intro-content intro-content intro-content intro-content"
      "experience-title experience-title experience-title experience-title education-title education-title"
      "experience-content experience-content experience-content experience-content education-content education-content";
  }
`

const ProfileContainer = styled.div`
  width: 200px;
  height: 200px;
  margin-top: 2rem;
  @media ${DESKTOP} {
    width: 300px;
    height: 300px;
  }
  @media print {
    margin-top: 0;
  }
`

const ProfileSection = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
  @media ${DESKTOP} {
    background-color: ${() => COLOR_PALETTE.backgroundSecondary.color};
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 10rem;
    padding-right: 3rem;
    height: 100vh;
  }
  @media print {
    background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
    grid-area: profile;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1rem;
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
  @media print {
    text-align: initial;
    padding: 0.5rem;
  }
`
const EducationTitle = styled(SectionTitle)`
  @media only print {
    grid-area: education-title;
  }
`
const ExperienceTitle = styled(SectionTitle)`
  @media only print {
    grid-area: experience-title;
  }
`
const IntroTitle = styled(SectionTitle)`
  @media only print {
    display: none;
  }
`

const Titles = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
  @media ${MOBILE} {
    text-align: center;
  }
  @media ${DESKTOP} {
    height: 100%;
    justify-content: center;
    align-items: flex-start;
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
  @media only print {
    display: flex;
    justify-content: space-between;
  }
`

const ContactWrapper = styled.div``
const ContactTitle = styled.h4`
  @media print {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
`

const Contact: React.FC<{
  title: string
  detail: string
  detailLink?: string
}> = ({ title, detail, detailLink }) => {
  const detailContent = detailLink ? <a href={detailLink}>{detail}</a> : detail
  return (
    <ContactWrapper>
      <ContactTitle>{title}</ContactTitle>
      <span>{detailContent}</span>
    </ContactWrapper>
  )
}

const FirstName = styled.h1`
  margin: 0;
`
const LastName = styled(FirstName)`
  font-weight: bold;
  @media print {
    margin-left: 1rem;
  }
`

interface GridAreaProps {
  printGridArea: string
}

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
const EducationSection = styled(SectionContent)`
  @media only print {
    grid-area: education-content;
  }
`
const BioWrapper = styled(SectionContent)`
  @media only print {
    grid-area: bio;
    padding-top: 1rem;
  }
`
const IntroContent = styled(SectionContent)`
  @media only print {
    grid-area: intro-content;
    padding-top: 1rem;
  }
`
const ExperienceSection = styled(SectionContent)`
  @media only print {
    grid-area: experience-content;
  }
`

const SectionContentInner = styled.div`
  padding: 3rem 1rem 1rem;
  max-width: 1200px;
  @media ${DESKTOP} {
    padding: 3rem 3rem 1rem;
    padding: 4rem 5rem;
  }
  @media only print {
    padding-top: 0;
  }
`

const Bio = styled(SectionContentInner)`
  @media ${DESKTOP} {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  @media print {
    grid-area: bio;
  }
`

const Description = styled.h2`
  margin-bottom: 0;
  display: flex;
  align-items: center;
  @media print {
    margin-top: 1rem;
    font-size: 1.5rem;
  }
`
interface SectionProps {
  title: string
  children: React.ReactNode
}

const TimelineOuter = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media ${DESKTOP} {
    grid-gap: 2rem;
    grid-template-columns: 1fr 2fr;
  }
`

const TimelineTitles = styled.div``
const TimelineDetails = styled.div``

const TimelinePre = styled.h5`
  opacity: 0.6;
  font-size: 0.7rem;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`
const TimelineTitle = styled.h3`
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`
const TimelineSubtitle = styled.h4`
  margin: 0;
  font-size: 0.8rem;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`
const TimelineDescription = styled.span`
  font-style: italic;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`

const TimelineListItem = styled.li`
  @media only print {
    font-size: 85%;
    margin-bottom: 0.5rem;
  }
`

const TimelineList = styled.ul`
  margin-left: 0;
  margin-top: 1rem;
  padding-left: 0.5rem;
  list-style-position: outside;
  @media only print {
    margin-bottom: 0;
    margin-top: 0.5rem;
  }
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

const Names = styled.div`
  @media print {
    display: flex;
  }
`

const Resume: React.FC = () => {
  const { value: isDarkMode } = useDarkMode()
  const downloadLink = isDarkMode ? darkResumePdf : lightResumePdf
  return (
    <ThemeProvider>
      <PageContainer>
        <ProfileSection>
          <ProfileContainer>
            <img
              src="https://res.cloudinary.com/dqvlfpaev/image/upload/v1580691840/avatar_sz1jui.jpg"
              alt="profile-picture"
            />
          </ProfileContainer>
        </ProfileSection>
        <BioWrapper>
          <Bio>
            <Titles>
              <Names>
                <FirstName>Guy</FirstName>
                <LastName>Thomas</LastName>
              </Names>
              <Description>
                Full Stack Developer &amp; Front-end Expert
                <a target="_blank" rel="noreferrer" href={downloadLink}>
                  <StyledSvg />
                </a>
              </Description>
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
        </BioWrapper>
        <IntroTitle>Intro</IntroTitle>
        <IntroContent>
          <SectionContentInner>
            I live and breathe Javascript, Typescript, React, HTML and CSS.
            I&apos;m a Software Engineer agnostic of languages &amp; frameworks
            and have worked with all sorts of tech including GraphQL, Cypress
            and much more.
          </SectionContentInner>
        </IntroContent>
        <ExperienceTitle>Experience</ExperienceTitle>
        <ExperienceSection>
          <SectionContentInner>
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
          </SectionContentInner>
        </ExperienceSection>
        <EducationTitle>Education</EducationTitle>
        <EducationSection>
          <SectionContentInner>
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
          </SectionContentInner>
        </EducationSection>
      </PageContainer>
    </ThemeProvider>
  )
}

export default Resume

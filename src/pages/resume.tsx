import React from "react"
import { css } from "@emotion/core"
import styled from "@emotion/styled"
import { COLOR_PALETTE } from "~styles"
import { graphql } from "gatsby"
import { ThemeProvider } from "../templates/GlobalLayout"
import lightResumePdf from "../../static/resume-light.pdf"
import darkResumePdf from "../../static/resume-dark.pdf"
import useDarkMode from "use-dark-mode"
import { ResumeQuery, Maybe } from "~types/gatsby-graphql"

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
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.64645 8.35355C3.84171 8.54882 4.15829 8.54882 4.35355 8.35355L7.53553 5.17157C7.7308 4.97631 7.7308 4.65973 7.53553 4.46447C7.34027 4.2692 7.02369 4.2692 6.82843 4.46447L4 7.29289L1.17157 4.46447C0.976311 4.2692 0.659728 4.2692 0.464466 4.46447C0.269204 4.65973 0.269204 4.97631 0.464466 5.17157L3.64645 8.35355ZM3.5 2.18557e-08L3.5 8L4.5 8L4.5 -2.18557e-08L3.5 2.18557e-08Z"
      fill="inherit"
    />
    <path d="M0 10H8V11H0V10Z" fill="inherit" />
  </svg>
)
const EditSvg: React.FC<SVGProps> = ({ className }) => (
  <svg
    className={className}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
  >
    <path d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"></path>
  </svg>
)

const InteractiveSvgStyles = () => css`
  height: 1.5rem;
  width: 1.5rem;
  margin-left: 1rem;
  display: inline-block;
  fill: ${COLOR_PALETTE.interactive.color};
  &:last-child {
    margin-right: 1rem;
  }
  &:hover {
    fill: ${COLOR_PALETTE.interactiveActive.color};
  }
  @media print {
    display: none;
  }
`

const DowloadIcon = styled(DownloadSvg)`
  ${InteractiveSvgStyles}
`
const EditIcon = styled(EditSvg)`
  ${InteractiveSvgStyles}
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

const FirstName = styled.h1`
  margin: 0;
`
const LastName = styled(FirstName)`
  font-weight: bold;
  @media print {
    margin-left: 1rem;
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

const DescriptionRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media ${DESKTOP} {
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
  }
`

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

const TimelineDate = styled.h5`
  opacity: 0.6;
  font-size: 0.7rem;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`
const TimelineCompany = styled.h3`
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`
const TimelineTitle = styled.h4`
  margin: 0;
  font-size: 0.8rem;
  margin: 1rem 0 1rem;
  @media print {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`
const TimelineSubtitle = styled.span`
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
  date?: string
  company?: string
  title?: string
  subtitle?: string
  detailItems?: Maybe<string>[]
  className?: string
}

const Timeline: React.FC<TimelineProps> = ({
  date,
  company,
  title,
  subtitle,
  detailItems = [],
  className = "",
}) => (
  <TimelineOuter className={className}>
    <TimelineTitles>
      {date && <TimelineDate>{date}</TimelineDate>}
      {company && <TimelineCompany>{company}</TimelineCompany>}
      {title && <TimelineTitle>{title}</TimelineTitle>}
      {subtitle && <TimelineSubtitle>{subtitle}</TimelineSubtitle>}
    </TimelineTitles>
    <TimelineDetails>
      <TimelineList>
        {detailItems.map((bullet) => (
          <TimelineListItem key={String(bullet)}>{bullet}</TimelineListItem>
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

const EditPanelContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  @media print {
    display: none;
  }
`
interface EditPanelProps {
  avatarUrl?: string
  onChangeAvatarUrl: (url: string) => void
}
const EditPanel: React.FC<EditPanelProps> = ({
  onChangeAvatarUrl,
  avatarUrl,
}) => {
  return (
    <EditPanelContainer>
      <input
        placeholder="Avatar URL"
        value={avatarUrl}
        onChange={(event) => {
          onChangeAvatarUrl(event.target.value)
        }}
      />
    </EditPanelContainer>
  )
}

const ResumeActionContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
`

interface ResumeProps {
  data: ResumeQuery
}
const Resume: React.FC<ResumeProps> = ({
  data: {
    allResumeYaml: { nodes },
  },
}) => {
  const { value: isDarkMode } = useDarkMode()
  const downloadLink = isDarkMode ? darkResumePdf : lightResumePdf
  const resumeData = nodes[0]
  const [isEditing, setIsEditing] = React.useState(false)
  const [localAvatarUrl, setLocalAvatarUrl] = React.useState("")
  return (
    <ThemeProvider>
      <PageContainer>
        {isEditing && (
          <EditPanel
            avatarUrl={localAvatarUrl}
            onChangeAvatarUrl={(url) => {
              setLocalAvatarUrl(url)
            }}
          />
        )}
        <ProfileSection>
          <ProfileContainer>
            {resumeData.avatar && (
              <img
                src={localAvatarUrl || resumeData.avatar}
                alt="profile-picture"
              />
            )}
          </ProfileContainer>
        </ProfileSection>
        <BioWrapper>
          <Bio>
            <Titles>
              <Names>
                <FirstName contentEditable={isEditing}>
                  {resumeData.firstName}
                </FirstName>
                <LastName contentEditable={isEditing}>
                  {resumeData.lastName}
                </LastName>
              </Names>
              <DescriptionRow>
                <Description contentEditable={isEditing}>
                  {resumeData.tagline}
                </Description>
                <ResumeActionContainer>
                  <a
                    style={{ cursor: "pointer" }}
                    target="_blank"
                    rel="noreferrer"
                    onClick={isEditing ? window.print : undefined}
                    href={isEditing ? undefined : downloadLink}
                  >
                    <DowloadIcon />
                  </a>
                  <a
                    style={{ cursor: "pointer" }}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      setIsEditing(!isEditing)
                      requestAnimationFrame(() => {
                        const firstHeader = document.querySelector("h1")
                        if (firstHeader) firstHeader.focus()
                      })
                    }}
                  >
                    <EditIcon />
                  </a>
                </ResumeActionContainer>
              </DescriptionRow>
            </Titles>
            <Contacts contentEditable={isEditing}>
              {resumeData.contactDetails?.map((contactDetail) => {
                // Wow, TS really wants me to be safe here
                const definitelyContactDetail = contactDetail || []
                const stringTitle = String(definitelyContactDetail[0])
                const stringDetail = String(definitelyContactDetail[1])
                return (
                  <ContactWrapper key={stringTitle}>
                    <ContactTitle>{stringTitle}</ContactTitle>
                    <span dangerouslySetInnerHTML={{ __html: stringDetail }} />
                  </ContactWrapper>
                )
              })}
            </Contacts>
          </Bio>
        </BioWrapper>
        <IntroTitle>Intro</IntroTitle>
        <IntroContent>
          <SectionContentInner contentEditable={isEditing}>
            {resumeData.intro}
          </SectionContentInner>
        </IntroContent>
        <ExperienceTitle>Experience</ExperienceTitle>
        <ExperienceSection>
          <SectionContentInner contentEditable={isEditing}>
            {resumeData.experience?.map((experienceItem) => (
              <Timeline
                key={String(experienceItem?.date)}
                company={experienceItem?.company || undefined}
                title={experienceItem?.title || undefined}
                subtitle={experienceItem?.subtitle || undefined}
                date={experienceItem?.date || undefined}
                detailItems={
                  (experienceItem?.detailItems as string[]) || undefined
                }
              />
            ))}
          </SectionContentInner>
        </ExperienceSection>
        <EducationTitle>Education</EducationTitle>
        <EducationSection>
          <SectionContentInner contentEditable={isEditing}>
            {resumeData.education?.map((experienceItem) => (
              <Timeline
                key={String(experienceItem?.date)}
                company={experienceItem?.date || undefined}
                title={experienceItem?.title || undefined}
                date={experienceItem?.date || undefined}
                detailItems={
                  (experienceItem?.detailItems as string[]) || undefined
                }
              />
            ))}
          </SectionContentInner>
        </EducationSection>
      </PageContainer>
    </ThemeProvider>
  )
}

export default Resume

export const pageQuery = graphql`
  query Resume {
    allResumeYaml {
      nodes {
        id
        version
        tagline
        intro
        contactDetails
        experience {
          date
          company
          title
          subtitle
          detailItems
        }
        education {
          date
          company
          title
          detailItems
        }
        avatar
        firstName
        lastName
      }
    }
  }
`
// 😢 Want to make this template more generic to help other people out,
// Which means they may not want these stylized sections
// const LifeTimeline = styled(Timeline)`
//   color: ${() => COLOR_PALETTE.secondary.color};
//   @media print {
//     display: none;
//   }
// `
/* <LifeTimeline
    title="Life Experience"
    subtitle="Chile, Argentina, Bolivia, Peru"
    titlePre="1st February, 2019, 14th April, 2019"
    bullets={[
      "Hiking Machu Picchu",
      "Taking Instagram photos of Salar de Uyuni",
      "Petting Llamas",
    ]}
  />
  <LifeTimeline
    title="Life Experience"
    subtitle="Japan"
    titlePre="11th December, 2016, 1st March, 2016"
    bullets={[
      "Teaching people ages 3-60 how to Ski",
      "Shreeeeding Niseko",
      "Making friends for life",
    ]}
  />
  <LifeTimeline
    title="Life Experience"
    subtitle="Sweden, Norway, Denmark"
    titlePre="4th June, 2016, 10th December, 2016"
    bullets={[
      "Visiting the midnight sun",
      "Eating meatballs at Ikea",
      "Hiking the first portion of the Kungsleden ( King Trail )",
    ]}
  /> */

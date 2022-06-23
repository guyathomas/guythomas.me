import React from "react"
import lightResumePdf from "./static/resume-light.pdf"
import darkResumePdf from "./static/resume-dark.pdf"
import { ResumeQuery } from "~types/gatsby-graphql"
import { Tooltip } from "~components/Tooltip"
import styled from "@emotion/styled"
import Timeline from "./Timeline"
import {
  DownloadIcon,
  GithubIcon,
  InteractiveSvgStyles,
} from "./svgs"
import {
  PageContainer,
  ProfileContainer,
  ProfileSection,
  EducationTitle,
  ExperienceTitle,
  IntroTitle,
  Titles,
  Contacts,
  ContactWrapper,
  ContactTitle,
  FirstName,
  LastName,
  EducationSection,
  BioWrapper,
  IntroContent,
  ExperienceSection,
  SectionContentInner,
  Bio,
  Description,
  DescriptionRow,
  Names,
  ResumeActionContainer,
  Background,
} from "./styles"
import { DarkModeToggle } from "~components/DarkModeToggle"
import { ThemeContext } from "~context/ThemeProvider"
const DarkModeToggleAction = styled(DarkModeToggle)`
  ${InteractiveSvgStyles}
`

const DEFAULT_AVATAR_URL =
  "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper.png"

export type ResumeJSON = ResumeQuery["allResumeYaml"]["nodes"][0]

const Resume: React.FC<{
  resumeData: ResumeJSON
}> = ({ resumeData }) => {
  const { isDarkMode } = React.useContext(ThemeContext)
  const downloadLink = isDarkMode ? darkResumePdf : lightResumePdf
  return (
    <Background>
      <PageContainer>
        <ProfileSection>
          <ProfileContainer>
            <img
              src={resumeData.avatar || DEFAULT_AVATAR_URL}
              alt="profile-picture"
            />
          </ProfileContainer>
        </ProfileSection>
        <BioWrapper>
          <Bio>
            <Titles>
              <Names>
                <FirstName
                >
                  {resumeData.firstName}
                </FirstName>
                <LastName
                >
                  {resumeData.lastName}
                </LastName>
              </Names>
              <DescriptionRow>
                <Description
                >
                  {resumeData.tagline}
                </Description>
                <ResumeActionContainer>
                  <Tooltip
                    tooltip={
                      "Download PDF"
                    }
                  >
                    <a
                      style={{ cursor: "pointer" }}
                      target="_blank"
                      rel="noreferrer"
                      href={downloadLink}
                    >
                      <DownloadIcon />
                    </a>
                  </Tooltip>

                  <Tooltip tooltip="View source">
                    <a
                      style={{ cursor: "pointer" }}
                      target="_blank"
                      rel="noreferrer"
                      href="https://github.com/guyathomas/guythomas.me"
                    >
                      <GithubIcon />
                    </a>
                  </Tooltip>
                  <Tooltip
                    tooltip={`Toggle ${isDarkMode ? "light" : "dark"
                      } mode`}
                  >
                    <DarkModeToggleAction />
                  </Tooltip>
                </ResumeActionContainer>
              </DescriptionRow>
            </Titles>
            <Contacts>
              {resumeData.contactDetails?.map(
                (contactDetail, index) => {
                  // Wow, TS really wants me to be safe here
                  const definitelyContactDetail = contactDetail || []
                  const stringTitle = String(
                    definitelyContactDetail[0]
                  )
                  const stringDetail = String(
                    definitelyContactDetail[1]
                  )
                  if (!stringDetail) return null
                  return (
                    <ContactWrapper key={stringTitle}>
                      <ContactTitle>{stringTitle}</ContactTitle>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: stringDetail,
                        }}
                      />
                    </ContactWrapper>
                  )
                }
              )}
            </Contacts>
          </Bio>
        </BioWrapper>
        <IntroTitle>Intro</IntroTitle>
        <IntroContent>
          <SectionContentInner
          >
            {resumeData.intro}
          </SectionContentInner>
        </IntroContent>
        <ExperienceTitle>Experience</ExperienceTitle>
        <ExperienceSection>
          <SectionContentInner>
            {resumeData.experience?.map((item, index) => (
              <Timeline
                company={item?.company || ""}
                title={item?.title || ""}
                date={item?.date || ""}
                details={item?.details || ""}
                key={index}
              />))}
          </SectionContentInner>
        </ExperienceSection>
        <EducationTitle>Projects</EducationTitle>
        <EducationSection>
          <SectionContentInner>
            {resumeData.education?.map((item, index) => <Timeline
              key={index}
              company={item?.company || ""}
              title={item?.title || ""}
              date={item?.date || ""}
              details={item?.details || ""}
            />)}
          </SectionContentInner>
        </EducationSection>
      </PageContainer>
    </Background >
  )
}

export default Resume

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

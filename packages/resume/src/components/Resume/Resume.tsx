import React from "react"
import lightResumePdf from "./static/resume-light.pdf"
import darkResumePdf from "./static/resume-dark.pdf"
import { ResumeQuery } from "~types/gatsby-graphql"
import { Tooltip } from "~components/Tooltip"
import styled from "@emotion/styled"
import Timeline from "./Timeline"
import { DownloadIcon, GithubIcon, InteractiveSvgStyles } from "./svgs"
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
  ContactValue,
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
                <FirstName>{resumeData.firstName}</FirstName>
                <LastName>{resumeData.lastName}</LastName>
              </Names>
              <DescriptionRow>
                <Description>{resumeData.tagline}</Description>
                <ResumeActionContainer>
                  <Tooltip tooltip={"Download PDF"}>
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
                      href="https://github.com/guyathomas/new.guythomas.me"
                    >
                      <GithubIcon />
                    </a>
                  </Tooltip>
                  <Tooltip
                    tooltip={`Toggle ${isDarkMode ? "light" : "dark"} mode`}
                  >
                    <DarkModeToggleAction />
                  </Tooltip>
                </ResumeActionContainer>
              </DescriptionRow>
            </Titles>
            <Contacts>
              {resumeData.contact?.map((contact) => {
                // Wow, TS really wants me to be safe here
                const stringTitle = contact?.title
                const stringDetail = contact?.value?.html
                if (!stringDetail) return null
                return (
                  <ContactWrapper key={stringTitle}>
                    <ContactTitle>{stringTitle}</ContactTitle>
                    <ContactValue
                      dangerouslySetInnerHTML={{
                        __html: stringDetail,
                      }}
                    />
                  </ContactWrapper>
                )
              })}
            </Contacts>
          </Bio>
        </BioWrapper>
        <IntroTitle>Intro</IntroTitle>
        <IntroContent>
          <SectionContentInner
            dangerouslySetInnerHTML={{ __html: resumeData.intro?.html! }}
          />
        </IntroContent>
        <ExperienceTitle>Experience</ExperienceTitle>
        <ExperienceSection>
          <SectionContentInner style={{ paddingBottom: 0 }}>
            {resumeData.experience?.map((item, index) => (
              <Timeline
                company={item?.company ?? undefined}
                title={item?.title ?? undefined}
                date={item?.date ?? undefined}
                details={item?.details?.html ?? undefined}
                key={index}
              />
            ))}
          </SectionContentInner>
        </ExperienceSection>
        <EducationTitle>Projects</EducationTitle>
        <EducationSection>
          <SectionContentInner>
            {resumeData.education?.map((item, index) => (
              <Timeline
                company={item?.title?.html ?? undefined}
                title={item?.subtitle ?? undefined}
                details={item?.details?.html ?? undefined}
                key={index}
              />
            ))}
          </SectionContentInner>
        </EducationSection>
      </PageContainer>
    </Background>
  )
}

export default Resume

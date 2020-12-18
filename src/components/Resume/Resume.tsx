import React from "react"
import lightResumePdf from "./static/resume-light.pdf"
import darkResumePdf from "./static/resume-dark.pdf"
import { ResumeQuery } from "~types/gatsby-graphql"
import { Tooltip } from "~components/Tooltip"
import styled from "@emotion/styled"
import Timeline from "./Timeline"
import { DowloadIcon, EditIcon, GithubIcon, InteractiveSvgStyles } from "./svgs"
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
} from "./styles"
import { DarkModeToggle } from "~components/DarkModeToggle"
import { ThemeContext } from "~templates"

const DarkModeToggleAction = styled(DarkModeToggle)`
  ${InteractiveSvgStyles}
`
const Resume: React.FC<{
  resumeData: ResumeQuery["allResumeYaml"]["nodes"][0]
}> = ({ resumeData }) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const { isDarkMode } = React.useContext(ThemeContext)
  const downloadLink = isDarkMode ? darkResumePdf : lightResumePdf
  return (
    <PageContainer>
      <ProfileSection>
        <ProfileContainer>
          {resumeData.avatar && (
            <img src={resumeData.avatar} alt="profile-picture" />
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
                <Tooltip tooltip={isEditing ? "Print changes" : "Download PDF"}>
                  <a
                    style={{ cursor: "pointer" }}
                    target="_blank"
                    rel="noreferrer"
                    onClick={isEditing ? window.print : undefined}
                    href={isEditing ? undefined : downloadLink}
                  >
                    <DowloadIcon />
                  </a>
                </Tooltip>
                <Tooltip
                  tooltip={isEditing ? "Stop editing" : "Edit this resume"}
                >
                  <a
                    style={{ cursor: "pointer" }}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      console.log("zzz isEditing", isEditing)
                      setIsEditing(!isEditing)
                      requestAnimationFrame(() => {
                        const firstHeader = document.querySelector("h1")
                        if (firstHeader) firstHeader.focus()
                      })
                    }}
                  >
                    <EditIcon isActive={isEditing} />
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
                <DarkModeToggleAction />
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

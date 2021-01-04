import React from "react"
import lightResumePdf from "./static/resume-light.pdf"
import darkResumePdf from "./static/resume-dark.pdf"
import { ResumeYamlExperience, ResumeQuery } from "~types/gatsby-graphql"
import { Tooltip } from "~components/Tooltip"
import styled from "@emotion/styled"
import Timeline from "./Timeline"
import {
  DownloadIcon,
  EditIcon,
  GithubIcon,
  InteractiveSvgStyles,
  SaveSvgIcon,
  CloseSvgIcon,
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
  SectionButton,
} from "./styles"
import { DarkModeToggle } from "~components/DarkModeToggle"
import { ThemeContext } from "~context/ThemeProvider"
import { Formik, Form, FieldArray } from "formik"

const DarkModeToggleAction = styled(DarkModeToggle)`
  ${InteractiveSvgStyles}
`

export type ResumeJSON = ResumeQuery["allResumeYaml"]["nodes"][0]

const SampleTimeline: ResumeYamlExperience = {
  title: "Title",
  company: "Company",
  date: "Date",
  details:
    "List of details<ul><li>First</li><li>Second</li><li>Third</li></ul>",
}

const AddSection = styled(SectionButton)`
  top: 30px;
  right: 30px;
`
const noop = () => {
  return
}

const Resume: React.FC<{
  resumeData: ResumeJSON
  onSave: (newResume: ResumeJSON) => void
  onReset: () => void
}> = ({ resumeData, onSave, onReset }) => {
  const [isEditing, setIsEditing] = React.useState(false)
  const { isDarkMode } = React.useContext(ThemeContext)
  const downloadLink = isDarkMode ? darkResumePdf : lightResumePdf
  return (
    <Formik initialValues={resumeData} onSubmit={noop}>
      {({ values, setFieldValue }) => {
        const createOnInput = (name: keyof ResumeJSON) => (
          event: React.FormEvent<HTMLElement>
        ) => {
          setFieldValue(name, event.currentTarget.innerText)
        }
        return (
          <Form>
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
                      <FirstName
                        contentEditable={isEditing}
                        onInput={createOnInput("firstName")}
                      >
                        {resumeData.firstName}
                      </FirstName>
                      <LastName
                        contentEditable={isEditing}
                        onInput={createOnInput("lastName")}
                      >
                        {resumeData.lastName}
                      </LastName>
                    </Names>
                    <DescriptionRow>
                      <Description
                        contentEditable={isEditing}
                        onInput={createOnInput("tagline")}
                      >
                        {resumeData.tagline}
                      </Description>
                      <ResumeActionContainer>
                        <Tooltip
                          tooltip={isEditing ? "Print changes" : "Download PDF"}
                        >
                          <a
                            style={{ cursor: "pointer" }}
                            target="_blank"
                            rel="noreferrer"
                            onClick={
                              typeof window !== "undefined" && isEditing
                                ? window.print
                                : undefined
                            }
                            href={isEditing ? undefined : downloadLink}
                          >
                            <DownloadIcon />
                          </a>
                        </Tooltip>
                        {!isEditing && (
                          <Tooltip tooltip={"Edit this resume"}>
                            <a
                              style={{ cursor: "pointer" }}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => {
                                setIsEditing(!isEditing)
                                requestAnimationFrame(() => {
                                  const firstHeader = document.querySelector(
                                    "h1"
                                  )
                                  if (firstHeader) firstHeader.focus()
                                })
                              }}
                            >
                              <EditIcon />
                            </a>
                          </Tooltip>
                        )}
                        {isEditing && (
                          <Tooltip tooltip={"Save Changes"}>
                            <a
                              style={{ cursor: "pointer" }}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => {
                                setIsEditing(!isEditing)
                                if (onSave) onSave(values)
                              }}
                            >
                              <SaveSvgIcon />
                            </a>
                          </Tooltip>
                        )}
                        {isEditing && (
                          <Tooltip tooltip={"Discard Changes"}>
                            <a
                              style={{ cursor: "pointer" }}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => {
                                setIsEditing(!isEditing)
                                if (onReset) onReset()
                              }}
                            >
                              <CloseSvgIcon />
                            </a>
                          </Tooltip>
                        )}
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
                  <Contacts>
                    {resumeData.contactDetails?.map((contactDetail, index) => {
                      // Wow, TS really wants me to be safe here
                      const definitelyContactDetail = contactDetail || []
                      const stringTitle = String(definitelyContactDetail[0])
                      const stringDetail = String(definitelyContactDetail[1])
                      if (!stringDetail) return null
                      return (
                        <ContactWrapper key={stringTitle}>
                          <ContactTitle>{stringTitle}</ContactTitle>
                          <span
                            contentEditable={isEditing}
                            onInput={(event) => {
                              setFieldValue(
                                `contactDetails[${index}][1]`,
                                event.currentTarget.innerText
                              )
                            }}
                            dangerouslySetInnerHTML={{ __html: stringDetail }}
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
                  contentEditable={isEditing}
                  onInput={createOnInput("intro")}
                >
                  {resumeData.intro}
                </SectionContentInner>
              </IntroContent>
              <ExperienceTitle>Experience</ExperienceTitle>
              <ExperienceSection>
                <SectionContentInner>
                  <FieldArray name="experience">
                    {({ remove, push }) => (
                      <>
                        {isEditing && (
                          <AddSection
                            onClick={() => {
                              push(SampleTimeline)
                            }}
                          >
                            +
                          </AddSection>
                        )}
                        {values.experience?.map((item, index) => {
                          const name = `experience[${index}]`
                          return (
                            <Timeline
                              onRemove={() => {
                                remove(index)
                              }}
                              onChange={(fieldValue, value) => {
                                setFieldValue(`${name}.${fieldValue}`, value)
                              }}
                              contentEditable={isEditing}
                              company={item?.company || ""}
                              title={item?.title || ""}
                              date={item?.date || ""}
                              details={item?.details || ""}
                              key={index}
                            />
                          )
                        })}
                      </>
                    )}
                  </FieldArray>
                </SectionContentInner>
              </ExperienceSection>
              <EducationTitle>Education</EducationTitle>
              <EducationSection>
                <SectionContentInner>
                  <FieldArray name="education">
                    {({ remove, push }) => (
                      <>
                        {isEditing && (
                          <AddSection
                            onClick={() => {
                              push(SampleTimeline)
                            }}
                          >
                            +
                          </AddSection>
                        )}
                        {values.education?.map((item, index) => {
                          const name = `education[${index}]`
                          return (
                            <Timeline
                              onRemove={() => {
                                remove(index)
                              }}
                              onChange={(fieldValue, value) => {
                                setFieldValue(`${name}.${fieldValue}`, value)
                              }}
                              contentEditable={isEditing}
                              key={index}
                              company={item?.company || ""}
                              title={item?.title || ""}
                              date={item?.date || ""}
                              details={item?.details || ""}
                            />
                          )
                        })}
                      </>
                    )}
                  </FieldArray>
                </SectionContentInner>
              </EducationSection>
            </PageContainer>
          </Form>
        )
      }}
    </Formik>
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

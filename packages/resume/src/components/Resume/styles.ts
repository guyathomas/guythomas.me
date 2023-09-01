import styled from "@emotion/styled"
import { COLOR_PALETTE } from "~styles"
import { DESKTOP, MOBILE } from "./constants"

const SectionContent = styled.div`
  background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
  position: relative;
  @media ${DESKTOP} {
    justify-content: flex-end;
    &:nth-of-type(4n) {
      background-color: ${() => COLOR_PALETTE.backgroundSecondary.color};
    }
    &:nth-of-type(4n + 2) {
      background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
    }
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
    &:nth-of-type(4n + 1) {
      background-color: ${() => COLOR_PALETTE.backgroundSecondary.color};
    }
    &:nth-of-type(4n + 3) {
      background-color: ${() => COLOR_PALETTE.backgroundTertiary.color};
    }
  }
  @media print {
    text-align: initial;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
`

export const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  color: ${() => COLOR_PALETTE.primary.color};
  color-adjust: exact; /* Tries to print background images */
  @media ${DESKTOP} {
    grid-template-columns: 1fr 2fr;
  }
  @media only print {
    grid-template-columns: repeat(12, 1fr);
    grid-template-areas:
      "profile profile profile profile bio bio bio bio bio bio bio bio"
      "intro-content intro-content intro-content intro-content intro-content intro-content intro-content intro-content intro-content intro-content intro-content intro-content"
      "experience-title experience-title experience-title experience-title experience-title experience-title experience-title experience-title education-title education-title education-title education-title"
      "experience-content experience-content experience-content experience-content experience-content experience-content experience-content experience-content education-content education-content education-content education-content";
  }
`

export const ProfileContainer = styled.div`
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

export const ProfileSection = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
  @media ${DESKTOP} {
    height: 100vh;
    background-color: ${() => COLOR_PALETTE.backgroundSecondary.color};
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 10rem;
    padding-right: 3rem;
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

export const EducationTitle = styled(SectionTitle)`
  @media only print {
    grid-area: education-title;
  }
`
export const ExperienceTitle = styled(SectionTitle)`
  @media only print {
    grid-area: experience-title;
  }
`
export const IntroTitle = styled(SectionTitle)`
  @media only print {
    display: none;
  }
`

export const Titles = styled.div`
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
export const Contacts = styled.div`
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

export const ContactWrapper = styled.div``
export const ContactTitle = styled.h4`
  @media print {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
`

export const ContactValue = styled.span`
  @media print {
    p {
      margin-bottom: 0;
    }
  }
`

export const FirstName = styled.h1`
  font-weight: bold;
  margin: 0;
  @media print {
    font-weight: initial;
  }
`
export const LastName = styled(FirstName)`
  @media print {
    margin-left: 1rem;
  }
`

export const EducationSection = styled(SectionContent)`
  @media only print {
    grid-area: education-content;
  }
`
export const BioWrapper = styled(SectionContent)`
  @media ${DESKTOP} {
    height: 100vh;
  }
  @media only print {
    grid-area: bio;
    padding-top: 1rem;
  }
`
export const IntroContent = styled(SectionContent)`
  @media only print {
    grid-area: intro-content;
    margin-top: 1rem;
  }
  p {
    margin-bottom: 0;
  }
`
export const ExperienceSection = styled(SectionContent)`
  @media only print {
    grid-area: experience-content;
  }
`

export const SectionContentInner = styled.div`
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

export const Bio = styled(SectionContentInner)`
  @media ${DESKTOP} {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  @media print {
    grid-area: bio;
    padding-bottom: 0;
  }
`

export const Description = styled.h2`
  margin-bottom: 0;
  display: flex;
  align-items: center;
  @media print {
    margin-top: 1rem;
    font-size: 1.5rem;
  }
`

export const DescriptionRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media ${DESKTOP} {
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
  }
`

export const Names = styled.div`
  @media print {
    display: flex;
  }
`

export const ResumeActionContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  @media print {
    display: none;
  }
`
interface SectionButtonProps {
  actionType?: "positive" | "negative"
}
export const SectionButton = styled.button<SectionButtonProps>`
  position: absolute;
  outline: none;
  cursor: pointer;
  background-color: ${(props) =>
    props.actionType === "negative" ? "#ff4d4f" : "#1890ff"};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  border: none;

  &:active {
    box-shadow: inset 0px 0px 5px #c1c1c1;
  }
  @media print {
    display: none;
  }
`

export const Background = styled.div`
  @media print {
    background-color: ${() => COLOR_PALETTE.backgroundPrimary.color};
    min-height: 100vh;
  }
`

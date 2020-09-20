import React from "react"
import styled from "@emotion/styled"
import dayjs from "dayjs"
import { COLOR_PALETTE } from "~styles"

interface CommentProps {
  user: string
  children: React.ReactNode
  pictureUrl?: string
  createdAt?: string
}

const Avatar = styled.img`
  height: 2.2rem;
  width: 2.2rem;
  margin-bottom: 0;
  margin-right: 1rem;
`

const CommentContainer = styled.li`
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${() => COLOR_PALETTE.primary.color};
  margin-top: 3rem;
`
const CommentHeader = styled.div`
  display: flex;
`
const NameAndTime = styled.div`
  display: flex;
  flex-direction: column;
`
const Name = styled.div`
  font-weight: bold;
  margin-top: 0;
  line-height: 1;
`
const Time = styled.time`
  color: ${() => COLOR_PALETTE.secondary.color};
  font-size: 90%;
`

const CommentBody = styled.div`
  color: ${() => COLOR_PALETTE.secondary.color};
`

export const Comment: React.FC<CommentProps> = ({
  user,
  children,
  pictureUrl,
  createdAt,
}) => {
  const day = dayjs(createdAt)
  return (
    <CommentContainer>
      <CommentHeader>
        <Avatar
          src={
            pictureUrl ||
            "https://api.adorable.io/avatars/50/abott@adorable.png"
          }
        />
        <NameAndTime>
          <Name>{user}</Name>
          <Time dateTime={day.format("YYYY-MM-DD")}>{day.fromNow()}</Time>
        </NameAndTime>
      </CommentHeader>
      <CommentBody>{children}</CommentBody>
    </CommentContainer>
  )
}

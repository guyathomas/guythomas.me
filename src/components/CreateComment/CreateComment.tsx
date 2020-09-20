import React from "react"
import styled from "@emotion/styled"

interface CreateCommentProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  value: string
  onChange: (newValue: string) => void
}

const CommentInput = styled.textarea`
  width: 100%;
`

export const CreateComment: React.FC<CreateCommentProps> = ({
  onSubmit,
  value,
  onChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <CommentInput
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
      <button disabled={value.length === 0 || value.length > 255} type="submit">
        Comment
      </button>
    </form>
  )
}

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Uses',
  description: 'Software I use, gadgets I love, and other things I recommend.',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="Software I use, gadgets I love, and other things I recommend."
      intro="I get asked a lot about the things I use to build software, stay productive, or buy to fool myself into thinking I’m being productive when I’m really just procrastinating. Here’s a big list of all of my favorite stuff."
    >
      <div className="space-y-20">
        <ToolsSection title="Workstation">
          <Tool title="16” MacBook Pro, M3 Max, 32GB RAM (2023)">{''}</Tool>
          <Tool title="Magic Mouse, Trackpad and Keyboard ( Without the number pad )">
            I like the more compact keyboard without the numpad. I find it
            better reflects the size of the keyboard on the laptop and makes it
            easy to transition between the two.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Development tools">
          <Tool title="VSCode">{'CoPilot'}</Tool>
          <Tool title="iTerm2">{''}</Tool>
          <Tool title="Paste">{''}</Tool>
          <Tool title="Giffox">{''}</Tool>
          <Tool title="Bitwarden">{''}</Tool>
          <Tool title="Alfred">{''}</Tool>
          <Tool title="ChatGPT, Perplexity">{''}</Tool>
          <Tool title="Git Kraken">{''}</Tool>
          <Tool title="Rectangle Pro">{''}</Tool>
          <Tool title="Postman">{''}</Tool>
          <Tool title="Chrome">{''}</Tool>
        </ToolsSection>
        <ToolsSection title="Design">
          <Tool title="Figma">{''}</Tool>
        </ToolsSection>
        <ToolsSection title="Productivity">
          <Tool title="Alfred">{''}</Tool>
          <Tool title="Notion">{''}</Tool>
          <Tool title="Focus">{''}</Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}

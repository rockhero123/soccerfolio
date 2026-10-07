import PageSection from "@/components/PageSection";
import PlaceholderCard from "@/components/PlaceholderCard";
import SoccerField from "@/components/SoccerField";
import { site } from "@/content/site";

const [hero, skills, projects, contact] = site.sections;

/**
 * The single page (spec 001 US-6): every section lives on the soccer field, in
 * order hero, skills, projects, contact. Sections are placeholders until their
 * own specs (002, 004, 006, 007) fill them in.
 */
export default function Home() {
  return (
    <SoccerField
      contact={
        <PageSection id={contact.id} title={contact.title}>
          <PlaceholderCard>
            <p className="font-body text-lg">
              Contact details are coming soon.
            </p>
          </PlaceholderCard>
        </PageSection>
      }
    >
      <div className="flex flex-col gap-16">
        <PageSection id={hero.id} title={hero.title}>
          <PlaceholderCard>
            <h1 className="font-heading text-4xl">{site.name}</h1>
            <p className="mt-2 font-body text-lg">{site.role}</p>
          </PlaceholderCard>
        </PageSection>
        <PageSection id={skills.id} title={skills.title}>
          <PlaceholderCard>
            <p className="font-body text-lg">
              The skills line-up is coming soon.
            </p>
          </PlaceholderCard>
        </PageSection>
        <PageSection id={projects.id} title={projects.title}>
          <PlaceholderCard>
            <p className="font-body text-lg">
              Selected projects are coming soon.
            </p>
          </PlaceholderCard>
        </PageSection>
      </div>
    </SoccerField>
  );
}

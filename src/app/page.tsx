import CartoonPortrait from "@/components/CartoonPortrait";
import EnchantedMirror from "@/components/EnchantedMirror";
import IntroSign from "@/components/IntroSign";
import PageSection from "@/components/PageSection";
import PlaceholderCard from "@/components/PlaceholderCard";
import TacticsBoard from "@/components/skills/TacticsBoard";
import ProjectBrowser from "@/components/projects/ProjectBrowser";
import ProjectModal from "@/components/projects/ProjectModal";
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
      <div className="flex flex-col gap-8 md:gap-12">
        <PageSection id={hero.id} title={hero.title}>
          {/* The intro sign comes out from behind the mirror: beside it from
              768px, below it on phones. The mirror sits on top. */}
          <div className="flex flex-col items-center md:flex-row md:items-center md:justify-center">
            <div className="relative z-10 w-full shrink-0 md:w-auto">
              <EnchantedMirror
                portrait={<CartoonPortrait className="w-48 md:w-56" />}
              />
            </div>
            <IntroSign />
          </div>
        </PageSection>
        <PageSection id={skills.id} title={skills.title}>
          <div className="mx-auto w-full max-w-3xl">
            <TacticsBoard />
          </div>
        </PageSection>
        <PageSection id={projects.id} title={projects.title}>
          <ProjectBrowser />
          <ProjectModal />
        </PageSection>
      </div>
    </SoccerField>
  );
}

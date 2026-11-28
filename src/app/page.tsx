import CartoonPortrait from "@/components/CartoonPortrait";
import EnchantedMirror from "@/components/EnchantedMirror";
import IntroSign from "@/components/IntroSign";
import PageSection from "@/components/PageSection";
import TacticsBoard from "@/components/skills/TacticsBoard";
import ProjectBrowser from "@/components/projects/ProjectBrowser";
import ProjectModal from "@/components/projects/ProjectModal";
import MusicWaterfall from "@/components/easter-egg/MusicWaterfall";
import TheaterDrapes from "@/components/easter-egg/TheaterDrapes";
import TheaterStalls from "@/components/easter-egg/TheaterStalls";
import Waterfall from "@/components/easter-egg/Waterfall";
import SoccerField from "@/components/SoccerField";
import ContactLineup from "@/components/contact/ContactLineup";
import ContactGate from "@/components/contact-game/ContactGate";
import GoldIngot from "@/components/contact-game/GoldIngot";
import { site } from "@/content/site";

const [hero, skills, projects, contact] = site.sections;

/**
 * The single page (spec 001 US-6): every section lives on the soccer field, in
 * order hero, skills, projects, contact (specs 002, 004, 006, 007).
 */
export default function Home() {
  return (
    <SoccerField
      crown={
        <MusicWaterfall
          scene={<Waterfall />}
          theater={{ drapes: <TheaterDrapes />, stalls: <TheaterStalls /> }}
        />
      }
      contact={
        <PageSection id={contact.id} title={contact.title} titleHidden>
          <ContactGate ingot={<GoldIngot />}>
            <ContactLineup />
          </ContactGate>
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
                portrait={<CartoonPortrait />}
              />
            </div>
            <IntroSign />
          </div>
        </PageSection>
        <PageSection id={skills.id} title={skills.title}>
          <div className="mx-auto w-full max-w-2xl">
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

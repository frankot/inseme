import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { testimonialDefaults, type TestimonialContent } from "@/content/home";

/**
 * The one moment on the page that is somebody else's voice, so it gets the page
 * to itself: a full-bleed dark band between the programme and the test, the
 * only break in the light run apart from the hero.
 *
 * It carries no numeral and no section head on purpose — it is a breath between
 * two numbered bands, not a step in them.
 */
export function Testimonial({
  content = testimonialDefaults,
}: {
  content?: TestimonialContent;
}) {
  return (
    <section className="bg-ink-950 py-[clamp(64px,8vw,128px)]">
      <Container>
        <Reveal>
          <figure className="m-0">
            <span
              aria-hidden
              className="mb-[clamp(26px,3vw,40px)] block h-px w-[clamp(48px,6vw,88px)] bg-on-dark-faint/50"
            />
            <blockquote className="m-0">
              <p className="max-w-[17em] text-pretty font-heading text-quote font-light text-on-dark">
                {content.quote}
              </p>
            </blockquote>
            <figcaption className="mt-[clamp(24px,2.8vw,38px)] text-meta text-on-dark-faint">
              <span className="text-on-dark-muted">{content.author}</span>
              <span aria-hidden className="mx-2.5 opacity-50">
                ·
              </span>
              {content.note}
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}

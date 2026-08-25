import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { testimonialDefaults, type TestimonialContent } from "@/content/home";

export function Testimonial({
  content = testimonialDefaults,
}: {
  content?: TestimonialContent;
}) {
  return (
    <section>
      <Container className="py-section-sm">
        <Reveal>
          <blockquote className="flex flex-wrap items-end gap-x-16 gap-y-8 border border-line bg-sand px-[clamp(26px,4vw,72px)] py-[clamp(40px,5vw,88px)]">
            <p className="max-w-[22em] flex-[1_1_20em] text-pretty font-heading text-quote font-light text-ink-900">
              {content.quote}
            </p>
            <footer className="flex-[0_1_14em] border-t border-line-warm pt-2 text-sm leading-[1.7] text-clay-600">
              {content.author}
              <br />
              {content.note}
            </footer>
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}

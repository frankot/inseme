/**
 * The copy of "Poproś o telefon" (`components/site/ui/callback-form.tsx`).
 * Here rather than in the component: the article renderer is a server
 * component and the admin block editor a client one, and both need the
 * defaults as plain values.
 *
 * The promise is what the centre confirmed on Nov 14, 2026: calls back in the
 * evening and at weekends too. No time limit is promised.
 */
export const CALLBACK_DEFAULTS = {
  heading: "Wolisz, żebyśmy zadzwonili?",
  text: "Zostaw numer i wybierz porę — oddzwonimy, także wieczorem i w weekend. Rozmowa jest bezpłatna i do niczego nie zobowiązuje.",
  consent: "Zgadzam się na telefon w tej sprawie. Numeru nie używamy do niczego innego.",
  submit: "Poproś o telefon",
  toggle: "Poproś o telefon",
};

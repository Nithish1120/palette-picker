import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Instagram,
  MapPin,
  Menu,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { menuCategories, menuItems, moodOptions } from "@/lib/menu-data";
import heroImage from "@/assets/food-therapy-hero.jpg";
import interiorImage from "@/assets/cafe-interior.jpg";
import spreadImage from "@/assets/therapy-spread.jpg";
import friendsImage from "@/assets/cafe-friends.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Food Therapy — Premium Café & Comfort Food" },
      {
        name: "description",
        content:
          "Mood-led coffee, comfort food and memorable moments at Food Therapy. Explore the menu, order online or book a table.",
      },
      { property: "og:title", content: "Food Therapy — Good food. Better mood." },
      { property: "og:description", content: "Your daily dose of comfort, crafted with flavour." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navLinks: Array<[string, string]> = [
  ["menu", "Menu"],
  ["experience", "Experience"],
  ["about", "About"],
  ["reservations", "Reservations"],
  ["contact", "Contact"],
];

function Index() {
  const cart = useCart();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mood, setMood] = useState("comfort");
  const [category, setCategory] = useState("All");
  const [review, setReview] = useState(0);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingBusy, setBookingBusy] = useState(false);

  const filtered = useMemo(
    () => (category === "All" ? menuItems : menuItems.filter((item) => item.category === category)),
    [category],
  );
  const moodMatches = useMemo(
    () => menuItems.filter((item) => item.moods.includes(mood)),
    [mood],
  );

  const scrollTo = (id?: string) => {
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  async function reserve(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBookingBusy(true);
    const data = new FormData(form);
    const { data: session } = await supabase.auth.getSession();
    const { error } = await supabase.from("reservations").insert({
      name: String(data.get("name")),
      phone: String(data.get("phone")),
      reservation_date: String(data.get("date")),
      reservation_time: String(data.get("time")),
      guests: Number(data.get("guests")),
      special_request: String(data.get("request") || ""),
      user_id: session.session?.user.id ?? null,
    });
    setBookingBusy(false);
    if (error) {
      toast.error("We couldn't save that booking. Please try again.");
      return;
    }
    setBookingDone(true);
    form.reset();
  }

  return (
    <main className="grain min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-primary-foreground/15 bg-primary/85 text-primary-foreground backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button
            onClick={() => scrollTo("home")}
            className="font-display text-xl font-bold tracking-normal"
          >
            FOOD THERAPY
          </button>
          <nav className="hidden items-center gap-7 text-xs font-semibold uppercase md:flex">
            {navLinks.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="transition-opacity hover:opacity-60"
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Sign in"
              asChild
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/auth">
                <User />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <ShoppingBag />
              {cart.count > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                  {cart.count}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              onClick={() => setNavOpen((open) => !open)}
              className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground md:hidden"
            >
              <Menu />
            </Button>
          </div>
        </div>
        {navOpen && (
          <nav className="border-t border-primary-foreground/15 p-5 md:hidden">
            {navLinks.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="block w-full py-3 text-left text-lg"
              >
                {label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <section id="home" className="relative min-h-[94vh] overflow-hidden bg-primary text-primary-foreground">
        <img
          src={heroImage}
          alt="Lavender latte and chocolate dessert on a stone table at Food Therapy"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 to-primary/25" />
        <div className="relative mx-auto flex min-h-[94vh] max-w-7xl flex-col justify-center px-5 pb-16 pt-28 lg:px-8">
          <p className="reveal-up mb-5 text-xs font-semibold uppercase tracking-[.28em]">
            Coffee · Food · Good vibes
          </p>
          <h1 className="reveal-up max-w-5xl text-6xl font-bold leading-[.88] sm:text-8xl lg:text-[9.5rem]">
            FOOD
            <br />
            THERAPY
          </h1>
          <div className="reveal-up mt-8 flex max-w-3xl flex-col gap-6 border-l border-secondary pl-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-2xl italic sm:text-3xl">Good food. Better mood.</p>
              <p className="mt-2 max-w-md text-sm text-primary-foreground/75">
                Your daily dose of comfort, crafted with flavour.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="lg" onClick={() => scrollTo("menu")}>
                Explore Menu <ArrowDown />
              </Button>
              <Button variant="heroOutline" size="lg" onClick={() => scrollTo("reservations")}>
                Book a Table
              </Button>
            </div>
          </div>
          <div className="float-soft absolute bottom-10 right-5 hidden size-36 rotate-6 items-center justify-center rounded-full border border-primary-foreground/30 bg-primary/30 p-5 text-center text-[10px] font-semibold uppercase leading-5 backdrop-blur-md lg:flex">
            EST. 2026
            <br />
            Coffee · Food
            <br />
            Good vibes
          </div>
        </div>
      </section>

      <section className="bg-secondary/45 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-primary">
            Your mood, our menu
          </p>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="max-w-3xl text-4xl sm:text-6xl">What are you craving today?</h2>
            <p className="max-w-sm text-muted-foreground">
              Choose how you feel. We’ll prescribe something delicious.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {moodOptions.map((option) => (
              <Button
                key={option.id}
                variant={mood === option.id ? "default" : "outline"}
                className="h-auto min-h-28 flex-col whitespace-normal px-3 py-5 text-center"
                onClick={() => setMood(option.id)}
              >
                <span className="text-2xl">{option.icon}</span>
                {option.label}
              </Button>
            ))}
          </div>
          <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
            {moodMatches.map((item) => (
              <article
                key={item.id}
                className="flex min-w-[290px] max-w-sm items-center gap-4 rounded-lg border border-border bg-card p-3 shadow-soft"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="size-24 rounded-md object-cover"
                />
                <div>
                  <p className="font-display text-lg font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">₹{item.price}</p>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      cart.add(item);
                      toast.success(`${item.name} added to your order`);
                    }}
                  >
                    Add <Plus />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="menu" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-primary">
                The therapy menu
              </p>
              <h2 className="text-5xl sm:text-7xl">Made for your mood.</h2>
            </div>
            <p className="max-w-sm text-muted-foreground">
              Honest ingredients, expressive flavours, and the comfort of something made with care.
            </p>
          </div>
          <div className="mt-10 flex gap-2 overflow-x-auto pb-4">
            {menuCategories.map((name) => (
              <Button
                key={name}
                variant={category === name ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(name)}
              >
                {name}
              </Button>
            ))}
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-lg border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {item.signature && (
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-primary-foreground">
                      Signature
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-2xl">{item.name}</h3>
                    <span
                      title={item.dietary === "veg" ? "Vegetarian" : "Non-vegetarian"}
                      className={`mt-1 size-3 shrink-0 rounded-full border-2 ${
                        item.dietary === "veg"
                          ? "border-emerald-700 bg-emerald-700"
                          : "border-red-700 bg-red-700"
                      }`}
                    />
                  </div>
                  <p className="mt-2 min-h-10 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-semibold">₹{item.price}</span>
                    <Button
                      size="sm"
                      onClick={() => {
                        cart.add(item);
                        toast.success(`${item.name} added to your order`);
                      }}
                    >
                      Add to Cart <Plus />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="bg-primary py-20 text-primary-foreground sm:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-secondary">
            The therapy experience
          </p>
          <h2 className="max-w-4xl text-5xl sm:text-7xl">A little reset, served beautifully.</h2>
          <div className="mt-14 grid border-y border-primary-foreground/20 md:grid-cols-3">
            {[
              ["01", "TASTE", "Flavours designed to make every bite memorable."],
              ["02", "MOOD", "A space where you can slow down, relax and reconnect."],
              ["03", "MOMENT", "Because sometimes, a good meal is all you need."],
            ].map(([number, title, copy], index) => (
              <article
                key={number}
                className={`min-h-64 p-7 md:p-10 ${
                  index < 2
                    ? "border-b border-primary-foreground/20 md:border-b-0 md:border-r"
                    : ""
                }`}
              >
                <span className="text-xs text-secondary">{number}</span>
                <h3 className="mt-14 text-3xl">{title}</h3>
                <p className="mt-3 max-w-xs text-primary-foreground/65">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5 lg:pt-16">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-primary">
              Our story
            </p>
            <h2 className="text-5xl sm:text-7xl">
              More Than
              <br />
              <em>A Café.</em>
            </h2>
            <p className="mt-8 max-w-lg text-lg leading-8 text-muted-foreground">
              Food Therapy was created around a simple idea — sometimes the best therapy is a great
              meal, a warm cup of coffee, and the right atmosphere.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <div className="h-px w-16 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-[.2em]">Come as you are</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            <img
              src={interiorImage}
              alt="The Food Therapy café interior with plum seating and lavender flowers"
              loading="lazy"
              width={1408}
              height={1008}
              className="h-full min-h-96 w-full rounded-lg object-cover sm:row-span-2"
            />
            <img
              src={spreadImage}
              alt="A Food Therapy brunch spread of coffee, toast, pasta and cake"
              loading="lazy"
              width={1200}
              height={1200}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <img
              src={friendsImage}
              alt="Friends laughing together over coffee at Food Therapy"
              loading="lazy"
              width={1408}
              height={1008}
              className="aspect-square w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      <section id="reservations" className="bg-secondary/45 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-primary">
              Your table awaits
            </p>
            <h2 className="text-5xl sm:text-6xl">Make time for a better mood.</h2>
            <p className="mt-6 text-muted-foreground">
              A quiet coffee, a long brunch, or dinner with your favourite people. We’ll set the
              table.
            </p>
          </div>
          <div className="lg:col-span-3">
            {bookingDone ? (
              <div className="reveal-up flex min-h-96 flex-col items-center justify-center rounded-lg bg-primary p-10 text-center text-primary-foreground shadow-lift">
                <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Check className="size-7" />
                </div>
                <h3 className="text-4xl">Your table is waiting.</h3>
                <p className="mt-3 text-primary-foreground/70">
                  We’ve received your reservation and will confirm it shortly.
                </p>
                <Button variant="heroOutline" className="mt-7" onClick={() => setBookingDone(false)}>
                  Make another booking
                </Button>
              </div>
            ) : (
              <form
                onSubmit={reserve}
                className="grid gap-4 rounded-lg border border-border bg-card p-5 shadow-soft sm:grid-cols-2 sm:p-8"
              >
                <label className="text-sm font-medium">
                  Name
                  <Input name="name" required minLength={2} className="mt-2" placeholder="Your name" />
                </label>
                <label className="text-sm font-medium">
                  Phone
                  <Input
                    name="phone"
                    required
                    minLength={7}
                    type="tel"
                    className="mt-2"
                    placeholder="Your number"
                  />
                </label>
                <label className="text-sm font-medium">
                  Date
                  <Input
                    name="date"
                    required
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    className="mt-2"
                  />
                </label>
                <label className="text-sm font-medium">
                  Time
                  <Input name="time" required type="time" className="mt-2" />
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Number of Guests
                  <Input
                    name="guests"
                    required
                    type="number"
                    min="1"
                    max="16"
                    defaultValue="2"
                    className="mt-2"
                  />
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Special Request
                  <Textarea
                    name="request"
                    maxLength={500}
                    className="mt-2"
                    placeholder="Birthday, allergies, favourite corner..."
                  />
                </label>
                <Button type="submit" size="lg" disabled={bookingBusy} className="sm:col-span-2">
                  {bookingBusy ? "Reserving..." : "Reserve My Table"}
                  <ArrowRight />
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Reviews current={review} setCurrent={setReview} />
      <Gallery scrollTo={scrollTo} />
      <Footer scrollTo={scrollTo} />

      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background p-5 shadow-lift"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-3xl">Your order</h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
              >
                <X />
              </Button>
            </div>
            {cart.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <ShoppingBag className="mb-5 size-12 text-muted-foreground" />
                <h3 className="text-2xl">Your cart is craving company.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add something delicious from the menu.
                </p>
                <Button
                  className="mt-6"
                  onClick={() => {
                    setCartOpen(false);
                    scrollTo("menu");
                  }}
                >
                  Explore Menu
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-7 flex-1 space-y-4 overflow-y-auto">
                  {cart.lines.map((line) => (
                    <div key={line.id} className="flex gap-3 border-b border-border pb-4">
                      <img
                        src={line.image}
                        alt=""
                        className="size-20 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{line.name}</p>
                        <p className="text-sm text-muted-foreground">₹{line.price}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`One less ${line.name}`}
                            className="size-7"
                            onClick={() => cart.setQuantity(line.id, -1)}
                          >
                            <Minus />
                          </Button>
                          <span className="w-5 text-center text-sm">{line.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            aria-label={`One more ${line.name}`}
                            className="size-7"
                            onClick={() => cart.setQuantity(line.id, 1)}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${line.name}`}
                        onClick={() => cart.remove(line.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-5">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{cart.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxes (5%)</span>
                      <span>₹{cart.taxes}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
                      <span>Total</span>
                      <span>₹{cart.total}</span>
                    </div>
                  </div>
                  <Button
                    className="mt-5 w-full"
                    size="lg"
                    onClick={() => {
                      setCartOpen(false);
                      navigate({ to: "/checkout" });
                    }}
                  >
                    Go to Payment <ArrowRight />
                  </Button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}

const reviews = [
  { quote: "Every bite genuinely felt like therapy.", name: "Maya Kapoor" },
  { quote: "The kind of place you want to keep all to yourself.", name: "Arjun Mehta" },
  { quote: "Beautiful coffee, thoughtful food, and the warmest mood.", name: "Rhea Shah" },
];

function Reviews({ current, setCurrent }: { current: number; setCurrent: (index: number) => void }) {
  const entry = reviews[current] ?? reviews[0];
  return (
    <section className="overflow-hidden bg-primary py-20 text-primary-foreground sm:py-28">
      <div className="mx-auto max-w-5xl px-5 text-center">
        <div className="mb-7 flex justify-center gap-1 text-secondary">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="size-4 fill-current" />
          ))}
        </div>
        <blockquote className="font-display text-4xl italic leading-tight sm:text-6xl">
          “{entry?.quote}”
        </blockquote>
        <p className="mt-7 text-sm uppercase tracking-[.2em] text-primary-foreground/65">
          {entry?.name}
        </p>
        <div className="mt-10 flex justify-center gap-2">
          <Button
            variant="heroOutline"
            size="icon"
            aria-label="Previous review"
            onClick={() => setCurrent((current + reviews.length - 1) % reviews.length)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="heroOutline"
            size="icon"
            aria-label="Next review"
            onClick={() => setCurrent((current + 1) % reviews.length)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

function Gallery({ scrollTo }: { scrollTo: (id?: string) => void }) {
  const gallery = [
    { src: heroImage, alt: "A lavender latte beside a chocolate dessert" },
    { src: spreadImage, alt: "A full Food Therapy brunch spread" },
    { src: interiorImage, alt: "The café interior with warm lighting" },
    { src: friendsImage, alt: "Friends sharing food at the café" },
    {
      src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=80",
      alt: "A barista pouring latte art",
    },
    {
      src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80",
      alt: "A freshly brewed coffee on a table",
    },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-primary">
              @foodtherapy
            </p>
            <h2 className="text-5xl sm:text-6xl">A good mood, shared.</h2>
          </div>
          <Button variant="outline" className="hidden sm:flex" onClick={() => scrollTo("contact")}>
            <Instagram />
            Follow Our Journey
          </Button>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {gallery.map((image) => (
            <div key={image.alt} className="group aspect-square overflow-hidden rounded-lg">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-6 w-full sm:hidden" onClick={() => scrollTo("contact")}>
          <Instagram />
          Follow Our Journey
        </Button>
      </div>
    </section>
  );
}

function Footer({ scrollTo }: { scrollTo: (id?: string) => void }) {
  return (
    <footer id="contact" className="bg-foreground px-5 py-16 text-background lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h2 className="text-4xl">FOOD THERAPY</h2>
            <p className="mt-3 font-display text-xl italic text-background/65">
              Eat. Sip. Relax. Repeat.
            </p>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.2em]">Visit us</p>
            <p className="flex gap-2 text-sm leading-7 text-background/65">
              <MapPin className="mt-1 size-4 shrink-0" />
              Food Therapy Café
              <br />
              Your city, India
            </p>
            <p className="mt-3 text-sm text-background/65">Daily · 8 AM — 11 PM</p>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.2em]">Say hello</p>
            <p className="text-sm leading-7 text-background/65">
              +91 00000 00000
              <br />
              hello@foodtherapy.cafe
              <br />
              @foodtherapy
            </p>
            <Button variant="heroOutline" size="sm" className="mt-4" asChild>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer">
                <MapPin />
                Google Maps
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-6 border-t border-background/15 pt-7 text-xs text-background/55 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Food Therapy. Good food. Better mood.</p>
          <nav className="flex flex-wrap gap-5">
            <button onClick={() => scrollTo("home")}>Home</button>
            {navLinks.map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}>
                {label}
              </button>
            ))}
            <Link to="/auth">Sign in</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

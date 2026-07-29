"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const WEDDING_DATE = new Date("2026-08-29T14:35:00+03:00");

const DRINKS = [
  "Шампанское",
  "Белое вино",
  "Красное вино",
  "Водка",
  "Коньяк / виски",
  "Без алкоголя",
  "Свой вариант",
] as const;

type Attendance = "" | "yes" | "no";
type SubmitState = "idle" | "submitting" | "success" | "error";

type WeddingInvitationProps = {
  rsvpScriptUrl: string;
  assetPrefix: string;
};

function getCountdown() {
  const distance = Math.max(0, WEDDING_DATE.getTime() - Date.now());

  return {
    distance,
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

function useCountdown() {
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return countdown;
}

function PearlString({ className = "" }: { className?: string }) {
  return <span className={`pearl-string ${className}`} aria-hidden="true" />;
}

function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <b>♡</b>
      <span />
    </div>
  );
}

type ScheduleIconName = "rings" | "transfer" | "banquet" | "party";

function ScheduleIcon({ name }: { name: ScheduleIconName }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {name === "rings" && (
        <>
          <circle cx="24" cy="36" r="13" />
          <circle cx="40" cy="36" r="13" />
          <path d="m27 20 5-8 5 8-5 5-5-5Z" />
          <path d="M29 14h6" />
        </>
      )}
      {name === "transfer" && (
        <>
          <path d="M12 19h40a4 4 0 0 1 4 4v22H8V23a4 4 0 0 1 4-4Z" />
          <path d="M14 25h11v10H14zm15 0h11v10H29zm15 0h6v10h-6M8 39h48" />
          <circle cx="18" cy="48" r="5" />
          <circle cx="46" cy="48" r="5" />
          <path d="M12 15h24" />
        </>
      )}
      {name === "banquet" && (
        <>
          <path d="M10 43h44M16 43c1-15 8-23 16-23s15 8 16 23" />
          <path d="M29 14h6M32 14v6M8 49h48" />
          <path d="M21 34c3-6 7-9 11-9" />
        </>
      )}
      {name === "party" && (
        <>
          <path d="M20 15v27a6 6 0 1 1-4-5.7V21l25-6v22a6 6 0 1 1-4-5.7V19l-17 4" />
          <path d="m48 11 1.5 4.5L54 17l-4.5 1.5L48 23l-1.5-4.5L42 17l4.5-1.5L48 11Z" />
        </>
      )}
    </svg>
  );
}

function IntroEnvelope({
  state,
  onOpen,
}: {
  state: "closed" | "opening";
  onOpen: () => void;
}) {
  const handleKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div className={`intro ${state === "opening" ? "intro--opening" : ""}`}>
      <div className="intro__ambient" aria-hidden="true" />
      <p className="intro__eyebrow">Вам письмо</p>
      <div className="envelope-scene">
        <div className="envelope-card" aria-hidden="true">
          <span>Приглашение на свадьбу</span>
          <strong>Максим &amp; Елизавета</strong>
          <small>29 августа 2026</small>
        </div>
        <div className="envelope">
          <div className="envelope__back" />
          <div className="envelope__lace envelope__lace--left" />
          <div className="envelope__lace envelope__lace--right" />
          <div className="envelope__front envelope__front--left" />
          <div className="envelope__front envelope__front--right" />
          <div className="envelope__front envelope__front--bottom" />
          <div className="envelope__flap" />
          <button
            className="wax-seal"
            type="button"
            onClick={onOpen}
            onKeyDown={handleKeyboard}
            disabled={state === "opening"}
            aria-label="Открыть свадебное приглашение"
          >
            <span>М</span>
            <i>&amp;</i>
            <span>Е</span>
          </button>
        </div>
      </div>
      <button
        className="intro__open"
        type="button"
        onClick={onOpen}
        disabled={state === "opening"}
        tabIndex={state === "opening" ? -1 : 0}
      >
        {state === "opening" ? "Открываем…" : "Открыть приглашение"}
      </button>
    </div>
  );
}

function LocationCard({
  eyebrow,
  title,
  address,
  routeUrl,
  mapUrl,
}: {
  eyebrow: string;
  title: string;
  address: string;
  routeUrl: string;
  mapUrl: string;
}) {
  return (
    <article className="location-card">
      <div className="location-card__copy">
        <span className="section-eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
        <p>{address}</p>
        <a href={routeUrl} target="_blank" rel="noreferrer">
          <span aria-hidden="true">⌖</span>
          Построить маршрут
        </a>
      </div>
      <div className="location-card__map">
        <iframe
          src={mapUrl}
          title={`Карта: ${title}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </article>
  );
}

export function WeddingInvitation({
  rsvpScriptUrl,
  assetPrefix,
}: WeddingInvitationProps) {
  const countdown = useCountdown();
  const audioRef = useRef<HTMLAudioElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [introVisible, setIntroVisible] = useState(true);
  const [introState, setIntroState] = useState<"closed" | "opening">("closed");
  const [playing, setPlaying] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [attendance, setAttendance] = useState<Attendance>("");
  const [guestName, setGuestName] = useState("");
  const [comment, setComment] = useState("");
  const [selectedDrinks, setSelectedDrinks] = useState<string[]>([]);
  const [customDrink, setCustomDrink] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    document.body.style.overflow = introVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introVisible]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [introVisible]);

  const openInvitation = () => {
    if (introState === "opening") return;

    const audio = audioRef.current;
    if (audio && !audioUnavailable) {
      audio.volume = 0.35;
      void audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }

    setIntroState("opening");

    window.setTimeout(() => {
      setIntroVisible(false);
      window.requestAnimationFrame(() => heroRef.current?.focus());
    }, 2400);
  };

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio || audioUnavailable) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      audio.volume = 0.35;
      await audio.play();
      setPlaying(true);
    } catch {
      setAudioUnavailable(true);
      setPlaying(false);
    }
  };

  const changeAttendance = (value: Attendance) => {
    setAttendance(value);
    setErrors((current) => ({ ...current, attendance: "", drinks: "" }));
    setSubmitState("idle");

    if (value === "no") {
      setSelectedDrinks([]);
      setCustomDrink("");
    }
  };

  const toggleDrink = (drink: string) => {
    setErrors((current) => ({ ...current, drinks: "", customDrink: "" }));
    setSubmitState("idle");

    setSelectedDrinks((current) => {
      if (drink === "Без алкоголя") {
        setCustomDrink("");
        return current.includes(drink) ? [] : [drink];
      }

      const withoutSober = current.filter((item) => item !== "Без алкоголя");
      if (withoutSober.includes(drink)) {
        if (drink === "Свой вариант") setCustomDrink("");
        return withoutSober.filter((item) => item !== drink);
      }
      return [...withoutSober, drink];
    });
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!guestName.trim()) nextErrors.guestName = "Укажите имя и фамилию.";
    if (!attendance)
      nextErrors.attendance = "Выберите, сможете ли вы присутствовать.";
    if (attendance === "yes" && selectedDrinks.length === 0) {
      nextErrors.drinks = "Выберите хотя бы один вариант напитка.";
    }
    if (
      attendance === "yes" &&
      selectedDrinks.includes("Свой вариант") &&
      !customDrink.trim()
    ) {
      nextErrors.customDrink = "Укажите свой вариант напитка.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitState("submitting");
    setDemoMode(false);

    const alcohol =
      attendance === "no"
        ? "Не требуется"
        : selectedDrinks
            .map((drink) =>
              drink === "Свой вариант"
                ? `Свой вариант: ${customDrink.trim()}`
                : drink,
            )
            .join(", ");

    const payload = {
      submittedAt: new Date().toISOString(),
      guestName: guestName.trim(),
      attendance:
        attendance === "yes" ? "Буду присутствовать" : "Не смогу присутствовать",
      alcohol,
      comment: comment.trim(),
    };

    if (!rsvpScriptUrl) {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      setDemoMode(true);
      setSubmitState("success");
      return;
    }

    try {
      const response = await fetch(rsvpScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Ошибка отправки");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <>
      {introVisible && (
        <IntroEnvelope state={introState} onOpen={openInvitation} />
      )}

      <main className="site-shell">
        <section className="hero" ref={heroRef} tabIndex={-1}>
          <div className="lace lace--hero-left" aria-hidden="true" />
          <div className="lace lace--hero-right" aria-hidden="true" />
          <PearlString className="pearl-string--hero-top" />
          <PearlString className="pearl-string--hero-bottom" />

          <button
            className={`music-button ${playing ? "music-button--playing" : ""}`}
            type="button"
            onClick={toggleMusic}
            disabled={audioUnavailable}
            aria-label={
              audioUnavailable
                ? "Музыкальный файл пока не добавлен"
                : playing
                  ? "Поставить музыку на паузу"
                  : "Включить музыку"
            }
          >
            <span className="music-button__icon" aria-hidden="true">
              {audioUnavailable ? "×" : playing ? "Ⅱ" : "♪"}
            </span>
            <span>
              <small>{audioUnavailable ? "Музыка появится позже" : "Наша песня"}</small>
              <strong>Гио Пика — Мир</strong>
            </span>
          </button>
          <audio
            ref={audioRef}
            src={`${assetPrefix}/audio/wedding-song.mp3`}
            preload="auto"
            loop
            onEnded={() => setPlaying(false)}
            onError={() => {
              setAudioUnavailable(true);
              setPlaying(false);
            }}
          />

          <div className="hero__inner">
            <div className="hero__copy" data-reveal>
              <span className="section-eyebrow">Приглашение на свадьбу</span>
              <h1>
                Максим
                <span>&amp;</span>
                Елизавета
              </h1>
              <time dateTime="2026-08-29">29 августа 2026</time>
              <p>
                Приглашаем вас разделить с нами день, с которого начнётся наша
                семейная история.
              </p>
              <Ornament />
            </div>

            <div className="hero__portrait-wrap" data-reveal>
              <div className="hero-frame">
                <div className="hero-frame__photo">
                  <img
                    src={`${assetPrefix}/images/maxim-elizaveta.jpg`}
                    alt="Максим и Елизавета"
                    fetchPriority="high"
                  />
                </div>
                <img
                  className="hero-frame__art"
                  src={`${assetPrefix}/images/swan-frame.png`}
                  alt=""
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <a className="scroll-cue" href="#welcome" aria-label="Листать вниз">
            <span>Листайте вниз</span>
            <b aria-hidden="true">⌄</b>
          </a>
        </section>

        <section className="welcome section" id="welcome">
          <div className="lace lace--corner lace--corner-left" aria-hidden="true" />
          <div
            className="lace lace--corner lace--corner-right"
            aria-hidden="true"
          />
          <div className="section__content" data-reveal>
            <span className="section-eyebrow">Несколько тёплых слов</span>
            <h2>Дорогие гости!</h2>
            <p>
              Мы будем счастливы разделить с вами этот особенный день. Ваша
              поддержка, улыбки и тёплые слова сделают наш праздник
              по-настоящему незабываемым.
            </p>
            <p>Будем рады видеть вас рядом в день рождения нашей семьи.</p>
            <Ornament />
          </div>
        </section>

        <section className="countdown section">
          <PearlString className="pearl-string--countdown" />
          <div className="section__content" data-reveal>
            <span className="section-eyebrow">Считаем дни</span>
            <h2>До нашей свадьбы</h2>
            {countdown.distance > 0 ? (
              <div className="countdown__grid" aria-live="polite">
                {[
                  ["days", countdown.days, "дней"],
                  ["hours", countdown.hours, "часов"],
                  ["minutes", countdown.minutes, "минут"],
                  ["seconds", countdown.seconds, "секунд"],
                ].map(([key, value, label]) => (
                  <div className="countdown__item" key={String(key)}>
                    <strong>{String(value).padStart(2, "0")}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="countdown__today">Сегодня наш особенный день!</p>
            )}
          </div>
        </section>

        <section className="schedule section">
          <div className="section__content section__content--wide" data-reveal>
            <span className="section-eyebrow">29 августа 2026</span>
            <h2>Программа дня</h2>
            <div className="schedule__line">
              {[
                ["14:35", "rings", "ЗАГС"],
                ["16:00–18:00", "transfer", "Прогулка на трансфере"],
                ["18:00", "banquet", "Начало банкета"],
                ["23:00", "party", "Дискотека"],
              ].map(([time, icon, label]) => (
                <article className="schedule__event" key={time}>
                  <span className="schedule__icon" aria-hidden="true">
                    <ScheduleIcon name={icon as ScheduleIconName} />
                  </span>
                  <time>{time}</time>
                  <p>{label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="locations section">
          <div className="lace lace--locations" aria-hidden="true" />
          <div className="section__content section__content--wide" data-reveal>
            <span className="section-eyebrow">Будем ждать вас</span>
            <h2>Места проведения</h2>
            <div className="locations__grid">
              <LocationCard
                eyebrow="14:35"
                title="ЗАГС"
                address="г. Нижний Новгород, ул. Дьяконова, 1В"
                routeUrl="https://yandex.com/maps/47/nizhny-novgorod/house/ulitsa_dyakonova_1v/YEoYfgFpT0QEQFtsfX50eXtmZw==/?ll=43.870016%2C56.258475&z=18"
                mapUrl="https://yandex.ru/map-widget/v1/?ll=43.870016%2C56.258475&z=17&pt=43.870016,56.258475,pm2rdm"
              />
              <LocationCard
                eyebrow="18:00"
                title="Ресторан «Ренессанс»"
                address="г. Нижний Новгород, ул. Ларина, 15Б"
                routeUrl="https://yandex.ru/maps/org/renessans/179124515196/?ll=44.001351%2C56.237767&z=17"
                mapUrl="https://yandex.ru/map-widget/v1/?ll=44.001351%2C56.237767&z=16&pt=44.001351,56.237767,pm2rdm"
              />
            </div>
          </div>
        </section>

        <section className="rsvp section" id="rsvp">
          <PearlString className="pearl-string--rsvp" />
          <div className="rsvp__panel" data-reveal>
            <span className="section-eyebrow">До скорой встречи</span>
            <h2>Анкета гостя</h2>
            <p className="rsvp__intro">
              Пожалуйста, подтвердите своё присутствие до начала свадьбы, чтобы
              мы могли учесть все детали праздника.
            </p>

            <form onSubmit={submitRsvp} noValidate>
              <div className="form-field">
                <label htmlFor="guest-name">Имя и фамилия</label>
                <input
                  id="guest-name"
                  name="guestName"
                  type="text"
                  autoComplete="name"
                  value={guestName}
                  onChange={(event) => {
                    setGuestName(event.target.value);
                    setErrors((current) => ({ ...current, guestName: "" }));
                    setSubmitState("idle");
                  }}
                  aria-invalid={Boolean(errors.guestName)}
                  aria-describedby={
                    errors.guestName ? "guest-name-error" : undefined
                  }
                  placeholder="Например, Иван Иванов"
                />
                {errors.guestName && (
                  <span className="form-error" id="guest-name-error">
                    {errors.guestName}
                  </span>
                )}
              </div>

              <fieldset className="form-group">
                <legend>Сможете ли вы присутствовать?</legend>
                <div className="choice-grid choice-grid--attendance">
                  {[
                    ["yes", "Буду присутствовать"],
                    ["no", "Не смогу присутствовать"],
                  ].map(([value, label]) => (
                    <label
                      className={`choice-card ${
                        attendance === value ? "choice-card--selected" : ""
                      }`}
                      key={value}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={value}
                        checked={attendance === value}
                        onChange={() => changeAttendance(value as Attendance)}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
                {errors.attendance && (
                  <span className="form-error">{errors.attendance}</span>
                )}
              </fieldset>

              {attendance === "yes" && (
                <fieldset className="form-group form-group--drinks">
                  <legend>Какой алкоголь вы будете пить на свадьбе?</legend>
                  <p className="form-hint">Можно выбрать несколько вариантов</p>
                  <div className="choice-grid choice-grid--drinks">
                    {DRINKS.map((drink) => (
                      <label
                        className={`choice-card ${
                          selectedDrinks.includes(drink)
                            ? "choice-card--selected"
                            : ""
                        }`}
                        key={drink}
                      >
                        <input
                          type="checkbox"
                          name="drinks"
                          value={drink}
                          checked={selectedDrinks.includes(drink)}
                          onChange={() => toggleDrink(drink)}
                        />
                        <span>{drink}</span>
                      </label>
                    ))}
                  </div>
                  {errors.drinks && (
                    <span className="form-error">{errors.drinks}</span>
                  )}
                  {selectedDrinks.includes("Свой вариант") && (
                    <div className="form-field form-field--custom">
                      <label htmlFor="custom-drink">Укажите свой вариант</label>
                      <input
                        id="custom-drink"
                        value={customDrink}
                        onChange={(event) => {
                          setCustomDrink(event.target.value);
                          setErrors((current) => ({
                            ...current,
                            customDrink: "",
                          }));
                        }}
                        aria-invalid={Boolean(errors.customDrink)}
                        placeholder="Напишите название напитка"
                      />
                      {errors.customDrink && (
                        <span className="form-error">
                          {errors.customDrink}
                        </span>
                      )}
                    </div>
                  )}
                </fieldset>
              )}

              <div className="form-field">
                <label htmlFor="comment">Комментарий или пожелание</label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={4}
                  value={comment}
                  onChange={(event) => {
                    setComment(event.target.value);
                    setSubmitState("idle");
                  }}
                  placeholder="Необязательно"
                />
              </div>

              <button
                className="submit-button"
                type="submit"
                disabled={submitState === "submitting"}
              >
                {submitState === "submitting"
                  ? "Отправляем ответ…"
                  : "Отправить ответ"}
              </button>

              <div className="form-status" aria-live="polite">
                {submitState === "success" && (
                  <p className="form-status--success">
                    {demoMode
                      ? "Спасибо! Демо-ответ принят. После подключения скрипта он будет отправляться организаторам."
                      : "Спасибо! Ваш ответ сохранён."}
                  </p>
                )}
                {submitState === "error" && (
                  <p className="form-status--error">
                    Не удалось отправить ответ. Проверьте соединение и попробуйте
                    ещё раз.
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <Ornament />
        <strong>Максим &amp; Елизавета</strong>
        <time dateTime="2026-08-29">29.08.2026</time>
      </footer>
    </>
  );
}

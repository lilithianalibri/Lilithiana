type BookArrowIconProps = {
  size?: number;
  className?: string;
};

export function BookArrowIcon({ size = 20, className }: BookArrowIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="book-arrow-cover" x1="8" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8F2F45" />
          <stop offset="1" stopColor="#C47A7C" />
        </linearGradient>
        <linearGradient id="book-arrow-pages" x1="16" y1="14" x2="50" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF8F1" />
          <stop offset="1" stopColor="#F0E2D5" />
        </linearGradient>
        <linearGradient id="book-arrow-gold" x1="34" y1="12" x2="58" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E6C177" />
          <stop offset="1" stopColor="#BB8A2F" />
        </linearGradient>
      </defs>

      <path
        d="M12 13.5C12 10.462 14.462 8 17.5 8H30.5C34.85 8 38.667 9.49 42 12.46C45.333 9.49 49.15 8 53.5 8H54C56.209 8 58 9.791 58 12V42.5C58 45.538 55.538 48 52.5 48H42C37.65 48 33.833 49.49 30.5 52.46L30 52.9L29.5 52.46C26.167 49.49 22.35 48 18 48H11.5C8.462 48 6 45.538 6 42.5V18C6 15.515 8.015 13.5 10.5 13.5H12Z"
        fill="url(#book-arrow-cover)"
      />

      <path
        d="M13 17.4C13 15.522 14.522 14 16.4 14H30.4C34.089 14 37.19 14.947 40 16.903V46.766C37.076 45.372 33.867 44.7 30.4 44.7H18.8C15.597 44.7 13 42.103 13 38.9V17.4Z"
        fill="url(#book-arrow-pages)"
      />
      <path
        d="M51 44.7H42.6C39.133 44.7 35.924 45.372 33 46.766V16.903C35.81 14.947 38.911 14 42.6 14H49.1C51.806 14 54 16.194 54 18.9V41.7C54 43.357 52.657 44.7 51 44.7Z"
        fill="url(#book-arrow-pages)"
      />

      <path
        d="M31.75 16H33.75V47.8H31.75V16Z"
        fill="#8F2F45"
        fillOpacity="0.34"
      />

      <path
        d="M47.25 19.3L58 30.05L47.25 40.8"
        stroke="url(#book-arrow-gold)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36.5 30.05H57.2"
        stroke="url(#book-arrow-gold)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M17.8 22.6H28.2"
        stroke="#8F2F45"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17.8 28.1H28.2"
        stroke="#8F2F45"
        strokeOpacity="0.28"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17.8 33.6H25.7"
        stroke="#8F2F45"
        strokeOpacity="0.22"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

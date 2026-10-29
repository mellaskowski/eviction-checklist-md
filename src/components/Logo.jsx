// White wordmark for the teal header. Files live in /public (supplied by Houstory).
export default function Logo() {
  return (
    <img
      className="logo-img"
      src={`${import.meta.env.BASE_URL}wordmark-white.svg`}
      alt="Houstory"
      width="186"
      height="38"
    />
  );
}

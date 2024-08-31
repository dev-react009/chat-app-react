import { styled, keyframes } from "@mui/material/styles";

// Keyframes
const spin78236 = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const wobble1 = keyframes`
  0%, 100% {
    transform: translateY(0%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-66%) scale(0.65);
    opacity: 0.8;
  }
`;

const wobble2 = keyframes`
  0%, 100% {
    transform: translateY(0%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(66%) scale(0.65);
    opacity: 0.8;
  }
`;

// Styled components
const ThreeBody = styled("div")(({ theme }) => ({
  "--uib-size": "35px",
  "--uib-speed": "0.8s",
  "--uib-color": "#f8f8fb",
  position: "relative",
  display: "inline-block",
  height: "var(--uib-size)",
  width: "var(--uib-size)",
  animation: `${spin78236} calc(var(--uib-speed) * 2.5) infinite linear`,
}));

const ThreeBodyDot = styled("div")({
  position: "absolute",
  height: "100%",
  width: "30%",
  "&:after": {
    content: '""',
    position: "absolute",
    height: "0%",
    width: "100%",
    paddingBottom: "100%",
    backgroundColor: "var(--uib-color)",
    borderRadius: "50%",
  },
  "&:nth-of-type(1)": {
    bottom: "5%",
    left: 0,
    transform: "rotate(60deg)",
    transformOrigin: "50% 85%",
    "&:after": {
      bottom: 0,
      left: 0,
      animation: `${wobble1} var(--uib-speed) infinite ease-in-out`,
      animationDelay: "calc(var(--uib-speed) * -0.3)",
    },
  },
  "&:nth-of-type(2)": {
    bottom: "5%",
    right: 0,
    transform: "rotate(-60deg)",
    transformOrigin: "50% 85%",
    "&:after": {
      bottom: 0,
      left: 0,
      animation: `${wobble1} var(--uib-speed) infinite`,
      animationDelay: "calc(var(--uib-speed) * -0.15)",
    },
  },
  "&:nth-of-type(3)": {
    bottom: "-5%",
    left: 0,
    transform: "translateX(116.666%)",
    "&:after": {
      top: 0,
      left: 0,
      animation: `${wobble2} var(--uib-speed) infinite ease-in-out`,
    },
  },
});

// Usage in a component
export default function MyLoadingComponent() {
  return (
    <ThreeBody>
      <ThreeBodyDot />
      <ThreeBodyDot />
      <ThreeBodyDot />
    </ThreeBody>
  );
}

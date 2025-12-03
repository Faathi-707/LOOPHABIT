export const pressedStyle = (pressed: boolean, baseScale = 0.98, baseOpacity = 0.7) => [
  {
    opacity: pressed ? baseOpacity : 1,
    transform: [{ scale: pressed ? baseScale : 1 }],
  },
];

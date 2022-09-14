import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState", //unique identifier with respect to other atoms/selectors
  default: null, // The initial value
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});

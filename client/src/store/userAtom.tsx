import { atom } from 'jotai';

const userInfoAtom = atom({ nickName: '', id: '' });

export const userNickNameAtom = atom(
  (get) => get(userInfoAtom).nickName,
  (get, set, newNickName: string) => {
    const prev = get(userInfoAtom);
    set(userInfoAtom, { ...prev, nickName: newNickName });
  },
);
export const userIdAtom = atom(
  (get) => get(userInfoAtom).id,
  (get, set, newId: string) => {
    const prev = get(userInfoAtom);
    set(userInfoAtom, { ...prev, id: newId });
  },
);

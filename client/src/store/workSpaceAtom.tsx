import {atom} from 'jotai';

const workSpaceAtom = atom({workSpaceId: '', workSpaceName: ''});

export const workSpaceNameAtom = atom(
  (get)=>get(workSpaceAtom).workSpaceName,
  (get, set, newWorkSpaceName: string)=>{
    const prev = get(workSpaceAtom);
    set(workSpaceAtom, {...prev, workSpaceName: newWorkSpaceName})
})
export const workSpaceIdAtom = atom(
  (get)=>get(workSpaceAtom).workSpaceId,
  (get, set, newWorkSpaceId: string)=>{
    const prev = get(workSpaceAtom);
    set(workSpaceAtom, {...prev, workSpaceId: newWorkSpaceId})
})
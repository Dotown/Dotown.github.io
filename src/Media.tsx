import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import {X, Maximize2} from 'lucide-react';
import musicPhoto1 from '../asset/音乐1.png';
import musicPhoto2 from '../asset/音乐2.jpg';
import musicPhoto3 from '../asset/音乐3.jpg';
import communityPhoto1 from '../asset/公益1.jpg';
import communityPhoto2 from '../asset/公益2.jpg';
import communityPhoto3 from '../asset/公益3.jpg';
import personalPhotoManifest from './personal-photos.json';

export type MediaAsset = {label:string; src:string; fit?:'contain'|'cover'};
export const personalPhotos: MediaAsset[] = personalPhotoManifest;
export const musicMedia: Record<string,MediaAsset> = {
  'music-01': {label:'Superconductor band together on the school stage',src:musicPhoto2,fit:'contain'},
  'music-02': {label:'Superconductor group photo after a stage performance',src:musicPhoto3,fit:'contain'},
  'music-main': {label:'Superconductor performing together in a rehearsal studio',src:musicPhoto1,fit:'contain'},
};
export const communityPhotos: MediaAsset[] = [
  {label:'Community visit with a student and family',src:communityPhoto1},
  {label:'School supplies shared during a community visit',src:communityPhoto2},
  {label:'School entrance during an education outreach visit',src:communityPhoto3},
];
export const communityMedia: Record<string,MediaAsset> = {
  'community-01': {...communityPhotos[0]},
  'community-02': {...communityPhotos[1]},
  'community-main': {...communityPhotos[2],fit:'contain'},
};
const OpenPhoto = createContext<(asset:MediaAsset)=>void>(()=>{});
export function Photo({asset,className='',showCaption=false}:{asset:MediaAsset,className?:string,showCaption?:boolean}) {
  const open = useContext(OpenPhoto);
  return <figure className={`photo-figure ${className}`}><button className="photo-open" onClick={()=>open(asset)} aria-label={`Enlarge photo: ${asset.label}`}><img src={asset.src} alt={asset.label} loading="lazy" decoding="async" style={{objectFit:asset.fit??'cover'}}/><span className="photo-zoom" aria-hidden="true"><Maximize2 size={16}/></span></button>{showCaption&&<figcaption>{asset.label}</figcaption>}</figure>
}
export function PhotoProvider({children}:{children:React.ReactNode}) {
  const [asset,setAsset]=useState<MediaAsset|null>(null);
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const dialog=ref.current;
    if(!asset){dialog?.close();return;}
    const previousOverflow=document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow=previousOverflow;};
  },[asset]);
  return <OpenPhoto.Provider value={setAsset}>{children}<dialog className="photo-dialog" ref={ref} aria-labelledby="photo-caption" onCancel={()=>setAsset(null)} onClick={e=>{if(e.target===e.currentTarget)setAsset(null);}}>{asset&&<div className="photo-dialog-content"><button className="photo-dialog-close" onClick={()=>setAsset(null)} aria-label="Close photo"><X size={22}/></button><img src={asset.src} alt={asset.label}/><p id="photo-caption">{asset.label}</p></div>}</dialog></OpenPhoto.Provider>
}

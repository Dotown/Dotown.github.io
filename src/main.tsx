import React, {useRef, useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {motion, useScroll, useTransform, useReducedMotion} from 'framer-motion';
import {ArrowUpRight, ArrowDown, Plus, X, Music2, BookOpen, Heart, Moon, Image as ImageIcon} from 'lucide-react';
import './style.css';
import './theme.css';
import './media.css';
import {musicMedia, communityMedia, personalPhotos, Photo, PhotoProvider, type MediaAsset} from './Media';
import {ProjectVideo} from './ProjectVideo';

const email='catherine090626@163.com';
const slots: Record<string,MediaAsset> = {
'hero-portrait':{label:'Fanghan illustrated portrait',src:'/images/hero-portrait.png'},
'about-music':{label:'音乐装饰',src:''},'about-research':{label:'研究装饰',src:''},
'about-community':{label:'公益装饰',src:''},'about-moon':{label:'月亮装饰',src:''},
...Object.fromEntries(personalPhotos.map((asset,i)=>[`gallery-${String(i+1).padStart(2,'0')}`,asset])),
...Object.fromEntries(['community','research','music'].flatMap(p=>['01','02','main'].map(n=>[`${p}-${n}`,{label:`${p==='community'?'公益项目':p==='research'?'金融研究':'音乐与舞台'} · ${n==='main'?'主图':n}`,src:''}]))),
...musicMedia,
...communityMedia
};
function Slot({id,className=''}:{id:string,className?:string}) {
 const asset=slots[id];
 return <div className={`asset-slot ${className}`} data-slot={id}>
 {asset.src?(id==='hero-portrait'?<img src={asset.src} alt={asset.label} loading="eager"/>:<Photo asset={asset}/>):<><div className="slot-cross top-left"/><div className="slot-cross bottom-right"/><div className="slot-center"><ImageIcon size={22} strokeWidth={1}/><span>{asset.label}</span><small>IMAGE TO COME</small></div><span className="slot-id">{id}</span></>}
 </div>
}
function Reveal({children,delay=0}:{children:React.ReactNode,delay?:number}) {const reduced=useReducedMotion();return <motion.div initial={reduced?false:{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}} transition={{duration:.7,delay,ease:[.25,.1,.25,1]}}>{children}</motion.div>}
function ContactButton(){return <a className="contact-button" href={`mailto:${email}`}>LET’S CONNECT <ArrowUpRight size={20}/></a>}
function Hero(){const reduced=useReducedMotion();const [xy,setXY]=useState({x:0,y:0});return <section className="hero" id="top">
<nav aria-label="Main navigation"><a href="#about">ABOUT</a><a href="#explorations">EXPLORATIONS</a><a href="#projects">PROJECTS</a><a href="#contact">CONTACT <ArrowUpRight size={16}/></a></nav>
<Reveal><div className="hero-eyebrow"><span>FANGHAN LIU</span><span>RESEARCH / MUSIC / COMMUNITY</span></div><h1 className="gradient">HI, I’M<br className="mobile-break"/> FANGHAN</h1></Reveal>
<motion.div className="portrait-wrap" animate={xy} transition={{type:'spring',stiffness:90,damping:24}} onMouseMove={e=>{if(reduced)return;const r=e.currentTarget.getBoundingClientRect();setXY({x:(e.clientX-r.left-r.width/2)/16,y:(e.clientY-r.top-r.height/2)/16})}} onMouseLeave={()=>setXY({x:0,y:0})}><Slot id="hero-portrait" className="portrait"/><span className="portrait-caption">A LIFE IN EXPLORATION</span></motion.div>
<div className="hero-bottom"><p>EXPLORING SOCIAL QUESTIONS.<br/>CREATING THROUGH MUSIC.<br/>GROWING WITH COMMUNITY.</p><div className="hero-cta"><span className="micro">BASED IN JINAN, CHINA</span><ContactButton/></div></div><a className="scroll-cue" href="#moments"><ArrowDown size={15}/> SCROLL TO EXPLORE</a>
</section>}
function MarqueeRow({photos,startIndex,reverse}:{photos:MediaAsset[],startIndex:number,reverse:boolean}){
 const ref=useRef<HTMLDivElement>(null);
 const rowRef=useRef<HTMLDivElement>(null);
 const [travel,setTravel]=useState(0);
 const {scrollYProgress}=useScroll({target:ref,offset:['end end','start start']});
 const reduced=useReducedMotion();
 useEffect(()=>{
  const section=ref.current,row=rowRef.current;
  if(!section||!row)return;
  const measure=()=>setTravel(Math.max(0,row.scrollWidth-section.clientWidth));
  const observer=new ResizeObserver(measure);
  observer.observe(section);observer.observe(row);measure();
  return()=>observer.disconnect();
 },[]);
 const x=useTransform(scrollYProgress,[0,1],reverse?[0,-travel]:[-travel,0]);
 return <div className="marquee-viewport" ref={ref}><motion.div className="marquee-row" ref={rowRef} style={{x:reduced?0:x}}>{photos.map((asset,i)=><Slot key={asset.src} id={`gallery-${String(startIndex+i+1).padStart(2,'0')}`} className={`gallery-tile tone-${i%4}`}/>)}</motion.div></div>
}
function Marquee(){const rowLength=Math.ceil(personalPhotos.length/2);return <section id="moments" className="marquee" aria-label="Moments gallery"><div className="section-meta"><span>01 / MOMENTS IN MOTION</span><span>A FEW FRAGMENTS OF MY WORLD</span></div>{[0,1].map(row=><MarqueeRow key={row} photos={personalPhotos.slice(row*rowLength,(row+1)*rowLength)} startIndex={row*rowLength} reverse={row===1}/>)}</section>}
const aboutParagraphs=[
'Hi, I’m Fanghan, and I’m from Jinan, China.',
'When I’m not at school, I’m usually busy messing around with all kinds of things. I sing, play the keyboard, write songs, and I’m also in a band with my friends. Besides music, I like baking, DIY projects, reading, and I have a few cats of my own. I also play softball and badminton to stay active. Softball is still pretty niche in China, so sometimes I can’t help explaining to people around me how the game actually works.',
'I’m someone who likes trying things out. If something catches my interest, I usually want to give it a shot. But for me, starting is only the first step. What I really enjoy is staying with it—figuring out the details, getting better little by little, and seeing where it takes me. That’s how many of the things I love have stayed in my life, from music and sports to baking and DIY projects.',
'I like that feeling of slowly building something over time. It doesn’t always have to become something huge. Sometimes it’s just realizing that I know a little more, can do a little more, or have made something that feels like my own.',
'Yeah, I guess that’s pretty much me.'
];
function Word({word,index,total,progress}:{word:string,index:number,total:number,progress:any}) {const opacity=useTransform(progress,[index/total,(index+1)/total],[.24,1]);return <motion.span style={{opacity}}>{word} </motion.span>}
function AboutParagraph({text}:{text:string}){const ref=useRef<HTMLParagraphElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:['start .95','end .85']});const reduced=useReducedMotion();return <p ref={ref}>{reduced?text:text.split(' ').map((word,i,all)=><Word key={i} word={word} index={i} total={all.length} progress={scrollYProgress}/>)}</p>}
function About(){return <section className="about" id="about"><div className="about-decor decor-1"><Slot id="about-music"/><Music2/></div><div className="about-decor decor-2"><Slot id="about-research"/><BookOpen/></div><div className="about-decor decor-3"><Slot id="about-community"/><Heart/></div><div className="about-decor decor-4"><Slot id="about-moon"/><Moon/></div><div className="about-content"><Reveal><span className="micro">THE PERSON BEHIND THE PROJECTS</span><h2 className="gradient">ABOUT ME</h2></Reveal><div className="about-copy">{aboutParagraphs.map((text,i)=><AboutParagraph key={i} text={text}/>)}</div><ContactButton/><span className="about-note">STUDENT AT JINAN FOREIGN LANGUAGE SCHOOL</span></div></section>}
const explorations=[
['Economics & research','Studying financial crises and company responses to market turbulence. Exploring economics through research, coursework, and the National Economics Challenge.','Financial research · NEC · Economics'],
['Social questions','Investigating period poverty in Chinese society through a Columbia PreCollege case study, with Herline as a proposed approach to education and access.','Herline · Columbia PreCollege'],
['Music & performance','Lead vocalist and keyboardist in Superconductor. Original composition, collaborative arrangements, and musical theater — from The Phantom of the Opera to High School Musical.','Original music · Live performance'],
['Community & leadership','Long-term donations, book contributions, and educational exchanges with rural students since 2016. Coordinating student feedback and campus dormitory initiatives.','Rural education · Student union'],
['Everyday curiosity','Reading finance and social science, experimenting in the kitchen, making handmade pieces for scene layouts and decorative design, and caring for animals and advocating for strays. Small interests that keep my perspective open.','Reading · Baking · Handmade']];
function Explorations(){return <section className="explorations" id="explorations"><div className="section-meta"><span>03 / WHAT I EXPLORE</span><span>CURIOSITY, IN DIFFERENT FORMS</span></div><Reveal><h2>EXPLORATIONS</h2></Reveal><div className="exploration-list">{explorations.map(([title,copy,tags],i)=><Reveal key={title}><article className="exploration-row"><span className="exploration-number">0{i+1}</span><div><h3>{title}</h3><p>{copy}</p><span className="tags">{tags}</span></div></article></Reveal>)}</div></section>}
const projects=[
{id:'community',n:'01',name:'EDUCATION & CARE',category:'COMMUNITY / EDUCATION',subtitle:'A continuing commitment to learning and literacy.',copy:'Since first grade in 2016, I have supported students in mountainous rural areas through annual monetary donations and book contributions. Online and offline educational exchanges, together with ongoing communication, keep this commitment connected to reading, learning, and literacy.',role:'Student volunteer · Long-term education support',year:'May 2016–Present',details:['Contributed monetary donations and books annually to support students in mountainous rural areas.', 'Facilitated online and offline educational seminars to encourage reading habits and strengthen learning awareness.', 'Maintained ongoing communication with beneficiary students to reinforce the value of education and literacy.']},
{id:'music',n:'02',name:'BEYOND THE NOTES',category:'MUSIC / PERFORMANCE',subtitle:'Original melodies. Shared stages. A voice of my own.',copy:'Lead vocals and keyboards with Superconductor, including the original composition Solitary Moon Wanderer. Featured solo performances in The Phantom of the Opera, La La Land, and High School Musical.',role:'Lead vocalist · Keyboardist · Musical theater',year:'Aug 2024–Present',details:['Superconductor · Aug 2024–Present: member, lead vocalist and keyboardist at Jinan Foreign Language School. Performed for New-Student Orientation and Club Promotion Day.', 'Premiered the original composition Solitary Moon Wanderer and performed covers of popular tracks. Collaborated with band members to refine arrangements and stage productions.', 'School Musical Theater Troupe · Sep 2024–Jun 2026: lead performer with featured solo vocal segments in The Phantom of the Opera (2024), La La Land (2025), and High School Musical (2026).', 'Worked with directors and cast members on script refinement, vocal training, and stage rehearsals.', 'Skills: stable live-stage vocal delivery, expressive musical interpretation, original melody writing, and independent music arrangement.']}
];
type Project=typeof projects[number];
function ProjectCard({project:p,onOpen}:{project:Project,onOpen:(p:Project)=>void}){
 const filmId=p.id==='community'?'community':'music';
 return <div className={`project-stage video-stage ${p.id==='music'?'music-stage':''}`} id={`project-${p.id}`}>
  <article className="project-card">
   <div className="project-header"><span className="project-number">{p.n}</span><div className="project-title"><span className="micro">{p.category}</span><h3>{p.name}</h3></div><button className="outline-button" onClick={()=>onOpen(p)}>EXPLORE PROJECT <ArrowUpRight size={18}/></button></div>
   <div className={`project-media project-media--${p.id}`}>
    <ProjectVideo projectId={filmId}/>
    <div className={`project-images ${p.id==='music'?'music-images':'community-images'}`}>
     <div className="project-left"><Slot id={p.id+'-01'}/><Slot id={p.id+'-02'}/></div>
     <Slot id={p.id+'-main'} className="project-main"/>
    </div>
   </div>
   <div className="project-foot"><span>{p.subtitle}</span><span>{p.year}</span></div>
  </article>
 </div>;
}
function ProjectDialog({project:p,onClose}:{project:Project|null,onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  const dialog=ref.current;
  if(p){document.querySelectorAll('video').forEach(video=>video.pause());dialog?.showModal();document.body.style.overflow='hidden'}
  else{dialog?.close();document.body.style.overflow=''}
  return()=>{document.body.style.overflow=''};
 },[p]);
 return <dialog ref={ref} className="project-dialog" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>{p&&<div>
  <button className="close-dialog" aria-label="Close project" onClick={onClose}><X/></button>
  <span className="micro">{p.category} · {p.year}</span><h2>{p.name}</h2><p className="dialog-subtitle">{p.subtitle}</p>
  <ProjectVideo key={p.id} projectId={p.id==='community'?'community':'music'}/>
  <p>{p.copy}</p><div className="dialog-role">{p.role}</div><ul>{p.details.map(d=><li key={d}>{d}</li>)}</ul><Slot id={p.id+'-main'}/>
 </div>}</dialog>;
}
function App(){const [selected,setSelected]=useState<Project|null>(null);return <><a className="skip-link" href="#about">Skip to content</a><main><Hero/><Marquee/><About/><Explorations/><section className="projects" id="projects"><div className="section-meta"><span>04 / SELECTED PROJECTS</span><span>IDEAS MADE PERSONAL</span></div><Reveal><h2 className="gradient">SELECTED WORK</h2></Reveal>{projects.map(p=><ProjectCard key={p.id} project={p} onOpen={setSelected}/>)}</section><footer id="contact"><div className="section-meta"><span>05 / START A CONVERSATION</span><a href="#top">BACK TO TOP ↑</a></div><h2 className="gradient">LET’S CONNECT<span>↗</span></h2><div className="footer-bottom"><a className="email" href={`mailto:${email}`}>{email}<ArrowUpRight size={23}/></a><p>FANGHAN LIU<br/><span>RESEARCH. MUSIC. COMMUNITY.</span></p></div></footer></main><ProjectDialog project={selected} onClose={()=>setSelected(null)}/></>}
createRoot(document.getElementById('root')!).render(<React.StrictMode><PhotoProvider><App/></PhotoProvider></React.StrictMode>);





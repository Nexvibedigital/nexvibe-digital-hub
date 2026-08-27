import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, GraduationCap, Network, TerminalSquare, Code2 } from 'lucide-react';
import { PageHero } from '../components/Common';
import { learningTracks } from '../data/learning';
import { roadmaps } from '../data/manual';
import { listProgress, setProgress } from '../lib/account';
import Seo from '../components/Seo';

const icons:Record<string,any>={'linux-foundations':TerminalSquare,'networking-academy':Network,'python-cyber':Code2};

export default function Learning({roadmapOnly=false}:{roadmapOnly?:boolean}){
  const [trackId,setTrackId]=useState(learningTracks[0].id); const [done,setDone]=useState<Set<string>>(new Set()); const [answers,setAnswers]=useState<Record<string,number>>({}); const [msg,setMsg]=useState('');
  const track=learningTracks.find(x=>x.id===trackId)!;
  useEffect(()=>{let alive=true;listProgress(trackId).then(rows=>{if(alive)setDone(new Set(rows.filter(x=>x.completed).map(x=>x.step_id)))});return()=>{alive=false}},[trackId]);
  const pct=Math.round(done.size/track.lessons.length*100);
  async function toggle(stepId:string){const completed=!done.has(stepId);const next=new Set(done);completed?next.add(stepId):next.delete(stepId);setDone(next);const r=await setProgress(trackId,stepId,completed);setMsg(r.ok?(completed?'Lesson marked complete.':'Lesson reopened.'):`Could not sync progress: ${r.error}`)}
  const totalLessons=useMemo(()=>learningTracks.reduce((n,t)=>n+t.lessons.length,0),[]);
  if(roadmapOnly)return <><Seo title="Cybersecurity Roadmaps" description="Structured cybersecurity and digital learning roadmaps from NexVibe." path="/roadmaps"/><PageHero eyebrow="Roadmaps" title="Choose a clear learning path" lead="Roadmaps organise the skills to learn next. Use the Learning Centre for interactive lessons and quizzes."/><section className="nv-section-compact"><div className="nv-container nv-grid-2">{roadmaps.map(r=><article id={r.id} key={r.id} className="nv-card nv-premium-card" style={{padding:22,scrollMarginTop:100}}><span className="nv-chip">Roadmap</span><h2>{r.title}</h2><ol className="nv-muted">{r.steps.map(s=><li key={s}>{s}</li>)}</ol></article>)}</div></section></>;
  return <><Seo title="Learning Centre" description={`Interactive Linux, networking and Python cybersecurity lessons with quizzes and progress tracking. ${totalLessons} lessons available.`} path="/learn"/><PageHero eyebrow="Learning Centre" title="Learn cybersecurity step by step" lead="Linux, networking and Python foundations with short lessons, quizzes and progress that syncs to your NexVibe account when you are signed in."/>
    <section className="nv-section-compact"><div className="nv-container">
      <div className="nv-learning-tabs">{learningTracks.map(t=>{const Icon=icons[t.id]||GraduationCap;return <button key={t.id} className={`nv-learning-tab ${t.id===trackId?'active':''}`} onClick={()=>setTrackId(t.id)}><Icon size={18}/><span><strong>{t.title}</strong><small>{t.level}</small></span></button>})}</div>
      <div className="nv-card nv-learning-progress"><div><span className="nv-eyebrow">Current track</span><h2>{track.title}</h2><p className="nv-muted">{track.description}</p></div><div className="nv-progress-ring"><strong>{pct}%</strong><span>{done.size}/{track.lessons.length} lessons</span></div><div className="nv-progress"><span style={{width:`${pct}%`}}/></div>{msg&&<small className="nv-muted">{msg}</small>}</div>
      <div className="nv-learning-list">{track.lessons.map((lesson,index)=>{
        const completed=done.has(lesson.id); const q=lesson.quiz[0]; const selected=answers[lesson.id]; const correct=selected===q.answer;
        return <article key={lesson.id} className="nv-card nv-lesson-card"><div className="nv-lesson-head"><button className="nv-icon-button" onClick={()=>toggle(lesson.id)} aria-label={completed?'Mark incomplete':'Mark complete'}>{completed?<CheckCircle2/>:<Circle/>}</button><div><span className="nv-chip">Lesson {index+1} • {lesson.minutes} min</span><h2>{lesson.title}</h2><p>{lesson.summary}</p></div></div><div className="nv-grid-2"><div><h3>Objectives</h3><ul className="nv-muted">{lesson.objectives.map(x=><li key={x}>{x}</li>)}</ul>{lesson.commands?.length?<><h3>Commands to recognise</h3><div className="nv-command-grid">{lesson.commands.map(c=><code key={c}>{c}</code>)}</div></>:null}</div><div className="nv-quiz"><span className="nv-eyebrow">Quick quiz</span><h3>{q.question}</h3><div className="nv-quiz-options">{q.options.map((o,i)=><button key={o} className={`${selected===i?'selected':''} ${selected!==undefined&&i===q.answer?'correct':''}`} onClick={()=>setAnswers(a=>({...a,[lesson.id]:i}))}>{o}</button>)}</div>{selected!==undefined&&<p className={correct?'nv-status-low':'nv-status-warn'}>{correct?'Correct. ':'Review this one. '}{q.explanation}</p>}</div></div></article>
      })}</div>
    </div></section>
  </>
}

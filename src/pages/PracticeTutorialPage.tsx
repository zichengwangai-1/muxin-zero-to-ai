import { useState } from 'react';
import { ArrowLeft, Check, Copy, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getPracticeModule } from '../data/practice-content';
import { getPracticeTutorial, type PracticeTutorial } from '../data/practice-tutorials';
import { getManagedEntry } from '../data/managed-content';
import { ManagedContentDetail } from '../components/ManagedPracticeContent';

function TutorialContent({ tutorial }: { tutorial: PracticeTutorial }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  async function copy() {
    try { await navigator.clipboard.writeText(tutorial.prompt); setStatus('copied'); }
    catch { setStatus('error'); }
  }
  return <>
    <header className="aipm-reading__header">
      <div className="aipm-reading__crumb">{tutorial.level}<span>/</span>{tutorial.tools.join(' · ')}</div>
      <h1>{tutorial.title}</h1>
      <p>{tutorial.summary}</p>
      <div className="tutorial-meta"><span>来源日期：<time dateTime={tutorial.date}>{tutorial.date}</time></span><span>中文改编 · 尚未实测</span></div>
    </header>
    <section className="aipm-conclusion-card"><span>你将做出什么</span><p>{tutorial.result}</p></section>
    <nav className="tutorial-nav" aria-label="教程目录">
      <a href="#prepare">准备材料</a><a href="#prompt">复制 Prompt</a><a href="#steps">操作步骤</a><a href="#checks">检查结果</a><a href="#source">原文与效果</a>
    </nav>
    <section className="tutorial-section" id="prepare"><h2>1. 准备材料</h2><ul>{tutorial.prepare.map(text => <li key={text}>{text}</li>)}</ul></section>
    <section className="tutorial-section prompt-card" id="prompt">
      <h2>2. 复制完整 Prompt</h2><p>来源：{tutorial.promptOrigin}。先准备材料，再替换提示词中的个人信息或链接，发送给对应工具。</p>
      <div className="prompt-code"><div className="prompt-code__toolbar"><button className="prompt-copy" type="button" onClick={copy} aria-label="复制完整 Prompt">{status === 'copied' ? <Check size={16} /> : <Copy size={16} />}{status === 'copied' ? '已复制' : '复制 Prompt'}</button></div>
        <pre tabIndex={0}>{tutorial.prompt}</pre>
        <span className="prompt-feedback" role="status">{status === 'copied' ? '已复制完整 Prompt，可粘贴到 AI 中。' : status === 'error' ? '复制未成功，请手动选择提示词正文复制。' : ''}</span>
      </div>
    </section>
    <section className="tutorial-section" id="steps"><h2>3. 按步骤完成</h2><ol className="tutorial-steps">{tutorial.steps.map((text, index) => <li key={text}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{text}</p></li>)}</ol></section>
    <section className="tutorial-section" id="checks"><h2>4. 检查结果</h2><ul>{tutorial.checks.map(text => <li key={text}>{text}</li>)}</ul><p className="tutorial-note">遇到问题时，把操作、预期结果、实际结果和报错截图一起发给 AI，要求复现后做最小修复，再重复同一操作检查。</p></section>
    <section className="tutorial-section tutorial-source" id="source"><h2>原文、效果与验证状态</h2><p>{tutorial.author} · <time dateTime={tutorial.date}>{tutorial.date}</time></p><p>{tutorial.limits}</p><p>{tutorial.preview}</p>
      <div className="tutorial-source__links"><a href={tutorial.source} target="_blank" rel="noreferrer">阅读原教程与配图 <ExternalLink size={15} /></a>{tutorial.demo && <a href={tutorial.demo} target="_blank" rel="noreferrer">查看原作者试玩（未验证） <ExternalLink size={15} /></a>}</div>
    </section>
  </>;
}

export function PracticeTutorialPage() {
  const { moduleId, tutorialId } = useParams();
  const module = getPracticeModule(moduleId);
  const tutorial = getPracticeTutorial(moduleId, tutorialId);
  const managed = getManagedEntry(moduleId, tutorialId);
  if (module && managed) return <main className="aipm-reading"><article className="aipm-reading__article section-shell tutorial-reading"><Link className="aipm-back-link" to={`/practice/${module.id}`}><ArrowLeft size={16} />返回{module.name}</Link><ManagedContentDetail key={managed.id} entry={managed} /></article></main>;
  if (!module || !tutorial) return <main className="aipm-empty section-shell"><h1>没有找到这篇教程</h1><p>返回教学区选择已有教程。</p><Link className="button button--primary" to="/practice">返回 AI 实战教学区</Link></main>;
  return <main className="aipm-reading"><article className="aipm-reading__article section-shell tutorial-reading"><Link className="aipm-back-link" to={`/practice/${module.id}`}><ArrowLeft size={16} />返回{module.name}</Link><TutorialContent key={tutorial.id} tutorial={tutorial} /></article></main>;
}

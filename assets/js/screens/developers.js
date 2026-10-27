/* ==========================================================================
   elan1 developer portal — owner: developers (layout 'doc')
   Routes: /developers … (see ROUTES.md, DEVELOPERS). One file, one IIFE.
   Sources: research/spec-tm.md §1–3 (primary), spec-phase1-console.md §1.4–1.14 + F13,
   spec-phase2-3-evidence.md §1.2–1.5, §1.14–1.15, §2.7, spec-atlas.md Fig 1–8, 13–15, 21, 24–25,
   spec-phase4-group.md §1.8, §1.14.
   Code on these pages is illustrative where the TM marks a surface "build recommendation"; it is labelled so.
   ========================================================================== */
(function () {
  'use strict';
  var E1 = window.E1, c = E1.c, esc = E1.esc;

  /* ------------------------------------------------------------------------
     Local styles (tokens only; prefix dv-). Injected once.
     ------------------------------------------------------------------------ */
  var CSS = [
    '.e1-doc__article:has(> .dv){max-width:none}',
    '.dv{max-width:880px;min-width:0}',
    '.dv p,.dv li{max-width:72ch}',
    '.dv .dv-wide p,.dv .dv-wide li,.dv td p{max-width:none}',
    '.dv h2{scroll-margin-top:80px}',
    '.dv > h2,.dv .dv-h2{font:var(--weight-bold) var(--text-title)/var(--lh-title) var(--font-display);letter-spacing:var(--tracking-title);margin:48px 0 12px;padding-top:24px;border-top:1px solid var(--border-subtle)}',
    '.dv > h3,.dv .dv-h3{font:var(--weight-semibold) var(--text-section)/var(--lh-section) var(--font-display);margin:28px 0 8px}',
    '.dv > p + p{margin-top:12px}',
    '.dv > ul,.dv > ol{padding-left:1.25em;margin:12px 0}',
    '.dv > * + .e1-code,.dv > * + .dv-tabs,.dv > * + .e1-table-wrap,.dv > * + .e1-callout,.dv > * + .dv-grid,.dv > * + .e1-card,.dv > * + .e1-locked,.dv > * + .dv-block{margin-top:16px}',
    '.dv-hero{padding-bottom:8px}',
    '.dv-hero h1{font:var(--weight-bold) var(--text-display)/var(--lh-display) var(--font-display);letter-spacing:var(--tracking-display);margin:6px 0 12px;max-width:22ch}',
    '.dv-hero .dv-lead{font-size:var(--text-lead);line-height:var(--lh-lead);font-weight:var(--weight-light);color:var(--text-secondary);max-width:64ch}',
    '.dv-hero__meta{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px}',
    '.dv-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px;align-items:center}',
    '.dv-pill{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 8px;border:1px solid var(--border-subtle);border-radius:var(--radius-full);font-size:var(--text-caption);color:var(--text-secondary);background:var(--bg-surface);white-space:nowrap}',
    '.dv-pill .e1-mono{font-size:12px;color:var(--text-primary)}',
    '.dv-quote{margin:24px 0 0;padding:18px 20px;border-left:3px solid var(--brand-clay);background:var(--bg-surface);border-radius:0 var(--radius-md) var(--radius-md) 0;font:var(--weight-semibold) 19px/1.45 var(--font-display);color:var(--text-primary);max-width:none}',
    '.dv-quote small{display:block;margin-top:6px;font:var(--weight-regular) var(--text-caption)/1.4 var(--font-ui);color:var(--text-secondary)}',
    '.dv-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}',
    '.dv-grid--2{grid-template-columns:repeat(2,minmax(0,1fr))}',
    '.dv-grid--3{grid-template-columns:repeat(3,minmax(0,1fr))}',
    '@media (max-width:900px){.dv-grid--2,.dv-grid--3{grid-template-columns:minmax(0,1fr)}}',
    '.dv-card{display:flex;flex-direction:column;gap:8px;padding:16px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);min-width:0;color:var(--text-primary);text-decoration:none}',
    'a.dv-card:hover{border-color:var(--border-strong)}',
    'a.dv-card:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:2px}',
    '.dv-card__top{display:flex;align-items:center;justify-content:space-between;gap:8px}',
    '.dv-card__t{font:var(--weight-semibold) var(--text-section)/1.3 var(--font-display)}',
    '.dv-card__d{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
    '.dv-card__f{margin-top:auto;padding-top:6px;font-size:var(--text-caption);color:var(--text-tertiary);display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
    '.dv-ic{display:inline-grid;place-items:center;width:32px;height:32px;border-radius:var(--radius-sm);background:var(--bg-sunken);color:var(--text-primary);border:1px solid var(--border-subtle)}',
    '.dv-tabs{border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;background:var(--bg-sunken);min-width:0}',
    '.dv-tabs__bar{display:flex;align-items:stretch;gap:2px;padding:0 8px;border-bottom:1px solid var(--border-subtle);background:var(--bg-surface);overflow-x:auto}',
    '.dv-tab{appearance:none;border:0;background:none;padding:10px 10px 9px;font:var(--weight-medium) var(--text-caption)/1 var(--font-ui);color:var(--text-secondary);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap}',
    '.dv-tab:hover{color:var(--text-primary)}',
    '.dv-tab.is-on{color:var(--text-primary);border-bottom-color:var(--brand-clay)}',
    '.dv-tab:focus-visible{outline:var(--focus-width) solid var(--focus-ring);outline-offset:-2px}',
    '.dv-tabs__note{margin-left:auto;align-self:center;font-size:var(--text-micro);color:var(--text-tertiary);padding-left:12px;white-space:nowrap}',
    '.dv-tabs > [role=tabpanel] > .e1-code,.dv-tabs > [role=tabpanel] > .e1-json{border:0;border-radius:0}',
    '.dv-tabs > [role=tabpanel] > .dv-pad{padding:14px 16px;background:var(--bg-surface)}',
    '.dv-http{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 12px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);font-family:var(--font-mono);font-size:13px}',
    '.dv-method{display:inline-flex;align-items:center;height:22px;padding:0 7px;border-radius:var(--radius-sm);font:var(--weight-semibold) 11px/1 var(--font-mono);letter-spacing:.04em;background:var(--bg-sunken);border:1px solid var(--border-default);color:var(--text-primary)}',
    '.dv-method--post{border-color:var(--brand-clay);color:var(--text-accent)}',
    '.dv-params{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);overflow:hidden}',
    '.dv-params__h{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid var(--border-subtle);background:var(--bg-sunken)}',
    '.dv-param{display:grid;grid-template-columns:minmax(150px,220px) minmax(0,1fr);gap:4px 16px;padding:12px 14px;border-top:1px solid var(--border-subtle)}',
    '.dv-param:first-of-type{border-top:0}',
    '.dv-param__n{font-family:var(--font-mono);font-size:13px;font-weight:var(--weight-semibold);word-break:break-word}',
    '.dv-param__t{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:4px;font-size:var(--text-micro);color:var(--text-tertiary);font-family:var(--font-mono)}',
    '.dv-param__d{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
    '.dv-param__d strong{color:var(--text-primary);font-weight:var(--weight-medium)}',
    '.dv-req{font:var(--weight-semibold) 10px/1 var(--font-ui);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-accent)}',
    '@media (max-width:640px){.dv-param{grid-template-columns:minmax(0,1fr)}}',
    '.dv-steps{list-style:none;margin:16px 0 0;padding:0;counter-reset:dvs}',
    '.dv-steps > li{position:relative;padding:0 0 28px 48px;counter-increment:dvs;max-width:none}',
    '.dv-steps > li::before{content:counter(dvs);position:absolute;left:0;top:0;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font:var(--weight-semibold) 13px/1 var(--font-mono);background:var(--bg-surface);border:1px solid var(--border-strong);color:var(--text-primary)}',
    '.dv-steps > li::after{content:"";position:absolute;left:15px;top:34px;bottom:4px;width:1px;background:var(--border-subtle)}',
    '.dv-steps > li:last-child::after{display:none}',
    '.dv-steps h2,.dv-steps h3{margin:3px 0 6px!important;padding:0!important;border:0!important;font:var(--weight-bold) var(--text-section)/1.35 var(--font-display)!important}',
    '.dv-steps p{margin-bottom:10px}',
    '.dv-steps .e1-code,.dv-steps .dv-tabs,.dv-steps .e1-callout{margin-top:10px}',
    '.dv-block{min-width:0}',
    '.dv-note{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary);margin-top:8px}',
    '.dv-tag{display:inline-flex;align-items:center;height:20px;padding:0 6px;border-radius:var(--radius-sm);font:var(--weight-semibold) 10px/1 var(--font-ui);letter-spacing:var(--tracking-label);text-transform:uppercase;border:1px solid var(--border-default);color:var(--text-secondary);background:var(--bg-surface);white-space:nowrap}',
    '.dv-tag--dash{border-style:dashed}',
    '.dv-tag--accent{border-color:var(--brand-clay);color:var(--text-accent)}',
    '.dv-mono{font-family:var(--font-mono);font-size:.92em}',
    '.dv-strip{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;background:var(--border-subtle);gap:1px}',
    '.dv-strip a{display:flex;flex-direction:column;gap:4px;padding:12px;background:var(--bg-surface);text-decoration:none;color:var(--text-primary);min-width:0}',
    '.dv-strip a:hover{background:var(--bg-hover)}',
    '.dv-strip b{font:var(--weight-semibold) 14px/1.2 var(--font-mono)}',
    '.dv-strip span{font-size:var(--text-micro);line-height:1.35;color:var(--text-secondary)}',
    '.dv-strip a.is-muted b{color:var(--text-tertiary)}',
    '@media (max-width:900px){.dv-strip{grid-template-columns:repeat(3,minmax(0,1fr))}}',
    '@media (max-width:480px){.dv-strip{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '.dv-ladder{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
    '.dv-rung{display:grid;grid-template-columns:52px minmax(0,1fr) auto;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);transition:border-color var(--dur-fast),box-shadow var(--dur-fast)}',
    '.dv-rung__n{font:var(--weight-bold) 13px/1 var(--font-mono);display:grid;place-items:center;height:30px;border-radius:var(--radius-sm);background:var(--bg-sunken);border:1px solid var(--border-subtle)}',
    '.dv-rung__name{font:var(--weight-semibold) 13px/1.3 var(--font-mono);letter-spacing:.02em}',
    '.dv-rung__rule{font-size:var(--text-caption);color:var(--text-secondary);line-height:1.4}',
    '.dv-rung__st{display:inline-flex;align-items:center;gap:6px;font-size:var(--text-caption);font-weight:var(--weight-medium);white-space:nowrap}',
    '.dv-rung.is-current{border-color:var(--brand-clay);box-shadow:0 0 0 1px var(--brand-clay)}',
    '.dv-rung.is-skipped{opacity:.62}',
    '.dv-rung.is-zero .dv-rung__n{border-style:dashed}',
    '.dv-rp{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:16px;align-items:start}',
    '@media (max-width:1100px){.dv-rp{grid-template-columns:minmax(0,1fr)}}',
    '.dv-rp__panel{position:sticky;top:76px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);padding:16px;display:flex;flex-direction:column;gap:12px}',
    '.dv-rp__ctl{display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
    '.dv-kvs{display:grid;grid-template-columns:auto minmax(0,1fr);gap:6px 14px;font-size:var(--text-caption);margin:0}',
    '.dv-kvs dt{color:var(--text-tertiary)}',
    '.dv-kvs dd{margin:0;color:var(--text-primary);min-width:0;word-break:break-word}',
    '.dv-diagram{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);overflow:hidden}',
    '.dv-diagram__bar{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:8px 12px;border-bottom:1px solid var(--border-subtle)}',
    '.dv-diagram__stage{padding:12px;background:var(--bg-canvas);overflow-x:auto}',
    '.dv-diagram svg{display:block;width:100%;height:auto;min-width:720px}',
    '.dv-diagram text{font-family:var(--font-ui);fill:var(--text-primary)}',
    '.dv-diagram .t-sub{fill:var(--text-secondary);font-size:10px}',
    '.dv-diagram .t-lab{font-size:9.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}',
    '.dv-diagram .t-mono{font-family:var(--font-mono)}',
    '.dv-node{cursor:pointer;outline:none}',
    '.dv-node rect.box{stroke-width:1.5}',
    '.dv-node:hover rect.box,.dv-node:focus-visible rect.box{stroke-width:2.5}',
    '.dv-node:focus-visible rect.ring{stroke:var(--focus-ring);stroke-width:2.5;fill:none}',
    '.dv-node.is-on rect.box{stroke-width:3}',
    '.dv-edge{fill:none;stroke:var(--text-tertiary);stroke-width:1.4}',
    '.dv-edge--dash{stroke-dasharray:6 4}',
    '.dv-edge--adv{stroke:var(--zone-runtime);stroke-dasharray:8 3 2 3}',
    '.dv-edge--strong{stroke:var(--text-primary);stroke-width:1.6}',
    '.dv-elabel{font-size:10px;fill:var(--text-secondary)}',
    '.dv-legend{display:flex;flex-wrap:wrap;gap:6px 16px;padding:10px 12px;border-top:1px solid var(--border-subtle);font-size:var(--text-micro);color:var(--text-secondary)}',
    '.dv-legend span{display:inline-flex;align-items:center;gap:6px}',
    '.dv-sw{width:14px;height:10px;border-radius:2px;border:1.5px solid var(--z);background:var(--zb)}',
    '.dv-ln{width:22px;height:0;border-top:1.6px solid var(--text-tertiary)}',
    '.dv-ln--dash{border-top-style:dashed}',
    '.dv-ln--adv{border-top:1.6px dashed var(--zone-runtime)}',
    '.dv-term{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-sunken);font:12.5px/1.6 var(--font-mono);padding:12px 14px;white-space:pre-wrap;word-break:break-word;color:var(--text-primary);margin:0}',
    '.dv-exit{display:inline-grid;place-items:center;min-width:26px;height:22px;padding:0 6px;border-radius:var(--radius-sm);font:var(--weight-bold) 12px/1 var(--font-mono);background:var(--bg-sunken);border:1px solid var(--border-default)}',
    '.dv-pager{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:56px;padding-top:24px;border-top:1px solid var(--border-subtle)}',
    '.dv-pager a{display:flex;flex-direction:column;gap:2px;padding:12px 14px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);text-decoration:none;color:var(--text-primary);background:var(--bg-surface)}',
    '.dv-pager a:hover{border-color:var(--border-strong)}',
    '.dv-pager a.is-next{text-align:right;grid-column:2}',
    '.dv-pager small{font-size:var(--text-micro);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:var(--tracking-label)}',
    '.dv-foot{margin-top:20px;font-size:var(--text-micro);color:var(--text-tertiary);display:flex;flex-wrap:wrap;gap:6px 16px}',
    '.dv-mnav{display:none;margin:0 0 20px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface)}',
    '.dv-mnav summary{padding:12px 14px;cursor:pointer;font-weight:var(--weight-medium);min-height:44px;display:flex;align-items:center;gap:8px}',
    '.dv-mnav__body{padding:0 14px 12px;display:grid;gap:12px}',
    '.dv-mnav__body a{display:block;padding:6px 0;min-height:32px}',
    '@media (max-width:800px){.dv-mnav{display:block}.e1-docnav:has(a[href^="#/developers"]){display:none}.dv-hero h1{font-size:30px;line-height:36px}.dv-pager{grid-template-columns:1fr}.dv-pager a.is-next{grid-column:1}}',
    '.e1-docnav a[href^="#/developers/kernelport/"],.e1-docnav a[href^="#/developers/refusals/"]{padding-left:26px;font-family:var(--font-mono);font-size:12.5px}',
    '.dv-sep{height:1px;background:var(--border-subtle);margin:24px 0}',
    '.dv-inline-form{display:grid;gap:14px;max-width:560px}',
    '.dv-keybox{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:14px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);background:var(--bg-sunken);font:var(--weight-semibold) 15px/1.3 var(--font-mono);word-break:break-all}',
    '.dv-drop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:24px;border:1.5px dashed var(--border-strong);border-radius:var(--radius-md);background:var(--bg-surface);text-align:center}',
    '.dv-drop.is-over{border-color:var(--brand-clay);background:var(--bg-selected)}',
    '.dv-hexrow{display:grid;grid-template-columns:44px 170px 64px minmax(0,1fr);gap:10px;padding:6px 10px;border-top:1px solid var(--border-subtle);font:12px/1.5 var(--font-mono);align-items:baseline}',
    '.dv-hexrow:first-child{border-top:0}',
    '.dv-hexrow .h{color:var(--text-tertiary)}',
    '.dv-hexrow .v{word-break:break-all;color:var(--text-secondary)}',
    '@media (max-width:640px){.dv-hexrow{grid-template-columns:40px minmax(0,1fr) 54px}.dv-hexrow .v{grid-column:1 / -1}}',
    '.dv-pipe{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;align-items:stretch}',
    '.dv-pipe li{list-style:none;display:flex;flex-direction:column;gap:4px;padding:10px;border:1.5px solid var(--zone-kernel);background:var(--zone-kernel-bg);border-radius:var(--radius-sm);font-size:var(--text-micro);line-height:1.35;color:var(--text-secondary)}',
    '.dv-pipe li b{font:var(--weight-bold) 11px/1.2 var(--font-mono);color:var(--text-primary);letter-spacing:.04em}',
    '.dv-pipe li.is-l2{border-style:dashed;background:var(--bg-surface)}',
    '.dv-pipe li.is-stop{position:relative}',
    '.dv-pipe li.is-stop::after{content:"Level 1 stops here";position:absolute;right:-8px;top:-22px;transform:translateX(50%);font:var(--weight-semibold) 10px/1 var(--font-ui);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-accent);white-space:nowrap}',
    '.dv-pipe li.is-stop{border-right-width:4px;border-right-color:var(--brand-clay)}',
    '@media (max-width:900px){.dv-pipe{grid-template-columns:repeat(2,minmax(0,1fr))}.dv-pipe li.is-stop::after{right:auto;left:10px;top:auto;bottom:-18px;transform:none}}',
    '.dv-cols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}',
    '@media (max-width:900px){.dv-cols{grid-template-columns:minmax(0,1fr)}}',
    '.dv-cols > div{border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:14px;background:var(--bg-surface)}',
    '.dv-cols h4{font:var(--weight-semibold) var(--text-caption)/1.3 var(--font-ui);text-transform:uppercase;letter-spacing:var(--tracking-label);color:var(--text-secondary);margin:0 0 8px}',
    '.dv-cols ul{margin:0;padding-left:1.1em;font-size:var(--text-caption);line-height:1.5}',
    '.dv-toolbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;margin:16px 0 12px}',
    '.dv-toolbar > .e1-seg{max-width:100%;overflow-x:auto}',
    '@media (min-width:1181px){.e1-doc__body:has([data-dv-diagram]){grid-template-columns:248px minmax(0,1fr)}.e1-doc__body:has([data-dv-diagram]) .e1-doc__toc{display:none}}',
    '.dv:has([data-dv-diagram]){max-width:1120px}',
    '.dv-rung{padding:8px 12px;grid-template-columns:44px minmax(0,1fr) auto}',
    '.dv-rung__n{height:26px}',
    '.dv-rung__rule{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.dv-rung.is-current .dv-rung__rule{white-space:normal}',
    '.dv-rp__panel h3{margin:2px 0 6px!important}',
    '.dv-rp__panel .dv-kvs{margin:4px 0}',
    '.dv-hero h1{overflow-wrap:break-word}',
    '.dv-hero h1.is-code{max-width:none;font-size:clamp(24px,3.2vw,40px);line-height:1.15;overflow-wrap:anywhere}',
    '.dv pre code{padding:0;background:none;border-radius:0}',
    /* v2 — the elan1 console family look for the developer docs: ink top bar, compact page header,
       square mono meta chips, console-style section heads and nav selection. Scoped to pages that render .dv. */
    '.e1-app--doc:has(.dv) .e1-doc__head{height:48px;padding:0 16px;gap:12px;background:var(--bg-chrome);border-bottom:1px solid var(--border-chrome);color:var(--text-on-chrome)}',
    '.e1-app--doc:has(.dv) .e1-doc__head .e1-logo--onlight{display:none!important}',
    '.e1-app--doc:has(.dv) .e1-doc__head .e1-logo--ondark{display:block!important}',
    '.e1-app--doc:has(.dv) .e1-doc__head .e1-logo img{height:26px;width:auto}',
    '.e1-app--doc:has(.dv) .e1-doc__brandsep{border-left-color:var(--border-chrome);color:var(--text-on-chrome-strong);font:var(--weight-semibold) var(--text-body)/1 var(--font-ui)}',
    '.e1-app--doc:has(.dv) .e1-doc__search{height:32px;background:var(--bg-chrome-hover);border-color:var(--border-chrome);color:var(--text-on-chrome-quiet)}',
    '.e1-app--doc:has(.dv) .e1-doc__search:hover{color:var(--text-on-chrome)}',
    '.e1-app--doc:has(.dv) .e1-doc__search .e1-kbd{background:transparent;border-color:var(--border-chrome);color:var(--text-on-chrome-quiet)}',
    '.e1-app--doc:has(.dv) .e1-doc__head .e1-iconbtn{color:var(--text-on-chrome)}',
    '.e1-app--doc:has(.dv) .e1-doc__head .e1-iconbtn:hover{background:var(--bg-chrome-hover);color:var(--text-on-chrome-strong)}',
    '.e1-app--doc:has(.dv) .e1-docnav,.e1-app--doc:has(.dv) .e1-doc__toc{top:48px}',
    '.e1-app--doc:has(.dv) .e1-docnav{height:calc(100vh - 48px);background:var(--bg-surface);padding:20px 12px}',
    '.e1-app--doc:has(.dv) .e1-doc__main{padding:24px 40px 96px}',
    '.e1-app--doc:has(.dv) .e1-doc__toc{padding:28px 16px}',
    '.e1-app--doc:has(.dv) .e1-crumbs{margin-bottom:14px}',
    '.dv-hero{padding-bottom:8px}',
    '.dv-hero .e1-eyebrow{margin:0 0 6px}',
    '.dv-hero h1{font:var(--weight-title) var(--text-page-title)/var(--lh-page-title) var(--font-display);letter-spacing:var(--tracking-title);margin:0 0 8px;max-width:40ch}',
    '.dv-hero h1.is-code{font-size:var(--text-page-title);line-height:var(--lh-page-title)}',
    '.dv-hero .dv-lead{font-size:var(--text-lead);line-height:var(--lh-lead);font-weight:var(--weight-regular);color:var(--text-secondary);max-width:70ch;margin:0}',
    '.dv-hero__meta{gap:6px;margin-top:12px}',
    '.dv-actions{margin-top:16px}',
    '.dv-pill{height:auto;min-height:22px;padding:2px 7px;border-color:var(--border-default);border-radius:var(--radius-sm);background:var(--bg-surface);font:var(--weight-medium) 11px/1.35 var(--font-mono);letter-spacing:.02em;text-transform:uppercase;white-space:normal;max-width:100%;overflow-wrap:anywhere;flex-wrap:wrap}',
    '.dv-pill .e1-mono{font-size:11px;text-transform:none;letter-spacing:0}',
    '.dv > h2,.dv .dv-h2{font:var(--weight-title) 20px/28px var(--font-display);margin:36px 0 10px;padding-top:20px}',
    '.dv > h3,.dv .dv-h3{font:var(--weight-semibold) 16px/24px var(--font-display);margin:22px 0 6px}',
    '.dv-quote{margin:18px 0 0;padding:12px 16px;border:1px solid var(--border-subtle);border-left:3px solid var(--border-accent);border-radius:var(--radius-sm);font:var(--weight-semibold) 16px/1.45 var(--font-display)}',
    '.dv-card{border-radius:var(--radius-sm)}',
    '.dv-card__t{font:var(--weight-semibold) var(--text-body)/1.35 var(--font-ui)}',
    '@media (max-width:800px){.e1-app--doc:has(.dv) .e1-doc__main{padding:16px 16px 64px}.dv-hero h1{font-size:22px;line-height:28px}.e1-app--doc:has(.dv) .e1-doc__search span{display:none}.e1-app--doc:has(.dv) .e1-doc__search{width:auto}}'
  ].join('\n');
  (function () {
    if (document.getElementById('dv-style')) return;
    var s = document.createElement('style'); s.id = 'dv-style'; s.textContent = CSS; document.head.appendChild(s);
  })();

  /* ------------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------------ */
  function hx(seed, n) {
    var h = 2166136261 >>> 0, out = '', s = String(seed), round = 0;
    while (out.length < n) {
      for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
      h ^= (round++ * 2654435761) >>> 0; h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
      out += ('00000000' + h.toString(16)).slice(-8);
    }
    return out.slice(0, n);
  }
  function dg(head, tail, seed) { return head + hx(seed || head + tail, 56) + tail; }
  function uid(seed, head) { var x = (head || '') + hx(seed, 32); x = x.slice(0, 32); return x.slice(0, 8) + '-' + x.slice(8, 12) + '-4' + x.slice(13, 16) + '-a' + x.slice(17, 20) + '-' + x.slice(20, 32); }
  var ZERO_UUID = '00000000-0000-0000-0000-000000000000';
  function J(o) { return JSON.stringify(o, null, 2); }
  function mono(s) { return '<code class="dv-mono">' + esc(s) + '</code>'; }
  function tag(s, mod) { return '<span class="dv-tag' + (mod ? ' dv-tag--' + mod : '') + '">' + esc(s) + '</span>'; }
  function pill(k, v) { return '<span class="dv-pill">' + esc(k) + (v ? ' <span class="e1-mono">' + esc(v) + '</span>' : '') + '</span>'; }
  function h2(id, t) { return '<h2 id="' + esc(id) + '">' + esc(t) + '</h2>'; }
  function h3(id, t) { return '<h3 id="' + esc(id) + '">' + esc(t) + '</h3>'; }
  function p(html) { return '<p>' + html + '</p>'; }
  function a(href, label) { return '<a href="' + esc(href) + '">' + esc(label) + '</a>'; }
  function here() { return '#' + ((window.location.hash || '#/developers').replace(/^#/, '').split('?')[0]); }
  function hero(o) {
    return '<header class="dv-hero">' + (o.eyebrow ? '<p class="e1-eyebrow">' + esc(o.eyebrow) + '</p>' : '') + '<h1' + (o.code ? ' class="is-code"' : '') + '>' + esc(o.title) + '</h1>' +
      (o.lead ? '<p class="dv-lead">' + o.lead + '</p>' : '') + (o.meta ? '<div class="dv-hero__meta">' + o.meta + '</div>' : '') +
      (o.actions ? '<div class="dv-actions">' + o.actions + '</div>' : '') + '</header>';
  }
  function card(o) {
    var inner = '<span class="dv-card__top">' + (o.icon ? '<span class="dv-ic">' + c.icon(o.icon, 16) + '</span>' : '<span class="dv-card__t">' + esc(o.title) + '</span>') + (o.href ? c.icon('arrow-right', 16) : (o.badge || '')) + '</span>' +
      (o.icon ? '<span class="dv-card__t">' + esc(o.title) + '</span>' : '') + '<span class="dv-card__d">' + (o.html || esc(o.body || '')) + '</span>' + (o.foot ? '<span class="dv-card__f">' + o.foot + '</span>' : '');
    return o.href ? '<a class="dv-card" href="' + esc(o.href) + '">' + inner + '</a>' : '<div class="dv-card">' + inner + '</div>';
  }
  /* A parameter list, Stripe style. rows: [{n, t, req, d(html), tags:[]}] */
  function params(title, rows, o) {
    o = o || {};
    return '<div class="dv-params">' + (title ? '<div class="dv-params__h"><span class="e1-label">' + esc(title) + '</span>' + (o.right || '') + '</div>' : '') + rows.map(function (r) {
      return '<div class="dv-param"><div><div class="dv-param__n">' + esc(r.n) + '</div><div class="dv-param__t"><span>' + esc(r.t || '') + '</span>' + (r.req ? '<span class="dv-req">Required</span>' : '') + (r.tags || []).map(function (t) { return tag(t); }).join('') + '</div></div><div class="dv-param__d">' + (r.d || '') + '</div></div>';
    }).join('') + '</div>';
  }
  function http(method, path, note) {
    return '<div class="dv-http"><span class="dv-method' + (method === 'POST' ? ' dv-method--post' : '') + '">' + esc(method) + '</span><span>' + esc(path) + '</span>' + (note ? '<span class="e1-muted" style="margin-left:auto;font-family:var(--font-ui);font-size:var(--text-caption)">' + esc(note) + '</span>' : '') + '</div>';
  }

  /* Tabs: a local tab set; sync:'lang' keeps every language tab set on the page on the same language (persisted). */
  var LANG = { ts: 'TypeScript', py: 'Python', curl: 'curl', http: 'HTTP', json: 'JSON', shell: 'Shell', yaml: 'YAML', mcp: 'MCP (JSON-RPC)' };
  function pref(sync) { return E1.store.get('dev.' + sync, sync === 'lang' ? 'ts' : null); }
  function tabs(items, o) {
    o = o || {};
    var keys = items.map(function (x) { return x.key; }), active = o.active;
    if (o.sync) { var pr = pref(o.sync); if (pr && keys.indexOf(pr) >= 0) active = pr; }
    if (!active || keys.indexOf(active) < 0) active = keys[0];
    var gid = E1.uid('dvt');
    return '<div class="dv-tabs' + (o.cls ? ' ' + o.cls : '') + '" data-dv-tabs>' +
      '<div class="dv-tabs__bar" role="tablist" aria-label="' + esc(o.label || 'Views') + '">' + items.map(function (it) {
        var on = it.key === active;
        return '<button type="button" role="tab" class="dv-tab' + (on ? ' is-on' : '') + '" id="' + gid + '-t-' + esc(it.key) + '" aria-controls="' + gid + '-p-' + esc(it.key) + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-dv-tab="' + esc(it.key) + '"' + (o.sync ? ' data-dv-sync="' + esc(o.sync) + '"' : '') + '>' + esc(it.label) + '</button>';
      }).join('') + (o.note ? '<span class="dv-tabs__note">' + esc(o.note) + '</span>' : '') + '</div>' +
      items.map(function (it) {
        var on = it.key === active;
        return '<div role="tabpanel" id="' + gid + '-p-' + esc(it.key) + '" aria-labelledby="' + gid + '-t-' + esc(it.key) + '" data-dv-panel="' + esc(it.key) + '"' + (on ? '' : ' hidden') + '>' + it.html + '</div>';
      }).join('') + '</div>';
  }
  /* Code in several languages. variants: [{lang, code, title?}] */
  function codeTabs(variants, o) {
    o = o || {};
    if (variants.length === 1) { var v = variants[0]; return c.code(v.code, v.lang, { title: v.title || LANG[v.lang] || v.lang }); }
    return tabs(variants.map(function (v) {
      return { key: v.lang, label: LANG[v.lang] || v.lang, html: c.code(v.code, v.lang === 'py' ? 'python' : v.lang, { title: v.title || LANG[v.lang] }) };
    }), { sync: o.sync === false ? null : 'lang', label: o.label || 'Language', note: o.note, cls: 'dv-tabs--code' });
  }
  function activate(group, key) {
    var tbs = group.querySelectorAll(':scope > .dv-tabs__bar > [data-dv-tab]'), pns = group.querySelectorAll(':scope > [data-dv-panel]');
    var found = false;
    Array.prototype.forEach.call(tbs, function (t) { if (t.getAttribute('data-dv-tab') === key) found = true; });
    if (!found) return false;
    Array.prototype.forEach.call(tbs, function (t) { var on = t.getAttribute('data-dv-tab') === key; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on); t.setAttribute('tabindex', on ? 0 : -1); });
    Array.prototype.forEach.call(pns, function (pn) { if (pn.getAttribute('data-dv-panel') === key) pn.removeAttribute('hidden'); else pn.setAttribute('hidden', ''); });
    return true;
  }
  E1.on('click', '[data-dv-tab]', function (e, el) {
    var key = el.getAttribute('data-dv-tab'), group = el.closest('[data-dv-tabs]'), sync = el.getAttribute('data-dv-sync');
    var top = el.getBoundingClientRect().top;
    activate(group, key);
    if (sync) {
      E1.store.set('dev.' + sync, key);
      Array.prototype.forEach.call(document.querySelectorAll('[data-dv-tabs]'), function (g) {
        if (g !== group && g.querySelector(':scope > .dv-tabs__bar > [data-dv-sync="' + sync + '"]')) activate(g, key);
      });
      var shift = el.getBoundingClientRect().top - top; if (Math.abs(shift) > 1) window.scrollBy(0, shift);
      E1.announce('Code samples switched to ' + (LANG[key] || key));
    }
  });
  E1.on('keydown', '[data-dv-tab]', function (e, el) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    var list = Array.prototype.slice.call(el.parentNode.querySelectorAll('[data-dv-tab]')), i = list.indexOf(el);
    var n = e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length;
    e.preventDefault(); list[n].focus(); list[n].click();
  });

  /* View-states menu for screens with meaningful states. */
  function statesMenu(path, list) {
    return c.menu({ label: 'View states', icon: 'layers', size: 'sm', items: list.map(function (s) { return { label: s[1], href: E1.href(path, s[0] ? { state: s[0] } : null) }; }) });
  }

  /* ------------------------------------------------------------------------
     The developer portal's own left navigation.
     E1.docNav is shared by every doc-layout page; we swap in ours while a
     /developers page renders and put the shared one back on e1:render.
     ------------------------------------------------------------------------ */
  var SHARED_NAV = E1.docNav;
  var CALLS = ['define', 'assert', 'seal', 'verify', 'scope', 'refuse'];
  var VIEWS = [['context', 'Context'], ['components', 'Components'], ['planes', 'Planes P0–P8'], ['write-path', 'Write path'], ['evidence', 'Evidence (L2)'], ['l3', 'Level 3 receipts']];
  function navGroups(path) {
    var inKp = path.indexOf('/developers/kernelport') === 0;
    var m = /^\/developers\/refusals\/([^/?]+)/.exec(path);
    var build = [['KernelPort: six calls', '/developers/kernelport']];
    if (inKp) CALLS.forEach(function (k) { build.push([k, '/developers/kernelport/' + k]); });
    build = build.concat([['MCP server', '/developers/mcp'], ['TypeScript SDK', '/developers/sdk/typescript'], ['Python SDK', '/developers/sdk/python'], ['HTTP API', '/developers/api'], ['Webhooks', '/developers/webhooks']]);
    var ref = [['Refusal register', '/developers/refusals']];
    if (m) ref.push([decodeURIComponent(m[1]), '/developers/refusals/' + m[1]]);
    ref = ref.concat([['Conformance suite', '/developers/conformance'], ['Versioning policy', '/developers/versioning'], ['Changelog', '/developers/changelog']]);
    return [
      { title: 'Get started', items: [['Overview', '/developers'], ['Quickstart', '/developers/quickstart'], ['Get a sandbox key', '/developers/sandbox-key'], ['Request production access', '/developers/production-request']] },
      { title: 'Concepts', items: [['The Right Path', '/developers/right-path'], ['Object model', '/developers/objects'], ['Declarations as code', '/developers/declarations']] },
      { title: 'Build', items: build },
      { title: 'Reference', items: ref },
      { title: 'Evidence specifications', items: [['Seal v6', '/developers/seal'], ['Offline verifier', '/developers/verifier'], ['Action Receipt (draft)', '/developers/receipt']] },
      { title: 'Architecture', items: VIEWS.map(function (v) { return [v[1], '/developers/architecture/' + v[0]]; }) }
    ];
  }
  function useNav(path) {
    E1.docNav = navGroups(path).map(function (g) { return { title: g.title, items: g.items.map(function (it) { return { label: it[0], href: '#' + it[1] }; }) }; });
  }
  document.addEventListener('e1:render', function () { E1.docNav = SHARED_NAV; });

  function flatNav(path) { var out = []; navGroups(path).forEach(function (g) { g.items.forEach(function (it) { out.push({ label: it[0], path: it[1], group: g.title }); }); }); return out; }
  function pager(path) {
    var list = flatNav(path), i = -1;
    list.forEach(function (x, k) { if (x.path === path) i = k; });
    if (i < 0) return '';
    var prev = list[i - 1], next = list[i + 1];
    return '<nav class="dv-pager" aria-label="Previous and next page">' +
      (prev ? '<a href="#' + esc(prev.path) + '"><small>Previous</small><span>' + esc(prev.label) + '</span></a>' : '') +
      (next ? '<a class="is-next" href="#' + esc(next.path) + '"><small>Next</small><span>' + esc(next.label) + '</span></a>' : '') + '</nav>';
  }
  function mobileNav(path) {
    return '<details class="dv-mnav"><summary>' + c.icon('menu', 16) + 'Browse the developer docs</summary><div class="dv-mnav__body">' + navGroups(path).map(function (g) {
      return '<div><p class="e1-label">' + esc(g.title) + '</p>' + g.items.map(function (it) { return '<a href="#' + esc(it[1]) + '"' + (it[1] === path ? ' aria-current="page"' : '') + '>' + esc(it[0]) + '</a>'; }).join('') + '</div>';
    }).join('') + '</div></details>';
  }
  function wrap(path, html, o) {
    o = o || {};
    return '<div class="dv">' + mobileNav(path) + html + (o.pager === false ? '' : pager(path)) +
      '<p class="dv-foot"><span>KernelPort v1 · refusal register v1 · pre-GA</span><span>Reviewed 24 Sep 2026</span><span>Code marked “illustrative” follows a TM build recommendation and may change before GA.</span></p></div>';
  }

  /* ------------------------------------------------------------------------
     Sample data (canonical ids from spec-phase1-console §4; tenant Kaveri Spinning Mills)
     ------------------------------------------------------------------------ */
  var T = {
    tenant: uid('kaveri-spinning', '3f9a1c2e'),
    sbxTenant: uid('ledgerloop-sbx', 'b7d40c19'),
    decl: uid('decl:erp.ar', 'd3c1a7e0'),
    arAgent: uid('actor:ar-agent', '5e21b0c4'),
    venkat: uid('actor:venkat-raman', '9b7e2d10'),
    lexicon: dg('6c0f', 'a1d2', 'lexicon rung1/erpnext/gst/2026-09'),
    base: 'https://api.in.elan1.example',
    mcp: 'https://mcp.in.elan1.example/v1',
    auth: 'https://auth.in.elan1.example/oauth/token'
  };
  var CHAIN = {
    4097: dg('64ab', 'd2f0', 's4097'), 4098: dg('1e9c', '83a5', 's4098'), 4099: dg('b7f2', '0e61', 's4099'), 4100: dg('4c08', 'f93d', 's4100'),
    4101: dg('9a51', '2c7e', 's4101'), 4102: dg('d6e3', '1b48', 's4102'), 4106: dg('5a7c', 'd3e0', 's4106'), 4108: dg('c9e1', '4a02', 's4108'), 4112: dg('a8e2', '07c3', 's4112')
  };
  /* Declared gate order for erp.sales_invoice.submit (erp.ar v7) */
  var SI_GATES = ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'budget'];
  function gateRows(failing, pend) {
    return SI_GATES.map(function (g, i) {
      var out = g === failing ? 'fail' : (g === pend ? 'pending' : 'pass');
      var r = { name: g, position: i + 1, outcome: out };
      if (out === 'fail') r.code = { consent: 'GATE.CONSENT_MISSING', residency: 'GATE.RESIDENCY_MISMATCH', retention: 'GATE.RETENTION_WINDOW_CLOSED', counterparty: 'GATE.COUNTERPARTY_UNKNOWN', precondition: 'GATE.PRECONDITION_FAILED', dual_control: 'GATE.DUAL_CONTROL_PENDING', budget: 'GATE.BUDGET_EXHAUSTED' }[g];
      r.inputs_hash = 'sha256:' + hx('gi' + g + failing, 16) + '…';
      return r;
    });
  }

  var EX = {};
  EX.intent = {
    intent_id: '8c1d6f4a-2e0b-5c7a-9d31-4b6e2f0a7c58', tenant_id: T.tenant, declaration_id: T.decl, declaration_version: 7,
    write_type: 'erp.sales_invoice.submit', actor_id: T.arAgent, actor_kind: 'agent', channel: 'api', subject: null,
    payload: { customer: 'ACME Textiles', customer_gstin: '33AAECA2210L1Z9', posting_date: '2026-09-24', items: [{ item_code: 'YARN-40S', qty: 800, rate: 300 }], grand_total: 240000 },
    as_of: '2026-09-24T08:46:00Z', reason: 'Dispatch DN-2026-01142 delivered; invoice due under the ACME rate contract'
  };
  EX.committed = {
    outcome: 'committed',
    decision: { write_id: '0b7e3a52-91c4-4d0e-b6a8-2f19c7d05e33', disposition: 'allow', rung: 7, policy_version: 11, declaration_version: 7, autonomy_level: 'A2', blast_radius: 'one_counterparty',
      gate_results: gateRows(null), reversal_plan: { method: 'target_native_undo', window_hours: 24, after_window: 'compensating_entry' } },
    record: { seq: 4101, digest: CHAIN[4101], assurance_level: 1 },
    record_id: '5d0a8e71-3c2f-4b19-a6d4-e80c21f7b945', record_version: 1, undo_until: '2026-09-25T09:32:47Z'
  };
  EX.refused = {
    outcome: 'refused',
    decision: { write_id: '7c41d0e2-5b8a-4f3c-9e21-0a6b3c8d4f12', disposition: 'refuse', rung: 3, code: 'GATE.PRECONDITION_FAILED', gate: 'precondition', policy_version: 11, declaration_version: 7, autonomy_level: 'A3', blast_radius: 'one_counterparty',
      gate_results: gateRows('precondition') },
    operator_action: 'Fix the record state',
    record: { seq: 4098, digest: CHAIN[4098], assurance_level: 1 },
    record_id: ZERO_UUID, record_version: 0
  };
  EX.escalated = {
    outcome: 'escalated',
    decision: { write_id: 'e2a95c07-6d1b-4f8e-8a3c-19b0e4d72f61', disposition: 'escalate', rung: 6, policy_version: 11, declaration_version: 7, autonomy_level: 'A2', blast_radius: 'one_counterparty',
      gate_results: gateRows(null, 'dual_control'),
      obligation: { obligation_id: 'ob_91c4e2a7-0d53-4b6f-9e18-7a2c5f30d846', display_id: 'OB-2026-0412', raised_at_rung: 6, expires_at: '2026-09-24T12:46:00Z', resolver_roles: ['ar-approvers'], quorum: 1 } },
    record: { seq: 4099, digest: CHAIN[4099], assurance_level: 1 },
    record_id: ZERO_UUID, record_version: 0
  };
  EX.platform = {
    outcome: 'refused',
    decision: { write_id: '3a6f0c19-8e27-4d5b-b1c9-5f04a2e8d7b6', disposition: 'refuse', rung: 7, code: 'PLATFORM.TARGET_UNREACHABLE', policy_version: 9, declaration_version: 5, autonomy_level: 'A3', blast_radius: 'one_counterparty' },
    operator_action: 'Page. Nothing was applied',
    retry: { retryable: true, same_intent_id: true, after_seconds: 30 },
    record: { seq: 4102, digest: CHAIN[4102], assurance_level: 1 },
    record_id: ZERO_UUID, record_version: 0
  };

  /* ---- KernelPort: six calls (TM §4.5, atlas Fig 5) ---- */
  var KP = {
    define: {
      title: 'define', short: 'Register a write type at a declaration version', token: 'control (ctl)', changes: 'No record. It is itself a governed registration write under dual control.',
      idem: '(declaration_id, version, compiled_digest)', http: ['POST', '/v1/declarations/{declaration_id}/versions'], mcp: null, sdk: 'control.define(…)', py: 'control.define(…)',
      purpose: 'Registers a certified declaration version so that its write types become reachable at rung 2. The version must be exactly the last version plus one; a typo fix is still a new version.',
      never: ['Overwrites a version — versions are kept verbatim, for ever', 'Resolves “latest”', 'Accepts an uncertified version', 'Accepts a tenant token (control tokens only; they have no route to a record store)'],
      req: [
        { n: 'declaration', t: 'object', req: true, d: 'The seven blocks — identity · shape · permissions · write_types · gates · proof_binding · channels. JSON Schema 2020-12, <code>additionalProperties: false</code>. YAML is accepted for authoring.' },
        { n: 'version', t: 'uint32', req: true, d: 'Exactly last + 1. A gap is a rejection: <code>POLICY.VERSION_NOT_SEQUENTIAL</code>.' },
        { n: 'certifier_id', t: 'uuid', req: true, d: 'A named person who is not the author. Certification is a governed write under dual control.' },
        { n: 'supersedes', t: 'uint32', d: 'The version this one replaces. The old version still resolves for old writes and for verification.' }
      ],
      res: [
        { n: 'declaration_id', t: 'uuid', d: 'Echoed.' },
        { n: 'version', t: 'uint32', d: 'The version now resolvable. The author sees “Accepted at version 8”.' },
        { n: 'compiled_digest', t: 'digest', d: 'Content address of the compiled surface plan. Two digests for one version is a P0.' },
        { n: 'write_types[]', t: 'array', d: '<strong>name</strong>, <strong>meter_basis</strong> (from the declared blast radius, never per customer) and <strong>blast_radius</strong> for each write type.' }
      ],
      codes: ['POLICY.DECLARATION_INVALID', 'POLICY.VERSION_NOT_SEQUENTIAL', 'POLICY.NOT_CERTIFIED', 'PLATFORM.REGISTRY_UNAVAILABLE']
    },
    assert: {
      title: 'assert', short: 'Run the rungs and return a decision', token: 'tenant · act', changes: 'Yes — the only call that can change a record.',
      idem: 'intent_id (a repeated key returns the original outcome, including seq and digest; kept 30 days)', http: ['POST', '/v1/writes'], mcp: 'act.write', sdk: 'k.assert(intent)', py: 'k.assert_(intent)',
      purpose: 'Submits a write intent. The kernel climbs rungs 0b to 9 — stop, identity, write door, pre-gates, evaluate(), guardrail, autonomy, act, proof, metered — and answers with exactly one of three outcomes: committed, refused or escalated. Every outcome is HTTP 200 and every outcome except a stopped tenant carries a proof entry.',
      never: ['Calls a model — rungs 3–8 are unreachable from any model client (I1)', 'Caches a decision, or offers a fast path, batch variant or admin mode (I5)', 'Returns a warning — there is no fourth outcome (I6)', 'Resolves “latest” for a production key (I7)'],
      req: [
        { n: 'intent_id', t: 'uuid', req: true, d: 'Client-generated idempotency key. Derive it (UUIDv5) from your own change key so a retry sends the same id. HTTP <code>Idempotency-Key</code> and MCP <code>idempotency_key</code> map to it.' },
        { n: 'declaration_id', t: 'uuid', req: true, d: 'The declaration that governs this write type.' },
        { n: 'declaration_version', t: 'uint32', req: true, d: 'An explicit integer. <code>"latest"</code> is a 4xx rejection for production keys; sandbox keys may use it while you iterate.' },
        { n: 'write_type', t: 'string', req: true, d: '<code>&lt;slug&gt;.&lt;verb&gt;</code>, 5–64 octets, NFC — for example <code>erp.sales_invoice.submit</code>. Must exist at that version. There is no generic write.' },
        { n: 'actor_id', t: 'uuid', req: true, d: 'Must match the token. The token is authoritative.' },
        { n: 'actor_kind', t: 'human · agent · system', req: true, d: 'Set by the kernel from the token, never inferred from the payload. A mismatch is a rejection and an alert, not a refusal.' },
        { n: 'channel', t: 'string', req: true, d: 'Must be listed for this write type in block 7 (channels), or the write refuses with <code>POLICY.CHANNEL_NOT_PERMITTED</code>.' },
        { n: 'subject', t: 'object | null', req: true, d: 'The target record reference. <code>null</code> for a create.' },
        { n: 'payload', t: 'object', req: true, d: 'Proposed field values, validated against the write type’s <code>payload_schema</code>. The payload is never stored in the chain; F14 commits to a salted digest of it.' },
        { n: 'as_of', t: 'RFC 3339', req: true, d: 'The business instant the gates evaluate against. Supplied by you, never taken from a clock.' },
        { n: 'on_behalf_of', t: 'uuid', d: 'A live delegation. It confers accountability, never autonomy.' },
        { n: 'reason', t: 'string', d: 'Recorded, never evaluated.' },
        { n: 'obligation_ref', t: 'uuid', d: 'Present only on the resubmission after an approval. Resubmit with a new intent_id; never resume.' }
      ],
      res: [
        { n: 'outcome', t: 'committed · refused · escalated', d: 'The consumer-facing outcome. Allow followed by a successful rung 7 is <strong>committed</strong>; a refusal at any rung, including a platform one, is <strong>refused</strong>.' },
        { n: 'decision', t: 'Decision', d: 'write_id, disposition (allow · refuse · escalate), rung, code, gate, obligation, policy_version, declaration_version, autonomy_level, blast_radius, <strong>gate_results[] — one row per declared gate, pass or fail</strong>, reversal_plan. See ' + '<a href="#/developers/objects">the object model</a>.' },
        { n: 'record', t: '{seq, digest, assurance_level}', d: 'The proof entry, returned synchronously. <code>assurance_level: 1</code> today; there is no signature, key_id or anchor_ref member at Level 1 — absent, not null.' },
        { n: 'record_id · record_version', t: 'uuid · uint32', d: 'The target-system record. The zero UUID and 0 on a refusal or escalation.' },
        { n: 'undo_until', t: 'RFC 3339', d: 'Commit only. The end of the declared reversal window.' },
        { n: 'operator_action', t: 'string', d: 'Refusal only. The register’s next step, in the declaration’s words.' },
        { n: 'X-Kernel-Port', t: 'header', d: '<code>v1</code>' }
      ],
      codes: ['POLICY.TENANT_STOPPED', 'POLICY.ACTOR_NOT_PERMITTED', 'POLICY.WRITE_TYPE_UNKNOWN', 'GATE.PRECONDITION_FAILED', 'POLICY.AUTONOMY_INSUFFICIENT', 'PLATFORM.TARGET_UNREACHABLE']
    },
    seal: {
      title: 'seal', short: 'Write the record and chain it (rung 8)', token: 'kernel only — not exported', changes: 'No. It records what rung 7 did or did not do.',
      idem: 'write_id', http: null, mcp: null, sdk: null, py: null,
      purpose: 'Callable only by the kernel’s chain writer. It consumes the outbox in commit order, assigns the next seq, reads prev_digest from seq − 1, computes SHA-256 over the sixteen-field preimage and returns seq and digest synchronously to assert. You cannot call seal; it is documented so you know what rung 8 guarantees. At Level 2 the same call also signs, with the same shape.',
      never: ['Is exported by the SDK, MCP server or HTTP API', 'Skips a seq — a gap is a P0', 'Signs at Level 1, or back-signs Level 1 records later', 'Is the Mode B report-back — that is POST /v1/writes/{write_id}/outcome'],
      req: [{ n: 'write_id', t: 'uuid', req: true, d: 'The governed write to record.' }],
      res: [
        { n: 'seq', t: 'uint64', d: 'Per tenant, from 1, never skips.' },
        { n: 'digest', t: 'digest', d: 'SHA-256 over <code>LP("elan1.proof.seal.v6") ‖ LP(enc F01) ‖ … ‖ LP(enc F16)</code>.' },
        { n: 'assurance_level', t: '1 | 2', d: '1 today. Records written at Level 1 stay Level 1.' }
      ],
      codes: ['PLATFORM.LOG_APPEND_FAILED', 'PLATFORM.CHAIN_HEAD_CONFLICT']
    },
    verify: {
      title: 'verify', short: 'Check a record or a chain segment', token: 'tenant · ro', changes: 'No, and never metered.',
      idem: 'natural', http: ['GET', '/v1/evidence/verify?seq_from=&seq_to='], mcp: 'read.evidence', sdk: 'k.verify({ seq_from, seq_to })', py: 'k.verify(seq_from=…, seq_to=…)',
      purpose: 'Recomputes every preimage and digest over a seq range, walks seq contiguously, checks prev_digest links and resolves every declaration version and lexicon hash. Returns pass or the first failure with seq, field and reason. At Level 1, verify requires us: the check runs inside elan1, so it is evidence for you, not for someone who does not trust elan1.',
      never: ['Is metered', 'Reports a partial run as a pass — a partial run is “not checked”', 'Returns a bare tick — the result always carries its range, count and write-type scope'],
      req: [
        { n: 'seq_from', t: 'uint64', req: true, d: 'First seq to check.' },
        { n: 'seq_to', t: 'uint64', req: true, d: 'Last seq to check. Ranges above 10,000 records are paged by the SDK.' }
      ],
      res: [
        { n: 'result', t: 'pass · fail · not_checked', d: 'Three-valued. Never a bare green tick.' },
        { n: 'range', t: '{seq_from, seq_to}', d: 'The range actually checked.' },
        { n: 'records_checked', t: 'uint64', d: 'Count, printed beside the result.' },
        { n: 'write_types', t: 'uint32', d: 'How many write types the range covers — “3 of 23 write types” reads differently from “23 of 23”.' },
        { n: 'failure', t: '{seq, field, reason}', d: 'The first failure only, in full: e.g. seq 5,004, <code>F03 prev_digest</code>, “does not equal digest(seq 5,003)”.' }
      ],
      codes: []
    },
    scope: {
      title: 'scope', short: 'Resolve blast radius and autonomy before you ask', token: 'tenant · ro', changes: 'No. Advisory.',
      idem: 'natural', http: ['GET', '/v1/scope?actor_id=&write_types='], mcp: 'read.scope', sdk: 'k.scope({ actor_id, write_types })', py: 'k.scope(actor_id=…, write_types=[…])',
      purpose: 'Tells a screen what to render and tells an agent whether to stage a write at all. A control the actor may not use is not rendered; a control that will need approval says so before it is pressed. Assert always re-resolves both, so never cache scope as permission — that would be the decision cache that invariant I5 bans.',
      never: ['Grants anything — it describes, assert decides', 'Is a substitute for handling a refusal'],
      req: [
        { n: 'actor_id', t: 'uuid', req: true, d: 'Usually the token’s own actor.' },
        { n: 'write_types[]', t: 'string[]', req: true, d: 'The write types you might submit.' }
      ],
      res: [
        { n: 'declaration_version', t: 'uint32', d: 'The version in force.' },
        { n: 'permitted[]', t: 'array', d: '<strong>write_type</strong>, <strong>blast_radius</strong>, <strong>autonomy_level</strong> (a missing grant is A0), <strong>reaches</strong> (<code>rung7</code> · <code>approval</code> · <code>none</code>) and <strong>dual_control</strong>.' }
      ],
      codes: []
    },
    refuse: {
      title: 'refuse', short: 'Emit a typed refusal from the register', token: 'tenant · act, or kernel', changes: 'No. Produces the full record with record_id zeroed and quantity 0.',
      idem: 'write_id', http: ['POST', '/v1/writes/{write_id}/refuse'], mcp: null, sdk: 'k.refuse({ write_id, code, context })', py: 'k.refuse(write_id=…, code=…, context={…})',
      purpose: 'Raised by the kernel, or by an adapter before the kernel is reached — for example a Mode A adapter that sees its target reject a credential. The code must come from the register and must map to the rung it is raised at. The result is a refusal outcome exactly like one the kernel produced: HTTP 200, a full sixteen-field record, quantity 0.',
      never: ['Carries free text instead of a register code', 'Is a 4xx or a warning', 'Is used to report that a Mode B caller wrote anyway — that is an unmatched write, found by reconciliation'],
      req: [
        { n: 'write_id', t: 'uuid', req: true, d: 'The write being refused.' },
        { n: 'code', t: 'register code', req: true, d: 'One of the codes on <a href="#/developers/refusals">the register</a>. The kernel checks that it maps to the rung it is raised at.' },
        { n: 'context', t: 'object', d: 'Structured inputs for the operator action (never shown raw to a person).' }
      ],
      res: [{ n: '(refusal outcome)', t: 'assert response', d: 'Same shape as a refused assert: decision, operator_action, record, zero record_id, record_version 0.' }],
      codes: ['GATE.SANDBOX_DIVERGED', 'PLATFORM.TOKEN_MINT_FAILED']
    }
  };

  /* ---- The Right Path: rung 0b plus nine rungs (spec-phase1 §1.4; budgets are targets) ---- */
  var RUNGS = [
    { n: '0b', name: 'STOP', rule: 'Is the tenant stopped? Checks tenant, residency and the stop flag.', codes: ['POLICY.TENANT_STOPPED'], budget: '4 ms (0b–2 together)', note: 'The only refusal with no proof record.' },
    { n: '1', name: 'IDENTITY', rule: 'actor_id and actor_kind come from the token, never the payload. Delegation confers accountability, never autonomy.', codes: ['POLICY.ACTOR_NOT_PERMITTED', 'POLICY.DELEGATION_INVALID'], budget: '″' },
    { n: '2', name: 'WRITE DOOR', rule: 'The write type exists at an explicit declaration version and is reachable from this channel. There is no generic write.', codes: ['POLICY.WRITE_TYPE_UNKNOWN', 'POLICY.CHANNEL_NOT_PERMITTED', 'POLICY.DECLARATION_UNRESOLVED', 'PLATFORM.REGISTRY_UNAVAILABLE'], budget: '″' },
    { n: '3', name: 'PRE-GATES', rule: 'Declared gates in declared order, pure functions of as_of. All run even after the first failure; one gate_result row each.', codes: ['GATE.* (19 codes)'], budget: '8 ms' },
    { n: '4', name: 'evaluate()', rule: 'Versioned rules over a projection of declared fields: allow, refuse or escalate. No model in this path, never a default allow.', codes: ['POLICY.DENIED_BY_RULE', 'POLICY.NO_RULE_MATCHED', 'PLATFORM.POLICY_UNAVAILABLE'], budget: '12 ms' },
    { n: '5', name: 'GUARDRAIL', rule: 'Measured blast radius against the declared value — catches “update one invoice” arriving as an unbounded filter.', codes: ['POLICY.BLAST_RADIUS_EXCEEDED'], budget: '8 ms (5–6 together)' },
    { n: '6', name: 'AUTONOMY', rule: 'The A0–A5 grant for this actor and write type. A missing grant is A0. Too low, or irreversible: an obligation for a named person.', codes: ['POLICY.AUTONOMY_INSUFFICIENT', 'POLICY.APPROVAL_DECLINED', 'POLICY.OBLIGATION_EXPIRED'], budget: '″' },
    { n: '7', name: 'ACT', rule: 'Snapshot → shadow sandbox apply → gate re-run → identical bytes to live on a single-use ten-minute credential → re-run on live → commit plus outbox.', codes: ['GATE.SANDBOX_DIVERGED', 'PLATFORM.TARGET_UNREACHABLE', 'PLATFORM.TOKEN_MINT_FAILED', 'PLATFORM.WRITER_LOCK_LOST'], budget: '18 ms kernel only · ERPNext pair ≤ 1,200 ms p95' },
    { n: '8', name: 'PROOF', rule: 'Assign seq, chain prev_digest, SHA-256 over the sixteen-field preimage. Refusals seal too.', codes: ['PLATFORM.LOG_APPEND_FAILED', 'PLATFORM.CHAIN_HEAD_CONFLICT'], budget: '12 ms' },
    { n: '9', name: 'METERED', rule: 'Exactly one meter event. Quantity 1 committed; every refusal and escalation 0, enforced by a database CHECK.', codes: [], budget: '2 ms' }
  ];
  /* Scenarios for the stepper. state per rung: pass | stop | esc | skip | rec | zero | none */
  var SCEN = {
    commit: { label: 'Committed', seq: 4101, outcome: 'committed', stopAt: null, story: 'ar-agent’s ₹2,40,000 invoice to ACME Textiles, resubmitted with obligation_ref after Venkat Raman approved OB-2026-0412. Climbs all ten rungs.', http: EX.committed },
    refuse: { label: 'Refused at rung 3', seq: 4098, outcome: 'refused', stopAt: 3, story: 'ar-agent tries a ₹4,20,000 invoice. Every gate runs; precondition fails because exposure would pass the ₹3,00,000 credit limit.', http: EX.refused },
    escalate: { label: 'Escalated at rung 6', seq: 4099, outcome: 'escalated', stopAt: 6, story: 'ar-agent holds A2 Propose. Gates and rules allow the write, but A2 needs a person: an obligation opens for ar-approvers with a 4-hour expiry.', http: EX.escalated },
    stopped: { label: 'Tenant stopped (0b)', seq: null, outcome: 'refused', stopAt: 0, story: 'Nilgiri Tea Traders is stopped (suspected credential exposure). The write is refused at 0b with POLICY.TENANT_STOPPED — no proof entry, no meter event.', http: { outcome: 'refused', code: 'POLICY.TENANT_STOPPED', rung: '0b', stop: { reason_class: 'incident', set_at: '2026-09-24T10:35:00Z' }, operator_action: 'Resolve the stop event; it names its cause class' } },
    platform: { label: 'Platform failure at 7', seq: 4102, outcome: 'platform', stopAt: 7, story: 'bank-recon-agent records a ₹75,000 payment; ERPNext does not answer. Nothing was applied, the entry meters at 0, on-call is paged. Retry with the same intent_id.', http: EX.platform }
  };
  function rungStates(sc) {
    var s = SCEN[sc];
    return RUNGS.map(function (r, i) {
      if (s.outcome === 'committed') return 'pass';
      if (i < s.stopAt) return 'pass';
      if (i === s.stopAt) return s.outcome === 'escalated' ? 'esc' : 'stop';
      if (s.stopAt === 0) return 'none';
      if (i === 8) return 'rec';
      if (i === 9) return 'zero';
      return 'skip';
    });
  }

  /* ---- Refusal register (spec-tm §3; spec-phase1 §1.7). Means and operator action verbatim. ----
     cls: policy | gate | platform; by: kernel | define | proposed | L3; eg: example context for the sample response */
  var REG = [
    ['POLICY.TENANT_STOPPED', 'policy', '0b', null, 'Not done — this workspace is stopped', 'The tenant is stopped', 'Resolve the stop event; it names its cause class', { wt: 'erp.sales_invoice.submit', tenant: 'nilgiri-tea', console: '#/records/tenants/nilgiri-tea' }],
    ['POLICY.ACTOR_NOT_PERMITTED', 'policy', '1', null, 'Not done — not allowed for you', 'permissions does not grant this actor kind this write type', 'Grant it in a new declaration version, or resubmit as a permitted actor', { wt: 'erp.payment_run.submit', actor: 'ar-agent', console: '#/records/declarations/erp.ar' }],
    ['POLICY.DELEGATION_INVALID', 'policy', '1', null, 'Not done — delegation has lapsed', 'on_behalf_of is not a live delegation', 'Renew the delegation', { wt: 'erp.journal_entry.submit', actor: 'close-agent', console: '#/records/actors' }],
    ['POLICY.WRITE_TYPE_UNKNOWN', 'policy', '2', null, 'Not done — this action is not declared', 'Not in write_types at that version', 'Publish a version that declares it', { wt: 'erp.sales_invoice.amend', console: '#/records/studio' }],
    ['POLICY.CHANNEL_NOT_PERMITTED', 'policy', '2', null, 'Not done — not allowed from this channel', 'channels does not carry this write type', 'Use a permitted channel or declare this one', { wt: 'erp.sales_invoice.cancel', channel: 'api', console: '#/records/write-types/erp.sales_invoice.submit' }],
    ['POLICY.DECLARATION_UNRESOLVED', 'policy', '2', null, 'Not done — declaration version not certified', 'Version absent or uncertified', 'Certify it', { wt: 'erp.sales_invoice.cancel', version: 8, console: '#/records/declarations/erp.ar' }],
    ['POLICY.DENIED_BY_RULE', 'policy', '4', null, 'Not done — a rule does not allow this', 'A named rule denied at policy_version', 'Read the named rule; change the request or the rule', { wt: 'erp.sales_invoice.submit', rule: 'R-SI-04', console: '#/records/policies/11' }],
    ['POLICY.NO_RULE_MATCHED', 'policy', '4', null, 'Not done — no rule covers this case', 'No rule covers this case', 'Author a rule. Never widen a default', { wt: 'erp.purchase_invoice.submit', console: '#/records/studio' }],
    ['POLICY.BLAST_RADIUS_EXCEEDED', 'policy', '5', null, 'Not done — touches more than declared', 'Wider than declared', 'Narrow the request, or raise the declared radius (forces dual control)', { wt: 'erp.price_list.update', console: '#/records/write-types/erp.sales_invoice.submit' }],
    ['POLICY.AUTONOMY_INSUFFICIENT', 'policy', '6', null, 'Not done — autonomy too low', 'Grant below what this write type needs', 'Raise the grant (a governed write) or route to approval', { wt: 'erp.supplier.create', actor: 'vendor-onboarding agent', seq: 4106, console: '#/agents/autonomy' }],
    ['POLICY.APPROVAL_DECLINED', 'policy', '6', null, 'Not done — the approver rejected it', 'An approver declined', 'Address the approver’s basis and resubmit', { wt: 'erp.price_list.update', seq: 4109, console: '#/work/decide/OB-2026-0410' }],
    ['POLICY.OBLIGATION_EXPIRED', 'policy', '6', null, 'Not done — nobody decided in time', 'The escalation expired unresolved', 'Resubmit; expiry is itself a recorded governed event', { wt: 'erp.journal_entry.submit', seq: 4110, console: '#/work/decide/OB-2026-0405' }],
    ['POLICY.DECLARATION_INVALID', 'policy', '—', null, 'Declaration not accepted', 'Fails the schema or a semantic rule', 'Shows the first failing rule with its block and field', { define: true, console: '#/records/studio' }],
    ['POLICY.VERSION_NOT_SEQUENTIAL', 'policy', '—', null, 'Version number out of order', 'Version ≠ last + 1. Gaps are a rejection', 'Rebase on version N and certify again (proposed wording)', { define: true, console: '#/records/declarations/erp.ar' }],
    ['POLICY.NOT_CERTIFIED', 'policy', '—', null, 'Not certified yet', 'No named certifier', 'A named person must certify this version (proposed wording)', { define: true, console: '#/records/studio' }],
    ['GATE.CONSENT_MISSING', 'gate', '3', 'consent', 'Not done — no consent on file', 'No consent covers this purpose', 'Capture consent', { wt: 'erp.customer.create' }],
    ['GATE.CONSENT_EXPIRED', 'gate', '3', 'consent', 'Not done — consent has lapsed', 'Consent lapsed', 'Re-capture', { wt: 'erp.customer.create' }],
    ['GATE.RESIDENCY_MISMATCH', 'gate', '3', 'residency', 'Not done — data would leave its residency', 'Record’s residency domain ≠ tenant’s', 'Never override. Escalate to the residency runbook', { wt: 'erp.sales_invoice.submit', console: '#/assurance/residency' }],
    ['GATE.RETENTION_WINDOW_CLOSED', 'gate', '3', 'retention', 'Not done — outside the retention window', 'Record outside its declared retention window', 'Do not write. Check the retention declaration', { wt: 'erp.journal_entry.submit' }],
    ['GATE.DUAL_CONTROL_PENDING', 'gate', '3', 'dual_control', 'Waiting — needs a second approver', 'No second approver yet', 'Request approval', { wt: 'erp.purchase_order.submit', console: '#/work/approvals' }],
    ['GATE.DUAL_CONTROL_SAME_ACTOR', 'gate', '3', 'dual_control', 'You proposed this, so you cannot also approve it', 'Approver equals requester', 'Find a second named actor', { wt: 'platform.obligation.resolve', seq: 4096, console: '#/work/decide/OB-2026-0418' }],
    ['GATE.RATE_EXCEEDED', 'gate', '3', 'rate', 'Not done — above the declared rate', 'Above the declared per-actor rate', 'Wait, or raise the declared rate', { wt: 'erp.stock_entry.submit' }],
    ['GATE.BUDGET_EXHAUSTED', 'gate', '3', 'budget', 'Not done — budget used up for this period', 'Above the declared per-period budget', 'Raise the budget; never truncate silently', { wt: 'erp.sales_invoice.submit', actor: 'rung1 drafting agent', seq: 4108, console: '#/work/not-done/4108' }],
    ['GATE.COUNTERPARTY_UNKNOWN', 'gate', '3', 'counterparty', 'Not done — counterparty not registered', 'Counterparty not registered', 'Register it', { wt: 'erp.sales_invoice.submit', actor: 'Invoice Agent', seq: 4092 }],
    ['GATE.COUNTERPARTY_SANCTIONED', 'gate', '3', 'counterparty', 'Not done — counterparty is on a sanctions list', 'Counterparty on a sanctions list', 'Never override. Escalate to compliance', { wt: 'erp.payment_entry.submit' }],
    ['GATE.OUTSIDE_SCHEDULE', 'gate', '3', 'schedule', 'Not done — outside the operating window', 'Outside the declared operating window', 'Wait, or change the window', { wt: 'erp.payment_run.submit' }],
    ['GATE.PRECONDITION_FAILED', 'gate', '3', 'precondition', 'Not done — credit limit', 'A declared record state does not hold', 'Fix the record state', { wt: 'erp.sales_invoice.submit', actor: 'ar-agent', seq: 4098, console: '#/work/not-done/4098' }],
    ['GATE.SANDBOX_DIVERGED', 'gate', '3 (raised at 7)', 'sandbox', 'Not done — the check on your live books disagreed', 'Live re-run disagreed with the sandbox result', 'Snapshot restored. Investigate before resubmitting', { wt: 'erp.stock_entry.submit', actor: 'stock-agent', seq: 4112, console: '#/work/not-done/4112', open: 'Gate or platform class is open (E02 OQ3); the TM lists it as gate class, raised at rung 7.' }],
    ['PLATFORM.REGISTRY_UNAVAILABLE', 'platform', '2', null, 'Our failure — declaration registry down', 'Declaration registry down', 'Page. Retry with the same intent_id', { wt: 'erp.sales_invoice.submit' }],
    ['PLATFORM.POLICY_UNAVAILABLE', 'platform', '4', null, 'Our failure — rule engine down', 'Rule engine down', 'Page. Never fall back to a default allow', { wt: 'erp.sales_invoice.submit' }],
    ['PLATFORM.TARGET_UNREACHABLE', 'platform', '7', null, 'Our failure — ERPNext did not answer', 'Target system unreachable', 'Page. Nothing was applied', { wt: 'erp.payment_entry.submit', actor: 'bank-recon-agent', seq: 4102, console: '#/work/not-done/4102' }],
    ['PLATFORM.TOKEN_MINT_FAILED', 'platform', '7', null, 'Our failure — could not open a one-time key', 'Could not mint the short-lived credential', 'Page', { wt: 'erp.payment_entry.submit' }],
    ['PLATFORM.WRITER_LOCK_LOST', 'platform', '7', null, 'Our failure — the write was interrupted', 'Single-writer lock lost', 'Page. Snapshot restored', { wt: 'erp.stock_entry.submit' }],
    ['PLATFORM.LOG_APPEND_FAILED', 'platform', '8', null, 'Our failure — proof not yet written', 'Chain append failed', 'Page. Outbox retries in order', { wt: 'erp.sales_invoice.submit', pending: true }],
    ['PLATFORM.CHAIN_HEAD_CONFLICT', 'platform', '8', null, 'Our failure — workspace stopped for safety', 'Two chain writers for one tenant', 'P0. Stop the tenant', { wt: 'erp.sales_invoice.submit' }]
  ].map(function (r) { return { code: r[0], cls: r[1], rung: r[2], gate: r[3], title: r[4], means: r[5], action: r[6], eg: r[7] }; });
  var REG_MORE = [
    ['PLATFORM.AUTONOMY_UNAVAILABLE', 'Proposed (build recommendation)', 'rung 6', 'Autonomy service could not answer. Would page and never resolve to a grant.'],
    ['POLICY.RECEIPT_AUDIENCE_MISMATCH', 'Level 3 — specified', 'receipt.accept', 'The receipt names another organisation as its audience.'],
    ['POLICY.RECEIPT_EXPIRED', 'Level 3 — specified', 'receipt.accept', 'expires_at has passed, or recorded_at or the anchor does not precede now.'],
    ['POLICY.TRUST_ANCHOR_UNKNOWN', 'Level 3 — specified', 'receipt.accept', 'No discovery route resolved the issuer’s key. There is no fallback to the in-receipt hint.'],
    ['POLICY.RECEIPT_UNVERIFIED', 'Level 3 — specified', 'receipt.accept', 'Preimage, digest or Ed25519 signature did not verify.'],
    ['GATE.RECEIPT_REPLAYED', 'Level 3 — specified', 'receipt.accept', '(issuer, source_seq, digest) was already bound.'],
    ['POLICY.AUTONOMY_NOT_EARNED', 'Level 3 — specified', 'autonomy.graduate', 'The precedent class does not meet the eight eligibility conditions.']
  ];
  function findCode(code) { for (var i = 0; i < REG.length; i++) if (REG[i].code === code) return REG[i]; return null; }
  function classWord(cls) { return { policy: 'Policy', gate: 'Gate', platform: 'Platform' }[cls] || cls; }
  function exampleFor(r) {
    var e = r.eg || {}, rungNum = parseInt(r.rung, 10);
    if (r.code === 'POLICY.TENANT_STOPPED') return { outcome: 'refused', code: r.code, rung: '0b', stop: { reason_class: 'incident', set_at: '2026-09-24T10:35:00Z' }, operator_action: r.action };
    if (e.define) {
      return { outcome: 'refused', call: 'define', code: r.code, declaration_id: T.decl, version: r.code === 'POLICY.VERSION_NOT_SEQUENTIAL' ? 10 : 8,
        failure: r.code === 'POLICY.DECLARATION_INVALID' ? { rule: 'L0-S03', block: 'write_types', field: 'erp.sales_invoice.cancel.reversal_plan', message: 'erp.sales_invoice.cancel declares neither a reversal plan nor irreversible: true. Every write type must say which it is.' } :
          r.code === 'POLICY.VERSION_NOT_SEQUENTIAL' ? { expected_version: 8, received_version: 10 } : { certifier_id: null },
        operator_action: r.action };
    }
    var seq = e.seq || (4090 + (hx(r.code, 2).charCodeAt(0) % 20));
    var gates = r.cls === 'gate' && r.gate !== 'sandbox' ? gateRows(r.gate) : (rungNum > 3 || r.cls === 'platform' && rungNum >= 7 || r.gate === 'sandbox') ? gateRows(null) : [];
    if (r.gate && r.gate !== 'sandbox' && SI_GATES.indexOf(r.gate) < 0) gates = gateRows(null).concat([{ name: r.gate, position: 8, outcome: 'fail', code: r.code, inputs_hash: 'sha256:' + hx('g' + r.code, 16) + '…' }]);
    var d = { write_id: uid('w' + r.code), disposition: 'refuse', rung: r.rung.indexOf('raised') > 0 ? 7 : (isNaN(rungNum) ? r.rung : rungNum), code: r.code };
    if (r.gate) d.gate = r.gate === 'sandbox' ? 'shadow_sandbox' : r.gate;
    if (rungNum >= 4 || r.cls === 'gate') d.policy_version = rungNum >= 4 || r.gate === 'sandbox' ? 11 : 0;
    d.declaration_version = rungNum >= 2 || isNaN(rungNum) ? (e.version || 7) : 7;
    if (e.rule) d.rule = { id: e.rule, text: 'An agent may not submit an invoice dated in a closed GST period.' };
    d.autonomy_level = rungNum >= 6 || r.gate === 'sandbox' ? (r.code === 'POLICY.AUTONOMY_INSUFFICIENT' ? 'A0' : 'A2') : 'A2';
    d.gate_results = gates;
    var out = { outcome: 'refused', decision: d, operator_action: r.action };
    if (r.cls === 'platform') out.retry = { retryable: true, same_intent_id: true, after_seconds: 30 };
    if (e.pending) { out.outcome = 'committed'; delete out.decision.code; out.decision.disposition = 'allow'; out.record = { status: 'pending' }; out.note = 'The rung-7 write committed; its proof entry is queued in the outbox and will be appended in order.'; return out; }
    out.record = { seq: seq, digest: dg(hx(r.code, 4), hx(r.code + 't', 4), r.code), assurance_level: 1 };
    out.record_id = ZERO_UUID; out.record_version = 0;
    return out;
  }

  /* ---- MCP tools: 34 = 18 ro · 10 stage · 6 act. Seven are named in the TM; the rest are illustrative names. ---- */
  var MCP = [
    ['read.records', 'ro', '{type, filter, as_of?}', 'Permission-filtered rows of a declared record type.', 1],
    ['read.evidence', 'ro', '{seq_from, seq_to}', 'Proof entries, paged by seq; also runs verify over the range.', 1],
    ['read.declaration', 'ro', '{declaration_id, version?}', 'The seven blocks of a declaration at a version.', 1],
    ['read.meter', 'ro', '{period}', 'Meter events and totals for a period.', 1],
    ['read.scope', 'ro', '{actor_id, write_types[]}', 'The scope call: blast radius, autonomy and what each write type reaches.', 0],
    ['read.record_versions', 'ro', '{record_id}', 'Versions of one governed record with their seqs.', 0],
    ['read.chain_standing', 'ro', '{}', 'Last nightly integrity run: continuous · break at seq N · not checked, with scope and count.', 0],
    ['read.declaration_versions', 'ro', '{declaration_id}', 'Version history with certifier and compiled digest.', 0],
    ['read.write_types', 'ro', '{declaration_id, version}', 'Write types with label, intent, blast radius and reversal plan.', 0],
    ['read.gates', 'ro', '{write_type, version}', 'Declared gates in declared order with their parameters.', 0],
    ['read.refusal_code', 'ro', '{code}', 'Register entry: class, rung, means and operator action.', 0],
    ['read.obligations', 'ro', '{status?, resolver?}', 'Open obligations visible to the token’s actor.', 0],
    ['read.obligation', 'ro', '{obligation_id}', 'One obligation with its expiry and resolver set.', 0],
    ['read.obligation_surface', 'ro', '{obligation_id}', 'The surface plan the approver sees: diff, gates, policy version.', 0],
    ['read.actor', 'ro', '{actor_id}', 'Actor, sponsor and pinned tool descriptions.', 0],
    ['read.autonomy_grants', 'ro', '{actor_id}', 'Grants per write type; a missing grant reads A0 Observe (no grant).', 0],
    ['read.write', 'ro', '{write_id}', 'One governed write with its decision and record (poll at 10 s or slower).', 0],
    ['read.versions', 'ro', '{}', 'Port major, schema major, register version and live policy version.', 0],
    ['stage.write', 'stage', '{write_type, payload, as_of}', 'A request object, validated, with no side effects. “Staged. No side effects. Submit with act.write.”', 1],
    ['stage.validate', 'stage', '{request_id}', 'Re-validates a staged request against the current declaration version.', 0],
    ['stage.diff', 'stage', '{request_id}', 'The field diff a person would see at Decide.', 0],
    ['stage.render_surface', 'stage', '{request_id, channel}', 'The rendered surface and its payload digest.', 0],
    ['stage.attach_reason', 'stage', '{request_id, reason}', 'Adds a reason (recorded, never evaluated).', 0],
    ['stage.resubmission', 'stage', '{write_id, obligation_ref}', 'A new request with a new intent_id for an approved obligation.', 0],
    ['stage.reversal', 'stage', '{write_id}', 'A reversal request built from the declared reversal plan.', 0],
    ['stage.list', 'stage', '{}', 'Requests staged by this actor in the last 24 hours.', 0],
    ['stage.get', 'stage', '{request_id}', 'One staged request.', 0],
    ['stage.discard', 'stage', '{request_id}', 'Discards a staged request. Nothing was recorded, so nothing is reversed.', 0],
    ['act.write', 'act', '{request, idempotency_key}', 'assert: committed · refused · escalated. Refusals return isError: false.', 1],
    ['act.escalate', 'act', '{obligation_id, decision, note}', 'Resolves an obligation. Refused from any agent token — agents never approve.', 1],
    ['act.reverse', 'act', '{request, idempotency_key}', 'Submits a staged reversal; itself a governed write.', 0],
    ['act.report_outcome', 'act', '{write_id, performed, target_ref}', 'Mode B report-back: the caller performed the write. Sets the caller-performed flag.', 0],
    ['act.send_to', 'act', '{obligation_id, person_ids[]}', 'Routes an obligation to named people (humans only).', 0],
    ['act.extend', 'act', '{obligation_id}', 'Uses the single declared extension on an obligation.', 0]
  ].map(function (t) { return { name: t[0], scope: t[1], args: t[2], returns: t[3], named: !!t[4] }; });

  /* ---- HTTP families (TM §6.6, §8.11) ---- */
  var API = [
    { id: 'writes', path: '/v1/writes', cls: 'act', serves: 'Submit (= assert), read and list governed writes', eps: [
      ['POST', '/v1/writes/stage', 'Stage a request (no side effects) → request_id rq_…', 'stage'], ['POST', '/v1/writes', 'Submit a write intent or a staged request (assert)', 'act'], ['GET', '/v1/writes/{write_id}', 'Read one write (poll at 10 s or slower)', 'act'],
      ['GET', '/v1/writes?outcome=&write_type=&seq_from=', 'List writes', 'act'], ['POST', '/v1/writes/{write_id}/outcome', 'Mode B: report that the caller performed the write (build rec.)', 'act'], ['POST', '/v1/writes/{write_id}/refuse', 'Emit a typed refusal from an adapter (illustrative path)', 'act']] },
    { id: 'obligations', path: '/v1/obligations', cls: 'act', serves: 'The approval queue and resolutions (seven endpoints, build rec.)', eps: [
      ['GET', '/v1/obligations?status=open&resolver=me', 'Open obligations for the token’s person', 'act'], ['GET', '/v1/obligations/{id}', 'One obligation', 'act'], ['GET', '/v1/obligations/{id}/surface', 'What the approver sees', 'act'],
      ['POST', '/v1/obligations/{id}/resolve', 'Approve or decline (= act.escalate); needs idempotency_key; refused for agent tokens', 'act'], ['POST', '/v1/obligations/{id}/send-to', 'Send to named people', 'act'], ['POST', '/v1/obligations/{id}/extend', 'Use the single declared extension', 'act'], ['GET', '/v1/obligations/{id}/history', 'Every event on the obligation', 'act']] },
    { id: 'records', path: '/v1/records', cls: 'ro', serves: 'Governed records and their versions', eps: [['GET', '/v1/records/{type}?filter=&as_of=', 'Permission-filtered rows', 'ro'], ['GET', '/v1/records/{type}/{record_id}/versions', 'Versions with their seqs', 'ro']] },
    { id: 'evidence', path: '/v1/evidence', cls: 'ro', serves: 'Proof entries and chain continuity; pages by seq', eps: [['GET', '/v1/evidence?seq_from=&seq_to=', 'Proof entries in seq order', 'ro'], ['GET', '/v1/evidence/verify?seq_from=&seq_to=', 'verify — pass · fail · not_checked', 'ro'], ['GET', '/v1/evidence/standing', 'Last nightly integrity run', 'ro']] },
    { id: 'meter', path: '/v1/meter', cls: 'ro', serves: 'Meter events, totals and reconciliation', eps: [['GET', '/v1/meter/events?period=2026-09', 'One event per governed write', 'ro'], ['GET', '/v1/meter/totals?period=2026-09', 'Committed, refused (₹0) and escalated (₹0)', 'ro'], ['GET', '/v1/meter/reconciliation?period=2026-09', 'Nightly two-way reconciliation, M1–M5', 'ro']] },
    { id: 'declarations', path: '/v1/declarations', cls: 'ctl', serves: 'Author, validate, simulate, certify, publish (define)', eps: [['POST', '/v1/declarations/{id}/validate', 'Schema, L0-S01…S11 and lint', 'ctl'], ['POST', '/v1/declarations/{id}/simulate', 'Against the reference tenant only', 'ctl'], ['POST', '/v1/declarations/{id}/versions', 'define — register version last + 1', 'ctl'], ['GET', '/v1/declarations/{id}/versions/{version}', 'A version, verbatim', 'ctl']] },
    { id: 'actors', path: '/v1/actors', cls: 'ctl', serves: 'Actors, delegations and autonomy grants (grant changes are governed writes)', eps: [['GET', '/v1/actors/{actor_id}', 'Actor, sponsor, pinned tool descriptions', 'ctl'], ['POST', '/v1/actors/{actor_id}/grants', 'Propose a grant change → an obligation', 'ctl'], ['POST', '/v1/actors/{actor_id}/delegations', 'Propose a delegation (dual control)', 'ctl']] },
    { id: 'tenants', path: '/v1/tenants', cls: 'ctl', serves: 'Configuration, stop, residency and keys', eps: [['GET', '/v1/tenants/{tenant_id}', 'Tenant configuration', 'ctl'], ['POST', '/v1/tenants/{tenant_id}/stop', 'Propose a stop (dual-control governed write)', 'ctl'], ['GET', '/v1/tenants/{tenant_id}/keys', 'Keys: last used and rotation window', 'ctl']] }
  ];
  var API_MORE = [['/v1/versions', '—', 'Port major, schema major, register version, live policy version'], ['/v1/scope', 'ro', 'The scope call (build rec.)'], ['/v1/ops', 'ops', 'Eight read-only endpoints: health, SLOs, the three zero-numbers, outbox lag, anchor status, reconciliation, eval history, grant-catalogue diff. No tenant data.']];

  /* ---- Webhooks (TM §6.6): seven events ---- */
  var HOOKS = [
    ['write.committed', 'A governed write committed at rung 7 and was sealed.', { write_id: EX.committed.decision.write_id, write_type: 'erp.sales_invoice.submit', record_id: EX.committed.record_id, record_version: 1, undo_until: '2026-09-25T09:32:47Z', seq: 4101, digest: CHAIN[4101] }],
    ['write.refused', 'A governed write was refused — policy, gate or platform class.', { write_id: EX.refused.decision.write_id, write_type: 'erp.sales_invoice.submit', code: 'GATE.PRECONDITION_FAILED', rung: 3, gate: 'precondition', operator_action: 'Fix the record state', seq: 4098, digest: CHAIN[4098] }],
    ['write.escalated', 'A governed write is waiting on a named person.', { write_id: EX.escalated.decision.write_id, obligation_id: 'ob_91c4e2a7-0d53-4b6f-9e18-7a2c5f30d846', autonomy_level: 'A2', expires_at: '2026-09-24T12:46:00Z', seq: 4099, digest: CHAIN[4099] }],
    ['obligation.resolved', 'A person approved or declined. The resolution is its own governed write.', { obligation_id: 'ob_91c4e2a7-0d53-4b6f-9e18-7a2c5f30d846', decision: 'approve', resolution_seq: 4100, write_id: EX.escalated.decision.write_id, seq: 4100, digest: CHAIN[4100] }],
    ['obligation.expired', 'Nobody decided before expires_at + paused_seconds. The original refuses with POLICY.OBLIGATION_EXPIRED.', { obligation_id: 'ob_3e07b1c9-44d2-4a8e-b5f0-6c19d2a7e304', display_id: 'OB-2026-0405', write_id: uid('w-exp'), code: 'POLICY.OBLIGATION_EXPIRED', seq: 4110, digest: dg('18ac', 'e57d', 's4110') }],
    ['declaration.certified', 'A named person certified a declaration version.', { declaration_id: T.decl, slug: 'erp.ar', version: 7, certifier: 'Arjun Mehta', compiled_digest: dg('7e41', 'd80f', 'erp.ar v7') }],
    ['tenant.stopped', 'The tenant was stopped. Every write, including refusals, halts; no proof entries are written while stopped.', { tenant_id: uid('nilgiri-tea'), reason_class: 'incident', set_at: '2026-09-24T10:35:00Z', set_by: ['Meenakshi Iyer', 'Arjun Mehta'] }]
  ];

  /* ---- Conformance C1–C14 (TM §2.7; evidence §1.14) ---- */
  var CONF = [
    ['C1', 'Import graph', 'No module reachable from rungs 3–8 imports a model client; nothing above P3 imports a kernel type.', true],
    ['C2', 'Bypass attempt', 'Every write path other than the single writer fails against the real target.', true],
    ['C3', 'Rung completeness', '100 intents; every rung runs in order for each, and every gate records a row.', false],
    ['C4', 'Determinism replay', 'The same intent, versions and as_of give the same decision on replay.', false],
    ['C5', 'Fail-closed matrix', 'Every dependency outage produces a PLATFORM.* refusal, never an allow.', false],
    ['C6', 'Missing grant → A0', '1,000 fuzzed actors without a grant resolve to A0 Observe.', false],
    ['C7', 'Idempotency', 'Replaying an intent_id returns the original outcome, seq and digest; no second meter event.', false],
    ['C8', 'Refusal shape', 'HTTP 200, a register code, the rung, a zeroed record_id, record_version 0, quantity 0.', false],
    ['C9', 'Chain integrity', '10,000 records; a flipped octet, a reordered pair, a duplicate and a gap are each found.', false],
    ['C10', 'Meter reconciliation', 'Event ↔ record ↔ target reconcile both ways for the run.', false],
    ['C11', 'Approval separation', 'No approval where approver = requester, and none by an agent token.', false],
    ['C12', 'Rollback drill', 'The reversal plan runs by both paths: native undo and the compensating entry.', false],
    ['C13', 'Version pinning', '“latest” is rejected for production keys; every decision records its versions.', false],
    ['C14', 'Claim boundary', 'String check over rendered Level 1 copy for claims that belong to Level 2.', false]
  ];
  var RUNS = {
    ledgerloop: { label: 'LedgerLoop Software · sandbox', file: { suite: 'elan1-conformance', suite_version: '1.0.0-rc.3', kernelport: 'v1', assurance_level: 1, tenant: 'ledgerloop-sbx', declaration: 'll.billing@3', run_at: '2026-09-23T10:41:07Z', result: 'fail', passed: 13, of: 14, digest: dg('c8f1', '2270', 'conf-ll') },
      res: { C1: ['passed', 'import graph: 0 model clients reachable from rungs 3–8'], C2: ['passed', '4 bypass paths attempted, 4 failed against the sandbox ERPNext site'], C3: ['passed', '100 of 100 intents, 1,000 rung rows'], C4: ['passed', '250 intents replayed, 0 differences'], C5: ['passed', '9 dependencies failed one at a time; 9 PLATFORM.* refusals'], C6: ['passed', '1,000 of 1,000 resolved to A0'], C7: ['passed', 'replay returned seq 311 and its digest'], C8: ['passed', 'GATE.DUAL_CONTROL_PENDING at #318: HTTP 200, zero record_id, qty 0'], C9: ['passed', '10,000 records; 4 of 4 faults found'], C10: ['passed', '0 mismatches'], C11: ['passed', '0 self-approvals; agent resolve refused'], C12: ['failed', 'native undo ran; the compensating-entry path was not exercised'], C13: ['passed', '"latest" rejected with a production-shaped key'], C14: ['passed', '0 banned strings in 212 rendered strings'] } },
    reference: { label: 'Reference kernel · ref-tenant', file: { suite: 'elan1-conformance', suite_version: '1.0.0-rc.3', kernelport: 'v1', assurance_level: 1, tenant: 'ref-tenant', declaration: 'erp.ar@7', run_at: '2026-09-22T21:15:40Z', result: 'pass', passed: 14, of: 14, digest: dg('41d0', '9b6c', 'conf-ref') },
      res: {} }
  };
  CONF.forEach(function (t) { RUNS.reference.res[t[0]] = ['passed', { C3: '100 of 100 intents', C6: '1,000 of 1,000 resolved to A0', C9: '10,000 records; 4 of 4 faults found', C12: 'both paths drilled on SINV-2026-01187 fixture' }[t[0]] || 'passed against erp.ar v7 fixtures']; });

  /* ---- Changelog (classes additive · breaking · fix — no fourth) ---- */
  var LOG = [
    ['2026-09-24', 'fix', 'Sandbox', '429 responses carry Retry-After in seconds, as documented. They previously sent an HTTP date.'],
    ['2026-09-22', 'additive', 'Conformance', 'Suite 1.0.0-rc.3: C12 now requires both reversal paths; the result file adds a digest member.'],
    ['2026-09-19', 'additive', 'HTTP', 'GET /v1/versions returns the refusal register version beside port major, schema major and live policy version.'],
    ['2026-09-15', 'additive', 'MCP', 'Every tool in tools/list carries _meta elan1/declaration, elan1/description_sha256 and elan1/scope.'],
    ['2026-09-10', 'breaking', 'KernelPort v1 (pre-GA)', 'declaration_version: "latest" is rejected for any key shaped like a production key, including in the sandbox. Sandbox keys may still use it.'],
    ['2026-09-03', 'additive', 'Webhooks', 'obligation.expired added. Every write payload now carries seq and digest so you can detect gaps.'],
    ['2026-08-27', 'fix', 'SDK', '@elan1/kernel 0.9.4: a PLATFORM.* refusal no longer raises; it returns outcome refused with retry.retryable true.'],
    ['2026-08-20', 'additive', 'Register', 'Refusal register v1 published: 43 codes, 28 active at Level 1. Codes are never renumbered or reused.']
  ];
  var NOTICES = [['PLATFORM.AUTONOMY_UNAVAILABLE', 'New refusal code (proposed)', 'Not yet published', '60 days external notice from publication; the operator action is published first.']];

  /* ------------------------------------------------------------------------
     Shared code samples
     ------------------------------------------------------------------------ */
  var S = {};
  S.heroTs = [
    'import { KernelClient } from "@elan1/kernel";',
    '',
    'const k = new KernelClient({ apiKey: process.env.ELAN1_KEY!, port: "v1" });',
    '',
    'const res = await k.assert({',
    '  intent_id: intentId("DN-2026-01142"),      // same change → same id',
    '  declaration_id: ERP_AR, declaration_version: 7, // never "latest"',
    '  write_type: "erp.sales_invoice.submit",',
    '  actor_id: AR_AGENT, actor_kind: "agent", channel: "api",',
    '  subject: null, payload: invoice, as_of: "2026-09-24T08:46:00Z",',
    '});',
    '',
    'switch (res.outcome) {',
    '  case "committed": return done(res.record.seq, res.undo_until);',
    '  case "escalated": return waitFor(res.decision.obligation!.obligation_id);',
    '  case "refused":',
    '    return res.decision.code.startsWith("PLATFORM.")',
    '      ? retryLater(res)            // our failure: same intent_id',
    '      : explain(res.operator_action); // never retry a governed refusal',
    '}'
  ].join('\n');
  S.heroPy = [
    'from elan1_kernelport import KernelClient, Committed, Escalated, Refused',
    '',
    'k = KernelClient(api_key=os.environ["ELAN1_KEY"], port="v1")',
    '',
    'res = k.assert_(Intent(',
    '    intent_id=intent_id("DN-2026-01142"),       # same change -> same id',
    '    declaration_id=ERP_AR, declaration_version=7,  # never "latest"',
    '    write_type="erp.sales_invoice.submit",',
    '    actor_id=AR_AGENT, actor_kind="agent", channel="api",',
    '    subject=None, payload=invoice, as_of="2026-09-24T08:46:00Z",',
    '))  # "assert" is reserved in Python; the wire name is assert',
    '',
    'match res:',
    '    case Committed(record=r, undo_until=u):',
    '        return done(r.seq, u)',
    '    case Escalated(decision=d):',
    '        return wait_for(d.obligation.obligation_id)',
    '    case Refused(decision=d) if d.code.startswith("PLATFORM."):',
    '        return retry_later(res)                 # same intent_id',
    '    case Refused():',
    '        return explain(res.operator_action)     # never retry a governed refusal'
  ].join('\n');
  S.heroCurl = [
    'curl -s ' + T.base + '/v1/writes \\',
    '  -H "Authorization: Bearer $ELAN1_TENANT_TOKEN" \\',
    '  -H "Idempotency-Key: 8c1d6f4a-2e0b-5c7a-9d31-4b6e2f0a7c58" \\',
    '  -H "Content-Type: application/json" \\',
    '  -d @intent.json',
    '',
    '# HTTP/1.1 200 OK',
    '# X-Kernel-Port: v1',
    '# {"outcome":"escalated","decision":{"rung":6,"obligation":{"obligation_id":"ob_91c4…"}},',
    '#  "record":{"seq":4099,"digest":"b7f2…0e61","assurance_level":1}}'
  ].join('\n');

  /* ------------------------------------------------------------------------
     /developers — landing
     ------------------------------------------------------------------------ */
  function pgHome() {
    var path = '/developers';
    var ways = '<div class="dv-grid dv-grid--3">' +
      card({ icon: 'code', title: 'SDK — in process', href: '#/developers/sdk/typescript', html: '<code>@elan1/kernel</code> for Node 20+ and <code>elan1-kernel</code> for Python 3.12. Mode A: the kernel’s single writer holds the only credential to the books, so a refusal means the write did not happen.', foot: tag('Mode A · Enforced') + tag('Six calls') }) +
      card({ icon: 'plug', title: 'MCP server — for agents', href: '#/developers/mcp', html: '34 tools: 18 read, 10 stage, 6 act. Tool descriptions are pinned by hash in your declaration. Refusals return <code>isError: false</code> so no framework retries them.', foot: tag('Mode B · Attested advisory') + tag('OAuth 2.1') }) +
      card({ icon: 'globe', title: 'HTTP /v1 and webhooks', href: '#/developers/api', html: 'Eight families across act · ro · ctl, idempotency keys, <code>X-RateLimit-*</code> headers and seven signed webhook events that carry seq and digest.', foot: tag('Mode B · Attested advisory') + tag('HMAC') }) + '</div>';
    var outcomes = c.table({ caption: 'The three outcomes', columns: [
      { key: 'o', label: 'Outcome', render: function (r) { return c.outcome(r.k); } },
      { key: 'h', label: 'HTTP', mono: true }, { key: 'p', label: 'Proof entry' }, { key: 'm', label: 'Meter' }, { key: 'r', label: 'Retry' }],
      rows: [{ k: 'committed', h: '200', p: 'Yes · seq + digest', m: 'Quantity 1', r: 'Nothing to retry' }, { k: 'refused', h: '200', p: 'Yes · record_id zeroed', m: 'Quantity 0 · ₹0', r: 'Never (PLATFORM.* only, same intent_id)' }, { k: 'escalated', h: '200', p: 'Yes · obligation id', m: 'Quantity 0 · ₹0', r: 'Never — wait for obligation.resolved' }] });
    var strip = '<div class="dv-strip">' + CALLS.map(function (k) { var d = KP[k]; return '<a href="#/developers/kernelport/' + k + '"' + (k === 'seal' ? ' class="is-muted"' : '') + '><b>' + k + '</b><span>' + esc(d.short) + '</span><span class="e1-mono">' + esc(d.token) + '</span></a>'; }).join('') + '</div>';
    var build = '<div class="dv-grid dv-grid--2">' +
      card({ title: 'An invoicing agent that cannot overshoot a credit limit', html: 'ar-agent proposes <code>erp.sales_invoice.submit</code>. Precondition (G9) refuses anything that takes a customer past their limit; above ₹2,00,000 a second person approves.', href: '#/developers/refusals/GATE.PRECONDITION_FAILED' }) +
      card({ title: 'Supplier bills booked only against a PO and GRN', html: 'ap-agent at A3 Act reversible books <code>erp.purchase_invoice.submit</code>. The reversal plan is a debit note, so A3 is allowed; without a plan it could not be.', href: '#/developers/declarations' }) +
      card({ title: 'Payment runs that always wait for two people', html: '<code>erp.payment_run.submit</code> is irreversible — money leaves the bank. Irreversible write types can never be auto-approved, whatever the grant.', href: '#/developers/right-path' }) +
      card({ title: 'A third-party agent over MCP, honestly labelled', html: 'LedgerLoop’s billing agent runs in Attested advisory: every intent is evaluated and recorded, and the claim says exactly that — not “blocked”.', href: '#/developers/mcp' }) + '</div>';
    var html = hero({
      eyebrow: 'elan1 developer documentation · KernelPort v1',
      title: 'Governed writes from any agent, through one door',
      lead: 'Your agent proposes a change to the books. elan1 runs it up the Right Path — stop, identity, write door, gates, rules, blast radius, autonomy — then commits it, refuses it with a typed code, or hands it to a named person. Every outcome is HTTP 200 and every outcome is recorded.',
      meta: pill('Port', 'kernelport/v1') + pill('Register', '43 codes · 28 at L1') + c.level('L1') + pill('Status', 'pre-GA'),
      actions: c.button('Get a sandbox key', { kind: 'primary', href: '#/developers/sandbox-key', icon: 'key' }) + c.button('Quickstart — five steps', { href: '#/developers/quickstart', iconRight: 'arrow-right' }) + c.button('Refusal register', { kind: 'ghost', href: '#/developers/refusals' })
    }) +
      '<p class="dv-quote">A model may produce a write intent; it may never produce an allow.<small>Invariant I1. Rungs 3 to 8 are unreachable from any model client, and a build that makes one reachable fails (conformance test C1).</small></p>' +
      h2('what-you-can-build', 'What you can build') +
      p('Anything where software proposes a change and your business must be able to show, afterwards, that the change was controlled: invoices, supplier bills, payments, credit limits, stock movements, period closes. You declare each write type once — its blast radius, gates, reversal plan and channels — and every agent, SDK call and person reaches it through the same six calls.') + build +
      h2('three-ways-in', 'Three ways in') + p('One submission surface, reachable three ways. The calls, objects and refusal codes are identical on all three.') + ways +
      c.callout({ kind: 'rule', title: 'Say which mode you are in, in writing, on the first call.', body: '<p><strong>Enforced</strong> (Mode A): “This write could not have occurred without passing the gates.” <strong>Attested advisory</strong> (Mode B): “Every write intent is evaluated against policy and recorded, and the record is exportable.” In Mode B never say “we block”, “we prevent” or “nothing gets through without us” — the caller holds the credential and can still write. The mode is declared per channel and write type, and never set in a call.</p>' }) +
      h2('first-call', 'Your first governed write') + p('Submit an intent and handle all three outcomes. A consumer that only handles the committed case will silently lose writes.') +
      codeTabs([{ lang: 'ts', code: S.heroTs, title: 'invoice.ts' }, { lang: 'py', code: S.heroPy, title: 'invoice.py' }, { lang: 'curl', code: S.heroCurl, title: 'Shell' }]) +
      h2('three-outcomes', 'Three outcomes, never a fourth') + p('There is no warning state and no fifth door. A refusal is a correct, free outcome — never a 4xx, because clients retry 4xx.') + outcomes +
      h2('six-calls', 'Six calls, five objects') + p('KernelPort v1 has identical signatures for every consumer at every assurance level. The tenant and the actor come from the token, never from an argument. ' + a('#/developers/objects', 'Read the object model') + '.') + strip +
      h2('levels', 'What Level 1 lets you say') +
      '<div class="dv-grid dv-grid--3">' +
      card({ title: 'L1 Guarded — running now', badge: c.level('L1', { short: true }), html: 'Gates, approval, sandbox, 30-day reversal and a hash-chained record of every write, refusal and escalation. <strong>Not signed.</strong> Verification requires elan1.' }) +
      card({ title: 'L2 Attested — specified', badge: tag('Not built', 'dash'), html: 'Ed25519 over the same sixteen fields, two timestamp authorities, an eight-member bundle and a free offline verifier. Arrives when its gate closes.', href: '#/developers/seal' }) +
      card({ title: 'L3 Proven — specified', badge: tag('Not built', 'dash'), html: 'Cross-organisation receipts, selective disclosure, customer-held keys and the Action Receipt draft standard.', href: '#/developers/receipt' }) + '</div>' +
      h2('next', 'Where to go next') +
      '<div class="dv-grid">' + card({ title: 'The Right Path', body: 'Step through a commit, a refusal at rung 3 and an escalation at rung 6.', href: '#/developers/right-path' }) + card({ title: 'Declarations as code', body: 'Seven blocks, eleven semantic rules, one sentence.', href: '#/developers/declarations' }) + card({ title: 'Conformance suite', body: 'C1–C14. The suite is the claim.', href: '#/developers/conformance' }) + card({ title: 'Architecture', body: 'Context, components, planes, write path, evidence and Level 3.', href: '#/developers/architecture/context' }) + '</div>';
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/quickstart — five steps
     ------------------------------------------------------------------------ */
  function pgQuickstart() {
    var path = '/developers/quickstart';
    var install = codeTabs([{ lang: 'ts', code: 'npm install @elan1/kernel uuid\nexport ELAN1_KEY=sk_sbx_…          # shown once when it was issued', title: 'Terminal' }, { lang: 'py', code: 'pip install elan1-kernel            # Python 3.12, import elan1_kernelport\nexport ELAN1_KEY=sk_sbx_…', title: 'Terminal' }, { lang: 'curl', code: '# Exchange the key for a 5–15 minute tenant token (client credentials).\ncurl -s ' + T.auth + ' \\\n  -d grant_type=client_credentials \\\n  -d client_secret=$ELAN1_KEY \\\n  -d audience=kernelport:v1\n# {"access_token":"eyJ…","token_type":"Bearer","expires_in":900,"scope":"ro stage act"}', title: 'Shell' }]);
    var client = codeTabs([{ lang: 'ts', title: 'client.ts', code: 'import { KernelClient } from "@elan1/kernel";\nimport { v5 as uuidv5 } from "uuid";\n\n// The SDK exchanges the key for a short-lived tenant token and refreshes it.\n// One token = one tenant, one actor, one autonomy level.\nexport const k = new KernelClient({ apiKey: process.env.ELAN1_KEY!, port: "v1", timeoutMs: 5000 });\n\nexport const ERP_AR = "' + T.decl + '";   // erp.ar, from the reference fixtures\nconst TENANT_NS = "' + T.sbxTenant + '";\nexport const intentId = (changeKey: string) => uuidv5(changeKey, TENANT_NS);' },
      { lang: 'py', title: 'client.py', code: 'import os, uuid\nfrom elan1_kernelport import KernelClient\n\n# The client exchanges the key for a short-lived tenant token and refreshes it.\nk = KernelClient(api_key=os.environ["ELAN1_KEY"], port="v1", timeout_s=5.0)\n\nERP_AR = "' + T.decl + '"   # erp.ar, from the reference fixtures\nTENANT_NS = uuid.UUID("' + T.sbxTenant + '")\ndef intent_id(change_key: str) -> str:\n    return str(uuid.uuid5(TENANT_NS, change_key))' },
      { lang: 'curl', title: 'Shell', code: 'curl -s ' + T.base + '/v1/versions -H "Authorization: Bearer $ELAN1_TENANT_TOKEN"\n# {"port_major":1,"schema_major":1,"register_version":"1.0","policy_version":11}' }]);
    var scope = codeTabs([{ lang: 'ts', title: 'stage.ts', code: 'const s = await k.scope({ actor_id: AR_AGENT, write_types: ["erp.sales_invoice.submit"] });\nconst p = s.permitted[0];\n// { write_type: "erp.sales_invoice.submit", blast_radius: "one_counterparty",\n//   autonomy_level: "A2", reaches: "approval", dual_control: true }\nif (p.reaches === "none") return renderNotAvailable();   // do not render the control\n\nconst staged = await k.stage.write({\n  write_type: "erp.sales_invoice.submit",\n  payload: { customer: "ACME Textiles", items: [{ item_code: "YARN-40S", qty: 800, rate: 300 }], grand_total: 240000 },\n  as_of: "2026-09-24T08:46:00Z",\n});\nconsole.log(staged.request_id, staged.diff);   // "rq_7f3c…" — staged, no side effects' },
      { lang: 'py', title: 'stage.py', code: 's = k.scope(actor_id=AR_AGENT, write_types=["erp.sales_invoice.submit"])\np = s.permitted[0]\n# reaches="approval": A2 Propose, so a named person will decide before rung 7\nif p.reaches == "none":\n    return render_not_available()\n\nstaged = k.stage.write(\n    write_type="erp.sales_invoice.submit",\n    payload={"customer": "ACME Textiles", "items": [{"item_code": "YARN-40S", "qty": 800, "rate": 300}], "grand_total": 240000},\n    as_of="2026-09-24T08:46:00Z",\n)\nprint(staged.request_id, staged.diff)   # staged, no side effects' },
      { lang: 'curl', title: 'Shell', code: 'curl -s "' + T.base + '/v1/scope?actor_id=$AR_AGENT&write_types=erp.sales_invoice.submit" \\\n  -H "Authorization: Bearer $ELAN1_TENANT_TOKEN"\n\ncurl -s ' + T.base + '/v1/writes/stage \\\n  -H "Authorization: Bearer $ELAN1_TENANT_TOKEN" -H "Content-Type: application/json" \\\n  -d \'{"write_type":"erp.sales_invoice.submit","payload":{…},"as_of":"2026-09-24T08:46:00Z"}\'\n# {"request_id":"rq_7f3c…","valid":true,"side_effects":"none"}' }]);
    var assertC = codeTabs([{ lang: 'ts', title: 'act.ts', code: 'const res = await k.act.write(staged, { idempotencyKey: intentId("DN-2026-01142") });\n\nswitch (res.outcome) {\n  case "committed":\n    return log(`Applied · proof #${res.record.seq}`, res.undo_until);\n  case "escalated":\n    // Stop. Do not retry. A named person decides; you get obligation.resolved.\n    return park(res.decision.obligation!.obligation_id);\n  case "refused":\n    if (res.decision.code.startsWith("PLATFORM.")) return retryLater(res); // same key\n    return showOperatorAction(res.decision.code, res.operator_action);\n}' },
      { lang: 'py', title: 'act.py', code: 'res = k.act.write(staged, idempotency_key=intent_id("DN-2026-01142"))\n\nmatch res:\n    case Committed(record=r, undo_until=u):\n        log(f"Applied · proof #{r.seq}", u)\n    case Escalated(decision=d):\n        park(d.obligation.obligation_id)      # stop; wait for obligation.resolved\n    case Refused(decision=d) if d.code.startswith("PLATFORM."):\n        retry_later(res)                      # our failure: same key\n    case Refused(decision=d):\n        show_operator_action(d.code, res.operator_action)' },
      { lang: 'curl', title: 'Shell', code: 'curl -s ' + T.base + '/v1/writes \\\n  -H "Authorization: Bearer $ELAN1_TENANT_TOKEN" \\\n  -H "Idempotency-Key: 8c1d6f4a-2e0b-5c7a-9d31-4b6e2f0a7c58" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"request":{"request_id":"rq_7f3c…"}}\'' }]);
    var resp = tabs([
      { key: 'escalated', label: 'Escalated (you will see this first)', html: c.code('HTTP/1.1 200 OK\nX-Kernel-Port: v1\n\n' + J(EX.escalated), 'json', { title: 'Response' }) },
      { key: 'refused', label: 'Refused', html: c.code('HTTP/1.1 200 OK\nX-Kernel-Port: v1\n\n' + J(EX.refused), 'json', { title: 'Response' }) },
      { key: 'committed', label: 'Committed (after approval)', html: c.code('HTTP/1.1 200 OK\nX-Kernel-Port: v1\n\n' + J(EX.committed), 'json', { title: 'Response' }) }
    ], { label: 'Outcome' });
    var hook = codeTabs([{ lang: 'ts', title: 'webhook.ts', code: 'import { verifyWebhook } from "@elan1/kernel/webhooks";\n\napp.post("/elan1/events", express.raw({ type: "application/json" }), (req, res) => {\n  const evt = verifyWebhook(req.body, req.headers, process.env.ELAN1_WEBHOOK_SECRET!); // throws if > 5 min old\n  if (seen(evt.id)) return res.sendStatus(200);            // at-least-once delivery\n  if (evt.data.seq && evt.data.seq !== lastSeq() + 1) backfill(lastSeq() + 1, evt.data.seq - 1);\n  switch (evt.type) {\n    case "obligation.resolved": resubmitIfApproved(evt.data); break;  // new intent_id + obligation_ref\n    case "write.committed": markPosted(evt.data.write_id, evt.data.seq); break;\n    case "write.refused": markNotDone(evt.data.write_id, evt.data.code); break;\n  }\n  res.sendStatus(200);\n});' },
      { lang: 'py', title: 'webhook.py', code: 'from elan1_kernelport.webhooks import verify_webhook\n\n@app.post("/elan1/events")\nasync def events(request: Request):\n    evt = verify_webhook(await request.body(), request.headers, WEBHOOK_SECRET)  # 5-minute window\n    if seen(evt.id):\n        return Response(status_code=200)                # at-least-once delivery\n    seq = evt.data.get("seq")\n    if seq and seq != last_seq() + 1:\n        backfill(last_seq() + 1, seq - 1)              # GET /v1/evidence?seq_from=&seq_to=\n    if evt.type == "obligation.resolved":\n        resubmit_if_approved(evt.data)                 # new intent_id + obligation_ref\n    return Response(status_code=200)' }]);
    var html = hero({ eyebrow: 'Get started', title: 'Quickstart', lead: 'Five steps from a sandbox key to a governed write whose three outcomes you handle correctly. Everything here runs against your own sandbox tenant: its own chain marked <code>mode: sandbox</code>, metered at quantity zero.', meta: pill('Time', 'about 20 minutes') + pill('Needs', 'Node 20+ or Python 3.12') + pill('Tenant', 'sandbox') }) +
      '<ol class="dv-steps">' +
      '<li>' + h2('step-key', 'Get a sandbox key') + p('Work e-mail, company name and one line on what you intend to govern. The key <code>sk_sbx_…</code> is shown once, and your sandbox tenant is ready in under a minute (target). It comes with the reference fixtures: declaration <code>erp.ar v7</code>, customers such as ACME Textiles, and an approver account so you can resolve a real escalation yourself.') + '<div class="dv-actions" style="margin-top:8px">' + c.button('Get a sandbox key', { kind: 'primary', size: 'sm', href: '#/developers/sandbox-key', icon: 'key' }) + '</div>' + install + '</li>' +
      '<li>' + h2('step-client', 'Create a client') + p('Keys are exchanged for short-lived tenant tokens by client credentials; the SDK does this for you. MCP never accepts a static key. Derive <code>intent_id</code> from your own change key so that a retry sends the same id.') + client + '</li>' +
      '<li>' + h2('step-stage', 'Ask scope, then stage the write') + p('<code>scope</code> tells you whether to offer the action at all and whether it will need a person. <code>stage.write</code> validates the request against the declaration and returns a request object with no side effects — nothing is recorded or metered. Inspect it before you act.') + scope + '</li>' +
      '<li>' + h2('step-act', 'Act, and handle all three outcomes') + p('<code>act.write</code> is <code>assert</code>. In the sandbox your agent holds A2 Propose on <code>erp.sales_invoice.submit</code>, so the first response is an escalation at rung 6. Open it in the sandbox console as the fixture approver, approve it, and resubmit with a new intent_id and <code>obligation_ref</code> — resubmit, never resume. Then send ₹4,20,000 to see precondition refuse.') + assertC + resp +
      c.callout({ kind: 'rule', title: 'Never retry a governed refusal.', body: '<p>Retrying the same intent_id returns the same decision (I8). Retry only <code>PLATFORM.*</code> codes and HTTP 429/5xx: exponential back-off with jitter, at most five attempts, the same key.</p>' }) + '</li>' +
      '<li>' + h2('step-webhooks', 'Receive webhooks and detect gaps') + p('Register an endpoint under ' + a('#/agents/webhooks', 'Agents · Webhooks') + ', verify <code>X-Elan1-Signature</code> within the five-minute window, be idempotent on the event id, and use seq contiguity to notice a missed delivery.') + hook + '</li></ol>' +
      h2('prove', 'Before you ask for production') + p('The production review checks four things and only four. Prove each in the sandbox; the onboarding checklist ticks them from proof entries marked <code>mode: sandbox</code>.') +
      c.table({ caption: 'Production readiness', columns: [{ key: 'c', label: 'Check' }, { key: 'h', label: 'How you prove it' }, { key: 'w', label: 'Where', render: function (r) { return a(r.href, r.w); } }], rows: [
        { c: 'Enforcement mode stated in writing', h: 'Your channels[].mode matches the mode you state — and, if Enforced, the mechanism', w: 'Declarations', href: '#/developers/declarations' },
        { c: 'Every write type reversible or declared irreversible', h: 'reversal_plan XOR irreversible: true (L0-S03)', w: 'Declarations', href: '#/developers/declarations' },
        { c: 'Three outcomes proved', h: 'A commit, a real refusal and a real escalation resolved by a real person', w: 'Conformance', href: '#/developers/conformance' },
        { c: 'A named person certified the declaration', h: 'Certified in Studio by someone who is not the author', w: 'Studio', href: '#/records/studio' }] }) +
      '<div class="dv-actions">' + c.button('Run the conformance suite', { href: '#/developers/conformance', icon: 'check' }) + c.button('Request production access', { kind: 'ghost', href: '#/developers/production-request', iconRight: 'arrow-right' }) + '</div>';
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/sandbox-key — get a sandbox key (?step=form|check-email|issued, ?state=blocked|building|error)
     ------------------------------------------------------------------------ */
  var SBX_KEY = 'sk_sbx_4Tq7Lm2Vx9Kc3Rb8Nw5Zp1Hd6Fj0Gs4f2a';
  var FREE_MAIL = /@(gmail|yahoo|outlook|hotmail|rediffmail|proton|icloud|aol)\./i;
  function pgSandboxKey(params, q) {
    var path = '/developers/sandbox-key', step = q.step || 'form', st = q.state || '';
    var states = statesMenu(path, [['', 'Form'], ['blocked', 'Blocked account'], ['building', 'Sandbox still building'], ['error', 'Could not reach us']]) ;
    var steps = c.stepper([{ label: 'Tell us who you are', note: 'Work e-mail, company, one line' }, { label: 'Verify your e-mail', note: 'The key is on the other side of the link' }, { label: 'Store your key', note: 'Shown once' }], step === 'issued' ? 2 : step === 'check-email' ? 1 : 0);
    var quota = c.kv([['Rate', '10 writes a minute · 2 concurrent'], ['Monthly', '5,000 writes, then a hard stop (HTTP 429 with Retry-After)'], ['Metering', 'Quantity 0 — sandbox writes are never billed'], ['Chain', 'Its own chain, every entry marked mode: sandbox'], ['Fixtures', 'Reference tenant: erp.ar v7, ACME Textiles and more'], ['Production', 'Not self-serve. Issued by elan1 after a person reviews your request']], { cols: 2, compact: true });
    var body;
    if (st === 'blocked') {
      body = c.error({ title: 'We cannot issue a key to this account.', body: 'Write to support and a person will read it.', reassurance: 'Nothing was created and nothing was recorded against your e-mail address beyond this request.', code: 'SBX-ELIGIBILITY', action: [{ label: 'Write to support', href: '#/contact' }, { label: 'Back to the form', href: '#' + path, kind: 'ghost' }] });
    } else if (st === 'building') {
      body = c.callout({ kind: 'info', title: 'Your account is ready; the sandbox is still building.', body: '<p>We will e-mail the key within the hour. Provisioning normally takes under 60 seconds (target, p95 not yet measured in production). Nothing needs doing on your side.</p>' }) + '<div class="dv-actions">' + c.button('Read the quickstart meanwhile', { href: '#/developers/quickstart', iconRight: 'arrow-right' }) + c.button('Status page', { kind: 'ghost', href: '#/status' }) + '</div>';
    } else if (st === 'error') {
      body = c.error({ title: 'We could not reach the key service.', body: 'Your request was not sent. Try again in a minute; if it keeps failing the status page will say why.', reassurance: 'No key was issued and no account was created, so there is nothing to clean up.', code: 'PLATFORM.REGISTRY_UNAVAILABLE', action: [{ label: 'Try again', href: '#' + path }, { label: 'Status page', href: '#/status', kind: 'ghost' }] });
    } else if (step === 'check-email') {
      body = c.empty({ icon: 'mail', title: 'Check your e-mail. The key is on the other side of the link.', why: 'We sent a verification link to ' + (E1.store.get('dev.sbx.email', 'your work address')) + '. It expires in 30 minutes. The key is issued only after the link is opened, so that a key never reaches an address nobody controls.', action: [{ label: 'I have opened the link (prototype)', href: E1.href(path, { step: 'issued' }), kind: 'primary' }, { label: 'Use a different address', href: '#' + path }] });
    } else if (step === 'issued') {
      body = '<div class="dv-block">' + c.callout({ kind: 'warning', title: 'This is the only time we show the full key.', body: '<p>Store it in your secret manager now. We keep only its last four characters. If you lose it, revoke it under Agents · Keys and ask for another.</p>' }) +
        '<div class="dv-keybox" style="margin-top:12px"><span id="dv-key">' + esc(SBX_KEY) + '</span><span style="margin-left:auto">' + c.button('Copy key', { size: 'sm', icon: 'copy', attrs: 'data-copy="' + esc(SBX_KEY) + '" data-copy-label="Sandbox key"' }) + '</span></div>' +
        '<div class="e1-card" style="margin-top:16px"><div class="e1-card__body">' + c.kv([['Key', 'sk_sbx_…4f2a', { mono: true }], ['Tenant', 'Your sandbox tenant (isolated), seeded from the reference fixtures'], ['Bound actor', 'Your agent actor · A2 Propose on erp.sales_invoice.submit'], ['Scopes', 'ro · stage · act', { mono: true }], ['Issued', '24 Sep 2026, 11:02 IST'], ['Rotate by', '23 Dec 2026']], { cols: 2 }) + '</div></div>' +
        '<div style="margin-top:16px">' + c.checkbox({ id: 'dv-stored', label: 'I have stored this key somewhere safe', attrs: 'data-dv-stored' }) + '</div>' +
        '<div class="dv-actions">' + c.button('Continue to the quickstart', { kind: 'primary', href: '#/developers/quickstart', icon: 'arrow-right', attrs: 'data-dv-continue aria-disabled="true"' }) + c.button('Open the sandbox console', { kind: 'ghost', href: '#/work/today' }) + '</div>' +
        '<p class="dv-note">In the console the sandbox banner reads: “Sandbox. Every write here is recorded in its own chain marked mode: sandbox and metered at quantity zero.”</p></div>';
    } else {
      body = '<form class="dv-inline-form" data-dv-sbx novalidate>' +
        c.field('Work e-mail', c.input({ id: 'sbx-email', type: 'email', placeholder: 'dev@ledgerloop.in', describedBy: 'sbx-email-msg', value: E1.store.get('dev.sbx.email', ''), attrs: 'autocomplete="email"' }), { id: 'sbx-email', required: true, help: 'We issue keys to organisations. The link goes here.' }) +
        c.field('Company', c.input({ id: 'sbx-co', placeholder: 'LedgerLoop Software Pvt Ltd', describedBy: 'sbx-co-msg', attrs: 'autocomplete="organization"' }), { id: 'sbx-co', required: true, help: 'The organisation the key is for.' }) +
        c.field('What do you intend to govern?', c.textarea({ id: 'sbx-what', rows: 3, placeholder: 'Our billing agent posts invoices into customers’ ERPNext; we want every post evaluated and recorded.', describedBy: 'sbx-what-msg' }), { id: 'sbx-what', required: true, help: 'One line is enough. A person may read it.' }) +
        c.checkbox({ id: 'sbx-terms', label: 'I accept the pre-GA sandbox terms', note: 'Sandbox data is synthetic. Do not put real customer data in a sandbox tenant.' }) +
        '<div class="dv-actions" style="margin-top:4px">' + c.button('Send me the link', { kind: 'primary', type: 'submit', icon: 'send' }) + '<span class="e1-caption e1-muted">A key is never issued without a verified address.</span></div></form>';
    }
    var html = hero({ eyebrow: 'Get started', title: 'Get a sandbox key', lead: 'A sandbox key gives you your own isolated tenant with synthetic fixtures, its own chain and every write metered at zero. It is self-serve. A production key is not: a person at elan1 reviews every request.', actions: states }) +
      '<div style="margin:8px 0 20px">' + steps + '</div>' + body +
      h2('what-you-get', 'What you get') + quota +
      h2('limits', 'Limits and what they mean') + p('A 429 is a transport rejection. It produces no proof entry and no meter event, and the conformance suite must never report it as a refusal. Back off with jitter and retry with the same idempotency key.') +
      codeTabs([{ lang: 'http', title: 'Throttled response', code: 'HTTP/1.1 429 Too Many Requests\nRetry-After: 6\nX-RateLimit-Limit: 10\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1790324580\nX-Kernel-Port: v1\n\n{"error":"rate_limited","message":"10 writes a minute on a sandbox key. Retry after 6 seconds with the same Idempotency-Key."}' }]) +
      h2('after', 'After you have a key') + '<div class="dv-grid">' + card({ title: 'Quickstart', body: 'Scope, stage, act, three outcomes, webhooks.', href: '#/developers/quickstart' }) + card({ title: 'Author your declaration', body: 'Seven blocks; no “n/a”, no “tbd”.', href: '#/developers/declarations' }) + card({ title: 'Run the conformance suite', body: 'Attach the result file to your production request.', href: '#/developers/conformance' }) + '</div>';
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/production-request (?state=submitted|review|approved|refused)
     ------------------------------------------------------------------------ */
  var REFUSE_CATS = [
    ['No certified declaration', 'Author and certify a declaration first. The Studio is open with your sandbox key.'],
    ['Mode not stated', 'Tell us which mode, and if Enforced, which mechanism — credential custody or token acceptance.'],
    ['Irreversible without a person', 'Every irreversible write type needs a named human at rung 6.'],
    ['Basis used as a price lever', 'The basis is not a pricing parameter. Here is the mapping.'],
    ['Wants a never-skippable gate off', 'Consent, residency, retention, dual control, counterparty and precondition are not configurable. Rate, budget and schedule are.'],
    ['Needs Level 2 evidence', 'You need L2. It is not built yet. Keep talking to us and do not buy this yet.'],
    ['Outside residency domain in', 'We run in today. We will tell you when that changes.'],
    ['No named production owner', 'Give us a person, not a distribution list.']
  ];
  function pgProduction(params, q) {
    var path = '/developers/production-request', st = q.state || '';
    var states = statesMenu(path, [['', 'Request form'], ['submitted', 'Submitted'], ['review', 'In review'], ['approved', 'Approved'], ['refused', 'Refused']]);
    var checks = [
      ['Enforcement mode stated in writing and matching channels[].mode', 'll.billing v3 declares mcp → attested_advisory; request states Attested advisory'],
      ['Every write type has a reversal plan or an explicit irreversible flag', 'll.invoice.post: compensating_entry 720 h; ll.invoice.void: irreversible: true'],
      ['Three outcomes proved in sandbox, including a real refusal and a real escalation resolved by a real person', 'Committed #311 · refused #318 GATE.DUAL_CONTROL_PENDING · escalated #302 resolved by a named approver at #303'],
      ['A named person certified the declaration', 'll.billing v3 certified by Arjun Mehta, 19 Sep 2026 (author: LedgerLoop)']
    ];
    var body = '';
    if (!st) {
      var run = RUNS.ledgerloop.file;
      body = '<form class="dv-inline-form" data-dv-prod novalidate style="max-width:640px">' +
        c.field('Conformance result file', '<div class="dv-http" style="font-family:var(--font-ui)">' + c.icon('file-text', 16) + '<span><strong class="e1-mono">conformance-ledgerloop-2026-09-23.json</strong><br><span class="e1-caption e1-muted">' + run.passed + ' of ' + run.of + ' · first failure C12 rollback drill · digest ' + E1.fmt.shortHash(run.digest, 4, 4) + '</span></span><a style="margin-left:auto" href="#/developers/conformance">Replace</a></div>', { id: 'pr-file', required: true, help: 'Required. A person will read the first failure; a run with no real refusal did not exercise the product.' }) +
        c.field('Declaration and version', c.select({ id: 'pr-decl', options: [{ value: 'll.billing@3', label: 'll.billing v3 — certified 19 Sep 2026' }, { value: 'll.billing@4', label: 'll.billing v4 — draft (cannot be requested)', }], value: 'll.billing@3' }), { id: 'pr-decl', required: true }) +
        c.field('Target system', c.input({ id: 'pr-target', value: 'Customer-run ERPNext v15 via Frappe REST API' }), { id: 'pr-target', required: true }) +
        c.field('Residency domain', c.select({ id: 'pr-res', options: [{ value: 'in', label: 'in — Mumbai (ap-south-1)' }], value: 'in' }), { id: 'pr-res', required: true, help: 'We run in today. We will tell you when that changes.' }) +
        c.field('Enforcement mode', c.select({ id: 'pr-mode', options: [{ value: 'attested_advisory', label: 'Attested advisory — we hold the target credential' }, { value: 'enforced_custody', label: 'Enforced — credential custody (elan1 holds it)' }, { value: 'enforced_token', label: 'Enforced — token acceptance (target accepts kernel tokens)' }], value: 'attested_advisory' }), { id: 'pr-mode', required: true, help: 'Must match channels[].mode in the declaration version above.' }) +
        c.field('Named production owner', c.input({ id: 'pr-owner', placeholder: 'Asha Rao, Head of Engineering', describedBy: 'pr-owner-msg' }), { id: 'pr-owner', required: true, help: 'A person, not a distribution list. They answer for production.' }) +
        c.field('Notice contact', c.input({ id: 'pr-notice', type: 'email', placeholder: 'name@company.in', describedBy: 'pr-notice-msg' }), { id: 'pr-notice', required: true, help: 'No contact, no production key: deprecation notices go here.' }) +
        '<div class="dv-actions">' + c.button('Submit for review', { kind: 'primary', type: 'submit', icon: 'send' }) + '<span class="e1-caption e1-muted">A person reads this. Two working days.</span></div></form>';
    } else {
      var idx = { submitted: 0, review: 1, approved: 2, refused: 2 }[st];
      body = '<div class="e1-card"><div class="e1-card__body">' + c.kv([['Request', 'PR-0042', { mono: true }], ['Organisation', 'LedgerLoop Software Pvt Ltd'], ['Submitted', '24 Sep 2026, 11:20 IST'], ['Reviewer', idx ? 'Kavya Menon (onboarding reviewer, elan1)' : 'Not yet assigned'], ['Declaration', 'll.billing v3', { mono: true }], ['Mode', 'Attested advisory (MCP)']], { cols: 2 }) + '</div></div>' +
        '<div style="margin:16px 0">' + c.stepper([{ label: 'Submitted', note: '24 Sep, 11:20 IST' }, { label: 'In review', note: 'The four checks' }, { label: st === 'refused' ? 'Refused' : 'Approved', note: st === 'refused' ? 'With the sentence below' : 'sk_live_… shown once' }], st === 'approved' || st === 'refused' ? 3 : idx) + '</div>';
      if (st === 'submitted') body += c.callout({ kind: 'info', title: 'A person reads this. Two working days.', body: '<p>We check four things and only four. You will get an e-mail at the notice contact either way, with the reason if we refuse.</p>' });
      if (st === 'review' || st === 'approved') body += h3('checks', 'The four checks') + c.table({ caption: 'Review checks', columns: [{ key: 'c', label: 'Check' }, { key: 'e', label: 'Evidence' }, { key: 's', label: 'Result', render: function (r) { return r.s ? c.badge('good', 'Passed') : c.badge('neutral', 'Not checked yet'); } }], rows: checks.map(function (x, i) { return { c: x[0], e: x[1], s: st === 'approved' || i < 2 }; }) });
      if (st === 'approved') body += h3('issued', 'Your production key') + c.callout({ kind: 'warning', title: 'Shown once.', body: '<p>Scoped to tenant <code>ledgerloop</code>, residency domain <code>in</code>, write types <code>ll.invoice.post</code> and <code>ll.invoice.void</code>. Production quota is set by your plan.</p>' }) +
        '<div class="dv-keybox" style="margin-top:12px"><span>elan1_live_8Hc2Wq5Tz1Lr7Mv3Pk9Xb4Ns6Dj0Ey9d1c</span><span style="margin-left:auto">' + c.button('Copy key', { size: 'sm', icon: 'copy', attrs: 'data-copy="elan1_live_8Hc2Wq5Tz1Lr7Mv3Pk9Xb4Ns6Dj0Ey9d1c" data-copy-label="Production key"' }) + '</span></div>' +
        p('Your first governed action will read “Applied · proof #1” — seq 1, prev_digest 32 zero octets, mode: live — with its undo window.');
      if (st === 'refused') body += h3('refused', 'Not issued — mode not stated') + c.callout({ kind: 'caveat', title: 'Tell us which mode, and if Enforced, which mechanism — credential custody or token acceptance.', body: '<p>Your declaration ll.billing v3 declares <code>channels[].mode: enforced</code> for the mcp channel, and the request does not state a mode. If your agent holds the ERPNext credential, the honest mode is Attested advisory: change the declaration (a new certified version) or state the mechanism. Reviewed by Kavya Menon, 25 Sep 2026, 16:40 IST. This refusal is recorded; nothing else about your sandbox changes.</p>' }) + '<div class="dv-actions">' + c.button('Edit and resubmit', { kind: 'primary', href: '#' + path }) + c.button('Open the declaration guide', { kind: 'ghost', href: '#/developers/declarations' }) + '</div>';
    }
    var html = hero({ eyebrow: 'Get started', title: 'Request production access', lead: 'Production keys are issued by elan1 after a person reviews your request — never self-serve. Attach your conformance result file, name a production owner and state your enforcement mode in writing.', actions: states }) + body +
      h2('four-checks', 'What the reviewer checks') + p('Four things and only four. Nothing else delays a key.') + '<ol>' + checks.map(function (x) { return '<li>' + esc(x[0]) + '</li>'; }).join('') + '</ol>' +
      h2('who-we-refuse', 'Who we refuse, and what we say') + p('Eight categories, each with the sentence you will receive. A refusal is recorded; you can resubmit once the cause is fixed.') +
      c.table({ caption: 'Refusal categories', columns: [{ key: 'k', label: 'Category' }, { key: 's', label: 'What we say' }], rows: REFUSE_CATS.map(function (r) { return { k: r[0], s: '“' + r[1] + '”' }; }) }) +
      h2('after-approval', 'After approval') + p('Production writes still pass the shadow sandbox at rung 7. Promotion from Attested advisory to Enforced is per write type and needs at least 30 days of advisory traffic, a bypass proof, no long-lived credential and a rollback drill by both paths — ' + a('#/assurance/enforcement', 'see Enforcement') + '.');
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/kernelport — six calls, five objects
     ------------------------------------------------------------------------ */
  var INV = [
    ['I1', 'A model may produce a write intent, never an allow. Rungs 3, 4, 5, 6 and 8 are unreachable from any model (import-graph check, C1).'],
    ['I2', 'Single writer. One process per tenant writes to the target, on a single-use ten-minute credential.'],
    ['I3', 'Fail closed. No grant → A0; a missing gate result counts as a failure; an outage is a platform refusal.'],
    ['I4', 'Refusals are free and typed: one rung, class and operator action; quantity 0 by CHECK.'],
    ['I5', 'No fast path, batch variant, admin mode, decision cache or second implementation.'],
    ['I6', 'No warn. Three outcomes, never a fourth.'],
    ['I7', 'Nothing resolves to “latest”; every decision records its policy_version.'],
    ['I8', 'Determinism. The same intent, versions and as_of give the same decision, for ever.']
  ];
  function pgKernelport() {
    var path = '/developers/kernelport';
    var callsTable = c.table({ caption: 'KernelPort v1 calls', columns: [
      { key: 'n', label: 'Call', render: function (r) { return '<a class="e1-mono" href="#/developers/kernelport/' + r.k + '"><strong>' + r.k + '</strong></a>'; } },
      { key: 'p', label: 'Does' }, { key: 't', label: 'Token', mono: true, nowrap: true }, { key: 'ch', label: 'Changes a record?' }, { key: 'i', label: 'Idempotent on', mono: true }],
      rows: CALLS.map(function (k) { var d = KP[k]; return { k: k, p: d.short, t: d.token, ch: k === 'assert' ? 'Yes — the only call that can' : 'No', i: d.idem.split(' (')[0] }; }) });
    var objs = '<div class="dv-grid dv-grid--3">' + [
      ['Write intent', 'A request, never a permission. intent_id, declaration_id + integer version, write_type, actor, channel, subject, payload, as_of.', 'write-intent'],
      ['Decision', 'Produced by assert. disposition allow · refuse · escalate, rung, code, gate, policy_version, every gate result, reversal plan.', 'decision'],
      ['Approval', 'Itself a governed write, not a flag. A person who is not the proposer; decision approve · decline; what they saw.', 'approval'],
      ['Record', 'The proof object: sixteen frozen fields F01–F16, SHA-256 over a length-prefixed preimage. Unsigned at Level 1.', 'record'],
      ['Meter event', 'Exactly one per governed write. Quantity 1 committed, 0 every refusal and escalation.', 'meter-event']
    ].map(function (o) { return card({ title: o[0], body: o[1], href: '#/developers/objects' }); }).join('') + '</div>';
    var matrix = c.table({ caption: 'Outcome matrix', columns: [{ key: 'k', label: '' }, { key: 'r', label: 'Refusal' }, { key: 'j', label: 'Rejection' }, { key: 'p', label: 'Platform failure' }],
      rows: [{ k: 'HTTP', r: '200', j: '4xx', p: '5xx, or 200 + PLATFORM.* code' }, { k: 'Record', r: 'Full record', j: 'None', p: 'Full record' }, { k: 'Meter · retry', r: 'Qty 0 · never retry', j: 'None · fix the request', p: 'Not billed · same intent_id' }] });
    var html = hero({ eyebrow: 'Build', title: 'KernelPort: six calls, five objects', lead: 'The whole contract between your code and the kernel. Identical signatures for every consumer — rung1, stack1 tools, third-party agents — at every assurance level. Consumers hold identifiers and enumerations, never a kernel internal.', meta: pill('Header', 'X-Kernel-Port: v1') + pill('SDK major', '= port major') + pill('Status', 'Level 1 — being built; Level 2 fields frozen') }) +
      h2('calls', 'The six calls') + callsTable + p('<code>seal</code> is kernel-only and is not exported; it is documented so you know exactly what rung 8 guarantees.') +
      h2('objects', 'The five objects') + objs +
      h2('invariants', 'Eight invariants') + '<div class="e1-table-wrap"><table class="e1-table"><caption class="e1-sr">Invariants</caption><thead><tr><th scope="col" style="width:64px">Id</th><th scope="col">Invariant</th></tr></thead><tbody>' + INV.map(function (x) { return '<tr><th scope="row" class="e1-mono">' + x[0] + '</th><td>' + esc(x[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      h2('outcome-matrix', 'Refusal, rejection and platform failure') + p('Three different things. A refusal is a governed outcome with a record; a rejection is a malformed request that never reached the kernel; a platform failure is our fault and is never billed.') + matrix +
      h2('tokens', 'Tokens and scopes') + p('Three token classes, and no fourth. The tenant and the actor kind come from the token, never from an argument.') +
      c.table({ caption: 'Token classes', columns: [{ key: 'c', label: 'Class', mono: true }, { key: 'w', label: 'Reaches' }, { key: 's', label: 'Scopes', mono: true }], rows: [
        { c: 'tenant', w: 'One tenant, one actor, one autonomy level. The only class that reaches /v1/writes.', s: 'ro · stage · act' },
        { c: 'control', w: 'Studio, registry, /v1/declarations, /v1/actors, /v1/tenants. No network route to any record store.', s: 'ctl' },
        { c: 'ops', w: 'Read-only operations. No tenant data. Break-glass is itself a governed write.', s: 'ro' }] }) +
      p('Claims (illustrative): <code>iss</code>, <code>aud: kernelport:v1</code>, <code>cls</code>, <code>tid</code>, <code>sub</code>, <code>akd</code>, <code>scp[]</code>, <code>spn</code> (sponsor — an agent token with no sponsor is refused: “This action needs a person behind it”), <code>obo</code>, <code>rdom: "in"</code>, <code>iat</code>, <code>exp</code> (5–15 minutes).');
    return wrap(path, html);
  }

  function pgCall(pr) {
    var k = pr.call, d = KP[k], path = '/developers/kernelport/' + k;
    if (!d) {
      return wrap(path, hero({ eyebrow: 'KernelPort', title: 'There is no call named “' + k + '”', lead: 'KernelPort v1 has exactly six calls. There is no generic write, no admin call and no seventh call.' }) +
        c.empty({ icon: 'code', title: 'Call not found', why: 'The contract is closed: define · assert · seal · verify · scope · refuse. A change to it needs a new port major and 12 months’ notice.', action: [{ label: 'The six calls', href: '#/developers/kernelport', kind: 'primary' }, { label: 'Versioning policy', href: '#/developers/versioning' }] }), { pager: false });
    }
    var sig = d.http ? http(d.http[0], d.http[1], d.token) : '<div class="dv-http">' + c.icon('lock', 14) + '<span>Not exported. Kernel chain writer only.</span></div>';
    var surf = c.kv([['HTTP', d.http ? d.http[0] + ' ' + d.http[1] : 'Not exposed', { mono: true }], ['MCP tool', d.mcp || 'Not exposed', { mono: true }], ['TypeScript', d.sdk || 'Not exported', { mono: true }], ['Python', d.py || 'Not exported', { mono: true }], ['Token', d.token, { mono: true }], ['Idempotent on', d.idem.split(' (')[0], { mono: true }]], { cols: 2, compact: true });
    var examples = '';
    if (k === 'assert') {
      examples = h2('request', 'Example request') + codeTabs([
        { lang: 'ts', title: 'assert.ts', code: 'const res = await k.assert(' + J(EX.intent).replace(/"([a-z_]+)":/g, '$1:') + ');' },
        { lang: 'py', title: 'assert.py', code: 'res = k.assert_(Intent(**' + J(EX.intent).replace(/null/g, 'None') + '))' },
        { lang: 'curl', title: 'Shell', code: 'curl -s ' + T.base + '/v1/writes \\\n  -H "Authorization: Bearer $ELAN1_TENANT_TOKEN" \\\n  -H "Idempotency-Key: ' + EX.intent.intent_id + '" \\\n  -H "Content-Type: application/json" \\\n  -d \'' + JSON.stringify(EX.intent) + '\'' },
        { lang: 'mcp', title: 'tools/call', code: J({ jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'act.write', arguments: { request: { request_id: 'rq_7f3c2a91' }, idempotency_key: EX.intent.intent_id } } }) }]) +
        h2('responses', 'Responses') + p('Every response is HTTP 200 with <code>X-Kernel-Port: v1</code>. A refusal is a result, not an error: it carries every declared gate result, the rung, the code, the operator action and a full proof entry with a zeroed record_id. Only <code>PLATFORM.*</code> codes may be retried, with the same intent_id.') +
        tabs([
          { key: 'committed', label: 'Committed', html: c.code(J(EX.committed), 'json', { title: '200 · committed' }) },
          { key: 'refused', label: 'Refused (gate)', html: c.code(J(EX.refused), 'json', { title: '200 · refused at rung 3' }) },
          { key: 'escalated', label: 'Escalated', html: c.code(J(EX.escalated), 'json', { title: '200 · escalated at rung 6' }) },
          { key: 'platform', label: 'Refused (platform)', html: c.code(J(EX.platform), 'json', { title: '200 · PLATFORM.TARGET_UNREACHABLE — retry, same intent_id' }) },
          { key: 'pending', label: 'Committed · proof pending', html: c.code(J({ outcome: 'committed', decision: { write_id: EX.committed.decision.write_id, disposition: 'allow', rung: 7 }, record: { status: 'pending' }, record_id: EX.committed.record_id, record_version: 1, undo_until: EX.committed.undo_until }), 'json', { title: '200 · the chain append missed its deadline; it pages at 5 minutes' }) },
          { key: 'rejection', label: 'Rejection (4xx)', html: c.code('HTTP/1.1 422 Unprocessable Entity\nX-Kernel-Port: v1\n\n' + J({ error: 'invalid_intent', field: 'declaration_version', message: '"latest" is not accepted for this key. Send an explicit integer, e.g. 7.' }), 'json', { title: '422 · never reached the kernel — no record, no meter event' }) }
        ], { label: 'Outcome' }) +
        h2('resubmit', 'Resubmit after an approval') + p('An escalation is resubmitted, never resumed. The approved intent climbs rungs 0b–6 again with a <strong>new intent_id</strong> and <code>obligation_ref</code>; G4 dual control now finds a second named actor. One approved decision therefore shows three proof entries: escalation #4,099 → resolution #4,100 → commit #4,101.') +
        codeTabs([{ lang: 'ts', title: 'resubmit.ts', code: 'const again = { ...intent, intent_id: intentId("DN-2026-01142#approved"), obligation_ref: evt.data.obligation_id };\nconst res = await k.assert(again);   // → committed, seq 4101' }, { lang: 'py', title: 'resubmit.py', code: 'again = intent.resubmission(obligation_ref=obligation_id)   # new intent_id\nres = k.assert_(again)                                        # -> Committed, seq 4101' }]);
    } else if (k === 'verify') {
      examples = h2('example', 'Example') + codeTabs([
        { lang: 'ts', title: 'verify.ts', code: 'const v = await k.verify({ seq_from: 1, seq_to: 4112 });\n// { result: "pass", range: { seq_from: 1, seq_to: 4112 }, records_checked: 4112, write_types: 19 }\n\nconst bad = await k.verify({ seq_from: 1, seq_to: 10000 });   // reference tenant, C9 fixture\n// { result: "fail", records_checked: 5003, write_types: 7,\n//   failure: { seq: 5004, field: "F03 prev_digest", reason: "does not equal digest(seq 5003)" } }' },
        { lang: 'py', title: 'verify.py', code: 'v = k.verify(seq_from=1, seq_to=4112)\nassert v.result in ("pass", "fail", "not_checked")   # three-valued, never a bare tick\nprint(f"{v.result} · seq {v.range.seq_from}–{v.range.seq_to} · {v.records_checked} records · {v.write_types} write types")' },
        { lang: 'curl', title: 'Shell', code: 'curl -s "' + T.base + '/v1/evidence/verify?seq_from=1&seq_to=4112" -H "Authorization: Bearer $ELAN1_TENANT_TOKEN"' }]) +
        c.callout({ kind: 'caveat', title: 'At Level 1, verify requires us.', body: '<p>Say it to your customer in those words. The check runs inside elan1, so it is evidence for the chain holder, not for someone who does not trust elan1. An independent check needs a signed bundle and the offline verifier, which arrive at Level 2.</p>' });
    } else if (k === 'scope') {
      examples = h2('example', 'Example') + codeTabs([
        { lang: 'ts', title: 'scope.ts', code: 'const s = await k.scope({ actor_id: AR_AGENT, write_types: ["erp.sales_invoice.submit", "erp.sales_invoice.cancel", "erp.payment_run.submit"] });' },
        { lang: 'py', title: 'scope.py', code: 's = k.scope(actor_id=AR_AGENT, write_types=["erp.sales_invoice.submit", "erp.sales_invoice.cancel", "erp.payment_run.submit"])' },
        { lang: 'curl', title: 'Shell', code: 'curl -s "' + T.base + '/v1/scope?actor_id=' + T.arAgent + '&write_types=erp.sales_invoice.submit,erp.sales_invoice.cancel,erp.payment_run.submit" \\\n  -H "Authorization: Bearer $ELAN1_TENANT_TOKEN"' }]) +
        c.code(J({ declaration_version: 7, permitted: [
          { write_type: 'erp.sales_invoice.submit', blast_radius: 'one_counterparty', autonomy_level: 'A2', reaches: 'approval', dual_control: true },
          { write_type: 'erp.sales_invoice.cancel', blast_radius: 'one_counterparty', autonomy_level: 'A2', reaches: 'approval', dual_control: true },
          { write_type: 'erp.payment_run.submit', blast_radius: 'batch', autonomy_level: 'A0', reaches: 'none', dual_control: true }] }), 'json', { title: 'Response · 200' }) +
        p('Render nothing for <code>reaches: "none"</code>; label <code>reaches: "approval"</code> controls “Needs approval” before they are pressed.');
    } else if (k === 'define') {
      examples = h2('example', 'Example') + codeTabs([
        { lang: 'ts', title: 'define.ts', code: 'import { ControlClient } from "@elan1/kernel/control";\nconst control = new ControlClient({ token: process.env.ELAN1_CONTROL_TOKEN!, port: "v1" });\n\nconst r = await control.define({\n  declaration: await loadYaml("declarations/erp.ar.yaml"),\n  version: 8,                          // exactly last + 1\n  certifier_id: ARJUN_MEHTA,           // a named person who is not the author\n  supersedes: 7,\n});' },
        { lang: 'curl', title: 'Shell', code: 'curl -s ' + T.base + '/v1/declarations/' + T.decl + '/versions \\\n  -H "Authorization: Bearer $ELAN1_CONTROL_TOKEN" -H "Content-Type: application/json" \\\n  -d @erp.ar.v8.json' }]) +
        c.code(J({ declaration_id: T.decl, version: 8, compiled_digest: dg('b21c', '9e07', 'erp.ar v8'), write_types: [{ name: 'erp.sales_invoice.submit', meter_basis: 'per_counterparty', blast_radius: 'one_counterparty' }, { name: 'erp.sales_invoice.cancel', meter_basis: 'per_counterparty', blast_radius: 'one_counterparty' }, { name: 'erp.credit_note.submit', meter_basis: 'per_counterparty', blast_radius: 'one_counterparty' }] }), 'json', { title: 'Response · 200 — “Accepted at version 8”' }) +
        c.code(J(exampleFor(findCode('POLICY.DECLARATION_INVALID'))), 'json', { title: 'Response · 200 — refused: the first failing rule, with its block and field' });
    } else if (k === 'refuse') {
      examples = h2('example', 'Example') + codeTabs([
        { lang: 'ts', title: 'adapter.ts', code: '// A Mode A adapter saw the live re-run disagree with the shadow sandbox.\nawait k.refuse({ write_id, code: "GATE.SANDBOX_DIVERGED", context: { field: "actual_qty", sandbox: 1200, live: 1180 } });' },
        { lang: 'py', title: 'adapter.py', code: 'k.refuse(write_id=write_id, code="GATE.SANDBOX_DIVERGED",\n         context={"field": "actual_qty", "sandbox": 1200, "live": 1180})' }]) +
        c.code(J(exampleFor(findCode('GATE.SANDBOX_DIVERGED'))), 'json', { title: 'Response · 200 — same shape as a refused assert' });
    } else if (k === 'seal') {
      examples = h2('preimage', 'What rung 8 computes') + c.code('preimage = LP("elan1.proof.seal.v6") ‖ LP(enc F01) ‖ LP(enc F02) ‖ … ‖ LP(enc F16)\nLP(x)    = uint32_BE(len(x)) ‖ x\ndigest   = SHA-256(preimage)                      # 32 octets, 64 lowercase hex\n\n# seq 4,101 (erp.sales_invoice.submit, ar-agent, A2)\nseq         4101\nprev_digest ' + CHAIN[4100] + '\ndigest      ' + CHAIN[4101], 'text', { title: 'Rung 8' }) +
        p('Read the full field table, encodings and test vectors in ' + a('#/developers/seal', 'Seal v6') + '. Records written at Level 1 stay Level 1 and are never back-signed.');
    }
    var codes = d.codes.length ? h2('codes', 'Refusal codes this call returns') + c.table({ caption: 'Codes', columns: [{ key: 'code', label: 'Code', render: function (r) { return '<a class="e1-mono" href="#/developers/refusals/' + esc(r.code) + '">' + esc(r.code) + '</a>'; } }, { key: 'rung', label: 'Rung', mono: true }, { key: 'title', label: 'Plain title' }, { key: 'action', label: 'Operator action' }], rows: d.codes.map(findCode).filter(Boolean) }) : '';
    var html = hero({ eyebrow: 'KernelPort v1 · call ' + (CALLS.indexOf(k) + 1) + ' of 6', title: k, lead: esc(d.purpose), meta: tag(d.token) + (k === 'assert' ? tag('Changes a record', 'accent') : tag('Changes no record')) + (k === 'seal' ? tag('Not exported', 'dash') : '') }) +
      sig + '<div style="margin-top:12px">' + surf + '</div>' +
      h2('never', 'Never') + '<ul>' + d.never.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
      h2('request-fields', k === 'assert' ? 'Request: the write intent' : 'Request') + params(null, d.req) +
      h2('response-fields', 'Response') + params(null, d.res) + examples + codes;
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/objects — object model reference
     ------------------------------------------------------------------------ */
  var F16 = [
    ['F01', 'tenant_id', 'uuid · 16', 'token', 'Whose chain this is'], ['F02', 'seq', 'uint64 · 8', 'rung 8', 'Starts at 1 and never skips'], ['F03', 'prev_digest', 'digest · 32', 'rung 8', 'Thirty-two zero octets at genesis'],
    ['F04', 'write_id', 'uuid · 16', 'intake', 'The write this records'], ['F05', 'write_type', 'string · 5–64', 'rung 2', '<slug>.<verb>'], ['F06', 'declaration_id', 'uuid · 16', 'rung 2', 'Which declaration governed it'],
    ['F07', 'declaration_version', 'uint32 · 4', 'rung 2', 'Never “latest”'], ['F08', 'policy_version', 'uint32 · 4', 'rung 4', 'Resolved by the kernel; 0 if rung 4 was not reached'], ['F09', 'actor_id', 'uuid · 16', 'rung 1', 'Who asked (pseudonymous)'],
    ['F10', 'actor_kind', 'enum · 5 or 6', 'rung 1', 'human · agent · system — never inferred'], ['F11', 'autonomy_level', 'uint8 · 1', 'rung 6', '0–5 → A0–A5'], ['F12', 'record_id', 'uuid · 16', 'rung 7', 'Zero UUID on a refusal or escalation'],
    ['F13', 'record_version', 'uint32 · 4', 'rung 7', '0 on a refusal'], ['F14', 'payload_hash', 'digest · 32', 'rung 7', 'Salted, canonicalised payload commitment'], ['F15', 'lexicon_hash', 'digest · 32', 'rung 2', 'The term set in force'],
    ['F16', 'recorded_at', 'timestamp · 20', 'rung 8', 'Platform clock, YYYY-MM-DDTHH:MM:SSZ']
  ];
  function objTable(rows) { return params(null, rows.map(function (r) { return { n: r[0], t: r[1], req: r[2] === 'yes', d: r[3] }; })); }
  function pgObjects() {
    var path = '/developers/objects';
    var html = hero({ eyebrow: 'Concepts', title: 'Object model', lead: 'Five objects cross KernelPort: the write intent you send, the decision assert returns, the approval a person makes, the record the chain keeps and the meter event. Two more are nested: gate results and the obligation.', meta: pill('Identifiers', 'uuid on the wire') + pill('Primary human handle', 'proof #4,101') }) +
      h2('write-intent', 'Write intent') + p('A request, never a permission.') + objTable([
        ['intent_id', 'uuid', 'yes', 'Client-generated idempotency key; HTTP/MCP <code>idempotency_key</code> maps to it (UUIDv5).'], ['tenant_id', 'uuid', 'yes', 'From the token. A body mismatch is a rejection and an alert, not a refusal.'], ['declaration_id', 'uuid', 'yes', ''],
        ['declaration_version', 'uint32', 'yes', 'Explicit integer. “latest” is a 4xx rejection; sandbox keys only may use it.'], ['write_type', 'string', 'yes', 'Must exist at that version.'], ['actor_id', 'uuid', 'yes', ''],
        ['actor_kind', 'human · agent · system', 'yes', 'The token is authoritative; never inferred.'], ['on_behalf_of', 'uuid', 'no', 'Confers accountability, never autonomy.'], ['subject', 'object | null', 'yes', 'Target record reference; null for a create.'],
        ['payload', 'object', 'yes', 'Proposed field values.'], ['as_of', 'RFC 3339', 'yes', 'Business instant; supplied, never taken from a clock.'], ['channel', 'string', 'yes', 'Must be listed in block 7 for this write type.'],
        ['reason', 'string', 'no', 'Recorded, never evaluated.'], ['obligation_ref', 'uuid', 'no', 'Present only on the resubmission after approval.']]) +
      h2('decision', 'Decision') + p('Produced by assert. It never changes once written.') + objTable([
        ['write_id', 'uuid', '', 'Kernel-assigned. Equals Record F04.'], ['disposition', 'allow · refuse · escalate', '', 'There is no fourth.'], ['rung', 'uint8', '', 'The rung that produced it (“0b” for a stop).'],
        ['code', 'string', '', 'Iff refuse — a register code.'], ['gate', 'string', '', 'Iff the code is gate class.'], ['obligation', 'Obligation', '', 'Iff escalate.'],
        ['policy_version', 'uint32', '', 'Resolved by the kernel.'], ['declaration_version', 'uint32', '', 'Echoed.'], ['autonomy_level', 'A0–A5', '', 'Held at that instant.'],
        ['blast_radius', 'enum', '', 'one_record · one_counterparty · batch · tenant · cross_boundary, ordered in that sequence.'], ['gate_results[]', 'GateResult[]', '', '<strong>One row per declared gate, in declared order, pass or fail.</strong>'], ['reversal_plan', 'object', '', 'Absent only when the write type is irreversible.']]) +
      h3('gate-result', 'GateResult (nested)') + objTable([['name', 'string', '', 'One of nine: consent, residency, retention, dual_control, rate, budget, counterparty, schedule, precondition.'], ['position', 'uint8', '', 'Declared order — semantic, not the G-number.'], ['outcome', 'pass · fail · pending', '', '<code>pending</code> only for G4 on a first submission.'], ['code', 'string', '', 'On fail.'], ['inputs_hash', 'sha256', '', 'Inputs are shown to auditors, not in the response.'], ['declaration_version · as_of', '', '', 'What it ran against.']]) +
      h3('obligation', 'Obligation (nested in an escalating decision)') + objTable([['obligation_id', 'uuid', '', 'Displayed as OB-2026-0412 in the console.'], ['raised_at_rung', '4 or 6', '', 'Rung 6 is the single place obligations are created.'], ['resolver_roles · resolver_ids', 'string[] · uuid[]', '', '<strong>Humans only</strong>, e.g. <code>ar-approvers</code>.'], ['quorum', 'smallint', '', 'Default 1; 2 for tenant or cross_boundary radius.'], ['expires_at', 'timestamptz', '', 'Default 4 h, asserted, not observed; per write type override. Effective deadline = expires_at + paused_seconds.'], ['status', 'open · approved · declined · expired', '', ''], ['escalation_seq', 'uint64', '', 'The proof entry of the escalation.']]) +
      h2('approval', 'Approval') + p('An approval is itself a governed write. It is not a flag.') + objTable([['approval_id', 'uuid', '', ''], ['write_id', 'uuid', '', 'The write being approved.'], ['approval_write_id', 'uuid', '', 'The approval’s own governed write, with its own seq.'], ['approver_id', 'uuid', '', '≠ requester where G4 applies (also a database CHECK).'], ['approver_kind', 'human', '', 'Human only at Level 1. Agents never approve.'], ['decision', 'approve · decline', '', 'The console button says Reject; the data value is decline. A decline needs a reason of at least a sentence.'], ['basis', 'object', '', '{surface_plan, rendered_payload_digest, channel, step_up} — what the approver saw.'], ['at', 'RFC 3339', '', 'Platform clock.']]) +
      h2('record', 'Record — the sixteen fields') + p('Hash-chained, unsigned at Level 1. The preimage is <code>LP("elan1.proof.seal.v6") ‖ LP(enc F01) ‖ … ‖ LP(enc F16)</code> and the digest is SHA-256 over it. At Level 1 there is no <code>signature</code>, <code>key_id</code> or <code>anchor_ref</code> member — absent, not null, not an empty string.') +
      c.table({ caption: 'Sixteen fields', dense: true, columns: [{ key: 'f', label: '#', mono: true }, { key: 'n', label: 'Field', mono: true }, { key: 't', label: 'Type · octets', mono: true, nowrap: true }, { key: 'at', label: 'Produced at', nowrap: true }, { key: 'd', label: 'Rule' }], rows: F16.map(function (r) { return { f: r[0], n: r[1], t: r[2], at: r[3], d: r[4] }; }) }) +
      p('Kept <strong>beside</strong> the record, outside the preimage: the digest, assurance_level, the refusal code, gate results, the reversal plan, one meter event and the separate approval record. The console also shows <code>mode: live | sandbox</code> and the enforcement mode beside the record; neither is a sealed field.') +
      h2('meter-event', 'Meter event') + p('Exactly one per governed write. Every invoice line traces to a record.') + objTable([['event_id', 'uuid', '', ''], ['write_id · seq', 'uuid · uint64', '', ''], ['basis', 'enum', '', 'From the declared blast radius: per record · per counterparty · per batch · per tenant · per crossing. Never per customer.'], ['quantity', '0 | 1', '', '1 only when outcome = committed ∧ key_class = production ∧ meter_class = governed_action. A database CHECK enforces 0 for every refusal.'], ['outcome', 'committed · refused · escalated', '', ''], ['at', 'RFC 3339', '', 'Platform clock.']]) +
      h2('states', 'Write outcome states') + c.code('received → rejected (4xx, no record)\n         → refused @ rung n        (record, qty 0)\n         → escalated @ rung 4 or 6 (record, qty 0) → resubmitted with obligation_ref\n         → committed               (seq, digest, undo_until)\n         → committed · proof pending (record.status = "pending"; pages at 5 min)\ncommitted → reversed (a new governed write)', 'text', { title: 'State machine' });
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/right-path — interactive stepper (?scenario=commit|refuse|escalate|stopped|platform)
     ------------------------------------------------------------------------ */
  var ST_WORD = { pass: ['good', 'check', 'Passed'], stop: ['neutral', 'refuse', 'Refused here'], esc: ['warning', 'gate', 'Escalated here'], skip: ['neutral', 'minus', 'Not reached'], rec: ['info', 'proof', 'Recorded'], zero: ['info', 'check', 'Metered at 0'], none: ['neutral', 'minus', 'No record'] };
  function ladderHtml(sc, cur) {
    var states = rungStates(sc), s = SCEN[sc];
    return '<ol class="dv-ladder" aria-label="The Right Path, ' + esc(s.label) + '">' + RUNGS.map(function (r, i) {
      var stt = states[i], w = ST_WORD[stt]; if (stt === 'stop' && s.outcome === 'platform') w = ['critical', 'alert', 'Platform failure'];
      var shown = cur === null || i <= cur;
      return '<li class="dv-rung' + (i === cur ? ' is-current' : '') + (stt === 'skip' || stt === 'none' ? ' is-skipped' : '') + (stt === 'zero' ? ' is-zero' : '') + '"' + (i === cur ? ' aria-current="step"' : '') + '>' +
        '<span class="dv-rung__n">' + esc(r.n) + '</span><span><span class="dv-rung__name">' + esc(r.name) + '</span><br><span class="dv-rung__rule">' + esc(r.rule) + '</span></span>' +
        '<span class="dv-rung__st e1-tone--' + (shown ? w[0] : 'neutral') + '">' + (shown ? c.icon(w[1], 14) + esc(w[2]) : '<span class="e1-muted">…</span>') + '</span></li>';
    }).join('') + '</ol>';
  }
  function panelHtml(sc, cur) {
    var s = SCEN[sc], i = cur === null ? 9 : cur, r = RUNGS[i], states = rungStates(sc), stt = states[i];
    var head = 'Rung ' + r.n + ' · ' + r.name;
    var what = { pass: 'Passed. The write climbs to the next rung.', stop: s.outcome === 'platform' ? 'Our failure. Nothing was applied; the entry is recorded at rung 8, not billed, and on-call is paged.' : 'Refused here. Every later rung up to 7 is not reached; rung 8 still records the refusal and rung 9 meters it at 0.', esc: 'Escalated. An obligation opens for a named person; rung 7 is never reached. The ladder climbs again from 0b on resubmission.', skip: 'Not reached for this write.', rec: 'Recorded: seq ' + (s.seq ? E1.fmt.num(s.seq) : '—') + ', prev_digest chained, SHA-256 over sixteen fields.', zero: 'One meter event, quantity 0 — refusals and escalations are free.', none: 'A stopped tenant writes no record and no meter event.' }[stt];
    return '<p class="e1-eyebrow">' + esc(s.label) + ' · step ' + (i + 1) + ' of 10</p><h3 class="dv-h3" style="margin:0">' + esc(head) + '</h3><p class="e1-caption">' + esc(what) + '</p>' +
      '<dl class="dv-kvs"><dt>Rule</dt><dd>' + esc(r.rule) + '</dd><dt>Can raise</dt><dd>' + (r.codes.length ? r.codes.map(function (x) { return x.indexOf('*') > 0 ? mono(x) : '<a class="e1-mono" href="#/developers/refusals/' + esc(x) + '">' + esc(x) + '</a>'; }).join('<br>') : '—') + '</dd>' +
      '<dt>p50 budget</dt><dd>' + esc(r.budget) + ' <span class="dv-tag">target · unverified</span></dd>' + (r.note ? '<dt>Note</dt><dd>' + esc(r.note) + '</dd>' : '') + '</dl>' +
      '<p class="e1-caption e1-muted">' + esc(s.story) + '</p>';
  }
  function pgRightPath(params, q) {
    var path = '/developers/right-path', sc = SCEN[q.scenario] ? q.scenario : 'refuse';
    var seg = c.segmented(Object.keys(SCEN).map(function (k) { return { id: k, label: SCEN[k].label, href: E1.href(path, { scenario: k }) }; }), sc, { label: 'Scenario' });
    var html = hero({ eyebrow: 'Concepts', title: 'The Right Path', lead: 'Every governed write climbs the same ladder, in one order: rung 0b and nine rungs. There is no fast path, no batch variant, no admin mode and no model anywhere in rungs 3 to 8. Pick an outcome and step through it.', meta: pill('Kernel total', '≈ 64 ms p50') + tag('Budgets are targets · unverified') }) +
      '<div class="dv-toolbar">' + seg + '</div>' +
      '<div class="dv-rp" data-dv-rp data-scenario="' + esc(sc) + '"><div data-dv-ladder>' + ladderHtml(sc, 0) + '</div>' +
      '<aside class="dv-rp__panel" aria-live="polite"><div data-dv-panel-body>' + panelHtml(sc, 0) + '</div>' +
      '<div class="dv-rp__ctl">' + c.button('Previous', { size: 'sm', icon: 'arrow-left', attrs: 'data-action="dv-rp" data-value="prev"' }) + c.button('Next rung', { size: 'sm', kind: 'primary', iconRight: 'arrow-right', attrs: 'data-action="dv-rp" data-value="next"' }) + c.button('Play', { size: 'sm', kind: 'ghost', icon: 'play', attrs: 'data-action="dv-rp" data-value="play"' }) + c.button('Show all', { size: 'sm', kind: 'ghost', attrs: 'data-action="dv-rp" data-value="all"' }) + '</div>' +
      '<p class="e1-caption e1-muted">Keys: ' + c.kbd('←') + ' ' + c.kbd('→') + ' step, ' + c.kbd('Space') + ' play.</p></aside></div>' +
      h2('response', 'What your code receives') + p('The response for this scenario. Every outcome is HTTP 200 except a request that never reached the kernel.') +
      c.code('HTTP/1.1 200 OK\nX-Kernel-Port: v1\n\n' + J(SCEN[sc].http), 'json', { title: SCEN[sc].label }) +
      h2('budgets', 'Budgets are targets') + p('Designed is not shipped. There is no customer and no measured governed action yet, so every figure below is a target marked unverified until it is measured. The kernel total is about 64 ms p50; sandbox and live applies sit outside it (ERPNext pair ≤ 1,200 ms p95; end to end ≤ 2 s p95 — measure this).') +
      c.table({ caption: 'Rung budgets', columns: [{ key: 'n', label: 'Rung', mono: true }, { key: 'name', label: 'Name', mono: true }, { key: 'budget', label: 'p50 target' }, { key: 'm', label: 'Measured' }], rows: RUNGS.map(function (r) { return { n: r.n, name: r.name, budget: r.budget, m: 'Not yet measured' }; }) }) +
      p('The architecture atlas splits the same ≈ 64 ms slightly differently across rungs 1–6. Both are targets; the console’s split is used here.') +
      h2('approval', 'When a person is needed') + p('Rung 6 (or evaluate()) escalates and creates an obligation — write_id, autonomy level, expiry (4 hours by default, asserted), a human resolver set. The ladder stops; rung 7 is never reached. Approve is itself a governed write, and the original is resubmitted with its obligation_ref and climbs from 0b again. Decline refuses the original with ' + a('#/developers/refusals/POLICY.APPROVAL_DECLINED', 'POLICY.APPROVAL_DECLINED') + '; expiry refuses it with ' + a('#/developers/refusals/POLICY.OBLIGATION_EXPIRED', 'POLICY.OBLIGATION_EXPIRED') + '. See it from the approver’s side at ' + a('#/work/decide/OB-2026-0412', 'Decide · OB-2026-0412') + '.');
    return wrap(path, html);
  }
  var rpTimer = null;
  function rpState(el) { return { sc: el.getAttribute('data-scenario'), cur: el.hasAttribute('data-cur') ? (el.getAttribute('data-cur') === 'all' ? null : Number(el.getAttribute('data-cur'))) : 0 }; }
  function rpDraw(el, cur) {
    var sc = el.getAttribute('data-scenario');
    el.setAttribute('data-cur', cur === null ? 'all' : cur);
    el.querySelector('[data-dv-ladder]').innerHTML = ladderHtml(sc, cur);
    el.querySelector('[data-dv-panel-body]').innerHTML = panelHtml(sc, cur);
  }
  function rpStep(dir) {
    var el = document.querySelector('[data-dv-rp]'); if (!el) return false;
    var s = rpState(el), cur = s.cur === null ? 9 : s.cur;
    if (dir === 'all') { rpDraw(el, null); return true; }
    var n = dir === 'prev' ? Math.max(0, cur - 1) : Math.min(9, cur + 1);
    rpDraw(el, n); return n < 9;
  }
  E1.action('dv-rp', function (btn) {
    var v = btn.getAttribute('data-value');
    if (rpTimer) { clearInterval(rpTimer); rpTimer = null; }
    if (v === 'play') {
      var el = document.querySelector('[data-dv-rp]'); if (el) rpDraw(el, 0);
      rpTimer = setInterval(function () { if (!document.querySelector('[data-dv-rp]') || !rpStep('next')) { clearInterval(rpTimer); rpTimer = null; } }, 900);
      return;
    }
    rpStep(v);
  });
  E1.on('keydown', 'body', function (e) {
    if (!document.querySelector('[data-dv-rp]')) return;
    var t = e.target; if (t && (t.closest('input,textarea,select,[contenteditable],[role=tab]'))) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); rpStep('next'); } else if (e.key === 'ArrowLeft') { e.preventDefault(); rpStep('prev'); } else if (e.key === ' ' && t === document.body) { e.preventDefault(); var b = document.querySelector('[data-action="dv-rp"][data-value="play"]'); if (b) b.click(); }
  });

  /* ------------------------------------------------------------------------
     /developers/refusals — the full register (?class=&rung=&q=), and /refusals/:code
     ------------------------------------------------------------------------ */
  function pgRefusals(params, q) {
    var path = '/developers/refusals', cls = q['class'] || '', qq = (q.q || '').trim();
    var rows = REG.filter(function (r) { return (!cls || r.cls === cls || (cls === 'define' && r.eg && r.eg.define)) && (!qq || E1.fuzzy(qq, r.code + ' ' + r.title + ' ' + r.means + ' ' + r.action + ' rung ' + r.rung) > 0); });
    var count = function (k) { return REG.filter(function (r) { return k === 'define' ? r.eg && r.eg.define : r.cls === k; }).length; };
    var chips = c.filters([{ label: 'All', href: E1.href(path, { q: qq }), active: !cls, count: REG.length }, { label: 'Policy', href: E1.href(path, { 'class': 'policy', q: qq }), active: cls === 'policy', count: count('policy') }, { label: 'Gate', href: E1.href(path, { 'class': 'gate', q: qq }), active: cls === 'gate', count: count('gate') }, { label: 'Platform', href: E1.href(path, { 'class': 'platform', q: qq }), active: cls === 'platform', count: count('platform') }, { label: 'define only', href: E1.href(path, { 'class': 'define', q: qq }), active: cls === 'define', count: count('define') }], { label: 'Class', clearHref: (cls || qq) ? '#' + path : null });
    var table = c.table({ caption: 'Refusal register', rowHref: function (r) { return '#/developers/refusals/' + r.code; }, columns: [
      { key: 'code', label: 'Code', render: function (r) { return '<span class="e1-mono" style="font-size:12.5px">' + esc(r.code) + '</span>'; } },
      { key: 'cls', label: 'Class', nowrap: true, width: '92px', render: function (r) { return r.cls === 'platform' ? c.badge('critical', 'Platform', { subtle: true }) : c.badge('neutral', classWord(r.cls), { subtle: true }); } },
      { key: 'rung', label: 'Rung', mono: true, width: '84px', render: function (r) { return esc(r.rung) + (r.gate && r.gate !== 'sandbox' ? '<br><span class="e1-caption e1-muted">' + esc(r.gate) + '</span>' : ''); } },
      { key: 'title', label: 'Plain title' }, { key: 'action', label: 'Operator action' }],
      rows: rows, empty: { title: 'No code matches “' + qq + '”', why: 'The register is closed: every code maps to one rung, one class and one operator action. Try a gate name, a rung number or part of a code.', action: { label: 'Show every code', href: '#' + path } } });
    var html = hero({ eyebrow: 'Reference', title: 'Refusal register', lead: 'A refusal is a correct, free outcome — HTTP 200, a full proof entry with a zeroed record_id, metered at quantity 0. Every code maps to one rung, one class and one operator action. The register is closed: codes are never renumbered and never reused.', meta: pill('Register', 'v1.0') + pill('Codes', '43 · policy 14 · gate 19 · platform 10') + pill('Active at L1', '28') }) +
      c.callout({ kind: 'rule', title: 'Only PLATFORM.* is ever retried.', body: '<p>A governed refusal returns the same decision on every retry (I8). A platform refusal is our failure: nothing was changed, you are not billed, on-call has been paged — retry with the same intent_id. <code>POLICY.TENANT_STOPPED</code> is the only refusal with no proof entry.</p>' }) +
      '<form class="dv-toolbar" data-dv-refsearch>' + chips + '<span style="min-width:240px">' + c.searchBox({ id: 'dv-ref-q', placeholder: 'Search codes, gates, actions', value: qq, label: 'Search the register' }) + '</span></form>' +
      table + '<p class="dv-note">' + rows.length + ' of ' + REG.length + ' enumerated codes shown. The register counts 43; the TM’s Level 1 table enumerates 32 plus 3 raised only by define, and the remaining codes activate with Level 2 signing, anchoring, bundles and verifier profiles. The gap is flagged in TM §4.6.3 and is not resolved here.</p>' +
      h2('reserved', 'Proposed and Level 3 codes') + p('Specified but not active. A new code needs 30 days’ internal and 60 days’ external notice, and its operator action is published first.') +
      c.table({ caption: 'Reserved codes', columns: [{ key: 'c', label: 'Code', mono: true }, { key: 's', label: 'Status', render: function (r) { return tag(r.s, 'dash'); } }, { key: 'w', label: 'Raised by', mono: true }, { key: 'm', label: 'Means' }], rows: REG_MORE.map(function (r) { return { c: r[0], s: r[1], w: r[2], m: r[3] }; }) }) +
      h2('copy', 'How to show a refusal to a person') + '<ul><li>Headline “Not done — {plain reason}”; the code once, in small type, because support asks for it.</li><li>Name the gate for a gate-class refusal; name the rule version for a policy-class refusal.</li><li>Show every gate result, not only the failure, and the operator action in the declaration’s words — never a stack trace, never a raw code alone.</li><li>Platform class: “We could not complete this. Nothing was changed. We have been paged.”</li><li>Never offer “Retry” on a governed refusal. Never say “insufficient permissions” — say “You proposed this, so you cannot also approve it. Send it to: [names]”.</li></ul>' +
      h2('other-families', 'Other code families') + c.table({ caption: 'Other families', columns: [{ key: 'f', label: 'Family' }, { key: 'c', label: 'Codes', mono: true }, { key: 'w', label: 'Where you see them' }], rows: [
        { f: 'Encoder errors', c: 'E_FIELD_MISSING · E_FIELD_NULL · E_UUID_FORM · E_INT_RANGE · E_STRING_LENGTH · E_ENUM_TOKEN · E_TIMESTAMP_FORM · E_DIGEST_LENGTH', w: 'Seal implementations and test vectors only' },
        { f: 'Verifier exit codes', c: '0 PASS · 1 FAIL_INTEGRITY · 2 FAIL_PROFILE · 3 INCOMPLETE · 4 UNSUPPORTED · 5 USAGE', w: 'The offline verifier (Level 2)' },
        { f: 'Receipt verdicts', c: 'UNSUPPORTED · AUDIENCE_MISMATCH · EXPIRED · FAIL_INTEGRITY · TRUST_ANCHOR_UNKNOWN · UNANCHORED · REPLAYED · REVOKED', w: 'Action Receipt verification (Level 3)' }] });
    return wrap(path, html);
  }
  E1.on('submit', '[data-dv-refsearch]', function (e) {
    e.preventDefault();
    var v = (document.getElementById('dv-ref-q') || {}).value || '', qy = E1.state.route.query || {};
    E1.go('/developers/refusals', { 'class': qy['class'] || '', q: v.trim() });
  });

  function pgRefusal(params) {
    var code = decodeURIComponent(params.code || '').toUpperCase(), r = findCode(code), path = '/developers/refusals/' + (params.code || '');
    if (!r) {
      var more = null; REG_MORE.forEach(function (x) { if (x[0] === code) more = x; });
      if (more) return wrap(path, hero({ eyebrow: 'Refusal register · reserved', title: more[0], lead: esc(more[3]), meta: tag(more[1], 'dash') + tag('Raised by ' + more[2]) }) + c.callout({ kind: 'info', title: 'Not active.', body: '<p>This code is specified but not in the active register. It reaches production only through the register procedure: 60 days’ external notice, operator action first.</p>' }) + '<div class="dv-actions">' + c.button('Back to the register', { href: '#/developers/refusals', icon: 'arrow-left' }) + '</div>', { pager: false });
      return wrap(path, hero({ eyebrow: 'Refusal register', title: 'No code “' + code + '”', lead: 'The register is closed. A code that is not listed cannot be raised.' }) + c.empty({ icon: 'search', title: 'This code is not in the register', why: 'Codes are never renumbered or reused, and the kernel rejects any code that does not map to the rung it is raised at. Check the spelling — codes are CLASS.NAME in capitals.', action: [{ label: 'Search the register', href: E1.href('/developers/refusals', { q: code.split('.').pop() }), kind: 'primary' }, { label: 'All codes', href: '#/developers/refusals' }] }), { pager: false });
    }
    var i = REG.indexOf(r), prev = REG[i - 1], next = REG[i + 1], ex = exampleFor(r), e = r.eg || {};
    var isPlat = r.cls === 'platform', stopped = r.code === 'POLICY.TENANT_STOPPED';
    var handle = codeTabs([
      { lang: 'ts', title: 'handle.ts', code: isPlat ? 'if (res.outcome === "refused" && res.decision.code === "' + r.code + '") {\n  // Our failure. Nothing was changed; you were not billed; we were paged.\n  await backoff(res.retry.after_seconds);          // jittered, at most 5 attempts\n  return k.assert(intent);                          // the SAME intent_id\n}' : stopped ? 'if (res.outcome === "refused" && res.code === "' + r.code + '") {\n  // No proof entry was written. Do not retry until the stop event is resolved.\n  return showStopped(res.stop.reason_class, res.stop.set_at);\n}' : 'if (res.outcome === "refused" && res.decision.code === "' + r.code + '") {\n  // A governed refusal. Never retry the same intent — it returns the same decision.\n  return showNotDone({\n    title: "' + r.title + '",\n    action: res.operator_action,           // "' + r.action + '"\n    gates: res.decision.gate_results,       // show every gate, not only the failure\n    proof: res.record.seq,\n  });\n}' },
      { lang: 'py', title: 'handle.py', code: isPlat ? 'case Refused(decision=d) if d.code == "' + r.code + '":\n    # Our failure: retry with the same intent_id, backing off.\n    raise RetryableKernelFailure(d.code)' : 'case Refused(decision=d) if d.code == "' + r.code + '":\n    # Governed refusal: never retry. Show the operator action.\n    return {"refused": d.code, "action": res.operator_action, "seq": res.record.seq}' }]);
    var html = hero({ eyebrow: 'Refusal register · ' + classWord(r.cls) + ' class', title: r.code, code: true, lead: esc(r.title) + '.', meta: (isPlat ? c.outcome('platform', { code: r.code }) : c.outcome('refused', { code: r.code })) + pill('Rung', r.rung) + (r.gate ? pill('Gate', r.gate === 'sandbox' ? 'shadow sandbox' : r.gate) : '') + pill('Meter', 'quantity 0 · ₹0') + pill('HTTP', stopped ? '200 · no record' : '200') }) +
      c.kv([['Code', r.code, { mono: true }], ['Class', classWord(r.cls)], ['Rung', r.rung, { mono: true }], ['Means', r.means], ['Operator action', '“' + r.action + '”'], ['Retry', isPlat ? 'Yes — same intent_id, back-off with jitter, at most 5 attempts' : 'Never'], ['Proof entry', stopped ? 'None — the only refusal without one' : (e.pending ? 'Pending — the outbox retries in order' : 'Yes, full sixteen fields, record_id zeroed')], ['Pages on-call', isPlat ? 'Yes' : 'No']], { cols: 2 }) +
      (e.open ? c.callout({ kind: 'caveat', title: 'Open question.', body: '<p>' + esc(e.open) + '</p>' }) : '') +
      h2('example', 'Example response') + p(e.define ? 'Returned by <code>define</code> (POST /v1/declarations/{id}/versions). The declaration version is not registered.' : stopped ? 'Returned by assert for any write while the tenant is stopped. Note the absent record.' : e.pending ? 'Rung 8 could not append in time. The write committed; its proof entry follows in order.' : 'Returned by assert. Illustrative values' + (e.seq ? ', shaped on proof #' + E1.fmt.num(e.seq) + ' in the Kaveri Spinning Mills sample chain' : '') + '.') +
      c.code('HTTP/1.1 200 OK\nX-Kernel-Port: v1\n\n' + J(ex), 'json', { title: 'Response · ' + (e.wt || 'define') }) +
      h2('handle', 'Handle it') + handle +
      h2('show', 'Show it to a person') + (isPlat ? p('Say: “This is our failure, not a rule. Nothing was changed, you have not been billed, and we have been paged.” Offer “Try again” — the same intent.') : p('Headline: <strong>“' + esc(r.title) + '”</strong>. Then the rule or gate in plain words, the numbers that decided it, and one action: “' + esc(r.action) + '”.')) +
      '<div class="dv-actions">' + (e.console ? c.button('See it in the console', { href: e.console, icon: 'arrow-up-right' }) : '') + c.button('Refusal in Assurance', { kind: 'ghost', href: '#/assurance/refusals/' + r.code }) + '</div>' +
      h2('related', 'Neighbours in the register') + '<div class="dv-grid dv-grid--2">' + (prev ? card({ title: prev.code, body: prev.title, href: '#/developers/refusals/' + prev.code }) : '') + (next ? card({ title: next.code, body: next.title, href: '#/developers/refusals/' + next.code }) : '') + '</div>';
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/mcp
     ------------------------------------------------------------------------ */
  function pgMcp(params, q) {
    var path = '/developers/mcp', sc = q.scope || '';
    var rows = MCP.filter(function (t) { return !sc || t.scope === sc; });
    var n = function (s) { return MCP.filter(function (t) { return t.scope === s; }).length; };
    var cfg = J({ mcpServers: { elan1: { type: 'http', url: T.mcp, auth: { type: 'oauth2_client_credentials', token_url: T.auth, client_secret_env: 'ELAN1_KEY', audience: 'kernelport:v1', scope: 'ro stage act' } } } });
    var list = J({ jsonrpc: '2.0', id: 1, result: { tools: [{ name: 'act.write', description: 'Submit a staged governed write. Returns committed, refused or escalated. Never retry a refusal; retry PLATFORM.* only with the same idempotency_key.', inputSchema: { type: 'object', required: ['request', 'idempotency_key'], properties: { request: { type: 'object' }, idempotency_key: { type: 'string', format: 'uuid' } } }, _meta: { 'elan1/declaration': 'erp.ar@7', 'elan1/description_sha256': dg('9e02', 'b3f1', 'act.write v7'), 'elan1/scope': 'act' } }] } });
    var call = J({ jsonrpc: '2.0', id: 9, result: { isError: false, content: [{ type: 'text', text: 'Refused at precondition. Do not retry. Credit limit exceeded.' }], structuredContent: { outcome: 'refused', code: 'GATE.PRECONDITION_FAILED', rung: 3, gate: 'precondition', operator_action: 'Fix the record state', seq: 4098, digest: CHAIN[4098] } } });
    var stage = J({ jsonrpc: '2.0', id: 8, result: { isError: false, content: [{ type: 'text', text: 'Staged. No side effects. Submit with act.write.' }], structuredContent: { request_id: 'rq_7f3c2a91', write_type: 'erp.sales_invoice.submit', declaration: 'erp.ar@7', valid: true, reaches: 'approval' } } });
    var html = hero({ eyebrow: 'Build', title: 'MCP server', lead: 'The doorway for third-party agents. 34 tools in three scopes — 18 read, 10 stage, 6 act — over MCP revision 2026-07-28 (stateless), authenticated with an OAuth 2.1 bearer tenant token. Every tool description is pinned by hash in your declaration.', meta: pill('Endpoint', T.mcp) + pill('Mode', 'Attested advisory unless proven Enforced') + pill('may_approve', 'false') }) +
      h2('connect', 'Connect a client') + p('Static keys are not accepted on MCP. Configure the client-credentials exchange; the token lasts 5–15 minutes and carries one tenant, one actor and one autonomy level.') + c.code(cfg, 'json', { title: 'mcp.json' }) +
      h2('tools', 'Tools') + p('Seven tools are named in the Technology Memorandum; the other names below are illustrative and may change before GA. Scopes are fixed: a token with <code>stage</code> but not <code>act</code> can prepare writes and never submit them.') +
      '<div class="dv-toolbar">' + c.filters([{ label: 'All', href: '#' + path, active: !sc, count: MCP.length }, { label: 'ro', href: E1.href(path, { scope: 'ro' }), active: sc === 'ro', count: n('ro') }, { label: 'stage', href: E1.href(path, { scope: 'stage' }), active: sc === 'stage', count: n('stage') }, { label: 'act', href: E1.href(path, { scope: 'act' }), active: sc === 'act', count: n('act') }], { label: 'Scope' }) + '</div>' +
      c.table({ caption: 'MCP tools', dense: true, columns: [{ key: 'name', label: 'Tool', render: function (t) { return '<span class="e1-mono">' + esc(t.name) + '</span>'; } }, { key: 'scope', label: 'Scope', mono: true }, { key: 'args', label: 'Arguments', mono: true }, { key: 'returns', label: 'Returns' }, { key: 'named', label: 'Source', render: function (t) { return t.named ? tag('Named in TM', 'accent') : tag('Illustrative', 'dash'); } }], rows: rows }) +
      h2('pinning', 'Tool descriptions are hash-pinned') + p('Every tool in <code>tools/list</code> carries <code>_meta</code>: <code>elan1/declaration</code>, <code>elan1/description_sha256</code> and <code>elan1/scope</code>. The declaration pins the SHA-256 of each description (UTF-8, NFC). A changed description shows as a version change, never as a silent update — for example ar-agent’s <code>act.write</code> moved from <code>d41c…07aa</code> (erp.ar v6) to <code>9e02…b3f1</code> (erp.ar v7), certified by Arjun Mehta on 19 Sep 2026.') +
      tabs([{ key: 'list', label: 'tools/list', html: c.code(list, 'json', { title: 'Response' }) }, { key: 'check', label: 'Check a pin', html: codeTabs([{ lang: 'ts', title: 'pin.ts', code: 'import { createHash } from "node:crypto";\nconst sha = (s: string) => createHash("sha256").update(s.normalize("NFC"), "utf8").digest("hex");\nfor (const t of tools) {\n  if (sha(t.description) !== t._meta["elan1/description_sha256"]) throw new Error(`${t.name}: description is not the pinned one`);\n}' }, { lang: 'py', title: 'pin.py', code: 'import hashlib, unicodedata\nfor t in tools:\n    d = hashlib.sha256(unicodedata.normalize("NFC", t["description"]).encode()).hexdigest()\n    assert d == t["_meta"]["elan1/description_sha256"], f"{t[\'name\']}: not the pinned description"' }]) }], { label: 'Pinning' }) +
      h2('refusals', 'Refusals are results, not errors') + p('Refusals return <code>isError: false</code>, because an error invites the agent’s framework to retry. The text content is written for the model: short, final, and it says whether to retry.') +
      tabs([{ key: 'stage', label: 'stage.write', html: c.code(stage, 'json', { title: 'Result' }) }, { key: 'refused', label: 'act.write · refused', html: c.code(call, 'json', { title: 'Result' }) }, { key: 'agent', label: 'act.escalate from an agent', html: c.code(J({ jsonrpc: '2.0', id: 12, result: { isError: false, content: [{ type: 'text', text: 'Refused. Agents never approve. A named person in ar-approvers must decide OB-2026-0412.' }], structuredContent: { outcome: 'refused', code: 'POLICY.ACTOR_NOT_PERMITTED', rung: 1 } } }), 'json', { title: 'Result' }) }], { label: 'Examples' }) +
      h2('mode-b', 'What you may claim over MCP') + c.table({ caption: 'Mode claims', columns: [{ key: 'r', label: '' }, { key: 'a', label: 'Enforced (Mode A)' }, { key: 'b', label: 'Attested advisory (Mode B)' }], rows: [
        { r: 'Target credential', a: 'The kernel’s per-tenant broker', b: 'The caller' }, { r: 'Rung 7', a: 'Performs the write', b: 'Does nothing; the caller acts, then reports back' },
        { r: 'A refusal means', a: '“The write did not happen”', b: '“elan1 evaluated this and said no”' },
        { r: 'May claim', a: '“This write could not have occurred without passing the gates.”', b: '“Every write intent is evaluated against policy and recorded, and the record is exportable.”' },
        { r: 'May not say', a: 'Anything implying Level 2', b: '“we block”, “we prevent”, “cannot”, “nothing gets through without us”' },
        { r: 'Kernel unreachable', a: 'Nothing was changed', b: 'Treat a timeout on assert as refuse — elan1 cannot force this' },
        { r: 'Added latency', a: '≤ 15 ms (target)', b: '≤ 40 ms p95 contract call (target)' }] }) +
      p('After an allow in Mode B, report the outcome with <code>act.report_outcome</code> (HTTP <code>POST /v1/writes/{write_id}/outcome</code>). An action never reported is reconciled as <strong>acted_unattested</strong>; a write after a refusal is an <strong>unmatched write</strong>. Promotion to Enforced is per write type — ' + a('#/assurance/enforcement', 'see Enforcement') + '.');
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/sdk/typescript and /developers/sdk/python
     ------------------------------------------------------------------------ */
  function sdkPage(lang) {
    var ts = lang === 'ts', path = '/developers/sdk/' + (ts ? 'typescript' : 'python'), L = ts ? 'ts' : 'py', fn = ts ? 'k.assert' : 'k.assert_';
    function cb(code, title) { return c.code(code, ts ? 'ts' : 'python', { title: title }); }
    var errs = c.table({ caption: 'Errors and outcomes', columns: [{ key: 'w', label: 'What happened' }, { key: 'g', label: 'You get', mono: true }, { key: 'r', label: 'Retry?' }], rows: [
      { w: 'Governed refusal (policy or gate)', g: ts ? 'res.outcome === "refused"' : 'Refused(...)', r: 'Never' },
      { w: 'Escalation', g: ts ? 'res.outcome === "escalated"' : 'Escalated(...)', r: 'Never — wait for obligation.resolved' },
      { w: 'Platform refusal (PLATFORM.*)', g: ts ? 'res.outcome === "refused" && res.retry.retryable' : 'Refused(...) with d.code "PLATFORM.*"', r: 'Yes — same intent_id' },
      { w: 'Rejection (4xx: malformed, "latest", cross-tenant body)', g: ts ? 'throws RejectionError' : 'raises RejectionError', r: 'Only after fixing the request' },
      { w: 'Throttle (429)', g: ts ? 'throws ThrottledError (retryAfterS)' : 'raises ThrottledError', r: 'Yes — automatic, with back-off' },
      { w: 'Kernel unreachable / timeout', g: ts ? 'throws KernelUnavailable' : 'raises KernelUnavailable', r: 'Treat as refuse. The caller MUST NOT write' }] });
    var html = hero({ eyebrow: 'Build · SDK', title: ts ? 'TypeScript SDK' : 'Python SDK', lead: ts ? '<code>@elan1/kernel</code> for Node 20+. The package major is the port major (kernelport/v1). Six calls behind KernelPort, with stage/act/obligation helpers that mirror the MCP scopes. <code>seal</code> is not exported.' : '<code>elan1-kernel</code> for Python 3.12, imported as <code>elan1_kernelport</code>. The package major is the port major. <code>assert</code> is reserved in Python, so the method is <code>assert_</code>; the wire name is still assert.', meta: pill('Package', ts ? '@elan1/kernel 0.9.4' : 'elan1-kernel 0.9.4') + pill('Runtime', ts ? 'Node 20+' : 'Python 3.12') + tag('Pre-GA · illustrative helpers', 'dash') }) +
      h2('install', 'Install') + c.code(ts ? 'npm install @elan1/kernel' : 'pip install elan1-kernel', 'shell', { title: 'Terminal' }) +
      h2('client', 'Create a client') + cb(ts ? 'import { KernelClient } from "@elan1/kernel";\n\nconst k = new KernelClient({\n  apiKey: process.env.ELAN1_KEY!,   // sk_sbx_… or sk_live_… — exchanged for a 5–15 min tenant token\n  port: "v1",                        // sent as X-Kernel-Port\n  timeoutMs: 5000,                   // a timeout raises KernelUnavailable: treat it as refuse\n  retry: { max: 5, jitter: true },   // 429, 5xx and PLATFORM.* only — never a governed refusal\n});' : 'from elan1_kernelport import KernelClient\n\nk = KernelClient(\n    api_key=os.environ["ELAN1_KEY"],   # exchanged for a 5–15 min tenant token\n    port="v1",\n    timeout_s=5.0,                     # a timeout raises KernelUnavailable: treat it as refuse\n    retry_max=5,                       # 429, 5xx and PLATFORM.* only\n)', ts ? 'client.ts' : 'client.py') +
      h2('scope', 'Scope') + cb(ts ? 'const { permitted } = await k.scope({ actor_id: AR_AGENT, write_types: ["erp.sales_invoice.submit"] });\nconst can = permitted[0].reaches;   // "rung7" | "approval" | "none"' : 's = k.scope(actor_id=AR_AGENT, write_types=["erp.sales_invoice.submit"])\ncan = s.permitted[0].reaches   # "rung7" | "approval" | "none"', 'scope') +
      h2('stage', 'Stage') + p('Staging validates against the declaration version and returns a request object. Nothing is recorded or metered.') + cb(ts ? 'const staged = await k.stage.write({ write_type: "erp.sales_invoice.submit", payload, as_of });\nstaged.request_id;   // "rq_7f3c2a91"\nstaged.diff;         // the field diff a person would see at Decide' : 'staged = k.stage.write(write_type="erp.sales_invoice.submit", payload=payload, as_of=as_of)\nstaged.request_id   # "rq_7f3c2a91"', 'stage') +
      h2('act', 'Act (assert)') + cb(ts ? 'const res = await k.act.write(staged, { idempotencyKey: intentId(changeKey) });\n// or, without staging: await k.assert(intent)\n\nif (res.outcome === "committed") console.log(`Applied · proof #${res.record.seq}`);' : 'res = k.act.write(staged, idempotency_key=intent_id(change_key))\n# or, without staging: k.assert_(intent)\n\nif isinstance(res, Committed):\n    print(f"Applied · proof #{res.record.seq}")', 'act') +
      p('The response types are a discriminated union on <code>outcome</code>: <code>Committed</code>, <code>Refused</code>, <code>Escalated</code>. Handle all three — a consumer that only handles the committed case will silently lose writes.') +
      h2('escalate', 'Escalate: resolve an obligation') + p('<code>obligations.resolve</code> is <code>act.escalate</code>. It is itself a governed write, and it is refused from any agent token — agents never approve, and the proposer never approves their own write. Only a person’s tenant token can resolve.') +
      cb(ts ? '// In a person-facing app, with that person’s token:\nconst r = await k.obligations.resolve("ob_91c4e2a7-…", {\n  decision: "approve",               // or "decline" — needs a reason of at least a sentence\n  note: "Rate contract RC-ACME-2026 covers this price.",\n  idempotencyKey: crypto.randomUUID(),\n});\n// r.record.seq === 4100 (the resolution); then the agent resubmits → 4101' : 'r = k.obligations.resolve(\n    "ob_91c4e2a7-…",\n    decision="decline",\n    note="Margin on 40s combed falls below 6%; recheck with sales before changing.",\n    idempotency_key=str(uuid.uuid4()),\n)\n# the original write now refuses with POLICY.APPROVAL_DECLINED', 'escalate') +
      h2('resubmit', 'Resubmit after approval') + cb(ts ? 'const again = { ...intent, intent_id: intentId(changeKey + "#approved"), obligation_ref };\nconst res = await k.assert(again);   // resubmit, never resume' : 'again = intent.resubmission(obligation_ref=obligation_id)   # new intent_id\nres = k.assert_(again)', 'resubmit') +
      h2('verify', 'Verify') + cb(ts ? 'const v = await k.verify({ seq_from: 1, seq_to: 4112 });\n// v.result: "pass" | "fail" | "not_checked" — print range, count and write types with it' : 'v = k.verify(seq_from=1, seq_to=4112)', 'verify') +
      h2('errors', 'Errors') + p('Outcomes are values; only transport and request problems throw. Clients retry 4xx — which is exactly why a refusal is never a 4xx.') + errs +
      cb(ts ? 'import { RejectionError, ThrottledError, KernelUnavailable } from "@elan1/kernel";\n\ntry {\n  const res = await k.assert(intent);\n  return handle(res);                           // committed | refused | escalated\n} catch (e) {\n  if (e instanceof KernelUnavailable) return failClosed(intent);   // do not write\n  if (e instanceof RejectionError) return fix(e.field, e.message);  // no record exists\n  throw e;\n}' : 'from elan1_kernelport import RejectionError, ThrottledError, KernelUnavailable\n\ntry:\n    res = k.assert_(intent)\nexcept KernelUnavailable:\n    return fail_closed(intent)        # the caller MUST NOT write\nexcept RejectionError as e:\n    return fix(e.field, e.message)    # nothing was recorded', 'errors') +
      h2('mode-b', 'Mode B: fail closed') + p('If you hold the target credential, wrap your write so that no allow means no write: a timeout is a refusal, there is no cached allow and no local gate.') +
      cb(ts ? 'async function governedWrite(intent: Intent, write: () => Promise<TargetRef>) {\n  const res = await k.assert(intent);              // throws KernelUnavailable on timeout\n  if (res.outcome !== "committed" && res.decision.disposition !== "allow") return res;\n  const ref = await write();\n  await k.writes.reportOutcome(res.decision.write_id, { performed: true, target_ref: ref });\n  return res;\n}' : 'def governed_write(intent, write):\n    res = k.assert_(intent)                          # raises KernelUnavailable on timeout\n    if res.decision.disposition != "allow":\n        return res\n    ref = write()\n    k.writes.report_outcome(res.decision.write_id, performed=True, target_ref=ref)\n    return res', 'mode-b') +
      h2('other-sdk', 'Other language') + p(ts ? a('#/developers/sdk/python', 'Python SDK') + ' · ' + a('#/developers/api', 'HTTP API') : a('#/developers/sdk/typescript', 'TypeScript SDK') + ' · ' + a('#/developers/api', 'HTTP API'));
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/api — HTTP reference families
     ------------------------------------------------------------------------ */
  function pgApi() {
    var path = '/developers/api';
    var fam = c.table({ caption: 'Endpoint families', columns: [{ key: 'path', label: 'Family', render: function (r) { return '<a class="e1-mono" href="#/developers/api" data-scrollto="api-' + r.id + '">' + esc(r.path) + '</a>'; } }, { key: 'cls', label: 'Token class', mono: true }, { key: 'serves', label: 'Serves' }], rows: API });
    var html = hero({ eyebrow: 'Build', title: 'HTTP API', lead: 'Eight families across three token classes: <code>act</code> for writes and obligations, <code>ro</code> for records, evidence and the meter, <code>ctl</code> for declarations, actors and tenants. ctl-class paths have no read path to any record store.', meta: pill('Base URL', T.base) + pill('Residency', 'in · Mumbai') + pill('Header', 'X-Kernel-Port: v1') }) +
      h2('families', 'Families') + fam + c.table({ caption: 'Other paths', columns: [{ key: 'p', label: 'Path', mono: true }, { key: 'c', label: 'Class', mono: true }, { key: 'd', label: 'Serves' }], rows: API_MORE.map(function (r) { return { p: r[0], c: r[1], d: r[2] }; }) }) +
      h2('auth', 'Authentication') + p('Exchange your key for a tenant token by client credentials and send it as <code>Authorization: Bearer</code>. The tenant and actor come from the token; a tenant_id in a body that disagrees with the token is a rejection and an alert.') +
      h2('conventions', 'Conventions') + c.table({ caption: 'Headers', columns: [{ key: 'h', label: 'Header', mono: true }, { key: 'd', label: 'Meaning' }], rows: [
        { h: 'Idempotency-Key', d: 'Maps to intent_id. Kept 30 days. A repeated key returns the original outcome, including seq and digest.' }, { h: 'X-Kernel-Port', d: 'v1 on every response.' },
        { h: 'X-RateLimit-Limit / -Remaining / -Reset', d: 'On every response. A sandbox key allows 10 writes a minute, 2 concurrent.' }, { h: 'Retry-After', d: 'Seconds, on 429 and some 5xx.' },
        { h: 'Deprecation / Sunset', d: 'On a superseded major; 12-month sunset, then 410 with “This version was withdrawn on <date>. You were notified on <date>.”' }] }) +
      p('Lists page by seq (<code>seq_from</code>, <code>seq_to</code>), never by offset. Poll <code>GET /v1/writes/{write_id}</code> at 10 seconds or slower; prefer webhooks.') +
      h2('taxonomy', 'Error taxonomy') + c.table({ caption: 'Error taxonomy', columns: [{ key: 'k', label: 'Kind' }, { key: 'h', label: 'HTTP', mono: true }, { key: 'p', label: 'Proof entry' }, { key: 'm', label: 'Meter' }, { key: 'r', label: 'Retry' }], rows: [
        { k: 'Refusal', h: '200 · outcome refused', p: 'Yes', m: '0', r: 'Never' }, { k: 'Escalation', h: '200 · outcome escalated', p: 'Yes', m: '0', r: 'Never; wait' },
        { k: 'Rejection (malformed, “latest”, cross-tenant body)', h: '4xx', p: 'No', m: 'No', r: 'Only after fixing' }, { k: 'Throttle', h: '429 + Retry-After', p: 'No', m: 'No', r: 'Yes, back-off' },
        { k: 'Platform failure', h: '5xx, or 200 + PLATFORM.*', p: 'Refusal only', m: '0 (not billed)', r: 'Yes, same key' }, { k: 'Tenant stopped', h: '200 · POLICY.TENANT_STOPPED', p: 'No', m: 'No', r: 'No' }] }) +
      p('Retry policy: 5xx and 429 only (and <code>PLATFORM.*</code>), exponential back-off with jitter, at most five attempts, the same key. A deprecated version is never slowed, rate-limited or given worse errors.') +
      API.map(function (f) {
        return '<h2 id="api-' + f.id + '">' + esc(f.path) + ' <span class="dv-tag" style="vertical-align:middle">' + esc(f.cls) + '</span></h2>' + p(esc(f.serves) + '.') +
          '<div class="dv-block" style="display:grid;gap:6px">' + f.eps.map(function (e) { return http(e[0], e[1], e[2]); }).join('') + '</div>' +
          (f.id === 'writes' ? '<div style="margin-top:12px">' + codeTabs([{ lang: 'curl', title: 'Shell', code: S.heroCurl }, { lang: 'ts', title: 'fetch.ts', code: 'const r = await fetch("' + T.base + '/v1/writes", {\n  method: "POST",\n  headers: { Authorization: `Bearer ${token}`, "Idempotency-Key": intent.intent_id, "Content-Type": "application/json" },\n  body: JSON.stringify(intent),\n});\nconst res = await r.json();   // r.status is 200 for committed, refused and escalated' }, { lang: 'py', title: 'httpx.py', code: 'r = httpx.post("' + T.base + '/v1/writes", json=intent,\n               headers={"Authorization": f"Bearer {token}", "Idempotency-Key": intent["intent_id"]})\nres = r.json()   # 200 for committed, refused and escalated' }]) + '</div>' : '') +
          (f.id === 'obligations' ? '<div style="margin-top:12px">' + c.code(J({ obligation_id: 'ob_91c4e2a7-0d53-4b6f-9e18-7a2c5f30d846', display_id: 'OB-2026-0412', status: 'open', write_type: 'erp.sales_invoice.submit', proposer: { actor_kind: 'agent', name: 'ar-agent' }, expires_at: '2026-09-24T12:46:00Z', paused_seconds: 0, resolver_roles: ['ar-approvers'], quorum: 1, escalation_seq: 4099 }), 'json', { title: 'GET /v1/obligations/{id}' }) + '</div>' : '') +
          (f.id === 'meter' ? '<div style="margin-top:12px">' + c.code(J({ period: '2026-09', state: 'open', committed: 3733, refused: { count: 171, amount_inr: 0 }, escalated: { count: 317, amount_inr: 0 }, reconciled: { at: '2026-09-22T21:00:00Z', mismatches: 0 } }), 'json', { title: 'GET /v1/meter/totals?period=2026-09 · Kaveri Spinning Mills sample' }) + '</div>' : '');
      }).join('');
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/webhooks
     ------------------------------------------------------------------------ */
  function pgWebhooks() {
    var path = '/developers/webhooks';
    var events = c.table({ caption: 'Events', columns: [{ key: 'n', label: 'Event', mono: true }, { key: 'd', label: 'When' }], rows: HOOKS.map(function (h) { return { n: h[0], d: h[1] }; }) });
    var payloads = tabs(HOOKS.map(function (h, i) { return { key: h[0], label: h[0], html: c.code(J({ type: h[0], id: 'evt_01J8' + hx(h[0], 20).toUpperCase(), tenant_id: T.tenant, created_at: '2026-09-24T09:' + (10 + i * 3) + ':07Z', data: h[2] }), 'json', { title: 'POST to your endpoint' }) }; }), { label: 'Event payloads' });
    var html = hero({ eyebrow: 'Build', title: 'Webhooks', lead: 'Seven events, signed with HMAC over the body using a per-endpoint secret, delivered at least once. Every write payload carries seq and digest so you can detect a missed delivery from seq contiguity.', meta: pill('Signature', 'X-Elan1-Signature') + pill('Freshness', '5 minutes') + pill('Delivery', 'at least once'), actions: c.button('Register an endpoint', { href: '#/agents/webhooks', icon: 'plug' }) + c.button('Send a test event', { kind: 'ghost', icon: 'send', attrs: 'data-action="dv-testhook"' }) }) +
      c.callout({ kind: 'rule', title: 'A consumer that only handles the committed case will silently lose writes.', body: '<p>Handle write.refused and write.escalated, and resubmit on obligation.resolved. Be idempotent on the event id and on write_id.</p>' }) +
      h2('events', 'Events') + events + h2('payloads', 'Payloads') + payloads +
      h2('verify', 'Verify the signature') + p('Headers: <code>X-Elan1-Signature</code> and <code>X-Elan1-Timestamp</code>. Reject anything older than five minutes. The exact signing string follows the Standard Webhooks scheme (<code>timestamp + "." + body</code>) — an open item, so pin the SDK helper rather than hand-rolling it.') +
      codeTabs([{ lang: 'ts', title: 'verify.ts', code: 'import { createHmac, timingSafeEqual } from "node:crypto";\n\nexport function verify(body: Buffer, sig: string, ts: string, secret: string): boolean {\n  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;       // 5-minute window\n  const mac = createHmac("sha256", secret).update(`${ts}.`).update(body).digest("hex");\n  return mac.length === sig.length && timingSafeEqual(Buffer.from(mac), Buffer.from(sig));\n}' }, { lang: 'py', title: 'verify.py', code: 'import hmac, hashlib, time\n\ndef verify(body: bytes, sig: str, ts: str, secret: bytes) -> bool:\n    if abs(time.time() - int(ts)) > 300:\n        return False                                   # 5-minute window\n    mac = hmac.new(secret, f"{ts}.".encode() + body, hashlib.sha256).hexdigest()\n    return hmac.compare_digest(mac, sig)' }]) +
      h2('gaps', 'Detect gaps with seq') + p('Seq is per tenant, starts at 1 and never skips. If an event arrives with a seq that is not last + 1, fetch the gap from <code>/v1/evidence</code> — the chain, not the webhook stream, is the source of truth.') +
      codeTabs([{ lang: 'ts', title: 'gaps.ts', code: 'const last = await store.lastSeq();\nif (evt.data.seq > last + 1) {\n  const missing = await k.evidence.list({ seq_from: last + 1, seq_to: evt.data.seq - 1 });\n  for (const e of missing) await apply(e);   // entries include refusals and escalations\n}\nawait store.setLastSeq(Math.max(last, evt.data.seq));' }, { lang: 'py', title: 'gaps.py', code: 'last = store.last_seq()\nif evt.data["seq"] > last + 1:\n    for e in k.evidence.list(seq_from=last + 1, seq_to=evt.data["seq"] - 1):\n        apply(e)\nstore.set_last_seq(max(last, evt.data["seq"]))' }]) +
      h2('retries', 'Retries') + p('Answer 2xx within 10 seconds. Anything else is retried with the Standard Webhooks schedule (build recommendation): immediately, then 5 s, 5 min, 30 min, 2 h, 5 h, 10 h and 10 h. After the last attempt the endpoint is marked failing under Agents · Webhooks and a person is told; events are never dropped from the chain, so a later backfill by seq recovers everything.') +
      c.table({ caption: 'Retry schedule', dense: true, columns: [{ key: 'a', label: 'Attempt', mono: true }, { key: 'd', label: 'Delay after the previous attempt' }], rows: ['immediately', '5 seconds', '5 minutes', '30 minutes', '2 hours', '5 hours', '10 hours', '10 hours'].map(function (d, i) { return { a: String(i + 1), d: d }; }) });
    return wrap(path, html);
  }
  E1.action('dv-testhook', function () { E1.toast('Test event write.refused sent to https://hooks.ledgerloop.in/elan1 · 200 in 184 ms', 'good', { title: 'Delivered', action: { label: 'Endpoints', href: '#/agents/webhooks' } }); });

  /* ------------------------------------------------------------------------
     /developers/declarations — authoring declarations as code
     ------------------------------------------------------------------------ */
  var DECL_YAML = [
    '# declarations/erp.ar.yaml — rung1 · Accounts receivable (ERPNext). Certified as v7 by Arjun Mehta, 19 Sep 2026.',
    'identity:',
    '  declaration_id: ' + T.decl,
    '  name: rung1 — Accounts receivable (ERPNext)',
    '  slug: erp_ar',
    '  owner_role: accounts-head            # a role, never a person — people leave',
    '  residency_domain: in',
    '  system_of_record: erpnext',
    '  lexicon_ref: rung1/erpnext/gst/2026-09',
    '  description: Invoices, credit notes and credit limits for customers of Kaveri Spinning Mills.',
    '',
    'shape:',
    '  record_type: Sales Invoice',
    '  fields:',
    '    - { name: customer,      type: reference, references: Customer, required: true, classification: internal }',
    '    - { name: customer_gstin, type: string, required: true, classification: financial }',
    '    - { name: grand_total,   type: decimal, required: true, classification: financial }',
    '    - { name: posting_date,  type: date,    required: true, classification: internal }',
    '',
    'permissions:',
    '  grants:',
    '    - { actor_kind: agent, role: ar-agent,     write_type: erp.sales_invoice.submit, min_autonomy: A2, may_approve: false }',
    '    - { actor_kind: human, role: ar-approvers, write_type: erp.sales_invoice.submit, min_autonomy: A4, may_approve: true }',
    '',
    'write_types:',
    '  - name: erp.sales_invoice.submit',
    '    label: Submit invoice',
    '    intent: Submit a drafted sales invoice to ERPNext and request its IRN from the GST portal.',
    '    blast_radius: one_counterparty',
    '    dual_control: { when: "grand_total > 200000" }',
    '    gates: [consent, residency, retention, counterparty, precondition, dual_control, budget]   # declared order is semantic',
    '    reversal_plan: { method: target_native_undo, window_hours: 24, after_window: compensating_entry }',
    '    payload_schema: schemas/sales_invoice.submit.json',
    '',
    'gates:',
    '  - name: precondition',
    '    params: { predicate: "credit_exposure + grand_total <= credit_limit", also: [no_duplicate_invoice_no, period_open] }',
    '    as_of_dependency: posting_date',
    '    refusal_codes: [GATE.PRECONDITION_FAILED]',
    '  - name: budget',
    '    enabled: true                        # only rate, budget and schedule may be false (with an ADR)',
    '    params: { per: month, limit: 250, counts: drafts }',
    '    refusal_codes: [GATE.BUDGET_EXHAUSTED]',
    '',
    'proof_binding:',
    '  fields: [customer, customer_gstin, grand_total, posting_date]   # → F14',
    '  canonicalisation: elan1_lp_v1',
    '  salt_scope: per_record',
    '',
    'channels:',
    '  - { name: console, kind: web,       write_types: [erp.sales_invoice.submit], may_approve: true,  mode: enforced }',
    '  - { name: api,     kind: api,       write_types: [erp.sales_invoice.submit], may_approve: false, mode: enforced }',
    '  - { name: mcp,     kind: mcp,       write_types: [erp.sales_invoice.submit], may_approve: false, mode: attested_advisory }',
    '  - { name: whatsapp, kind: messaging, write_types: [],                        may_approve: true,  mode: enforced }'
  ].join('\n');
  function pgDeclarations() {
    var path = '/developers/declarations';
    var blocks = [['1', 'identity', 'declaration_id · name · slug · owner_role (a role, never a person) · residency_domain · system_of_record · lexicon_ref (→ F15) · description'],
      ['2', 'shape', 'record_type · fields[] {name, type, cardinality, required, classification public · internal · personal · financial} · links[]'],
      ['3', 'permissions', 'grants[] {actor_kind, role, write_type, min_autonomy A0–A5, may_approve — never true for an agent}'],
      ['4', 'write_types', 'name · label · intent (≥ 40 characters) · blast_radius · dual_control · gates[] (ordered) · reversal_plan XOR irreversible: true · payload_schema'],
      ['5', 'gates', 'name (nine) · enabled (false only for rate, budget, schedule) · params · as_of_dependency · refusal_codes[]'],
      ['6', 'proof_binding', 'fields[] (→ F14) · canonicalisation elan1_lp_v1 · salt_scope per_record · redaction_profile (ignored at L1)'],
      ['7', 'channels', 'channels[] {name, kind web · mobile · messaging · api · mcp · voice, write_types[], may_approve, mode enforced · attested_advisory}']];
    var S_RULES = [['L0-S01', 'Granted write types exist'], ['L0-S02', 'Named gates exist'], ['L0-S03', 'reversal_plan XOR irreversible'], ['L0-S04', 'Irreversible ⇒ radius ≥ one_counterparty'], ['L0-S05', 'tenant or cross_boundary ⇒ dual_control'], ['L0-S06', 'cross_boundary ⇒ non-empty proof_binding'], ['L0-S07', 'Bound fields exist in shape'], ['L0-S08', 'Channels are registered for the tenant'], ['L0-S09', 'policy_exempt needs an ADR, never on irreversible'], ['L0-S10', 'Every write type is on at least one channel'], ['L0-S11', 'No agent may_approve; min_autonomy within A0–A5']];
    var LINT = [['LN-01', 'More than 900 lines'], ['LN-02', 'A reason under 12 characters'], ['LN-03', 'not_measurable unchanged over 3 versions'], ['LN-04', 'Gate order differs from the pack template'], ['LN-05', 'intent under 40 characters, or repeats label'], ['LN-06', 'A financial or personal field unbound without an ADR'], ['LN-07', 'rate, budget or schedule off without an ADR']];
    var html = hero({ eyebrow: 'Concepts', title: 'Declarations as code', lead: 'Policy is data. A declaration is one JSON object — YAML to author — in seven blocks that read as one sentence: <em>identity · shape · permissions · write_types · gates · proof_binding · channels</em>. Keep it in your repository, validate it in CI, certify it in Studio.', meta: pill('Schema', 'JSON Schema 2020-12') + pill('additionalProperties', 'false') + pill('Size', 'under 900 lines') }) +
      h2('blocks', 'The seven blocks') + c.table({ caption: 'Blocks', columns: [{ key: 'n', label: '#', mono: true }, { key: 'b', label: 'Block', mono: true }, { key: 'f', label: 'Fields' }], rows: blocks.map(function (b) { return { n: b[0], b: b[1], f: b[2] }; }) }) +
      h2('example', 'A worked example') + p('An excerpt of <code>erp.ar v7</code>, the declaration behind ' + a('#/records/declarations/erp.ar', 'Records · erp.ar') + ' and the ' + a('#/records/write-types/erp.sales_invoice.submit', 'Submit invoice') + ' write type.') + c.code(DECL_YAML, 'yaml', { title: 'declarations/erp.ar.yaml' }) +
      h2('dispositions', 'Three dispositions, never a blank') + p('Every field carries one of: a value; <code>out_of_scope</code> with an <code>ADR-nnnn</code>; or <code>not_measurable</code> with a <code>reason</code> and <code>would_change_if</code>, each at least 12 characters. Studio rejects “n/a” and “tbd” with: “An honest unknown needs a sentence. What would change your answer?”') +
      c.code('retention:\n  not_measurable:\n    reason: "Retention for e-invoices under GST rule 56 is not yet confirmed by counsel."\n    would_change_if: "Counsel confirms whether IRN acknowledgements count as books of account."', 'yaml', { title: 'An honest unknown' }) +
      h2('rules', 'Semantic rules and lint') + '<div class="dv-grid dv-grid--2">' + c.table({ caption: 'Failures', dense: true, columns: [{ key: 'c', label: 'Failure', mono: true }, { key: 'd', label: 'Rule' }], rows: S_RULES.map(function (r) { return { c: r[0], d: r[1] }; }) }) + c.table({ caption: 'Lint', dense: true, columns: [{ key: 'c', label: 'Warning', mono: true }, { key: 'd', label: 'Lint' }], rows: LINT.map(function (r) { return { c: r[0], d: r[1] }; }) }) + '</div>' +
      p('Failures are shown against the block that caused them, not as a list of codes. For example: “L0-S03 — sales_invoice.submit declares neither a reversal plan nor irreversible: true. Every write type must say which it is.”') +
      h2('ci', 'Validate and simulate in CI') + p('Validation checks the schema, L0-S01 to S11 and lint. Simulation runs against the reference tenant only. A simulation that produced no refusals did not test your rules: “Add a fixture that fails.” The CLI below is illustrative.') +
      codeTabs([{ lang: 'yaml', title: '.github/workflows/declarations.yml', code: 'name: declarations\non: [pull_request]\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npx @elan1/cli declarations validate declarations/erp.ar.yaml\n      - run: npx @elan1/cli declarations simulate declarations/erp.ar.yaml --tenant ref-tenant --fixtures fixtures/ --require-refusal\n        env: { ELAN1_CONTROL_TOKEN: ${{ secrets.ELAN1_CONTROL_TOKEN }} }' }, { lang: 'shell', title: 'Output', code: '$ elan1 declarations validate declarations/erp.ar.yaml\n✓ schema          2020-12, additionalProperties: false\n✓ semantic        L0-S01 … L0-S11 (11 of 11)\n! lint            LN-05 erp.credit_note.submit: intent repeats label\n\n$ elan1 declarations simulate … --tenant ref-tenant\n  commits 42 · refusals 9 (GATE.PRECONDITION_FAILED 6, GATE.BUDGET_EXHAUSTED 3) · escalations 11\n✓ at least one refusal per declared gate with fixtures' }], { sync: false, label: 'CI' }) +
      h2('lifecycle', 'Lifecycle') + c.stepper(['Draft', 'Validated', 'Simulated', 'Certified', 'Compiled', 'Resolvable'], 3) +
      p('Six stages, none skippable. Certification is a governed write by a named person who is not the author (else <code>GATE.DUAL_CONTROL_SAME_ACTOR</code>). Versions are exactly last + 1, kept verbatim for ever; a typo fix is still a new version. Later states: <em>superseded</em> (old writes still resolve) and <em>withdrawn</em> (new intents refuse with ' + a('#/developers/refusals/POLICY.DECLARATION_UNRESOLVED', 'POLICY.DECLARATION_UNRESOLVED') + '). The author sees “Accepted at version N”; webhook <code>declaration.certified</code> follows.') +
      '<div class="dv-actions">' + c.button('Open Studio', { href: '#/records/studio', icon: 'edit' }) + c.button('Register with define', { kind: 'ghost', href: '#/developers/kernelport/define', iconRight: 'arrow-right' }) + '</div>';
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/seal — Seal Spec v6
     ------------------------------------------------------------------------ */
  var GROUPS = [['Chain position', 'F01–F03'], ['The write', 'F04–F05'], ['Which rules decided', 'F06–F08, F15'], ['Who acted, at what latitude', 'F09–F11'], ['The target record', 'F12–F13'], ['The payload, committed', 'F14'], ['When', 'F16']];
  var LEN = { uuid: 16, uint64: 8, digest: 32, uint32: 4, uint8: 1, timestamp: 20 };
  function preimageRows(which) {
    var rec = which === '1' ? { wt: 'sales_invoice.submit', kind: 'human', seq: 1, a: 2, prev: '00'.repeat(32), rid: 'non-zero', rv: 1, at: '2027-01-04T09:15:00Z' } :
      which === '4098' ? { wt: 'erp.sales_invoice.submit', kind: 'agent', seq: 4098, a: 3, prev: CHAIN[4097], rid: 'zero', rv: 0, at: '2026-09-24T08:37:12Z' } :
      { wt: 'erp.sales_invoice.submit', kind: 'agent', seq: 4101, a: 2, prev: CHAIN[4100], rid: 'non-zero', rv: 1, at: '2026-09-24T09:32:47Z' };
    var rows = [['—', 'domain', 19, '"elan1.proof.seal.v6"']];
    F16.forEach(function (f) {
      var t = f[2].split(' · ')[0], len = LEN[t], v;
      if (f[1] === 'write_type') { len = rec.wt.length; v = '"' + rec.wt + '"'; }
      else if (f[1] === 'actor_kind') { len = rec.kind.length; v = '"' + rec.kind + '"'; }
      else if (f[1] === 'seq') v = String(rec.seq) + ' (u64 BE)';
      else if (f[1] === 'prev_digest') v = which === '1' ? '32 × 0x00 (genesis)' : E1.fmt.shortHash(rec.prev, 8, 8);
      else if (f[1] === 'autonomy_level') v = rec.a + ' (A' + rec.a + ')';
      else if (f[1] === 'record_id') v = rec.rid === 'zero' ? '16 × 0x00 (refusal)' : '16 octets, big-endian';
      else if (f[1] === 'record_version') v = String(rec.rv);
      else if (f[1] === 'recorded_at') v = '"' + rec.at + '"';
      else if (f[1] === 'declaration_version') v = which === '1' ? '1' : '7';
      else if (f[1] === 'policy_version') v = which === '1' ? '1' : '11';
      else v = t === 'uuid' ? '16 binary octets' : '32 octets';
      rows.push([f[0], f[1], len, v]);
    });
    return rows;
  }
  function preimageHtml(which) {
    var rows = preimageRows(which), content = rows.reduce(function (s, r) { return s + r[2]; }, 0), total = content + rows.length * 4;
    return '<div class="dv-params" style="overflow:auto">' + rows.map(function (r) { return '<div class="dv-hexrow"><span class="h">' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span><span>' + ('0000000' + r[2].toString(16)).slice(-8).replace(/(..)(?=.)/g, '$1 ') + '</span><span class="v">' + esc(r[3]) + '</span></div>'; }).join('') + '</div>' +
      '<p class="dv-note"><strong>' + rows.length + ' groups</strong> · content ' + content + ' octets + ' + rows.length + ' × 4 length prefixes = <strong>' + total + '-octet preimage</strong>' + (which === '1' ? ' — TV-001, exactly as the specification says.' : '.') + ' The third column is each group’s uint32 big-endian length prefix.</p>';
  }
  function pgSeal(params, q) {
    var path = '/developers/seal', which = ['1', '4098', '4101'].indexOf(q.record) >= 0 ? q.record : '1';
    var html = hero({ eyebrow: 'Evidence specification · elan1.proof.seal.v6', title: 'Seal v6', lead: 'Sixteen fields, length-prefixed, SHA-256, frozen for ever. No optional fields, no seventeenth field, no v6.1. Level 1 computes and chains the digest today; Level 2 signs exactly the same 32 octets.', meta: tag('Steps 1–4 · Level 1 — being built') + tag('Steps 5–7 · Level 2 — specified, not built', 'dash') + pill('TV-001', '329 octets') }) +
      h2('fields', 'The sixteen fields') + c.table({ caption: 'Seal v6 fields', dense: true, columns: [{ key: 'f', label: '#', mono: true }, { key: 'n', label: 'Field', mono: true }, { key: 't', label: 'Type · octets', mono: true, nowrap: true }, { key: 'd', label: 'Rule' }], rows: F16.map(function (r) { return { f: r[0], n: r[1], t: r[2], d: r[4] }; }) }) +
      p('Field groups: ' + GROUPS.map(function (g) { return '<strong>' + esc(g[0]) + '</strong> (' + g[1] + ')'; }).join(' · ') + '. Never label F16 <code>sealed_at</code> — that name is retired.') +
      h2('encoding', 'Encoding') + '<ul><li>uuid: 16 binary octets, big-endian — never text.</li><li>Integers: unsigned, big-endian.</li><li>Strings: UTF-8, NFC, no BOM, no terminator.</li><li>Enums: lowercase ASCII tokens (<code>human</code>, <code>agent</code>, <code>system</code>).</li><li>Time: <code>YYYY-MM-DDTHH:MM:SSZ</code>, exactly 20 octets, platform clock.</li><li>No JSON anywhere in the preimage.</li></ul>' +
      c.code('preimage = LP("elan1.proof.seal.v6") ‖ LP(enc F01) ‖ … ‖ LP(enc F16)     # 17 groups\nLP(x)    = uint32_BE(len(x)) ‖ x\ndigest   = SHA-256(preimage)', 'text', { title: 'Preimage' }) +
      h2('inspector', 'Preimage inspector') + p('Pick a record to see its seventeen length-prefixed groups.') +
      '<div class="dv-toolbar">' + c.segmented([{ id: '1', label: 'seq 1 · genesis (TV-001)', href: E1.href(path, { record: '1' }) }, { id: '4098', label: '#4,098 · refused', href: E1.href(path, { record: '4098' }) }, { id: '4101', label: '#4,101 · committed', href: E1.href(path, { record: '4101' }) }], which, { label: 'Record' }) + '</div>' + preimageHtml(which) +
      h2('pipeline', 'From fields to seal: seven steps') +
      '<ol class="dv-pipe" style="margin-top:30px;padding:0">' + [['1 BIND', '16 fields from the append-only context; nothing computed here', ''], ['2 CANONICALISE', 'Encode each field; uint32 BE length prefix; domain string first', ''], ['3 DIGEST', 'SHA-256 over 17 groups → 32 octets', ''], ['4 CHAIN', 'Append under UNIQUE (tenant_id, seq); return seq + digest · assurance_level: 1', 'is-stop'],
        ['5 SIGN', 'Pure Ed25519 over the 32-octet digest (RFC 8032, not ph, not ctx)', 'is-l2'], ['6 ANCHOR', 'RFC 6962 Merkle root → RFC 3161 tokens from two TSAs, ≤ 15 min', 'is-l2'], ['7 SEAL OBJECT', '16 fields + digest + level 2 + signature + key_id + anchor_ref', 'is-l2']].map(function (s) { return '<li class="' + s[2] + '"><b>' + esc(s[0]) + '</b>' + esc(s[1]) + (s[2] === 'is-l2' ? '<span class="dv-tag dv-tag--dash" style="margin-top:4px;align-self:flex-start">Level 2 · specified</span>' : '') + '</li>'; }).join('') + '</ol>' +
      p('Deliberately <strong>outside</strong> the preimage: the payload itself (erasure destroys the salt), gate results (bound by declaration version), the approver (an approval is its own record), the enforcement mode, and any seventeenth field.') +
      h2('l2-object', 'The Level 2 seal object') + (c.locked({ level: 'L2', title: 'The signed seal object arrives at Assurance Level 2 Attested', why: 'At Level 1 there is no signature, key_id or anchor_ref member — absent, not null. Showing a filled example as if it applied today would claim something Level 1 cannot.', items: ['signature — 128 hex, pure Ed25519', 'key_id, e.g. k_in_20270401_9c3a', 'anchor_ref — Merkle inclusion path and RFC 3161 token reference'] }) ||
        c.code(J({ tenant_id: T.tenant, seq: 41207, prev_digest: dg('a90f', '13be', 'seal41206'), write_id: uid('w41207'), write_type: 'sales_invoice.submit', declaration_id: T.decl, declaration_version: 7, policy_version: 12, actor_id: uid('billing-agent-01'), actor_kind: 'agent', autonomy_level: 2, record_id: uid('rec41207'), record_version: 1, payload_hash: dg('77b0', 'c3d1', 'ph41207'), lexicon_hash: T.lexicon, recorded_at: '2027-08-12T06:30:11Z', digest: dg('2c4e', '9f70', 'seal41207'), assurance_level: 2, signature: hx('sig41207', 128), key_id: 'k_in_20270701_4d7e', anchor_ref: { batch: 'b_20270812_0630_7c1e', path: [hx('p1', 64), hx('p2', 64), hx('p3', 64), hx('p4', 64)], token: 'anchors/b_20270812_0630_7c1e.tsr' } }), 'json', { title: 'Level 2 preview · specified, not built · illustrative values' })) +
      h2('vectors', 'Test vectors') + p('64 positive vectors and 28 negatives. “The v3.0 TV-001 digest is not written into any document until two independent implementations have produced it and agreed.” Until then this page shows <strong>Digest: published at freeze</strong>.') +
      c.table({ caption: 'Vector groups', columns: [{ key: 'g', label: 'Group', mono: true }, { key: 'w', label: 'What it covers' }, { key: 'l', label: 'Level' }], rows: [
        { g: 'PV-01 … PV-12', w: 'Structure: every field type at its bounds; TV-001 genesis (329 octets)', l: 'L1' }, { g: 'PV-13 … PV-24', w: 'Chains: 2 and 1,000 records, an all-refusal chain, a chain spanning a key rotation', l: 'L1 / L2' },
        { g: 'PV-25 … PV-36', w: 'Merkle and anchor: 1, 2, 3, 7 and 1,024 leaves', l: 'L2' }, { g: 'NV-01 … NV-28', w: 'Must be rejected, naming record and field: a gap in seq, a 17th field, a text uuid, delimiters, NV-13 odd node duplicated, NV-14 a ph signature, a bundle carrying its own key', l: 'L1 / L2' }] }) +
      h2('two-impl', 'The two-implementation rule') + '<ol><li>Freeze the text and the vector inputs, withholding the expected digests.</li><li>Teams A and B build from the text alone — no shared code, branch, channel or engineer.</li><li>Diff octet for octet; 64 of 64 is the only pass.</li><li>A disagreement is a defect in the text: fix the text, never make one implementation match the other.</li><li>Re-implement.</li><li>A third party writes the verifier (no network, empty lockfile).</li><li>The verifier passes every positive and rejects every negative.</li><li>Publish text, vectors, digests and verifier source together.</li></ol>' +
      h2('never', 'What must never happen') + '<ul><li>A seventeenth field, a v6.1 or an optional field.</li><li>A library shared by the chain writer and the verifier.</li><li>Signing at Level 1, or back-signing Level 1 records.</li><li>A record leaving the building before step 8 of the two-implementation rule.</li></ul>';
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/verifier — offline verifier CLI
     ------------------------------------------------------------------------ */
  var EXITS = [
    ['0', 'PASS', 'Every integrity check passed and every profile check passed', 'Rely on it within the limits statement', 'good'],
    ['0', 'PASS — payload unbound', 'One or more records’ payload salts were destroyed under an erasure obligation. Chain intact, payload unbound', 'Note it. This is not a failure and must never be printed as one', 'good'],
    ['0', 'PASS — unsigned, assurance level 1', 'Structure and chain verified; signature, key-window and anchor checks not_applicable', 'Treat as internal control evidence only. It is not third-party-checkable', 'neutral'],
    ['1', 'FAIL_INTEGRITY', 'A digest, a chain link, a signature, an inclusion path or an anchor did not verify', 'Stop. This is a forensic question, not a compliance question', 'critical'],
    ['2', 'FAIL_PROFILE', 'Integrity is sound; a profile requirement is unmet', 'The records are trustworthy and the bundle does not meet this regime’s requirements. Two different findings', 'serious'],
    ['3', 'INCOMPLETE', 'A referenced declaration version, lexicon or anchor member is missing from the bundle', 'Ask for a complete bundle. Do not treat as a failure of the records', 'warning'],
    ['4', 'UNSUPPORTED', 'Unknown profile version or unknown domain string', 'Obtain the matching verifier. Never interpret', 'neutral'],
    ['5', 'USAGE', 'Bad arguments, unreadable file', 'Operator error', 'neutral']
  ];
  var DEMOS = {
    tampered: ['$ elan1-verify --bundle published/tampered-bundle.tar --profile in-mca-audit-trail-v1.json --key-fingerprint 3f9a1c07…8b2e', '', 'VERDICT      1 FAIL_INTEGRITY', 'CLAIM        in-mca-audit-trail v1 · seq 1–4,200 · tenant 7c1e…a04b', 'SCOPE        4,200 records claimed · 3,180 verified before the first failure', 'INTEGRITY    preimages passed · digests passed · seq contiguity passed', '             prev_digest linkage FAILED', 'FIRST FAIL   FAIL at seq 3,181: prev_digest mismatch, expected a376… got 0000…', 'NOTES        This is the published tampered bundle. A verifier nobody has watched refuse is not a verifier.', 'LIMITS       (the profile’s limits statement, verbatim)', 'REPRODUCE    elan1-verify v1.0.3 (0d7c…55a1) · profile aa60…31f2 · bundle 9e17…c402', '', 'exit 1'],
    pass: ['$ elan1-verify --bundle kaveri-ledger1-2027-07-01_2027-10-26.tar --profile in-mca-audit-trail-v1.json --key-fingerprint 3f9a1c07…8b2e', '', 'VERDICT      0 PASS', 'CLAIM        in-mca-audit-trail v1 · rule_as_at 2023-04-01 · seq 41,207–53,686', 'SCOPE        12,480 records · 611 refusals · 6 of 6 write types · continuity full_chain', 'INTEGRITY    preimages passed · digests passed · signatures passed (1 key, window ok)', '             seq contiguity passed · prev_digest linkage passed', '             Merkle inclusion passed (12,458 records in 818 batches; 1 single_anchor batch)', '             anchor time passed · declarations and lexicon resolved passed', 'CLAUSES      4 clauses bound · C01–C06 passed', 'FIRST FAIL   none', 'NOTES        22 records unanchored at export time', '', 'exit 0'],
    l1: ['$ elan1-verify --bundle kaveri-l1-dryrun.tar --profile in-mca-audit-trail-v1.json --key-fingerprint none', '', 'VERDICT      0 PASS — unsigned, assurance level 1', 'INTEGRITY    preimages passed · digests passed · seq contiguity passed · prev_digest linkage passed', '             signatures not_applicable — assurance level 1', '             Merkle inclusion not_applicable — assurance level 1', 'CLAUSES      C06 not_applicable — assurance level 1', 'NOTES        Internal control evidence only. It is not third-party-checkable.', '', 'exit 0']
  };
  function pgVerifier(params, q) {
    var path = '/developers/verifier', demo = DEMOS[q.demo] ? q.demo : 'tampered';
    var html = hero({ eyebrow: 'Evidence specification · elan1-verify', title: 'Offline verifier', lead: 'A command-line tool that checks an evidence bundle on the reader’s own machine: no network, no API, no elan1 account and no code shared with the chain writer. It does not refuse, it reports. Free, shipped as source, to anyone — never priced.', meta: tag('Level 2 — specified, not built', 'dash') + pill('Dependencies', '0') + pill('Exit codes', '0–5') }) +
      h2('usage', 'Usage') + c.code('elan1-verify --bundle <path> --profile <path> --key-fingerprint <hex>', 'shell', { title: 'Command' }) +
      p('It reads only four things: the bundle’s eight members, the profile document, the key fingerprint — obtained out of band, from the reader’s own source, never from the bundle — and the local clock, only to check that the anchor time precedes now.') +
      h2('exit-codes', 'Exit codes') + p('Six codes; code 0 has three verdict strings. “1 and 2 must never be collapsed. FAIL_INTEGRITY means somebody’s records were altered. FAIL_PROFILE means an honest record set does not meet a regime’s requirements.” 3 is never reported as either.') +
      c.table({ caption: 'Exit codes', columns: [{ key: 'c', label: 'Exit', render: function (r) { return '<span class="dv-exit">' + esc(r.c) + '</span>'; } }, { key: 'n', label: 'Verdict', render: function (r) { return c.badge(r.s, r.n); } }, { key: 'm', label: 'Means' }, { key: 'r', label: 'What the reader does' }], rows: EXITS.map(function (e) { return { c: e[0], n: e[1], m: e[2], r: e[3], s: e[4] }; }) }) +
      p('The same table, for people without a terminal, is on ' + a('#/verify/exit-codes', 'Verify · exit codes') + '.') +
      h2('report', 'The report: nine sections, in this order') + '<ol><li>Verdict</li><li>The claim</li><li>Scope — continuity and count</li><li>Integrity results (I1–I8: passed · failed · not_applicable — assurance level 1)</li><li>Clause results</li><li>First failure, in full — seq, field, expected, found</li><li>Notes</li><li>Limits — verbatim</li><li>Reproduction — command, verifier, profile and bundle digests</li></ol>' +
      h2('integrity', 'Eight integrity steps') + '<ol><li>Recompute every preimage.</li><li>Recompute every digest.</li><li>Verify every signature against keys.json windows and the supplied fingerprint.</li><li>seq contiguity.</li><li>prev_digest linkage.</li><li>Merkle inclusion paths.</li><li>Anchor token time precedes now.</li><li>Resolve every declaration version and lexicon digest inside the bundle.</li></ol>' +
      h2('demo', 'Watch it refuse') + p('A verifier nobody has watched refuse is not a verifier. Run it on the published tampered bundle and watch it exit 1.') +
      (c.locked({ level: 'L2', title: 'Verifier runs arrive at Assurance Level 2 Attested', why: 'At Level 1 there is no bundle to verify and no verifier verdict to show. The run below is a Level 2 preview on sample data.', items: ['The published tampered bundle, exiting 1', 'A Level 2 bundle, exiting 0 PASS', 'A Level 1 dry run: 0 PASS — unsigned, assurance level 1'] }) ||
        ('<div class="dv-toolbar">' + c.segmented([{ id: 'tampered', label: 'Tampered bundle', href: E1.href(path, { demo: 'tampered' }) }, { id: 'pass', label: 'Level 2 bundle', href: E1.href(path, { demo: 'pass' }) }, { id: 'l1', label: 'Level 1 dry run', href: E1.href(path, { demo: 'l1' }) }], demo, { label: 'Bundle' }) + tag('Level 2 preview · sample data', 'dash') + '</div><pre class="dv-term" aria-label="Verifier output">' + esc(DEMOS[demo].join('\n')) + '</pre>')) +
      h2('trust', 'How a sceptic checks the verifier is ours') + '<ol><li>Compare its SHA-256 with <code>SHA256SUMS</code> and check the release signature against the release key fingerprint obtained out of band.</li><li>Rebuild from source and compare digests — the build is reproducible.</li><li>Read the source: standard library only, small enough to read in a day.</li><li>Write your own verifier from Seal v6 and the profile specification. “A verifier we supply is a convenience; the format is the product.”</li></ol>' +
      h2('bundle', 'What it reads: the bundle') + c.table({ caption: 'Bundle members', dense: true, columns: [{ key: 'm', label: 'Member', mono: true }, { key: 'w', label: 'Contents' }, { key: 'r', label: 'Required' }], rows: [
        { m: 'manifest.json', w: 'Range, counts, digests of every other member, the profile claimed, unanchored_head (0 is a value, not an absence). Written last.', r: 'Always' }, { m: 'seals.jsonl', w: 'One record per line in seq order: sixteen fields, digest, level; at L2 the signature and key_id.', r: 'Always' },
        { m: 'chain.json', w: 'Genesis and head digests, seq range, boundary rows where level or key changes.', r: 'Always' }, { m: 'anchors/', w: 'Per batch: RFC 3161 tokens, Merkle root, leaf count, paths, TSA certificate path and revocation data.', r: 'L2' },
        { m: 'keys.json', w: 'key_id, validity window, status, successor, fingerprint — never the key.', r: 'L2' }, { m: 'declarations/', w: 'Every referenced (declaration_id, version), verbatim.', r: 'Always' },
        { m: 'lexicon/', w: 'Every term set referenced by F15.', r: 'Always' }, { m: 'VERIFY.txt', w: 'How to check without elan1, each failure, and what a PASS does not prove.', r: 'Always' }] }) +
      p('Never in a bundle: payloads, salts, key material, executables or URLs to fetch, or the target system’s current state.');
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/receipt — Action Receipt draft standard
     ------------------------------------------------------------------------ */
  function pgReceipt() {
    var path = '/developers/receipt';
    var members = c.table({ caption: 'Receipt members', columns: [{ key: 'm', label: 'Member', mono: true }, { key: 'c', label: 'Contents' }, { key: 'l', label: 'Conformance level', render: function (r) { return tag(r.l); } }], rows: [
      { m: 'format · seal_suite', c: 'action-receipt/1 · elan1-seal-v6', l: 'All' }, { m: 'sealed_fields · digest', c: 'F01–F16, SHA-256. A refusal carries zeroes, not omissions.', l: 'All' },
      { m: 'signature · key_id', c: 'Pure Ed25519 (RFC 8032); an identifier, never a key', l: 'CL-2' }, { m: 'anchor', c: 'Suite rfc3161-6962: path, root, leaf count, token', l: 'CL-3' },
      { m: 'audience · nonce · expires_at', c: 'The envelope: receiver org_id, 128-bit nonce, expiry. Signed separately over LP(digest) ‖ LP(audience) ‖ LP(nonce) ‖ LP(expires_at)', l: 'CL-4' },
      { m: 'disclosure_suite · disclosures', c: 'elan1-sd-v1, per-field disclosures against commitments', l: 'CL-D' }, { m: 'issuer · limits', c: 'ar-org:<domain>; the limits line, verbatim', l: 'All' }] });
    var levels = c.table({ caption: 'Levels mapping', columns: [{ key: 'a', label: 'elan1 assurance level' }, { key: 'c', label: 'Receipts you may produce' }], rows: [{ a: 'L1 Guarded', c: 'CL-1 Structural only — nothing above may be claimed' }, { a: 'L2 Attested', c: 'CL-2 Attested + CL-3 Anchored' }, { a: 'L3 Proven', c: 'CL-2 + CL-3 + CL-4 Addressed (+ CL-D Disclosing)' }] });
    var receipt = J({ format: 'action-receipt/1', seal_suite: 'elan1-seal-v6', issuer: 'ar-org:kaverispinning.example', sealed_fields: { tenant_id: T.tenant, seq: 41288, write_type: 'sales_invoice.submit', declaration_version: 9, policy_version: 14, actor_kind: 'agent', autonomy_level: 2, record_version: 1, recorded_at: '2028-03-14T10:02:11Z', '…': 'F01–F16 in full' }, digest: dg('51c0', '7a2e', 'rcpt41288'), signature: hx('rsig', 128), key_id: 'k_in_20280101_3b9d', anchor: { suite: 'rfc3161-6962', root: dg('0f3a', 'b8c1', 'root'), leaf_count: 24, path: ['…5 sibling digests…'], token: '…' }, audience: 'ar-org:acmetextiles.example', nonce: hx('nonce', 32), expires_at: '2028-03-21T10:02:11Z', disclosure_suite: 'elan1-sd-v1', disclosures: [{ field: 'invoice_no', value: 'SINV-2028-00412' }, { field: 'grand_total', value: '2764300' }, { field: 'customer_gstin', value: '33AAECA2210L1Z9' }], limits: 'This establishes that the issuer’s governed write path produced this record under these rules at this time; it does not establish that the underlying transaction occurred. elan1 does not adjudicate disputes between organisations.' });
    var html = hero({ eyebrow: 'Evidence specification · draft', title: 'Action Receipt', lead: 'A draft open format for proving to another organisation that a governed write happened on the issuer’s path, under stated rules, at a stated time — checkable without trusting the issuer or elan1, and usable after this company has ceased to exist.', meta: tag('Draft v0 · action-receipt/1', 'accent') + tag('Level 3 Proven — specified, not built', 'dash') + pill('Spec licence', 'CC BY 4.0') }) +
      c.callout({ kind: 'caveat', title: 'What it does not prove.', body: '<p>It still does not prove the transaction was genuine, it still does not prove the rules were adequate, and no regulator has approved it. The status word is “Published”, never “Open”, until three independent implementations from at least two organisations that are not elan1 exist.</p>' }) +
      h2('members', 'Members') + members + h2('levels', 'Conformance levels') + p('Deliberately not merged with elan1’s assurance levels. Claims are self-asserted with a published vector run; there is no certification body or mark in v0.') + levels +
      p('Your tenant today: ' + c.level(E1.state.level) + ' — ' + (E1.atLeast('L3') ? 'CL-2, CL-3 and CL-4 producer (preview).' : E1.atLeast('L2') ? 'CL-2 and CL-3 producer (preview).' : 'your level produces CL-1 receipts.')) +
      h2('verify-order', 'Verification order') + '<ol><li>Echo the claim.</li><li>Audience equals your own org_id — checked before the signature (POLICY.RECEIPT_AUDIENCE_MISMATCH).</li><li>expires_at; recorded_at and the anchor precede now (POLICY.RECEIPT_EXPIRED).</li><li>Resolve the key: route 1, else 2 or 3, never 4 (POLICY.TRUST_ANCHOR_UNKNOWN; no fallback).</li><li>Seal v6 preimage → SHA-256 → pure Ed25519 (POLICY.RECEIPT_UNVERIFIED).</li><li>Inclusion path against the RFC 3161 token; absent → UNANCHORED, stated, and verification continues.</li><li>Disclosures against per-field commitments.</li><li>Replay key (issuer, source_seq, digest) (GATE.RECEIPT_REPLAYED).</li></ol>' +
      h2('keys', 'Key discovery, first success wins') + c.table({ caption: 'Key discovery routes', columns: [{ key: 'n', label: 'Route', mono: true }, { key: 'r', label: 'How' }, { key: 't', label: 'Trust' }], rows: [{ n: '1', r: 'Out-of-band pinned fingerprint', t: 'Highest' }, { n: '2', r: 'https://<domain>/.well-known/action-receipt-keys — key_id, fingerprint, valid_from, valid_to, status, successor_id', t: 'Moderate' }, { n: '3', r: 'Trust-anchor attestation (specified; elan1 never operates a trust anchor)', t: 'Depends on the anchor' }, { n: '4', r: 'In-receipt hint', t: 'None. A hint is used to look up, never to trust' }] }) +
      h2('learns', 'What a receiver learns') + '<div class="dv-cols"><div><h4>Learns (intended)</h4><ul><li>F05–F08, F10, F11, F16</li><li>The actor as an opaque UUID</li><li>Only the disclosed payload fields</li></ul></div><div><h4>Learns, unavoidably</h4><ul><li>Volume between receipts, from seq</li><li>Tenant linkability via F01</li><li>Timing patterns — unlinkability is not claimed</li></ul></div><div><h4>Never learns</h4><ul><li>Undisclosed payload values</li><li>Other counterparties, records, refusals or gate results</li><li>Key material, or whether the receipt was accepted</li></ul></div></div>' +
      h2('example', 'Example receipt') + (c.locked({ level: 'L3', title: 'Signed receipts arrive at Assurance Level 3 Proven', why: 'A receipt with a signature, anchor and audience cannot be produced at your level. At Level 1 only CL-1 structural receipts exist.', items: ['A CL-4 receipt addressed to ar-org:acmetextiles.example', 'Three of eleven fields disclosed', 'The limits line, verbatim'] }) || c.code(receipt, 'json', { title: 'Level 3 preview · illustrative values' })) +
      h2('never', 'What must never happen') + '<ul><li>A receipt carrying its own key, or a fallback to the in-receipt hint.</li><li>A callback to the issuer on acceptance, a shared ledger or replicated records.</li><li>elan1 operating a trust anchor, or a degraded best-effort verify mode.</li><li>A seventeenth field.</li></ul>' +
      h2('governance', 'Licences and governance') + c.table({ caption: 'Licences', columns: [{ key: 'w', label: 'What' }, { key: 'l', label: 'Licence' }], rows: [{ w: 'Specification text', l: 'CC BY 4.0' }, { w: 'Reference verifier', l: 'Apache-2.0 — never priced, to anyone' }, { w: 'Test vectors and the tampered bundle', l: 'CC0' }, { w: 'The name “elan1” and its marks', l: 'Not licensed' }] }) +
      p('Draft and change log → 60-day public comment, every comment answered → two independent implementations → publish (a governed write under dual control, with the release key) → transfer of editorship within 12 months of three independent implementations. Defects are acknowledged within five working days; a defective version is superseded, never withdrawn. Alignment with SCITT, COSE receipts and SD-JWT is noted and [unverified]. See also ' + a('#/standard', 'the public standard page') + '.');
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/conformance (?run=ledgerloop|reference, ?state=empty|error)
     ------------------------------------------------------------------------ */
  function pgConformance(params, q) {
    var path = '/developers/conformance', st = q.state || '', runKey = RUNS[q.run] ? q.run : 'ledgerloop', run = RUNS[runKey];
    var states = statesMenu(path, [['', 'Latest result'], ['empty', 'No result file yet'], ['error', 'Unreadable result file']]);
    var WORD = { passed: ['good', 'Passed'], failed: ['critical', 'Failed'], not_measured: ['neutral', 'Not measured'] };
    var resultsTable = c.table({ caption: 'Conformance results', columns: [
      { key: 'id', label: 'Test', mono: true }, { key: 'n', label: 'Name', render: function (r) { return esc(r.n) + (r.dq ? ' ' + tag('Disqualifying', 'accent') : ''); } },
      { key: 's', label: 'Result', render: function (r) { var w = WORD[r.s] || WORD.not_measured; return c.badge(w[0], w[1]); } }, { key: 'e', label: 'Evidence' }],
      rows: CONF.map(function (t) { var rr = run.res[t[0]] || ['not_measured', '—']; return { id: t[0], n: t[1], dq: t[3], s: rr[0], e: rr[1] }; }) });
    var summary;
    if (st === 'empty') summary = c.empty({ icon: 'file-text', title: 'No result file yet', why: 'Run the suite against your sandbox tenant and upload the result file. It is a required attachment to a production request, and a person reads its first failure.', action: [{ label: 'Upload a result file', href: '#' + path, kind: 'primary' }, { label: 'How to run it', href: '#/developers/conformance', kind: 'ghost' }] });
    else if (st === 'error') summary = c.error({ title: 'We could not read that result file.', body: 'conformance.json is not a result file: the member “digest” is missing and “tests” has 12 entries, not 14.', reassurance: 'Nothing was attached to any request. Your previous result file (13 of 14, 23 Sep 2026) is still the one on record.', action: [{ label: 'Try another file', href: '#' + path }] });
    else {
      var f = run.file, first = null; CONF.forEach(function (t) { if (!first && run.res[t[0]] && run.res[t[0]][0] === 'failed') first = t; });
      summary = '<div class="dv-toolbar">' + c.segmented([{ id: 'ledgerloop', label: RUNS.ledgerloop.label, href: E1.href(path, { run: 'ledgerloop' }) }, { id: 'reference', label: RUNS.reference.label, href: E1.href(path, { run: 'reference' }) }], runKey, { label: 'Run' }) + '</div>' +
        '<div class="dv-grid dv-grid--3" style="margin-bottom:12px">' + c.stat({ label: 'Result', value: f.passed + ' of ' + f.of, note: f.result === 'pass' ? 'Every test passed.' : 'First failure: ' + first[0] + ' ' + first[1] + '.' }) + c.stat({ label: 'Suite', value: f.suite_version, note: 'KernelPort ' + f.kernelport + ' · assurance level ' + f.assurance_level }) + c.stat({ label: 'Run', value: E1.fmt.date(f.run_at), note: E1.fmt.time(f.run_at) + ' · ' + f.tenant + ' · ' + f.declaration }) + '</div>' +
        (first ? c.callout({ kind: 'warning', title: 'First failure: ' + first[0] + ' ' + first[1] + '.', body: '<p>' + esc(run.res[first[0]][1]) + '. ' + esc(first[2]) + ' Drill the compensating-entry path on a fixture and run the suite again; the reviewer will read this line.</p>' }) : '') +
        resultsTable + '<p class="dv-note">Result file digest <span class="e1-mono">' + esc(E1.fmt.shortHash(f.digest, 4, 4)) + '</span>. Each result is three-valued — passed, failed or not measured — never a bare tick.</p>';
    }
    var html = hero({ eyebrow: 'Reference', title: 'Conformance suite', lead: 'Fourteen tests, C1 to C14, that decide whether an integration behaves like elan1 says it does. The suite is the claim: its result file is a required attachment to a production request. C1 and C2 run first and disqualify on failure.', meta: pill('Suite', 'elan1-conformance 1.0.0-rc.3') + pill('Tests', 'C1–C14'), actions: states }) +
      h2('results', 'Results') + summary +
      h2('upload', 'Upload a result file') + '<div class="dv-drop" data-dv-drop tabindex="0" role="button" aria-label="Upload a result file">' + c.icon('upload', 20) + '<strong>Drop conformance.json here, or choose a file</strong><span class="e1-caption e1-muted">We read the file in your browser, show the first failure and keep its digest with your production request.</span><input type="file" accept="application/json,.json" data-dv-file class="e1-sr" id="dv-conf-file"><label for="dv-conf-file" class="e1-btn e1-btn--secondary e1-btn--sm" style="cursor:pointer">Choose a file</label></div>' +
      h2('tests', 'The fourteen tests') + c.table({ caption: 'Tests', columns: [{ key: 'id', label: 'Test', mono: true }, { key: 'n', label: 'Name' }, { key: 'a', label: 'Asserts' }], rows: CONF.map(function (t) { return { id: t[0], n: t[1] + (t[3] ? ' · disqualifying' : ''), a: t[2] }; }) }) +
      p('C14 fails the build on “signed”, “tamper-proof” or “independently verifiable” anywhere in rendered Level 1 copy. A 429 is a transport rejection: it produces no proof entry and no meter event, and must never be reported by the suite as a refusal. A run with no real refusal did not exercise the product.') +
      h2('run', 'Run it') + codeTabs([{ lang: 'shell', title: 'Terminal', code: 'npx @elan1/conformance run \\\n  --key $ELAN1_KEY \\\n  --declaration ll.billing@3 \\\n  --adapter ./adapter.config.json \\\n  --out conformance.json\n\n# C1 import graph ........ passed\n# C2 bypass attempt ...... passed\n# …\n# C12 rollback drill ..... failed  native undo ran; compensating path not exercised\n# 13 of 14 · first failure C12' }, { lang: 'yaml', title: '.github/workflows/conformance.yml', code: 'name: conformance\non: { schedule: [{ cron: "30 20 * * *" }], workflow_dispatch: {} }   # 02:00 IST\njobs:\n  suite:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npx @elan1/conformance run --key ${{ secrets.ELAN1_SANDBOX_KEY }} --declaration ll.billing@3 --out conformance.json\n      - uses: actions/upload-artifact@v4\n        with: { name: conformance, path: conformance.json }' }], { sync: false, label: 'Run' }) +
      h2('format', 'The result file') + c.code(J({ suite: 'elan1-conformance', suite_version: '1.0.0-rc.3', kernelport: 'v1', assurance_level: 1, tenant: 'ledgerloop-sbx', declaration: 'll.billing@3', run_at: '2026-09-23T10:41:07Z', result: 'fail', passed: 13, of: 14, tests: [{ id: 'C8', name: 'Refusal shape', result: 'passed', evidence: { seq: 318, http: 200, code: 'GATE.DUAL_CONTROL_PENDING', record_id: ZERO_UUID, quantity: 0 } }, { id: 'C12', name: 'Rollback drill', result: 'failed', evidence: { native_undo: 'passed', compensating_entry: 'not_exercised' } }, '… 12 more'], digest: RUNS.ledgerloop.file.digest }), 'json', { title: 'conformance.json (excerpt)' });
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/versioning — compatibility policy (O06)
     ------------------------------------------------------------------------ */
  function pgVersioning() {
    var path = '/developers/versioning';
    var html = hero({ eyebrow: 'Reference', title: 'Versioning policy', lead: 'What can change without notice, what needs notice, and how long you get. A deprecated version is never slowed, rate-limited or given worse errors — the anti-degradation rule.', meta: pill('Port', 'kernelport/v1') + pill('Sunset', '12 months') + pill('Changelog classes', 'additive · breaking · fix') }) +
      h2('identifiers', 'What is versioned') + c.table({ caption: 'Identifiers', columns: [{ key: 'i', label: 'Identifier', mono: true }, { key: 'w', label: 'Where you see it' }], rows: [
        { i: 'kernelport/v1', w: 'Header X-Kernel-Port: v1; the SDK package major' }, { i: '/v1/…', w: 'HTTP paths; Deprecation and Sunset headers on a superseded major' },
        { i: 'declaration@version', w: 'Every intent and every record (F06, F07). Never “latest” in production' }, { i: 'schema major', w: 'The declaration schema' },
        { i: 'policy_version', w: 'Resolved by the kernel; recorded in F08' }, { i: 'refusal register version', w: 'GET /v1/versions; codes never renumbered or reused' }] }) +
      h2('notice', 'Notice periods') + c.table({ caption: 'Notice periods', columns: [{ key: 'c', label: 'Change' }, { key: 'i', label: 'Internal' }, { key: 'e', label: 'External' }], rows: [
        { c: 'New optional response field', i: 'None', e: 'None — ships without notice; ignore unknown fields' }, { c: 'New refusal code', i: '30 days', e: '60 days, with the operator action published first' },
        { c: 'New required field', i: '90 days', e: 'A new port major — 12 months' }, { c: 'New KernelPort major', i: '90 days', e: '12 months' },
        { c: 'Change to rung order', i: '180 days', e: '12 months, plus a published argument' }, { c: 'Withdrawal', i: 'Two quarters', e: '12 months' },
        { c: 'Emergency security change', i: '—', e: 'Notified within 30 minutes, with a note in 24 hours' }] }) +
      p('The sixteen seal fields cannot change at v1. Deploy windows: Tuesday and Thursday, 21:00–23:00 IST.') +
      h2('versions', 'GET /v1/versions') + c.code(J({ port_major: 1, schema_major: 1, register_version: '1.0', policy_version: 11 }), 'json', { title: 'Response' }) +
      h2('deprecation', 'Deprecation and withdrawal') + c.code('HTTP/1.1 200 OK\nDeprecation: @1830297600\nSunset: Wed, 01 Mar 2028 00:00:00 GMT\nLink: <' + T.base + '/v2/writes>; rel="successor-version"\n\n# after Sunset:\nHTTP/1.1 410 Gone\n{"error":"withdrawn","message":"This version was withdrawn on 1 Mar 2028. You were notified on 1 Mar 2027."}', 'http', { title: 'Headers' }) +
      h2('contact', 'No contact, no production key') + p('Every production consumer names a notice contact — a person — who receives every deprecation notice. A consumer we cannot write to is a consumer we cannot honour this policy towards. Set it under ' + a('#/developers/production-request', 'Request production access') + '.');
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/changelog (?class=additive|breaking|fix)
     ------------------------------------------------------------------------ */
  function pgChangelog(params, q) {
    var path = '/developers/changelog', k = q['class'] || '';
    var rows = LOG.filter(function (r) { return !k || r[1] === k; });
    var cnt = function (x) { return LOG.filter(function (r) { return r[1] === x; }).length; };
    var tone = { additive: 'info', breaking: 'serious', fix: 'neutral' };
    var html = hero({ eyebrow: 'Reference', title: 'Changelog', lead: 'Every change to KernelPort, the HTTP API, the MCP server, the SDKs, webhooks and the register. Three classes and no fourth: additive, breaking, fix. Readable without a login.', meta: pill('Pre-GA', 'breaking changes still possible, and listed') }) +
      '<div class="dv-toolbar">' + c.filters([{ label: 'All', href: '#' + path, active: !k, count: LOG.length }, { label: 'Additive', href: E1.href(path, { 'class': 'additive' }), active: k === 'additive', count: cnt('additive') }, { label: 'Breaking', href: E1.href(path, { 'class': 'breaking' }), active: k === 'breaking', count: cnt('breaking') }, { label: 'Fix', href: E1.href(path, { 'class': 'fix' }), active: k === 'fix', count: cnt('fix') }], { label: 'Class' }) + '</div>' +
      (rows.length ? c.timeline(rows.map(function (r) { return { time: E1.fmt.date(r[0] + 'T12:00:00+05:30'), title: r[2] + ' · ' + r[1], body: r[3], state: tone[r[1]] }; })) : c.empty({ title: 'No ' + k + ' changes', why: 'Nothing in this class has shipped yet.', action: { label: 'Show all changes', href: '#' + path } })) +
      h2('pending', 'Pending notices') + c.table({ caption: 'Pending notices', columns: [{ key: 'c', label: 'Change', mono: true }, { key: 'k', label: 'Kind' }, { key: 's', label: 'Status' }, { key: 'n', label: 'Notice' }], rows: NOTICES.map(function (r) { return { c: r[0], k: r[1], s: r[2], n: r[3] }; }) }) +
      p('Product changes for people using the console are in ' + a('#/changelog', 'the public changelog') + '.');
    return wrap(path, html);
  }

  /* ------------------------------------------------------------------------
     /developers/architecture/:view — inline SVG diagrams from the atlas.
     Zone colours (--zone-*) are for diagrams only, never status. Nodes are
     keyboard-focusable buttons that open a drawer with the atlas copy.
     ------------------------------------------------------------------------ */
  var ZN = { kernel: 'elan1 — kernel, packs, console', consumer: 'Consumers and agents', runtime: 'stack1 runtime', people: 'People who decide', external: 'External systems and parties', refusal: 'Limits and prohibitions' };
  var ST = { l1: 'Level 1 — being built', l2: 'Level 2 — specified, not built', l3: 'Level 3 — specified, not built', ext: 'Outside elan1', parked: 'Parked' };
  function N(id, x, y, w, h, zone, label, sub, o) { o = o || {}; return { id: id, x: x, y: y, w: w, h: h, zone: zone, label: label, sub: sub || [], dashed: !!o.dashed, inline: !!o.inline, st: o.st || (o.dashed ? 'l2' : zone === 'external' ? 'ext' : 'l1'), body: o.body || '', links: o.links || [], rel: o.rel || null, mono: !!o.mono, small: !!o.small }; }
  function anchor(n, side, f) {
    f = f === undefined || f === null ? 0.5 : f;
    return side === 't' ? [n.x + n.w * f, n.y] : side === 'b' ? [n.x + n.w * f, n.y + n.h] : side === 'l' ? [n.x, n.y + n.h * f] : [n.x + n.w, n.y + n.h * f];
  }
  function autoSides(a, b) { if (b.x >= a.x + a.w) return ['r', 'l']; if (b.x + b.w <= a.x) return ['l', 'r']; return (b.y > a.y) ? ['b', 't'] : ['t', 'b']; }
  function edgeSvg(e, byId) {
    var A = byId[e.from], B = byId[e.to]; if (!A || !B) return '';
    var sd = e.sides ? e.sides.split('') : autoSides(A, B), p1 = anchor(A, sd[0], e.ff), p2 = anchor(B, sd[1], e.tf), d, lx, ly;
    var hz = function (s) { return s === 'l' || s === 'r'; };
    if (hz(sd[0]) && hz(sd[1])) { var mx = e.mx || (p1[0] + p2[0]) / 2; d = 'M' + p1[0] + ' ' + p1[1] + ' H' + mx + ' V' + p2[1] + ' H' + p2[0]; lx = mx; ly = (p1[1] + p2[1]) / 2; }
    else if (!hz(sd[0]) && !hz(sd[1])) { var my = e.my || (p1[1] + p2[1]) / 2; d = 'M' + p1[0] + ' ' + p1[1] + ' V' + my + ' H' + p2[0] + ' V' + p2[1]; lx = (p1[0] + p2[0]) / 2; ly = my; }
    else if (hz(sd[0])) { d = 'M' + p1[0] + ' ' + p1[1] + ' H' + p2[0] + ' V' + p2[1]; lx = (p1[0] + p2[0]) / 2; ly = p1[1]; }
    else { d = 'M' + p1[0] + ' ' + p1[1] + ' V' + p2[1] + ' H' + p2[0]; lx = p1[0]; ly = (p1[1] + p2[1]) / 2; }
    if (e.lx !== undefined) lx = e.lx; if (e.ly !== undefined) ly = e.ly;
    return '<path class="dv-edge' + (e.kind ? ' dv-edge--' + e.kind : '') + '" d="' + d + '" marker-end="url(#dv-arr' + (e.kind === 'adv' ? '-adv' : '') + ')"/>' +
      (e.label ? '<text class="dv-elabel" x="' + lx + '" y="' + (ly - 4) + '" text-anchor="' + (e.anchor || 'middle') + '">' + esc(e.label) + '</text>' : '');
  }
  function nodeSvg(n) {
    var z = 'var(--zone-' + n.zone + ')', zb = 'var(--zone-' + n.zone + '-bg)';
    var t = n.inline ? '<text x="' + (n.x + 12) + '" y="' + (n.y + n.h / 2 + 4.5) + '" style="font-size:13px;font-weight:700">' + esc(n.label) + '<tspan class="t-sub t-mono" dx="14" style="font-size:12px">' + esc(n.sub.join(' ')) + '</tspan></text>' :
      '<text x="' + (n.x + (n.small ? 7 : 10)) + '" y="' + (n.y + (n.small ? 17 : 19)) + '" style="font-size:' + (n.small ? 11 : 12.5) + 'px;font-weight:700"' + (n.mono ? ' class="t-mono"' : '') + '>' + esc(n.label) + '</text>' + n.sub.map(function (s, i) { return '<text class="t-sub" x="' + (n.x + (n.small ? 7 : 10)) + '" y="' + (n.y + (n.small ? 31 : 35) + i * 14) + '"' + (n.small ? ' style="font-size:9.5px"' : '') + '>' + esc(s) + '</text>'; }).join('');
    return '<g class="dv-node" tabindex="0" role="button" data-dv-node="' + esc(n.id) + '" aria-label="' + esc(n.label + '. ' + ST[n.st] + '. Open details') + '">' +
      '<rect class="ring" x="' + (n.x - 3) + '" y="' + (n.y - 3) + '" width="' + (n.w + 6) + '" height="' + (n.h + 6) + '" rx="8" fill="none" stroke="none"/>' +
      '<rect class="box" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="6" style="fill:' + zb + ';stroke:' + z + '"' + (n.dashed ? ' stroke-dasharray="6 4"' : '') + '/>' + t + '</g>';
  }
  function groupSvg(g) {
    var z = g.zone ? 'var(--zone-' + g.zone + ')' : 'var(--border-strong)';
    return '<g aria-hidden="true"><rect x="' + g.x + '" y="' + g.y + '" width="' + g.w + '" height="' + g.h + '" rx="10" style="fill:none;stroke:' + z + ';stroke-width:1.2"' + (g.dashed ? ' stroke-dasharray="7 5"' : '') + '/>' +
      '<text class="t-lab dv-elabel" x="' + (g.x + 10) + '" y="' + (g.bottom ? g.y + g.h - 9 : g.y - 6) + '" style="fill:' + z + ';font-size:9.5px">' + esc(g.label) + '</text></g>';
  }
  function diagramSvg(v) {
    var byId = {}; v.nodes.forEach(function (n) { byId[n.id] = n; });
    return '<svg viewBox="0 0 ' + v.w + ' ' + v.h + '" role="group" aria-label="' + esc(v.title) + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><marker id="dv-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--text-tertiary)"/></marker>' +
      '<marker id="dv-arr-adv" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill:var(--zone-runtime)"/></marker></defs>' +
      '<style>.dv-elabel{paint-order:stroke;stroke:var(--bg-canvas);stroke-width:4px;stroke-linejoin:round}</style>' +
      (v.groups || []).map(groupSvg).join('') + (v.extra || '') + (v.edges || []).map(function (e) { return edgeSvg(e, byId); }).join('') + v.nodes.map(nodeSvg).join('') + (v.over || '') + '</svg>';
  }
  function legendHtml(v) {
    var zones = {}; v.nodes.forEach(function (n) { zones[n.zone] = 1; });
    return '<div class="dv-legend" aria-label="Legend">' + Object.keys(zones).map(function (z) { return '<span><span class="dv-sw" style="--z:var(--zone-' + z + ');--zb:var(--zone-' + z + '-bg)"></span>' + esc(ZN[z]) + '</span>'; }).join('') +
      '<span><span class="dv-ln"></span>Built · Level 1</span><span><span class="dv-ln dv-ln--dash"></span>Specified, not built</span>' + (v.adv ? '<span><span class="dv-ln dv-ln--adv"></span>Advisory path (Mode B)</span>' : '') + '<span>Colours mark zones, never status.</span></div>';
  }

  var AV = {};
  AV.context = { title: 'elan1 in context', fig: 'Figure 1', w: 1000, h: 600, adv: true,
    lead: 'Who acts, who consumes the kernel, what the kernel runs on, and the systems it writes to or is checked by. Everything inside the dashed perimeter is elan1.',
    groups: [{ x: 16, y: 34, w: 200, h: 300, label: 'People and agents', zone: 'people' }, { x: 236, y: 34, w: 528, h: 108, label: 'Consumers and third parties', zone: 'consumer' }, { x: 236, y: 166, w: 528, h: 292, label: 'elan1 Pvt Ltd — the perimeter', zone: 'kernel', dashed: true, bottom: true }, { x: 784, y: 34, w: 200, h: 516, label: 'Outside elan1', zone: 'external' }],
    nodes: [
      N('agents', 28, 50, 176, 76, 'consumer', 'AI agents', ['actor_kind from the token', 'produce intents, never an allow'], { body: 'Hold A0–A5 per write type and produce write intents, never an allow. actor_kind is set by the kernel from the token and never claimed by the tool.', links: [['Autonomy', '#/agents/autonomy'], ['The Right Path', '#/developers/right-path']] }),
      N('operators', 28, 144, 176, 76, 'people', 'Operators', ['stop switch, grants, keys —', 'each one a governed write'], { body: 'Tenant admins and declaration certifiers — named humans. They control the stop switch, grants and keys, and each of those actions is itself a governed write.', links: [['Tenants', '#/records/tenants'], ['Keys', '#/agents/keys']] }),
      N('approvers', 28, 238, 176, 76, 'people', 'Approvers', ['named humans in a resolver set', 'an agent never approves'], { body: 'See the diff, every gate and the policy version first. An agent may never approve, and the proposer may never approve their own write.', links: [['Approvals', '#/work/approvals'], ['Decide · OB-2026-0412', '#/work/decide/OB-2026-0412']] }),
      N('rung1', 248, 50, 160, 76, 'consumer', 'rung1 Enterprise', ['first consumer · Mode A', 'hosted ERPNext, enforced'], { body: 'The first consumer. Mode A, enforced, hosted ERPNext, Phase 1. Pays ₹0.40 per committed action from 1 Jan 2027 (intra-group); refusals cost ₹0. It may never build a gates engine, an approval store, a seal, a meter or a verifier.', links: [['TypeScript SDK', '#/developers/sdk/typescript']] }),
      N('third', 420, 50, 160, 76, 'consumer', 'Third-party agents', ['MCP / HTTP · Mode B', 'attested advisory'], { body: 'Vendors over MCP or HTTP in Mode B, attested advisory: every intent is evaluated and recorded; the caller holds the credential. Pre-GA design partners such as LedgerLoop.', links: [['MCP server', '#/developers/mcp'], ['HTTP API', '#/developers/api']] }),
      N('tools', 592, 50, 160, 76, 'runtime', 'stack1 tools', ['call the kernel over', 'the Mode B path'], { st: 'l1', body: 'stack1 tooling uses the same Mode B path as third parties. No stack1 package imports elan1 (rule B1).' }),
      N('kp', 248, 184, 504, 40, 'kernel', 'KernelPort v1', ['define · assert · seal · verify · scope · refuse'], { inline: true, body: 'Six calls with identical signatures for every consumer. The tenant comes from the token, never from an argument. Nothing above plane P3 imports a kernel type (C1).', links: [['KernelPort', '#/developers/kernelport']] }),
      N('console', 248, 242, 150, 92, 'kernel', 'Console', ['the Four Doors:', 'Work · Records ·', 'Agents · Assurance'], { body: 'Approvals, Decide, Studio and Proof — compiled from the declaration, drawn by shared components.', links: [['Work · Today', '#/work/today']] }),
      N('kernel', 412, 242, 340, 196, 'kernel', 'elan1 kernel — plane P3 (shut)', ['Right Path: rung 0b + nine rungs', 'gates G1–G9 in declared order', 'evaluate() with no model in the path', 'single writer · one credential to the books', 'hash-chained record · refusals sealed too', 'one meter event · refusals at quantity 0', 'closed register: 43 codes, 28 at Level 1', 'no fast path · no admin mode · no warn'], { body: 'The one write function. Plane P3 is shut: changing it takes a Kernel Change Request, an ADR and the founder.', links: [['The Right Path', '#/developers/right-path'], ['Refusal register', '#/developers/refusals']] }),
      N('packs', 248, 350, 150, 84, 'kernel', 'Packs · plane P8', ['ledger1 · invoice1', '· collect1', 'configuration, not code'], { body: 'Each pack is one declaration, one certified verifier profile and one regime-specific export mapping. ledger1 (MCA audit trail) is first.', links: [['ledger1', '#/records/packs/ledger1'], ['Packs', '#/packs']] }),
      N('stack1', 248, 494, 504, 64, 'runtime', 'stack1 — runtime supplier, plane P1', ['fusion.run · trace · tools · guard · gateway /v1', 'Temporal · OpenBao path per tenant · ap-south-1 Mumbai'], { body: 'A separate venture supplying the runtime at observed cost + 15%. The kernel runs on the runtime, never inside it.', links: [['Planes', '#/developers/architecture/planes']] }),
      N('regs', 796, 50, 176, 62, 'external', 'Regulators', ['MCA · GST · RBI', 'no conformance claim at L1'], { body: 'Dated obligations. There is no conformance claim at Level 1.', links: [['Regulators', '#/regulators']] }),
      N('tsa', 796, 130, 176, 62, 'external', 'Timestamp authorities', ['RFC 3161 × 2 · Level 2', 'receive a hash and a nonce'], { dashed: true, body: 'Two authorities, one India-based. They receive a hash and a nonce only. Level 2 — specified, not built.', links: [['Seal v6', '#/developers/seal']] }),
      N('targets', 796, 242, 176, 62, 'external', 'Target systems', ['ERPNext via Frappe API', 'written by the single writer'], { body: 'Written only by the single writer, with one single-use credential scoped to one write and a ten-minute life. Through Frappe’s own API, never the ORM.', links: [['Connected systems', '#/records/systems']] }),
      N('auditors', 796, 312, 176, 58, 'external', 'Auditors', ['L1: verify requires us', 'L2: bundle, checked offline'], { body: 'At Level 1 they reconstruct through elan1 (“verify requires us”). At Level 2 they check a bundle offline.', links: [['Auditor portal', '#/auditor'], ['verify', '#/developers/kernelport/verify']] }),
      N('cps', 796, 378, 176, 58, 'external', 'Counterparties', ['G7: known, not sanctioned', 'L3: receipts between orgs'], { body: 'Gate G7 checks a counterparty is known and not sanctioned. At Level 3 they verify receipts between organisations.', links: [['Action Receipt', '#/developers/receipt']] }),
      N('verifier', 796, 470, 176, 62, 'external', 'Offline verifier', ['zero dependencies', 'six exit codes · Level 2'], { dashed: true, body: 'Runs on the reviewer’s own machine against an evidence bundle. Free, source, never priced. Level 2 — specified, not built.', links: [['Offline verifier', '#/developers/verifier']] })
    ],
    edges: [
      { from: 'agents', to: 'rung1', sides: 'rl' },
      { from: 'rung1', to: 'kp', sides: 'bt', tf: 0.159, kind: 'strong', label: 'Mode A · in-process SDK', lx: 334, ly: 142, anchor: 'start' },
      { from: 'third', to: 'kp', sides: 'bt', tf: 0.5, kind: 'adv', label: 'Mode B · MCP / HTTP', lx: 506, ly: 142, anchor: 'start' },
      { from: 'tools', to: 'kp', sides: 'bt', tf: 0.841, kind: 'adv' },
      { from: 'kp', to: 'kernel', sides: 'bt', ff: 0.663 },
      { from: 'operators', to: 'console', sides: 'rl', tf: 0.3, mx: 226 },
      { from: 'approvers', to: 'console', sides: 'rl', tf: 0.7, mx: 226 },
      { from: 'console', to: 'kernel', sides: 'rl', tf: 0.224 },
      { from: 'packs', to: 'kernel', sides: 'rl', tf: 0.776 },
      { from: 'kernel', to: 'targets', sides: 'rl', ff: 0.158 },
      { from: 'kernel', to: 'auditors', sides: 'rl', ff: 0.5, tf: 0.5 },
      { from: 'kernel', to: 'cps', sides: 'rl', ff: 0.832, tf: 0.5 },
      { from: 'kernel', to: 'tsa', sides: 'rl', ff: 0.02, mx: 778, kind: 'dash', label: 'L2 anchoring', lx: 790, ly: 222, anchor: 'start' },
      { from: 'kernel', to: 'stack1', sides: 'bt', tf: 0.663, kind: 'dash', label: 'fusion.*/v1 seam — the kernel runs on the runtime, never inside it', lx: 574, ly: 480, anchor: 'end' }
    ],
    over: '<text class="dv-elabel" x="500" y="590" text-anchor="middle" style="font-size:11px;font-style:italic">“A model may produce a write intent; it may never produce an allow.”</text>'
  };

  AV.components = { title: 'Components, repositories and internal seams', fig: 'Figure 4', w: 1000, h: 660,
    lead: 'What elan1 builds for Level 1, by zone and repository. One submission surface reachable three ways, one kernel, one declaration plane — and a dashed Level 2 band that is specified, not built.',
    groups: [{ x: 16, y: 30, w: 968, h: 84, label: 'Surfaces · elan1-surfaces, elan1-console (proposed repos)', zone: 'kernel' }, { x: 16, y: 198, w: 660, h: 240, label: 'Kernel core · plane P3 · repo elan1-core · shut', zone: 'kernel' }, { x: 696, y: 198, w: 288, h: 240, label: 'Declaration plane P4 · elan1-declarations', zone: 'kernel' }, { x: 16, y: 462, w: 968, h: 74, label: 'Level 2 Attested · frozen specification, not built', zone: 'kernel', dashed: true }, { x: 16, y: 570, w: 968, h: 74, label: 'stack1 runtime · plane P1 · separate venture', zone: 'runtime' }],
    nodes: [
      N('sdk', 28, 44, 226, 60, 'consumer', 'SDK @elan1/kernel', ['in-process, Mode A (rung1)', 'six calls, identical signatures'], { body: 'In-process Mode A. No kernel type is imported above P3.', links: [['TypeScript SDK', '#/developers/sdk/typescript']] }),
      N('mcp', 266, 44, 226, 60, 'consumer', 'MCP server (Mode B)', ['34 tools: ro 18 · stage 10 · act 6', 'descriptions pinned by hash'], { body: 'Tool descriptions are pinned by hash in the declaration; a changed description is a version change.', links: [['MCP server', '#/developers/mcp']] }),
      N('http', 504, 44, 226, 60, 'consumer', 'HTTP /v1 + webhooks', ['8 families across act · ro · ctl', 'HMAC-signed, carry seq'], { body: 'ctl has no read path to any record. Webhooks are HMAC-signed and carry seq.', links: [['HTTP API', '#/developers/api'], ['Webhooks', '#/developers/webhooks']] }),
      N('console', 742, 44, 230, 60, 'kernel', 'Console · P5 renderers', ['the Four Doors, compiled', 'from the declaration'], { body: 'Approvals, Decide, Not done, Record, Proof and Studio — compiled from declarations.', links: [['Work · Today', '#/work/today']] }),
      N('kp', 16, 134, 968, 40, 'kernel', 'KernelPort v1', ['define · assert · seal · verify · scope · refuse — the tenant comes from the token, never from an argument'], { inline: true, links: [['KernelPort', '#/developers/kernelport']], body: 'The contract bar. Identical signatures for every consumer.' }),
      N('exec', 28, 214, 206, 62, 'kernel', 'Right Path executor', ['rungs 0b–9; idempotent on intent_id', 'runs in a fusion.run/v1 workflow'], { links: [['The Right Path', '#/developers/right-path']], body: 'One write function covering rungs 0b–9.' }),
      N('gate', 244, 214, 206, 62, 'kernel', 'Gate engine · rung 3', ['G1–G9, pure functions of', 'context, version, state, as_of'], { body: 'One gate_result row per gate, all run even after the first failure.' }),
      N('policy', 460, 214, 206, 62, 'kernel', 'Policy service · rung 4', ['evaluate() over versioned rules', 'no model, no read path to records'], { body: 'Allow, refuse or escalate — never a score, never a default allow.' }),
      N('guard', 28, 290, 206, 62, 'kernel', 'Guardrail + autonomy · 5, 6', ['blast radius against declared', 'missing grant resolves to A0'], { body: 'Autonomy grants A0–A5; a missing grant is A0 Observe.' }),
      N('approval', 244, 290, 206, 62, 'people', 'Approval service', ['obligations with expiry', 'human-only resolver set'], { body: 'Each resolution is a governed write.', links: [['Approvals', '#/work/approvals']] }),
      N('register', 460, 290, 206, 62, 'kernel', 'Refusal register', ['43 codes, 28 active at L1', 'register lint runs in CI'], { links: [['Refusal register', '#/developers/refusals']], body: 'Each code maps to one rung, class and operator action.' }),
      N('writer', 28, 366, 206, 62, 'kernel', 'Single writer · rung 7', ['snapshot, shadow sandbox, adapter', 'one-write ten-minute credential'], { body: 'The broker mints a one-write, ten-minute credential. The adapter returns the inverse operation.' }),
      N('chain', 244, 366, 206, 62, 'kernel', 'Chain writer · rung 8', ['outbox in commit order; SHA-256', 'INSERT granted to one role'], { links: [['Seal v6', '#/developers/seal']], body: 'Consumes the outbox in commit order and returns seq and digest synchronously.' }),
      N('meter', 460, 366, 206, 62, 'kernel', 'Meter · rung 9', ['one meter_event per write', 'CHECK: a refusal has quantity 0'], { body: 'meter.reconcile() runs nightly.', links: [['Meter', '#/assurance/meter']] }),
      N('studio', 708, 214, 264, 62, 'kernel', 'Studio', ['author → validate → simulate', '→ certify, by a named person'], { links: [['Studio', '#/records/studio'], ['Declarations as code', '#/developers/declarations']], body: 'Certification is by a named person who is not the author.' }),
      N('compiler', 708, 290, 264, 62, 'kernel', 'Compiler and registry', ['surface plan, write types, meter basis', 'content-addressed; every version kept'], { body: 'Every version kept, never compacted.' }),
      N('sor', 708, 366, 264, 62, 'external', 'System of record', ['ERPNext via Frappe’s own API', 'the adapter returns the inverse op'], { body: 'Never the ORM. Tally and Zoho Books are read-only sources.', links: [['Connected systems', '#/records/systems']] }),
      N('signer', 28, 474, 226, 52, 'kernel', 'Signer', ['Ed25519 over the same 32-octet digest'], { dashed: true, links: [['Seal v6', '#/developers/seal']] }),
      N('anchor', 266, 474, 226, 52, 'kernel', 'Anchor batcher', ['Merkle root → RFC 3161 at two TSAs'], { dashed: true }),
      N('bundle', 504, 474, 226, 52, 'kernel', 'Bundle exporter', ['for a party who distrusts elan1'], { dashed: true, links: [['Offline verifier', '#/developers/verifier']] }),
      N('verify', 742, 474, 230, 52, 'kernel', 'Offline verifier', ['elan1-verify, zero deps, six exit codes'], { dashed: true, links: [['Offline verifier', '#/developers/verifier']] }),
      N('run', 28, 582, 178, 52, 'runtime', 'run/v1', ['Temporal; every write in a workflow'], { mono: true }),
      N('trace', 218, 582, 178, 52, 'runtime', 'trace/v1', ['OTel spans the proof can bind'], { mono: true }),
      N('tools', 408, 582, 178, 52, 'runtime', 'tools/v1', ['ERPNext MCP servers, call ledger'], { mono: true }),
      N('guardv', 598, 582, 178, 52, 'runtime', 'guard/v1', ['a verdict is an input, never an allow'], { mono: true }),
      N('gateway', 788, 582, 184, 52, 'runtime', 'gateway/v1', ['model calls, upstream of assert'], { mono: true })
    ],
    edges: [{ from: 'sdk', to: 'kp', sides: 'bt' }, { from: 'mcp', to: 'kp', sides: 'bt' }, { from: 'http', to: 'kp', sides: 'bt' }, { from: 'console', to: 'kp', sides: 'bt' },
      { from: 'kp', to: 'exec', sides: 'bt', ff: 0.119 }, { from: 'studio', to: 'compiler', sides: 'bt' }, { from: 'compiler', to: 'policy', sides: 'lr' },
      { from: 'chain', to: 'anchor', sides: 'bt', kind: 'dash' }, { from: 'meter', to: 'sor', sides: 'rl', tf: 0.5, mx: 686, kind: 'dash' }]
  };
  /* The meter→sor edge is replaced by writer→sor visually; keep it simple: */
  AV.components.edges[8] = { from: 'writer', to: 'sor', sides: 'bb', ff: 0.9, tf: 0.2, my: 448 };

  var PLANES = [['p8', 'P8 Packs', 'a declaration plus a verifier profile each', 'Yes, intended churn', 'elan1', 'kernel'], ['p7', 'P7 Apps', 'horizontal apps, one declaration each', 'Yes', 'rung1 · third parties', 'consumer'], ['p6', 'P6 Channels', 'web, API, messaging — declared in block 7', 'Yes, per channel', 'rung1 / elan1 MCP·HTTP', 'consumer'], ['p5', 'P5 Surfaces', 'shared renderers; screens compiled from a declaration', 'Hard, one team', 'elan1', 'kernel'], ['p4', 'P4 Declaration plane', 'schema, write-type descriptors, lexicon, policy versions', 'Forward only, never migrated', 'elan1 schema', 'kernel'], ['p3', 'P3 Kernel', 'the one write function: nine rungs, evaluate(), proof, meter', 'SHUT', 'elan1', 'kernel'], ['p2', 'P2 System of record', 'the only place a record changes (hosted ERPNext first)', 'Hard', 'customer’s books / rung1', 'external'], ['p1', 'P1 Platform runtime', 'compute, queues, secrets, transactional outbox', 'Yes, deliberately boring', 'stack1', 'runtime'], ['p0', 'P0 Residency and tenancy', 'region ap-south-1, tenant, key custody, erasure salts', 'SHUT, no migration path', 'elan1 policy / stack1 operation', 'kernel']];
  var RULES = [['r1', '1 · P3 | P4 and above', 'Nothing above P3 imports a kernel type', 'C1', ['p3', 'p4']], ['r2', '2 · Rungs 3–8', 'No module reachable from them imports a model client', 'I1 · C1', ['p3']], ['r3', '3 · P1 | P3', 'No stack1 package imports elan1', 'B1 · B2', ['p1', 'p3']], ['r4', '4 · P1 control | P2', 'The control plane has no route to the record store', 'B5', ['p1', 'p2']], ['r5', '5 · Into P2', 'Exactly one write credential per environment', 'C2', ['p2']], ['r6', '6 · P4', 'define rejects a version ≠ last + 1; “latest” is a rejection', 'C13', ['p4']], ['r7', '7 · P0', 'A resource outside the region allow-list fails the build', 'O05', ['p0']], ['r8', '8 · Tenancy', 'RLS on every tenant table; disabling it fails CI', 'RLS test', ['p0']], ['r9', '9 · Consumer copy', 'No Level 2 claims in rendered Level 1 copy', 'C14', ['p7', 'p6']]];
  AV.planes = { title: 'Planes P0–P8 and who owns each', fig: 'Figure 3', w: 1000, h: 600,
    lead: 'Nine planes, read bottom-up as a cost gradient: costlier to change at the bottom, cheaper at the top. P0 and P3 are shut. Nine boundary rules each fail the build. Select a rule to light the planes it separates.',
    nodes: PLANES.map(function (p, i) { return N(p[0], 60, 30 + i * 62, 560, 54, p[5], p[1] + (p[3].indexOf('SHUT') === 0 ? '  ·  SHUT' : ''), [p[2], 'Changeable: ' + p[3] + ' · owner: ' + p[4]], { body: p[2] + '. Changeable: ' + p[3] + '. Owner: ' + p[4] + '.', st: p[5] === 'external' ? 'ext' : 'l1' }); })
      .concat(RULES.map(function (r, i) { return N(r[0], 650, 30 + i * 62, 334, 54, 'refusal', r[1], [r[2], 'Enforced by ' + r[3]], { st: 'l1', body: r[2] + '. Enforced by ' + r[3] + ' — a failing build. “An instruction in a document is advice; a failing build is a control.”', rel: r[4], links: [['Conformance suite', '#/developers/conformance'], ['Controls', '#/assurance/controls']] }); })),
    extra: '<text class="t-lab" x="26" y="150" transform="rotate(-90 26 150)" text-anchor="middle" style="fill:var(--text-tertiary)">cheaper to change</text><text class="t-lab" x="26" y="470" transform="rotate(-90 26 470)" text-anchor="middle" style="fill:var(--text-tertiary)">costlier to change</text><path d="M40 40 V580" class="dv-edge" marker-start="url(#dv-arr)" marker-end="url(#dv-arr)"/>',
    edges: []
  };

  /* Sequence view (Figure 7) */
  var LIFE = [['agent', 'ar-agent', 'A2 Propose', 'consumer'], ['sdk', 'SDK / MCP', 'act scope', 'consumer'], ['kernel', 'kernel', 'Right Path', 'kernel'], ['gates', 'gate engine', 'G1–G9, evaluate', 'kernel'], ['approval', 'approval svc', 'console · Work', 'people'], ['venkat', 'Venkat Raman', 'named approver', 'people'], ['writer', 'single writer', '+ broker', 'kernel'], ['erp', 'ERPNext', 'via Frappe API', 'external'], ['proof', 'proof store', 'chain writer', 'kernel'], ['meter', 'meter', 'meter_event', 'kernel']];
  var MSGS = [
    ['act', '① Escalate'], ['agent', 'sdk', 'act.write {request, idempotency_key}'], ['sdk', 'kernel', 'assert(intent) → 0b · 1 · 2 (erp.ar v7)'], ['kernel', 'gates', 'rung 3 gates on as_of · rung 4 evaluate()'], ['gates', 'kernel', '5 of 5 pass · allow at policy 11', 'ret'], ['kernel', 'approval', 'rung 6: A2 → obligation, 4 h, resolvers'], ['kernel', 'proof', 'seal → #4,099 escalated'], ['kernel', 'meter', 'qty 0'], ['kernel', 'sdk', '200 · escalated · obligation_id', 'ret'], ['sdk', 'agent', 'stop — do not retry', 'ret'],
    ['act', '② A named human decides'], ['approval', 'venkat', 'Decide: diff · 5/5 gates · policy v11 · countdown'], ['venkat', 'approval', 'Approve (act.escalate)'], ['approval', 'proof', '#4,100 resolution — its own governed write'], ['approval', 'meter', 'qty 1 · per record'],
    ['act', '③ Resubmit and act'], ['sdk', 'kernel', 'resubmit: new intent_id + obligation_ref'], ['kernel', 'gates', 'climbs 0b–6 again · G4 finds a second person'], ['kernel', 'writer', 'rung 7 ACT'], ['writer', 'erp', 'snapshot · shadow sandbox · identical bytes live'], ['erp', 'writer', 'document name + inverse op', 'ret'], ['writer', 'proof', 'commit + outbox → #4,101'], ['proof', 'meter', 'qty 1 · per counterparty'], ['kernel', 'sdk', 'webhook write.committed {seq 4,101, digest}', 'ret']
  ];
  (function () {
    var colX = {}, nodes = [], y = 92, rows = '';
    LIFE.forEach(function (l, i) { var cx = 56 + i * 99; colX[l[0]] = cx; nodes.push(N('lf-' + l[0], cx - 47, 16, 94, 42, l[3], l[1], [l[2]], { small: true, body: { agent: 'Proposes the ₹2,40,000 invoice SINV-2026-01187 to ACME Textiles at A2 Propose.', sdk: 'The act-scoped surface; sends the idempotency key.', kernel: 'Runs the Right Path. Keeps no suspended-and-resumed state.', gates: 'Gates in declared order; evaluate() with no model.', approval: 'Opens the obligation; the approval is its own governed write.', venkat: 'Accounts head in ar-approvers. Not the proposer.', writer: 'Mints a single-use, ten-minute credential; applies identical bytes to live.', erp: 'Hosted ERPNext, written only through Frappe’s API.', proof: 'Appends in commit order; returns seq and digest synchronously.', meter: 'One meter event per governed write.' }[l[0]], links: l[0] === 'venkat' ? [['Decide · OB-2026-0412', '#/work/decide/OB-2026-0412']] : l[0] === 'proof' ? [['Proof #4,101', '#/assurance/proof/4101']] : [['The Right Path', '#/developers/right-path']] })); });
    var lines = LIFE.map(function (l) { return '<path d="M' + colX[l[0]] + ' 62 V640" style="stroke:var(--border-default);stroke-dasharray:3 4;fill:none"/>'; }).join('');
    MSGS.forEach(function (m) {
      if (m[0] === 'act') { rows += '<rect x="8" y="' + (y - 14) + '" width="984" height="20" rx="4" style="fill:var(--bg-sunken)"/><text class="t-lab" x="16" y="' + (y) + '" style="fill:var(--text-secondary)">' + esc(m[1]) + '</text>'; y += 26; return; }
      var x1 = colX[m[0]], x2 = colX[m[1]], dir = x2 > x1 ? 1 : -1;
      rows += '<path class="dv-edge' + (m[3] === 'ret' ? ' dv-edge--dash' : ' dv-edge--strong') + '" d="M' + (x1 + dir * 3) + ' ' + y + ' H' + (x2 - dir * 4) + '" marker-end="url(#dv-arr)"/>' +
        '<text class="dv-elabel" x="' + ((x1 + x2) / 2) + '" y="' + (y - 5) + '" text-anchor="middle">' + esc(m[2]) + '</text>';
      y += 24;
    });
    AV['write-path'] = { title: 'One governed action, as a sequence', fig: 'Figures 6 and 7', w: 1000, h: y + 30,
      lead: 'ar-agent at A2 Propose proposes a ₹2,40,000 invoice; Venkat Raman approves; the single writer commits. Three proof entries for one approved decision — the kernel keeps no suspended-and-resumed state.',
      nodes: nodes, edges: [], extra: lines + rows,
      over: '<text class="dv-elabel" x="500" y="' + (y + 16) + '" text-anchor="middle" style="font-size:11px">Escalated #4,099 → resolution #4,100 → committed #4,101 · meter 0, 1, 1</text>' };
  })();

  AV.evidence = { title: 'The Level 1 record, the seal and the evidence bundle', fig: 'Figures 13, 14 and 15', w: 1000, h: 560,
    lead: 'Left to right: three records linked by prev_digest (built at Level 1); the seven-step seal pipeline that stops after step 4 at Level 1; the eight-member bundle and the offline verifier (Level 2, specified, not built).',
    groups: [{ x: 16, y: 34, w: 220, h: 500, label: 'Per-tenant hash chain · L1', zone: 'kernel' }, { x: 256, y: 34, w: 230, h: 500, label: 'Seal v6 pipeline', zone: 'kernel' }, { x: 506, y: 34, w: 230, h: 500, label: 'elan1.evidence.bundle.v1 · L2', zone: 'kernel', dashed: true }, { x: 756, y: 34, w: 228, h: 500, label: 'Offline verifier · L2', zone: 'external', dashed: true }],
    nodes: [
      N('g1', 28, 52, 196, 108, 'kernel', 'seq 1 · genesis (TV-001)', ['F03 = 32 × 0x00', 'sales_invoice.submit · human', 'A2 · preimage exactly 329 octets', 'd₁ = SHA-256(preimage)'], { links: [['Seal v6 · TV-001', '#/developers/seal']], body: 'The first record of a tenant’s chain.' }),
      N('g4097', 28, 212, 196, 108, 'kernel', '#4,097 · committed', ['F03 = d₄₀₉₆ · payment_entry', 'person · A4 · decl v7 · policy 11', 'F12 ERPNext record id', 'meter 1'], { links: [['Proof #4,097', '#/assurance/proof/4097']] }),
      N('g4098', 28, 372, 196, 122, 'refusal', '#4,098 · refused', ['F03 = d₄₀₉₇ · sales_invoice', 'agent · A3', 'GATE.PRECONDITION_FAILED', 'F12 zero UUID · F13 0', 'same sixteen fields · meter 0'], { st: 'l1', links: [['Not done #4,098', '#/work/not-done/4098'], ['The code', '#/developers/refusals/GATE.PRECONDITION_FAILED']], body: 'A refusal is sealed exactly like a commit: same sixteen fields, same shape.' }),
      N('s1', 268, 50, 206, 44, 'kernel', '1 BIND', ['16 fields, append-only context']),
      N('s2', 268, 104, 206, 44, 'kernel', '2 CANONICALISE', ['LP-encode each field; domain first']),
      N('s3', 268, 158, 206, 44, 'kernel', '3 DIGEST', ['SHA-256 over 17 groups → 32 octets']),
      N('s4', 268, 212, 206, 44, 'kernel', '4 CHAIN', ['UNIQUE (tenant_id, seq) · level 1']),
      N('s5', 268, 296, 206, 44, 'kernel', '5 SIGN', ['pure Ed25519 over the digest'], { dashed: true }),
      N('s6', 268, 350, 206, 44, 'kernel', '6 ANCHOR', ['Merkle root → RFC 3161 × 2'], { dashed: true }),
      N('s7', 268, 404, 206, 44, 'kernel', '7 SEAL OBJECT', ['+ signature, key_id, anchor_ref'], { dashed: true }),
      N('m1', 518, 50, 206, 40, 'kernel', 'manifest.json', ['range, counts, digests · written last'], { dashed: true, mono: true }),
      N('m2', 518, 98, 206, 40, 'kernel', 'seals.jsonl', ['one record per line, seq order'], { dashed: true, mono: true }),
      N('m3', 518, 146, 206, 40, 'kernel', 'chain.json', ['genesis, head, boundary rows'], { dashed: true, mono: true }),
      N('m4', 518, 194, 206, 40, 'kernel', 'anchors/', ['tokens, roots, inclusion paths'], { dashed: true, mono: true }),
      N('m5', 518, 242, 206, 40, 'kernel', 'keys.json', ['fingerprints — never the key'], { dashed: true, mono: true }),
      N('m6', 518, 290, 206, 40, 'kernel', 'declarations/', ['every (id, version), verbatim'], { dashed: true, mono: true }),
      N('m7', 518, 338, 206, 40, 'kernel', 'lexicon/', ['every term set referenced by F15'], { dashed: true, mono: true }),
      N('m8', 518, 386, 206, 40, 'kernel', 'VERIFY.txt', ['how to check without elan1'], { dashed: true, mono: true }),
      N('never', 518, 448, 206, 70, 'refusal', 'Never in a bundle', ['payloads · salts · key material', 'executables or URLs to fetch', 'target-system state'], { st: 'l2' }),
      N('ver', 768, 50, 204, 76, 'external', 'elan1-verify', ['bundle + profile + fingerprint', 'from the reader’s own source', 'no network, no account'], { dashed: true, mono: true, links: [['Offline verifier', '#/developers/verifier']] }),
      N('x0', 768, 150, 204, 44, 'external', '0 PASS', ['three verdict strings'], { dashed: true, mono: true }),
      N('x1', 768, 202, 204, 44, 'external', '1 FAIL_INTEGRITY', ['forensics — stop'], { dashed: true, mono: true }),
      N('x2', 768, 254, 204, 44, 'external', '2 FAIL_PROFILE', ['records sound; regime unmet'], { dashed: true, mono: true }),
      N('x3', 768, 306, 204, 44, 'external', '3 INCOMPLETE', ['ask for a complete bundle'], { dashed: true, mono: true }),
      N('x4', 768, 358, 204, 44, 'external', '4 UNSUPPORTED', ['get the matching verifier'], { dashed: true, mono: true }),
      N('x5', 768, 410, 204, 44, 'external', '5 USAGE', ['operator error'], { dashed: true, mono: true })
    ],
    edges: [{ from: 'g1', to: 'g4097', sides: 'bt', label: '… prev_digest …', lx: 126, ly: 190 }, { from: 'g4097', to: 'g4098', sides: 'bt', label: 'prev_digest', lx: 126, ly: 350 },
      { from: 's1', to: 's2', sides: 'bt' }, { from: 's2', to: 's3', sides: 'bt' }, { from: 's3', to: 's4', sides: 'bt' }, { from: 's4', to: 's5', sides: 'bt', ff: 0.85, tf: 0.85, kind: 'dash' }, { from: 's5', to: 's6', sides: 'bt', kind: 'dash' }, { from: 's6', to: 's7', sides: 'bt', kind: 'dash' },
      { from: 'g4098', to: 's1', sides: 'rl', ff: 0.3, mx: 246 }, { from: 's7', to: 'm2', sides: 'rl', tf: 0.5, mx: 496, kind: 'dash' }, { from: 'm8', to: 'ver', sides: 'rl', mx: 746, kind: 'dash' }],
    over: '<path d="M262 276 H480" style="stroke:var(--brand-clay);stroke-width:2;fill:none"/><text class="t-lab dv-elabel" x="268" y="290" style="fill:var(--text-accent)">Level 1 stops here</text>'
  };

  AV.l3 = { title: 'Cross-organisation verification and the Action Receipt', fig: 'Figures 21 and 24', w: 1000, h: 560,
    lead: 'Level 3, specified, not built. The same event lands in two independent chains; nothing is replicated and there is no callback to the issuer.',
    groups: [{ x: 16, y: 34, w: 280, h: 400, label: 'Organisation A · issuer', zone: 'kernel', dashed: true }, { x: 704, y: 34, w: 280, h: 400, label: 'Organisation B · receiver', zone: 'consumer', dashed: true }],
    nodes: [
      N('a1', 28, 52, 256, 64, 'kernel', '1 · Source write commits', ['nine rungs; record signed; anchor batch', 'closed — or issued unanchored, saying so'], { st: 'l3', dashed: true }),
      N('a2', 28, 134, 256, 64, 'kernel', '2 · receipt.issue gates', ['its own write type: counterparty, consent,', 'residency, precondition'], { st: 'l3', dashed: true, links: [['GATE.COUNTERPARTY_UNKNOWN', '#/developers/refusals/GATE.COUNTERPARTY_UNKNOWN']] }),
      N('a3', 28, 216, 256, 64, 'kernel', '3 · Assemble the receipt', ['16 fields, digest, Ed25519, key_id, path', '+ audience, nonce, expires_at, disclosures'], { st: 'l3', dashed: true }),
      N('a4', 28, 298, 256, 64, 'kernel', '4 · Record the issuance', ['chain A #41,288 · F14 commits to the', 'receipt digest and audience · qty 1'], { st: 'l3', dashed: true }),
      N('rcpt', 360, 120, 280, 110, 'kernel', 'The Action Receipt', ['action-receipt/1 · one record, one signature,', 'one inclusion path, one issuer identity', 'envelope: audience · nonce · expires_at', 'never carries its own verification key', 'sent by e-mail, API or upload'], { st: 'l3', dashed: true, links: [['Action Receipt', '#/developers/receipt']] }),
      N('keys', 360, 262, 280, 110, 'external', 'Key discovery, first success wins', ['1 out-of-band pinned fingerprint', '2 /.well-known/action-receipt-keys', '3 trust-anchor attestation (not by elan1)', '4 in-receipt hint — lookup only, never trust'], { st: 'l3', dashed: true }),
      N('b1', 716, 52, 256, 150, 'consumer', 'Verify, in this order', ['1 echo the claim', '2 audience = own org_id', '3 expiry; recorded_at, anchor < now', '4 resolve the key (routes 1–3)', '5 preimage → SHA-256 → Ed25519', '6 inclusion path vs RFC 3161 token', '7 disclosures vs commitments · 8 replay'], { st: 'l3', dashed: true }),
      N('b2', 716, 220, 256, 64, 'consumer', 'receipt.accept', ['nine rungs · cross_boundary →', 'dual control, non-empty proof_binding'], { st: 'l3', dashed: true }),
      N('b3', 716, 302, 256, 64, 'consumer', 'Chain B #8,902', ['bound to issuer record 41,288', 'F14 commits to digest, org, route'], { st: 'l3', dashed: true }),
      N('never', 28, 452, 612, 84, 'refusal', 'What must never happen', ['a receipt carrying its own key · fallback to the in-receipt hint · a callback to the issuer', 'a shared ledger or replicated records · elan1 operating a trust anchor', 'a degraded, best-effort verify mode · a seventeenth field'], { st: 'l3' }),
      N('cl', 660, 452, 324, 84, 'kernel', 'Conformance levels', ['CL-1 Structural · CL-2 Attested · CL-3 Anchored', 'CL-4 Addressed · CL-D Disclosing', 'L1 → CL-1 only · L2 → CL-2 + CL-3'], { st: 'l3', links: [['Action Receipt', '#/developers/receipt']] })
    ],
    edges: [{ from: 'a1', to: 'a2', sides: 'bt' }, { from: 'a2', to: 'a3', sides: 'bt' }, { from: 'a3', to: 'a4', sides: 'bt' }, { from: 'a3', to: 'rcpt', sides: 'rl', tf: 0.7, kind: 'dash' }, { from: 'rcpt', to: 'b1', sides: 'rl', ff: 0.3, tf: 0.5, kind: 'dash' }, { from: 'keys', to: 'b1', sides: 'rl', ff: 0.3, tf: 0.75, kind: 'dash', mx: 680 }, { from: 'b1', to: 'b2', sides: 'bt' }, { from: 'b2', to: 'b3', sides: 'bt' }],
    over: '<path d="M704 400 H300" style="stroke:var(--zone-refusal);stroke-dasharray:4 4;fill:none"/><text class="dv-elabel" x="480" y="396" text-anchor="middle">no callback · nothing replicated</text><path d="M612 392 l16 16 M628 392 l-16 16" style="stroke:var(--zone-refusal);stroke-width:2"/>'
  };

  function pgArch(params) {
    var id = params.view, v = AV[id], path = '/developers/architecture/' + id;
    var tabsNav = c.tabs(VIEWS.map(function (x) { return { id: x[0], label: x[1], href: '#/developers/architecture/' + x[0] }; }), id, { label: 'Architecture views' });
    if (!v) return wrap(path, hero({ eyebrow: 'Architecture', title: 'No view called “' + id + '”', lead: 'Six views are drawn from the architecture atlas.' }) + tabsNav + c.empty({ icon: 'layers', title: 'View not found', why: 'The developer architecture views are context, components, planes, write-path, evidence and l3. The full 32-figure atlas lives in Reference.', action: [{ label: 'Context view', href: '#/developers/architecture/context', kind: 'primary' }, { label: 'Architecture atlas', href: '#/reference/atlas' }] }), { pager: false });
    var list = '<details style="margin-top:12px"><summary class="e1-caption" style="cursor:pointer">The diagram as a list (' + v.nodes.length + ' parts)</summary><ul style="margin-top:8px">' + v.nodes.map(function (n) { return '<li><strong>' + esc(n.label) + '</strong> — ' + esc(ZN[n.zone]) + ', ' + esc(ST[n.st]) + '. ' + esc(n.body || n.sub.join(' ')) + '</li>'; }).join('') + '</ul></details>';
    var html = hero({ eyebrow: 'Architecture · ' + v.fig + ' of the atlas', title: v.title, lead: esc(v.lead), meta: tag('Draft for review · 23 Sep 2026') + (id === 'evidence' || id === 'l3' ? tag(id === 'l3' ? 'Level 3 — specified, not built' : 'Steps 5–7 · Level 2 — specified, not built', 'dash') : tag('Level 1 — being built')) }) + tabsNav +
      '<div class="dv-diagram" style="margin-top:16px" data-dv-diagram="' + esc(id) + '"><div class="dv-diagram__bar"><span class="e1-label">' + esc(v.fig) + ' · select any box for details</span><span class="e1-caption e1-muted">' + c.kbd('Tab') + ' to move · ' + c.kbd('Enter') + ' to open</span></div><div class="dv-diagram__stage">' + diagramSvg(v) + '</div>' + legendHtml(v) + '</div>' + list +
      h2('read-more', 'Read more') + '<div class="dv-grid">' + ({ context: [['KernelPort', '#/developers/kernelport'], ['MCP server', '#/developers/mcp'], ['Assurance · System map', '#/assurance/system-map']], components: [['The Right Path', '#/developers/right-path'], ['Declarations as code', '#/developers/declarations'], ['Refusal register', '#/developers/refusals']], planes: [['Conformance suite', '#/developers/conformance'], ['Versioning policy', '#/developers/versioning'], ['Architecture atlas', '#/reference/atlas']], 'write-path': [['The Right Path', '#/developers/right-path'], ['assert', '#/developers/kernelport/assert'], ['Decide · OB-2026-0412', '#/work/decide/OB-2026-0412']], evidence: [['Seal v6', '#/developers/seal'], ['Offline verifier', '#/developers/verifier'], ['Object model', '#/developers/objects']], l3: [['Action Receipt', '#/developers/receipt'], ['Level 3 preview', '#/assurance/l3'], ['Architecture atlas', '#/reference/atlas']] }[id] || []).map(function (l) { return card({ title: l[0], body: 'Continue reading', href: l[1] }); }).join('') + '</div>';
    return wrap(path, html);
  }
  function openNode(g) {
    var dg = g.closest('[data-dv-diagram]'); if (!dg) return;
    var v = AV[dg.getAttribute('data-dv-diagram')]; if (!v) return;
    var id = g.getAttribute('data-dv-node'), n = null; v.nodes.forEach(function (x) { if (x.id === id) n = x; });
    if (!n) return;
    Array.prototype.forEach.call(dg.querySelectorAll('.dv-node.is-on'), function (x) { x.classList.remove('is-on'); });
    g.classList.add('is-on');
    (n.rel || []).forEach(function (r) { var t = dg.querySelector('[data-dv-node="' + r + '"]'); if (t) t.classList.add('is-on'); });
    E1.drawer({ title: n.label, eyebrow: ZN[n.zone] + ' · ' + ST[n.st], body: '<div class="e1-stack">' + '<p>' + esc(n.body || n.sub.join(' · ')) + '</p>' + (n.sub.length && n.body ? '<ul class="e1-caption">' + n.sub.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' : '') +
      (n.rel ? '<p class="e1-caption e1-muted">Highlighted on the diagram: ' + n.rel.map(function (r) { return r.toUpperCase(); }).join(', ') + '.</p>' : '') +
      (n.links.length ? '<div class="e1-row" style="flex-wrap:wrap;gap:8px">' + n.links.map(function (l) { return c.button(l[0], { size: 'sm', href: l[1], iconRight: 'arrow-right' }); }).join('') + '</div>' : '') + '</div>' });
  }
  E1.on('click', '[data-dv-node]', function (e, g) { openNode(g); });
  E1.on('keydown', '[data-dv-node]', function (e, g) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNode(g); } });

  /* ------------------------------------------------------------------------
     Forms and uploads (delegated at file load; never on document in mount)
     ------------------------------------------------------------------------ */
  function fieldError(id, msg) {
    var inp = document.getElementById(id), m = document.getElementById(id + '-msg');
    if (inp) { inp.setAttribute('aria-invalid', msg ? 'true' : 'false'); var w = inp.closest('.e1-input'); if (w) w.classList.toggle('is-invalid', !!msg); }
    if (m) { if (!m.getAttribute('data-help')) m.setAttribute('data-help', m.textContent); m.textContent = msg || m.getAttribute('data-help'); m.classList.toggle('e1-tone--critical', !!msg); if (msg) m.setAttribute('role', 'alert'); else m.removeAttribute('role'); }
    return !msg;
  }
  E1.on('submit', '[data-dv-sbx]', function (e) {
    e.preventDefault();
    var em = (document.getElementById('sbx-email') || {}).value || '', co = (document.getElementById('sbx-co') || {}).value || '', wh = (document.getElementById('sbx-what') || {}).value || '', terms = document.getElementById('sbx-terms');
    var ok = fieldError('sbx-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.trim()) ? 'Enter a work e-mail address, like dev@ledgerloop.in.' : FREE_MAIL.test(em) ? 'Use your work e-mail. We issue keys to organisations, not personal addresses.' : '');
    ok = fieldError('sbx-co', co.trim().length < 2 ? 'Name the company the key is for.' : '') && ok;
    ok = fieldError('sbx-what', wh.trim().length < 12 ? 'A sentence, please — at least 12 characters on what you will govern.' : '') && ok;
    if (terms && !terms.checked) { ok = false; E1.toast('Accept the pre-GA sandbox terms to continue.', 'warning'); }
    if (!ok) { var first = document.querySelector('[data-dv-sbx] [aria-invalid="true"]'); if (first) first.focus(); return; }
    E1.store.set('dev.sbx.email', em.trim());
    E1.toast('Verification link sent to ' + em.trim(), 'good', { title: 'Check your e-mail' });
    E1.go('/developers/sandbox-key', { step: 'check-email' });
  });
  E1.on('change', '[data-dv-stored]', function (e, el) {
    var b = document.querySelector('[data-dv-continue]'); if (b) b.setAttribute('aria-disabled', el.checked ? 'false' : 'true');
  });
  E1.on('click', '[data-dv-continue]', function (e, el) {
    if (el.getAttribute('aria-disabled') === 'true') { e.preventDefault(); E1.toast('Confirm you have stored the key first. We cannot show it again.', 'warning'); var cb = document.getElementById('dv-stored'); if (cb) cb.focus(); }
  });
  E1.on('submit', '[data-dv-prod]', function (e) {
    e.preventDefault();
    var owner = (document.getElementById('pr-owner') || {}).value || '', notice = (document.getElementById('pr-notice') || {}).value || '', decl = (document.getElementById('pr-decl') || {}).value;
    var ok = fieldError('pr-owner', owner.trim().length < 3 ? 'Give us a person, not a distribution list.' : /^(team|all|finance|accounts|ops|support|admin|info)\b|@|,/i.test(owner.trim()) ? 'A named person, please — for example “Asha Rao, Head of Engineering”.' : '');
    ok = fieldError('pr-notice', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notice.trim()) ? 'Enter the notice contact’s e-mail address.' : '') && ok;
    if (decl === 'll.billing@4') { ok = false; E1.toast('ll.billing v4 is a draft. Only a certified version can go to production.', 'warning', { action: { label: 'Open Studio', href: '#/records/studio' } }); }
    if (!ok) return;
    E1.confirm({ title: 'Submit PR-0042 for review?', eyebrow: 'Production request', body: '<p>A person at elan1 reads this within two working days and checks four things only. You will hear at ' + esc(notice.trim()) + ' either way. Your sandbox keeps working meanwhile.</p>', confirmLabel: 'Submit for review', onConfirm: function () { E1.toast('Submitted. A person reads this within two working days.', 'good', { title: 'PR-0042' }); E1.go('/developers/production-request', { state: 'submitted' }); } });
  });
  function readResult(file) {
    var rdr = new FileReader();
    rdr.onload = function () {
      var j = null; try { j = JSON.parse(String(rdr.result)); } catch (x) { j = null; }
      if (!j || !j.suite || !Array.isArray(j.tests)) { E1.toast('That file is not a conformance result file — it needs suite, tests and digest members.', 'warning', { title: 'Not attached' }); return; }
      var failed = j.tests.filter(function (t) { return t && t.result === 'failed'; });
      E1.toast((j.passed || (j.tests.length - failed.length)) + ' of ' + (j.of || j.tests.length) + (failed.length ? ' · first failure ' + failed[0].id : ' · every test passed'), failed.length ? 'warning' : 'good', { title: 'Result file read' });
    };
    rdr.onerror = function () { E1.toast('We could not read that file. Nothing was attached.', 'warning'); };
    rdr.readAsText(file);
  }
  E1.on('change', '[data-dv-file]', function (e, el) { if (el.files && el.files[0]) readResult(el.files[0]); });
  E1.on('keydown', '[data-dv-drop]', function (e, el) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); var f = el.querySelector('input[type=file]'); if (f) f.click(); } });
  E1.on('dragover', '[data-dv-drop]', function (e, el) { e.preventDefault(); el.classList.add('is-over'); });
  E1.on('dragleave', '[data-dv-drop]', function (e, el) { el.classList.remove('is-over'); });
  E1.on('drop', '[data-dv-drop]', function (e, el) { e.preventDefault(); el.classList.remove('is-over'); var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) readResult(f); });

  /* ------------------------------------------------------------------------
     Routes
     ------------------------------------------------------------------------ */
  function reg(pattern, o) {
    E1.route(pattern, {
      title: o.title, layout: 'doc', docLabel: 'Developers', crumbs: o.crumbs, example: o.example, keywords: o.keywords, redirect: o.redirect, palette: o.redirect ? false : undefined,
      render: function (params, query) { useNav(here().slice(1)); return o.render(params || {}, query || {}); },
      mount: o.mount
    });
  }
  var DOCS = ['Docs', '#/developers'];
  reg('/developers', { title: 'Developers', keywords: 'developer docs api sdk mcp kernelport overview', render: pgHome });
  reg('/developers/quickstart', { title: 'Quickstart', crumbs: [DOCS, ['Get started', '#/developers/quickstart']], keywords: 'getting started first write tutorial', render: pgQuickstart });
  reg('/developers/sandbox-key', { title: 'Get a sandbox key', crumbs: [DOCS, ['Get started', '#/developers/quickstart']], keywords: 'api key sk_sbx signup', render: pgSandboxKey });
  reg('/developers/production-request', { title: 'Request production access', crumbs: [DOCS, ['Get started', '#/developers/quickstart']], keywords: 'production key sk_live review', render: pgProduction });
  reg('/developers/kernelport', { title: 'KernelPort', crumbs: [DOCS, ['Build', '#/developers/kernelport']], keywords: 'six calls five objects invariants contract', render: pgKernelport });
  reg('/developers/kernelport/:call', { title: function (p) { return p.call || 'Call'; }, crumbs: [DOCS, ['Build', '#/developers/kernelport'], ['KernelPort', '#/developers/kernelport']], example: '/developers/kernelport/assert', keywords: 'assert define verify scope refuse seal call reference', render: pgCall });
  reg('/developers/objects', { title: 'Object model', crumbs: [DOCS, ['Concepts', '#/developers/right-path']], keywords: 'write intent decision approval record meter event sixteen fields', render: pgObjects });
  reg('/developers/right-path', { title: 'The Right Path', crumbs: [DOCS, ['Concepts', '#/developers/right-path']], keywords: 'rungs ladder nine rungs stepper budgets', render: pgRightPath });
  reg('/developers/refusals', { title: 'Refusal register', crumbs: [DOCS, ['Reference', '#/developers/refusals']], keywords: 'refusal codes errors register gate policy platform', render: pgRefusals });
  reg('/developers/refusals/:code', { title: function (p) { return decodeURIComponent(p.code || '') || 'Refusal code'; }, crumbs: [DOCS, ['Reference', '#/developers/refusals'], ['Refusal register', '#/developers/refusals']], example: '/developers/refusals/GATE.PRECONDITION_FAILED', keywords: 'refusal code', render: pgRefusal });
  reg('/developers/mcp', { title: 'MCP server', crumbs: [DOCS, ['Build', '#/developers/kernelport']], keywords: 'model context protocol tools agents', render: pgMcp });
  reg('/developers/sdk/typescript', { title: 'TypeScript SDK', crumbs: [DOCS, ['Build', '#/developers/kernelport']], keywords: 'node npm @elan1/kernel', render: function () { return sdkPage('ts'); } });
  reg('/developers/sdk/python', { title: 'Python SDK', crumbs: [DOCS, ['Build', '#/developers/kernelport']], keywords: 'pip elan1-kernel elan1_kernelport', render: function () { return sdkPage('py'); } });
  reg('/developers/api', { title: 'HTTP API', crumbs: [DOCS, ['Build', '#/developers/kernelport']], keywords: 'rest http endpoints v1 headers rate limit', render: pgApi });
  reg('/developers/webhooks', { title: 'Webhooks', crumbs: [DOCS, ['Build', '#/developers/kernelport']], keywords: 'events hmac signature retries', render: pgWebhooks });
  reg('/developers/declarations', { title: 'Declarations as code', crumbs: [DOCS, ['Concepts', '#/developers/right-path']], keywords: 'declaration yaml seven blocks lint ci', render: pgDeclarations });
  reg('/developers/seal', { title: 'Seal v6', crumbs: [DOCS, ['Evidence specifications', '#/developers/seal']], keywords: 'seal preimage sixteen fields test vectors sha-256', render: pgSeal });
  reg('/developers/verifier', { title: 'Offline verifier', crumbs: [DOCS, ['Evidence specifications', '#/developers/seal']], keywords: 'elan1-verify exit codes bundle', render: pgVerifier });
  reg('/developers/receipt', { title: 'Action Receipt', crumbs: [DOCS, ['Evidence specifications', '#/developers/seal']], keywords: 'action receipt standard cross organisation', render: pgReceipt });
  reg('/developers/conformance', { title: 'Conformance suite', crumbs: [DOCS, ['Reference', '#/developers/refusals']], keywords: 'conformance tests c1 c14 result file', render: pgConformance });
  reg('/developers/versioning', { title: 'Versioning policy', crumbs: [DOCS, ['Reference', '#/developers/refusals']], keywords: 'compatibility deprecation sunset notice', render: pgVersioning });
  reg('/developers/changelog', { title: 'Developer changelog', crumbs: [DOCS, ['Reference', '#/developers/refusals']], keywords: 'changes release notes', render: pgChangelog });
  reg('/developers/architecture', { title: 'Architecture', redirect: '/developers/architecture/context', render: function () { return ''; } });
  reg('/developers/architecture/:view', { title: function (p) { var v = AV[p.view]; return v ? v.title : 'Architecture'; }, crumbs: [DOCS, ['Architecture', '#/developers/architecture/context']], example: '/developers/architecture/context', keywords: 'architecture diagram context components planes write path evidence', render: pgArch });
  reg('/developers/sdk', { title: 'SDKs', redirect: '/developers/sdk/typescript', render: function () { return ''; } });

  E1.cmdAdd({ id: 'dev-sbx', label: 'Get a sandbox key', run: '#/developers/sandbox-key', icon: 'key', group: 'Developers', keywords: 'api key' });
  E1.cmdAdd({ id: 'dev-refusal', label: 'Look up a refusal code', run: '#/developers/refusals', icon: 'refuse', group: 'Developers', keywords: 'error code register' });
})();

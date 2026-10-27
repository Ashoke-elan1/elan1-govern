/* ==========================================================================
   elan1 — WORK door: "What needs me now?"  (owner: work)
   Routes: /work/today · /work/approvals (+/arrives) · /work/decide/:id · /work/not-done(/:id)
           /work/requests · /work/request/:writeType · /work/writes/:id · /work/reverse/:id
           /work/obligations · /work/escalations · /work/reviews(/:id) · /work/stop · /work/break-glass
   Mobile & channels (layout 'mobile'): /m/approvals · /m/decide/:id · /m/done/:id
           /channels/whatsapp · /channels/voice · /channels/email
   Sources: spec-phase1-console §1, §2.1, §2.8, §3 F1–F5 F9–F12, §4 (canonical data);
            spec-tm (obligation state machine, refusal register, invariants);
            spec-atlas Figures 6, 7, 11; spec-phase4-group (graduation, receipt acceptance);
            spec-phase2-3-evidence (dual-control variants, production and promotion review).
   Demo clock: the sample tenant's day is 24 Sep 2026; live countdowns run from page load.
   ========================================================================== */
(function () {
  'use strict';
  var E1 = window.E1, c = E1.c, esc = E1.esc, fmt = E1.fmt;

  /* ------------------------------------------------------------------------
     Local styles (tokens only; prefix w-). Injected once. Core/components were
     not edited; see the final report.
     ------------------------------------------------------------------------ */
  var CSS = [
    '.w-fold{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface)}',
    '.w-fold__cell{padding:14px 16px;border-left:1px solid var(--border-subtle);min-width:0;display:flex;flex-direction:column;gap:8px}',
    '.w-fold__cell:first-child{border-left:0}',
    '.w-fold__k{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;font-weight:var(--weight-semibold);color:var(--text-tertiary)}',
    '.w-fold__sub{font-size:var(--text-caption);color:var(--text-secondary);line-height:var(--lh-caption)}',
    '.w-fold .e1-countdown{font:var(--weight-title) 17px/1.25 var(--font-mono)}',
    '@media (max-width:1100px){.w-fold{grid-template-columns:repeat(2,minmax(0,1fr))}.w-fold__cell:nth-child(3){border-left:0}.w-fold__cell:nth-child(n+3){border-top:1px solid var(--border-subtle)}}',
    '@media (max-width:560px){.w-fold{grid-template-columns:minmax(0,1fr)}.w-fold__cell{border-left:0}.w-fold__cell+.w-fold__cell{border-top:1px solid var(--border-subtle)}}',
    '.w-sec{margin-top:var(--space-6)}',
    '.w-sec:first-child{margin-top:0}',
    '.w-sec__head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:10px;flex-wrap:wrap}',
    '.w-sec__title{font:var(--weight-title) var(--text-section)/var(--lh-section) var(--font-display);letter-spacing:-.01em}',
    '.w-sec__aside{font-size:var(--text-caption);color:var(--text-secondary)}',
    '.w-sec__lead{font-size:var(--text-caption);color:var(--text-secondary);margin:-4px 0 10px;max-width:var(--measure)}',
    '.w-panel{position:sticky;top:calc(var(--topbar-height) + 16px);display:flex;flex-direction:column;gap:16px}',
    '.w-decide{display:flex;flex-direction:column;gap:0}',
    '.w-decide__approve{display:flex;flex-direction:column;gap:8px}',
    '.w-decide__gap{display:flex;align-items:center;gap:10px;margin:22px 0 14px;font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary)}',
    '.w-decide__gap::before,.w-decide__gap::after{content:"";flex:1;height:1px;background:var(--border-subtle)}',
    '.w-decide .e1-btn{min-height:44px}',
    '.w-note{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
    '.w-note strong{color:var(--text-primary);font-weight:var(--weight-semibold)}',
    '.w-reason{display:flex;flex-direction:column;gap:10px;padding:14px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-sunken)}',
    '.w-reason[hidden]{display:none}',
    '.w-meter-hint{font-size:var(--text-label);color:var(--text-tertiary)}',
    '.w-ladder{display:grid;grid-template-columns:78px minmax(0,1fr);gap:6px;align-items:start}',
    '.w-ladder__0b{display:flex;flex-direction:column;gap:6px;padding-right:8px;border-right:2px dashed var(--border-default)}',
    '.w-ladder__0b b{display:grid;place-items:center;width:36px;height:24px;border-radius:var(--radius-sm);border:1.5px solid var(--text-primary);background:var(--text-primary);color:var(--text-inverse);font:var(--weight-semibold) var(--text-label)/1 var(--font-mono)}',
    '.w-ladder__0b.is-failed b{background:var(--state-critical);border-color:var(--state-critical)}',
    '.w-ladder__0b span{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;font-weight:var(--weight-semibold);color:var(--text-tertiary)}',
    '.w-ladder__0b em{font-style:normal;font-size:var(--text-caption);font-weight:var(--weight-semibold)}',
    '.w-ladder .e1-rung__name{white-space:normal;overflow:visible}',
    '.w-ladder__cap{margin-top:12px;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.w-result{display:flex;gap:14px;padding:18px 20px;border-radius:var(--radius-md);border:1px solid var(--border-subtle);border-left:4px solid var(--text-secondary);background:var(--bg-surface);box-shadow:var(--shadow-1)}',
    '.w-result__icon{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:50%;border:1.5px solid currentColor}',
    '.w-result__t{font:var(--weight-title) var(--text-section)/var(--lh-section) var(--font-display);letter-spacing:-.01em}',
    '.w-result__b{margin-top:6px;color:var(--text-secondary);max-width:var(--measure)}',
    '.w-result__acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}',
    '.w-result__meta{margin-top:10px;font-size:var(--text-caption);color:var(--text-tertiary)}',
    '.w-result--good{border-left-color:var(--state-good)}.w-result--good .w-result__icon{color:var(--state-good);background:var(--state-good-bg)}',
    '.w-result--neutral{border-left-color:var(--state-neutral)}.w-result--neutral .w-result__icon{color:var(--state-neutral);background:var(--state-neutral-bg)}',
    '.w-result--warning{border-left-color:var(--state-warning)}.w-result--warning .w-result__icon{color:var(--state-warning);background:var(--state-warning-bg)}',
    '.w-result--critical{border-left-color:var(--state-critical)}.w-result--critical .w-result__icon{color:var(--state-critical);background:var(--state-critical-bg)}',
    '.w-result--info{border-left-color:var(--state-info)}.w-result--info .w-result__icon{color:var(--state-info);background:var(--state-info-bg)}',
    '.w-banner{display:flex;gap:12px;align-items:flex-start;padding:12px 16px;margin-bottom:16px;border-radius:var(--radius-md);border:1px solid var(--state-serious-border);background:var(--state-serious-bg)}',
    '.w-banner--info{border-color:var(--state-info-border);background:var(--state-info-bg)}',
    '.w-banner--warning{border-color:var(--state-warning-border);background:var(--state-warning-bg)}',
    '.w-banner__icon{flex:none;padding-top:2px}',
    '.w-banner__t{font-weight:var(--weight-semibold)}',
    '.w-banner__b{font-size:var(--text-caption);color:var(--text-secondary);margin-top:2px}',
    '.w-banner .e1-btn{margin-left:auto;flex:none}',
    '.w-prop{display:flex;flex-direction:column;gap:2px;min-width:0}',
    '.w-prop__t{font-weight:var(--weight-medium)}',
    '.w-prop__s{font-size:var(--text-caption);color:var(--text-tertiary);font-weight:var(--weight-regular)}',
    'tr.w-kbd-sel>th,tr.w-kbd-sel>td{background:var(--bg-selected)}',
    'tr.w-kbd-sel>th{box-shadow:inset 3px 0 0 var(--border-accent)}',
    '.w-keys{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:var(--text-caption);color:var(--text-secondary);align-items:center}',
    '.w-keys span{display:inline-flex;gap:6px;align-items:center}',
    '.w-toolbar{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:space-between;margin:14px 0 12px}',
    '.w-toolbar__l,.w-toolbar__r{display:flex;flex-wrap:wrap;gap:10px;align-items:center}',
    '.w-inline{display:inline-flex;align-items:center;gap:8px;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.w-inline .e1-selectwrap{min-width:180px}',
    '.w-splitq{display:grid;grid-template-columns:minmax(280px,360px) minmax(0,1fr);gap:16px;align-items:start}',
    '@media (max-width:1000px){.w-splitq{grid-template-columns:minmax(0,1fr)}}',
    '.w-qlist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);overflow:hidden}',
    '.w-qlist li+li{border-top:1px solid var(--border-subtle)}',
    '.w-qitem{display:flex;flex-direction:column;gap:6px;padding:12px 14px;color:var(--text-primary);text-decoration:none;border-left:3px solid transparent;min-height:44px}',
    '.w-qitem:hover{background:var(--bg-hover)}',
    '.w-qitem.is-selected{background:var(--bg-selected);border-left-color:var(--border-accent)}',
    '.w-qitem__row{display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.w-qitem__t{font-weight:var(--weight-medium);line-height:1.35}',
    '.w-needs{list-style:none;margin:0;padding:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);overflow:hidden}',
    '.w-needs>li{display:grid;grid-template-columns:132px minmax(0,1fr) auto;gap:12px;align-items:center;padding:12px 16px}',
    '.w-needs>li+li{border-top:1px solid var(--border-subtle)}',
    '.w-needs__t{font-weight:var(--weight-medium)}',
    '.w-needs__s{font-size:var(--text-caption);color:var(--text-secondary);margin-top:2px}',
    '.w-needs__r{display:flex;align-items:center;gap:10px;justify-content:flex-end;flex-wrap:wrap}',
    '@media (max-width:720px){.w-needs>li{grid-template-columns:minmax(0,1fr)}.w-needs__r{justify-content:flex-start}}',
    '.w-seqs{display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
    '.w-seq{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border:1px solid var(--border-subtle);border-radius:var(--radius-full);background:var(--bg-surface);font-size:var(--text-caption);color:var(--text-primary);text-decoration:none}',
    '.w-seq{max-width:100%;flex-wrap:wrap;border-radius:var(--radius-md)}',
    '.w-seq:hover{border-color:var(--border-default)}',
    '.w-seq code{font-family:var(--font-mono)}',
    '.w-seqs__arrow{color:var(--text-tertiary)}',
    '.w-code-small{font-size:var(--text-caption);color:var(--text-tertiary)}',
    '.w-code-small code{font-family:var(--font-mono)}',
    '.w-rule{font-size:var(--text-body);line-height:var(--lh-body);font-weight:var(--weight-medium);max-width:var(--measure)}',
    '.w-nums{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;background:var(--bg-surface);margin:14px 0}',
    '.w-nums>div{padding:12px 16px}',
    '.w-nums>div+div{border-left:1px solid var(--border-subtle)}',
    '.w-nums dt{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;font-weight:var(--weight-semibold);color:var(--text-tertiary)}',
    '.w-nums dd{margin:4px 0 0;font:var(--weight-title) 17px/1.25 var(--font-mono);font-variant-numeric:tabular-nums}',
    '.w-action{display:flex;flex-direction:column;gap:10px;padding:16px;border:1px solid var(--border-strong);border-radius:var(--radius-md);background:var(--bg-surface)}',
    '.w-action__q{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;font-weight:var(--weight-semibold);color:var(--text-tertiary)}',
    '.w-action__t{font-weight:var(--weight-semibold)}',
    '.w-action__row{display:flex;flex-wrap:wrap;gap:8px}',
    '.w-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0}',
    '.w-steps li{display:grid;grid-template-columns:24px minmax(0,1fr) auto;gap:10px;align-items:start;padding:10px 0;border-bottom:1px solid var(--border-subtle)}',
    '.w-steps li:last-child{border-bottom:0}',
    '.w-steps__i{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;border:1.5px solid currentColor}',
    '.w-steps__t{font-weight:var(--weight-medium)}',
    '.w-steps__d{font-size:var(--text-caption);color:var(--text-secondary)}',
    '.w-steps__m{font-size:var(--text-caption);color:var(--text-tertiary);font-family:var(--font-mono);white-space:nowrap}',
    '.w-cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;background:var(--bg-surface)}',
    '.w-cal__h{padding:8px 10px;font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;font-weight:var(--weight-semibold);color:var(--text-tertiary);background:var(--bg-sunken);border-bottom:1px solid var(--border-subtle)}',
    '.w-cal__d{min-height:96px;padding:6px 8px;border-top:1px solid var(--border-subtle);border-left:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:4px;min-width:0}',
    '.w-cal__d:nth-child(7n+1){border-left:0}',
    '.w-cal__d.is-out{background:var(--bg-canvas);color:var(--text-disabled)}',
    '.w-cal__d.is-today{box-shadow:inset 0 0 0 2px var(--border-accent)}',
    '.w-cal__n{font:var(--weight-semibold) var(--text-caption)/1 var(--font-mono);color:var(--text-secondary)}',
    '.w-cal__e{display:block;padding:3px 6px;border-radius:var(--radius-sm);font-size:var(--text-label);line-height:1.3;text-decoration:none;color:var(--text-primary);background:var(--bg-sunken);border-left:3px solid var(--border-default);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.w-cal__e--approval{border-left-color:var(--state-warning)}',
    '.w-cal__e--statutory{border-left-color:var(--text-primary)}',
    '.w-cal__e--window{border-left-color:var(--state-info)}',
    '@media (max-width:900px){.w-cal{display:none}}',
    '.w-kindmark{display:inline-flex;align-items:center;gap:6px;font-size:var(--text-caption)}',
    '.w-kindmark i{width:10px;height:10px;border-radius:2px;display:inline-block;background:var(--bg-sunken);border-left:3px solid var(--border-default)}',
    '.w-kindmark--approval i{border-left-color:var(--state-warning)}.w-kindmark--statutory i{border-left-color:var(--text-primary)}.w-kindmark--window i{border-left-color:var(--state-info)}',
    '.w-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}',
    '@media (max-width:720px){.w-two{grid-template-columns:minmax(0,1fr)}}',
    '.w-approver{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface)}',
    '.w-approver__n{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary);font-weight:var(--weight-semibold)}',
    '.w-check{list-style:none;margin:0;padding:0}',
    '.w-check li{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-subtle);align-items:start}',
    '.w-check li:last-child{border-bottom:0}',
    '.w-just{padding:14px 16px;border-left:3px solid var(--text-primary);background:var(--bg-sunken);border-radius:0 var(--radius-md) var(--radius-md) 0;font-size:var(--text-body);line-height:var(--lh-body)}',
    '.w-model{padding:12px 14px;border:1px dashed var(--border-default);border-radius:var(--radius-md);font-size:var(--text-caption);color:var(--text-secondary)}',
    '.w-counters{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;background:var(--bg-surface)}',
    '.w-counters>div{padding:10px 14px;border-right:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle)}',
    '.w-counters dt{font-size:var(--text-label);color:var(--text-secondary);font-family:var(--font-mono)}',
    '.w-counters dd{margin:2px 0 0;font:var(--weight-title) var(--text-lead)/1.2 var(--font-mono)}',
    /* mobile + channels */
    '.w-m-seg{padding:10px 16px 0}',
    '.w-mcard{display:flex;flex-direction:column;gap:8px;padding:14px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);text-decoration:none;color:var(--text-primary);min-height:44px}',
    '.w-mcard__t{font-weight:var(--weight-semibold);line-height:1.35}',
    '.w-mcard__row{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:var(--text-caption);color:var(--text-secondary)}',
    '.w-mfacts{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '.w-mfacts>div{padding:10px 12px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);display:flex;flex-direction:column;gap:6px;min-width:0}',
    '.w-mdetails{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface)}',
    '.w-mdetails>summary{min-height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;cursor:pointer;font-weight:var(--weight-medium);list-style:none}',
    '.w-mdetails>summary::-webkit-details-marker{display:none}',
    '.w-mdetails[open]>summary{border-bottom:1px solid var(--border-subtle)}',
    '.w-mdetails>div{padding:0 4px}',
    '.w-chat{display:flex;flex-direction:column;gap:10px;padding:14px 12px;background:var(--bg-sunken);min-height:520px}',
    '.w-chat__day{align-self:center;font-size:var(--text-label);padding:3px 8px;border-radius:var(--radius-sm);background:var(--bg-surface);color:var(--text-secondary)}',
    '.w-bub{max-width:86%;padding:10px 12px;border-radius:12px;background:var(--bg-surface);border:1px solid var(--border-subtle);font-size:var(--text-body);line-height:1.45;box-shadow:var(--shadow-1)}',
    '.w-bub--in{align-self:flex-start;border-top-left-radius:4px}',
    '.w-bub--out{align-self:flex-end;border-top-right-radius:4px;background:var(--bg-raised);border-color:var(--border-default)}',
    '.w-bub__meta{display:block;margin-top:6px;font-size:var(--text-label);color:var(--text-tertiary);text-align:right}',
    '.w-bub__link{display:block;margin-top:8px;padding-top:8px;border-top:1px solid var(--border-subtle);font-weight:var(--weight-semibold)}',
    '.w-bub__btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}',
    '.w-bub__btns .e1-btn{min-height:44px}',
    '.w-chathead{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle)}',
    '.w-chathead__t{font-weight:var(--weight-semibold);line-height:1.2}',
    '.w-chathead__s{font-size:var(--text-label);color:var(--text-secondary)}',
    '.w-compose{display:flex;gap:8px;padding:10px 12px;background:var(--bg-surface);border-top:1px solid var(--border-subtle);position:sticky;bottom:0}',
    '.w-compose .e1-input{min-height:44px}',
    '.w-voice{display:flex;flex-direction:column;gap:12px}',
    '.w-vline{display:grid;grid-template-columns:64px minmax(0,1fr);gap:10px;font-size:var(--text-body);line-height:1.45}',
    '.w-vline__w{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;font-weight:var(--weight-semibold);color:var(--text-tertiary);padding-top:3px}',
    '.w-vline--sys .w-vline__s{padding:8px 10px;border-radius:var(--radius-md);background:var(--bg-sunken)}',
    '.w-mail{display:flex;flex-direction:column;gap:0;background:var(--bg-surface)}',
    '.w-mail__head{padding:14px 16px;border-bottom:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:4px}',
    '.w-mail__subj{font:var(--weight-title) 17px/1.3 var(--font-display)}',
    '.w-mail__from{font-size:var(--text-caption);color:var(--text-secondary)}',
    '.w-mail__body{padding:16px;display:flex;flex-direction:column;gap:12px;font-size:var(--text-body);line-height:1.5}',
    '.w-mail__foot{padding:12px 16px 24px;border-top:1px solid var(--border-subtle);font-size:var(--text-label);color:var(--text-tertiary)}',
    '.w-kv-tight .e1-kv__row{padding:6px 0}',
    '.w-pausebtn[aria-pressed="true"]{background:var(--bg-selected)}',
    '.w-result{overflow-wrap:anywhere}.w-result>div{min-width:0}.w-result .e1-btn{max-width:100%;white-space:normal;height:auto;min-height:40px;text-align:left}',
    '.w-qcards{display:none;flex-direction:column;gap:10px}',
    '@media (max-width:720px){#w-queue{display:none}.w-qcards{display:flex}.w-keys{display:none}.w-inline{flex-wrap:wrap;width:100%}.w-inline .e1-selectwrap{min-width:0;flex:1 1 200px}}',
    '.w-toolbar,.w-toolbar__l,.w-toolbar__r{min-width:0;max-width:100%}',
    '.w-live{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}',
    '.w-checks{display:inline-flex;align-items:center;gap:6px;white-space:nowrap}',
    '.w-checks .e1-mono{font-size:var(--text-caption);color:var(--text-secondary)}',
    '.w-cards2{display:grid;grid-template-columns:minmax(0,1fr);gap:var(--space-5);margin-top:var(--space-5);align-items:start}',
    '.w-doors{list-style:none;margin:0;padding:0}',
    '.w-doors li{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px var(--pane-padding);border-bottom:1px solid var(--border-subtle)}',
    '.w-doors li:last-child{border-bottom:0}',
    '.w-doors__q{font-weight:var(--weight-semibold)}',
    '.w-doors__d{font-size:var(--text-caption);color:var(--text-secondary)}',
    '.w-card-pad{padding:var(--space-4) var(--pane-padding)}'
  ].join('\n');
  (function injectStyle() {
    try {
      if (document.getElementById('w-work-style')) return;
      var s = document.createElement('style'); s.id = 'w-work-style'; s.textContent = CSS;
      document.head.appendChild(s);
    } catch (e) { /* no DOM */ }
  })();

  /* ------------------------------------------------------------------------
     Sample data — E1.data.work (canonical names and ids from spec §4)
     ------------------------------------------------------------------------ */
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, ''); }
  var PEOPLE = {};
  (E1.data.people || []).forEach(function (p) { PEOPLE[p.id] = p; });
  PEOPLE['kavya-menon'] = PEOPLE['kavya-menon'] || { id: 'kavya-menon', name: 'Kavya Menon', role: 'Onboarding reviewer (elan1)', kind: 'person', mayApprove: null };
  function person(id) { return PEOPLE[id] || { id: id, name: id, role: '', kind: 'person' }; }
  function personIdByName(n) { for (var k in PEOPLE) { if (PEOPLE[k].name === n) return k; } return slug(n); }
  var USER = E1.data.user || { id: 'venkat-raman', name: 'Venkat Raman', role: 'Accounts head' };

  var AGENTS = {
    'ar-agent': { owner: 'Venkat Raman', model: 'claude-sonnet (via rung1)' },
    'ap-agent': { owner: 'Ravi Shankar', model: 'gpt-4.1-mini' },
    'bank-recon-agent': { owner: 'Rekha Subramanian', model: 'llama-3.1-70b (stack1 gateway)' },
    'stock-agent': { owner: 'Priya Nair', model: 'claude-haiku' },
    'gst-agent': { owner: 'Venkat Raman', model: 'sarvam-m' },
    'close-agent': { owner: 'Meenakshi Iyer', model: 'claude-sonnet' },
    'Invoice Agent': { owner: 'Rekha Subramanian', model: 'claude-sonnet' },
    'Collections Agent': { owner: 'Ravi Shankar', model: 'claude-sonnet' },
    'vendor-onboarding agent': { owner: 'Priya Nair', model: 'gpt-4.1-mini' },
    'rung1 drafting agent': { owner: 'Venkat Raman', model: 'claude-haiku' },
    'LedgerLoop billing agent': { owner: 'LedgerLoop (design partner)', model: 'their own' }
  };
  function agentHref(name) { return '#/agents/agent/' + slug(name).replace(/\./g, '-'); }
  function actorHref(name, kind) { return kind === 'agent' ? agentHref(name) : kind === 'system' ? '#/agents/registry' : '#/agents/people/' + personIdByName(name); }
  function actor(name, kind, role, size) { return c.actor({ name: name, kind: kind || 'person', role: role, href: actorHref(name, kind), size: size }); }
  function kindWord(k) { return k === 'agent' ? 'Agent' : k === 'system' ? 'System' : 'Person'; }

  /* Write types (spec §4.4). rev: hours | false (irreversible). gates: declared order. */
  var WT = {
    'erp.sales_invoice.submit': { label: 'Submit invoice', blast: 2, rev: '24 h', revText: 'Reversible: cancel IRN within 24 h, then credit note (30 days).', dual: 'Above ₹2,00,000', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G4'], channels: 'web, mcp (submit) · web, mobile, WhatsApp (approve)', wa: false, decl: 'erp.ar', v: 7, expiry: '4 h', basis: 'per counterparty' },
    'erp.sales_invoice.cancel': { label: 'Cancel invoice', blast: 2, rev: false, revText: 'Irreversible — cannot be auto-approved.', dual: 'Always', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G5', 'G4'], channels: 'web · voice (approve only) · API not permitted', wa: false, decl: 'sales_invoice', v: 4, expiry: '4 h', basis: 'per counterparty' },
    'erp.payment_entry.submit': { label: 'Record payment', blast: 2, rev: 720, revText: 'Reversible: snapshot restore within 30 days, then compensating entry.', dual: 'No', gates: ['G1', 'G2', 'G3', 'G7', 'G9'], channels: 'web, api', wa: false, decl: 'erp.ar', v: 7, expiry: '4 h', basis: 'per counterparty' },
    'erp.purchase_order.submit': { label: 'Submit purchase order', blast: 2, rev: 720, revText: 'Reversible: cancel in ERPNext within 30 days.', dual: 'Above ₹5,00,000', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G4', 'G6', 'G5'], channels: 'web, api', wa: false, decl: 'erp.ap', v: 5, expiry: '8 h', basis: 'per counterparty' },
    'erp.purchase_invoice.submit': { label: 'Book supplier bill', blast: 2, rev: 720, revText: 'Reversible: debit note (compensating entry) within 30 days.', dual: 'Above ₹2,00,000', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G4', 'G6', 'G5'], channels: 'web, api, mcp', wa: false, decl: 'erp.ap', v: 5, expiry: '8 h', basis: 'per counterparty' },
    'erp.credit_note.submit': { label: 'Raise credit note', blast: 2, rev: 720, revText: 'Reversible: compensating entry within 30 days.', dual: 'Always', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G4', 'G6'], channels: 'web', wa: false, decl: 'erp.ar', v: 7, expiry: '4 h', basis: 'per counterparty' },
    'erp.credit_limit.change': { label: 'Change credit limit', blast: 2, rev: 720, revText: 'Reversible: snapshot restore within 30 days.', dual: 'Always', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G5', 'G4'], channels: 'web', wa: false, decl: 'erp.ar', v: 7, expiry: '4 h', basis: 'per counterparty' },
    'erp.customer.create': { label: 'Add customer', blast: 1, rev: 720, revText: 'Reversible: snapshot restore within 30 days.', dual: 'No', gates: ['G1', 'G2', 'G3', 'G7', 'G9'], channels: 'web, api', wa: false, decl: 'erp.ar', v: 7, expiry: '4 h', basis: 'per record' },
    'erp.supplier.create': { label: 'Add supplier', blast: 1, rev: 720, revText: 'Reversible: snapshot restore within 30 days.', dual: 'No', gates: ['G1', 'G2', 'G3', 'G7', 'G9'], channels: 'web, api, mcp', wa: false, decl: 'erp.ap', v: 5, expiry: '4 h', basis: 'per record' },
    'erp.journal_entry.submit': { label: 'Post journal entry', blast: 1, rev: 720, revText: 'Reversible: compensating entry within 30 days.', dual: 'Above ₹1,00,000', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G8', 'G4'], channels: 'web', wa: false, decl: 'erp.ar', v: 7, expiry: '4 h', basis: 'per record' },
    'erp.stock_entry.submit': { label: 'Move stock', blast: 1, rev: 720, revText: 'Reversible: cancel the stock entry in ERPNext within 30 days.', dual: 'No', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G5'], channels: 'web, api · WhatsApp reply (approve)', wa: true, decl: 'erp.stock', v: 3, expiry: '2 h', basis: 'per record' },
    'erp.price_list.update': { label: 'Update price list', blast: 3, rev: 168, revText: 'Reversible: snapshot restore within 7 days.', dual: 'Always', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G5', 'G4', 'G8'], channels: 'web', wa: false, decl: 'erp.ar', v: 7, expiry: '4 h', basis: 'per batch' },
    'erp.payment_run.submit': { label: 'Release supplier payment run', blast: 3, rev: false, revText: 'Irreversible — money leaves the bank. Cannot be auto-approved.', dual: 'Always · two approvers', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G5', 'G4', 'G6', 'G8'], channels: 'web · voice (approve only)', wa: false, decl: 'erp.ap', v: 5, expiry: '4 h', basis: 'per batch' },
    'erp.period.close': { label: 'Close accounting period', blast: 4, rev: 72, revText: 'Reversible: reopen the period within 72 h.', dual: 'Forced by radius · two approvers', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G4', 'G8'], channels: 'web', wa: false, decl: 'erp.ar', v: 7, expiry: '4 h', basis: 'per tenant' },
    'erp.gstr1.file': { label: 'File GSTR-1', blast: 5, rev: false, revText: 'Irreversible — a filing leaves the organisation. Cannot be auto-approved.', dual: 'Forced by radius', gates: ['G1', 'G2', 'G3', 'G7', 'G9', 'G4', 'G8', 'G5'], channels: 'web', wa: false, decl: 'erp.ar', v: 7, expiry: '4 h', basis: 'per crossing' },
    'platform.declaration.certify': { label: 'Certify declaration version', blast: 4, rev: false, revText: 'Irreversible — versions are kept for ever.', dual: 'Always', gates: ['G2', 'G4'], channels: 'web', wa: false, decl: 'platform', v: 3, expiry: '24 h', basis: 'per tenant' },
    'platform.tenant.stop': { label: 'Stop tenant', blast: 4, rev: 'lift', revText: 'Reversible: lifting the stop is the same dual-control write.', dual: 'Always', gates: ['G2', 'G4'], channels: 'web', wa: false, decl: 'platform', v: 3, expiry: '1 h', basis: 'per tenant' },
    'platform.autonomy.grant': { label: 'Change autonomy grant', blast: 1, rev: 720, revText: 'Reversible: snapshot restore; lowering a grant needs one person.', dual: 'Always', gates: ['G1', 'G2', 'G3', 'G9', 'G8', 'G4'], channels: 'web', wa: false, decl: 'platform', v: 3, expiry: '4 h', basis: 'per record' },
    'platform.obligation.resolve': { label: 'Approve or reject', blast: 1, rev: false, revText: 'A decision is recorded, not reversed; a new request supersedes it.', dual: 'G4 by definition', gates: ['G4'], channels: 'web, mobile, WhatsApp, voice', wa: true, decl: 'platform', v: 3, expiry: '—', basis: 'per record' },
    'platform.breakglass': { label: 'Break-glass', blast: 4, rev: 'session', revText: 'Session ends by itself after the declared window.', dual: 'Always', gates: ['G2', 'G4', 'G8'], channels: 'web', wa: false, decl: 'platform', v: 3, expiry: '15 min', basis: 'per tenant' }
  };
  function wt(name) {
    if (WT[name]) return WT[name];
    var verb = String(name || '').split('.').pop();
    return { label: (String(name || 'write').split('.').slice(-2, -1)[0] || 'write').replace(/_/g, ' ').replace(/^\w/, function (m) { return m.toUpperCase(); }) + ' · ' + verb, blast: 1, rev: 720, revText: 'Reversible: snapshot restore within 30 days.', dual: 'No', gates: ['G1', 'G2', 'G3', 'G9'], channels: 'web', wa: false, decl: String(name || '').split('.')[0] || 'erp.ar', v: 1, expiry: '4 h', basis: 'per record', unknown: true };
  }
  function wtHref(name) { return '#/records/write-types/' + name; }
  function declHref(d) { return '#/records/declarations/' + d; }
  function proofHref(seq) { return '#/assurance/proof/' + seq; }
  function seqTxt(seq) { return '#' + fmt.num(seq); }

  var GATE_NAME = { G1: 'Consent', G2: 'Residency (Mumbai)', G3: 'Retention', G4: 'Dual control', G5: 'Rate', G6: 'Budget', G7: 'Counterparty', G8: 'Schedule', G9: 'Precondition' };
  function gateWords(id, ob) {
    var cp = ob.cp || 'this counterparty';
    return {
      G1: 'Recorded consent covers this purpose' + (ob.cp ? ' for ' + cp : '') + '; not opted out.',
      G2: 'Record and tenant are both in residency domain in · Mumbai.',
      G3: 'Inside the declared 8-year retention window.',
      G4: 'A second named person must approve.',
      G5: 'Within the declared per-actor rate (12 of 60 this hour).',
      G6: 'Within the declared budget for September.',
      G7: ob.cp ? 'Registered with a validated GSTIN; not on a sanctions list checked 24 Sep 2026.' : 'No external counterparty on this write.',
      G8: 'Inside the declared operating window (Mon–Sat, 09:00–20:00 IST).',
      G9: 'The declared record state holds.'
    }[id];
  }

  /* Open obligations (spec §4.5; now = 24 Sep 2026, 15:28 IST). exp = minutes left. */
  var OB = [
    { id: 'OB-2026-0412', wt: 'erp.sales_invoice.submit', proposal: 'Submit invoice SINV-2026-01187 · ACME Textiles', cp: 'ACME Textiles', amount: 240000, by: { name: 'ar-agent', kind: 'agent', level: 'A2' }, passed: 5, total: 5, exp: 192, waiting: ['venkat-raman'], set: 'ar-approvers', quorum: 1, policy: 11, rung: 6,
      why: 'the proposing agent is at A2 Propose; a person approves before anything is written.', esc: 4099, resolution: 4100, commit: 4101, writeId: 'w_8c21f4a0', record: 'SINV-2026-01187', raised: '14:16 IST',
      gateWords: { G1: 'Recorded consent covers invoicing for ACME Textiles; expires 31 Mar 2027.', G7: 'Registered customer with a validated GSTIN; not on any sanctions list checked 24 Sep 2026.', G9: 'credit_exposure + amount ≤ credit_limit held at as_of; no duplicate invoice number.', G4: 'Above ₹2,00,000, so a second named person is required: you (ar-approvers).' },
      gateNames: { G7: 'Counterparty (ACME Textiles, known)', G9: 'Precondition (credit limit ₹3,00,000, exposure after this write ₹2,40,000)' },
      diff: [
        { field: 'Invoice status', before: 'Draft', after: 'Submitted', material: true },
        { field: 'Customer', before: 'ACME Textiles', after: 'ACME Textiles' },
        { field: 'Item', before: 'YARN-40S · Cotton yarn 40s combed', after: 'YARN-40S · Cotton yarn 40s combed' },
        { field: 'Quantity', before: '800 kg', after: '800 kg', mono: true },
        { field: 'Rate', before: '₹300 / kg', after: '₹300 / kg', mono: true },
        { field: 'Grand total', before: '₹2,40,000', after: '₹2,40,000', mono: true },
        { field: 'ACME Textiles credit exposure', before: '₹0', after: '₹2,40,000', material: true, mono: true },
        { field: 'e-Invoice IRN', before: '', after: 'Requested on submit' },
        { field: 'Posting date', before: '', after: '24 Sep 2026' },
        { field: 'Due date', before: '', after: '24 Oct 2026' },
        { field: 'Credit limit', before: '₹3,00,000', after: '₹3,00,000', mono: true }
      ],
      related: [{ seq: 4098, label: 'Not done — credit limit (₹4,20,000 draft)', outcome: 'refused' }] },
    { id: 'OB-2026-0411', wt: 'erp.payment_run.submit', proposal: 'Release supplier payment run · 14 suppliers', amount: 1842760, radius: 'Batch · 14 suppliers', by: { name: 'ap-agent', kind: 'agent', level: 'A2' }, passed: 8, total: 8, exp: 52, waiting: ['ravi-shankar', 'meenakshi-iyer'], set: 'payment-run approvers', quorum: 2, policy: 11, rung: 6,
      why: 'the write type is irreversible, so it can never be auto-approved, and a batch that moves money needs two named people (dual control, two approvers).', esc: 4111, writeId: 'w_3fd10c77', record: 'PR-RUN-2026-09-24', raised: '15:27 IST', cp: '14 suppliers',
      gateWords: { G1: 'Recorded consent covers payment to all 14 suppliers.', G7: '14 of 14 suppliers registered with validated GSTINs and bank accounts; none on a sanctions list.', G9: 'Every line matches a booked bill; PO and GRN cross-checked; bank balance ₹42,18,300 covers the run.', G6: '₹18,42,760 of the ₹60,00,000 September payment budget.', G8: 'Inside the bank cut-off window (before 16:30 IST).', G4: 'Two named people must approve: Ravi Shankar and Meenakshi Iyer. None recorded yet.' },
      gateNames: { G7: 'Counterparty (14 suppliers, known)' },
      diff: [
        { field: 'Payment run status', before: 'Draft', after: 'Released to bank', material: true },
        { field: 'Suppliers', before: '14', after: '14', mono: true },
        { field: 'Total', before: '₹18,42,760', after: '₹18,42,760', mono: true },
        { field: 'MSME suppliers in this run', before: '3', after: '3 (paid inside 45 days)', material: true },
        { field: 'Bank account', before: 'HDFC Current ··4471', after: 'HDFC Current ··4471' },
        { field: 'Bank balance after run', before: '₹42,18,300', after: '₹23,75,540', material: true, mono: true },
        { field: 'Value date', before: '', after: '24 Sep 2026' },
        { field: 'Tiruppur Knit Processors', before: '₹3,42,000 due 28 Sep', after: 'Paid', mono: true },
        { field: 'Coimbatore Castings Pvt Ltd', before: '₹1,86,440 due 8 Nov', after: 'Paid', mono: true },
        { field: 'Erode Bobbins & Cones', before: '₹64,800 due 6 Oct', after: 'Paid', mono: true }
      ] },
    { id: 'OB-2026-0414', wt: 'erp.credit_limit.change', proposal: 'Change credit limit · ACME Textiles · ₹3,00,000 → ₹5,00,000', cp: 'ACME Textiles', amount: null, radius: 'One counterparty', by: { name: 'Rekha Subramanian', kind: 'person', level: 'A2' }, passed: 6, total: 6, exp: 238, waiting: ['venkat-raman'], set: 'ar-approvers', quorum: 1, policy: 11, rung: 6,
      why: 'every credit-limit change needs a second named person (dual control); Rekha Subramanian holds A2 Propose on this write type.', esc: 4107, writeId: 'w_5a7cd3e0', record: 'ACME Textiles (customer)', raised: '15:22 IST',
      gateWords: { G9: 'Customer is not overdue beyond 45 days; last 12 months paid on time (median 31 days).', G4: 'A second named person must approve: you (ar-approvers).' },
      gateNames: { G7: 'Counterparty (ACME Textiles, known)' },
      diff: [
        { field: 'Credit limit', before: '₹3,00,000', after: '₹5,00,000', material: true, mono: true },
        { field: 'Headroom after the open invoice', before: '₹60,000', after: '₹2,60,000', mono: true },
        { field: 'Credit days', before: '30', after: '30', mono: true },
        { field: 'Customer', before: 'ACME Textiles', after: 'ACME Textiles' },
        { field: 'Reason', before: '', after: 'Festive-season orders; ACME has paid on time for 12 months.' }
      ],
      related: [{ seq: 4098, label: 'Not done — credit limit (the refusal that prompted this)', outcome: 'refused' }] },
    { id: 'OB-2026-0415', wt: 'erp.purchase_order.submit', proposal: 'Submit purchase order PO-2026-00321 · Coimbatore Castings Pvt Ltd', cp: 'Coimbatore Castings Pvt Ltd', amount: 680000, by: { name: 'ap-agent', kind: 'agent', level: 'A2' }, passed: 7, total: 7, exp: 100, waiting: ['ravi-shankar'], set: 'ap-approvers', quorum: 1, policy: 11, rung: 6,
      why: 'the amount is above ₹5,00,000, so dual control applies; ap-agent is at A2 Propose on purchase orders.', esc: 4086, writeId: 'w_1b44e902', record: 'PO-2026-00321',
      gateWords: { G9: 'Approved supplier; rate within 2% of the last three orders.', G6: '₹6,80,000 of the ₹25,00,000 September purchasing budget.', G4: 'Above ₹5,00,000, so a second named person is required: Ravi Shankar.' },
      diff: [
        { field: 'PO status', before: 'Draft', after: 'Submitted', material: true },
        { field: 'Supplier', before: 'Coimbatore Castings Pvt Ltd', after: 'Coimbatore Castings Pvt Ltd' },
        { field: 'Grand total', before: '₹6,80,000', after: '₹6,80,000', mono: true },
        { field: 'Delivery', before: '', after: '10 Oct 2026, Mill 1' }
      ] },
    { id: 'OB-2026-0416', wt: 'erp.purchase_invoice.submit', proposal: 'Book supplier bill · Coimbatore Castings Pvt Ltd', cp: 'Coimbatore Castings Pvt Ltd', amount: 286440, by: { name: 'ap-agent', kind: 'agent', level: 'A3' }, passed: 7, total: 7, exp: 125, waiting: ['venkat-raman'], set: 'ap-approvers', quorum: 1, policy: 11, rung: 6,
      why: 'ap-agent acts alone at A3 on bills up to ₹2,00,000; this one is above it, so a second named person must approve (dual control).', esc: 4087, writeId: 'w_77c0a1d5', record: 'ACC-PINV-2026-00548',
      gateWords: { G9: 'PO-2026-00318 and GRN-2026-00902 cross-checked; quantities and rates match.', G6: '₹2,86,440 of the ₹25,00,000 September purchasing budget.', G4: 'Above ₹2,00,000, so a second named person is required: you.' },
      diff: [
        { field: 'Bill status', before: 'Draft', after: 'Submitted', material: true },
        { field: 'Supplier', before: 'Coimbatore Castings Pvt Ltd', after: 'Coimbatore Castings Pvt Ltd' },
        { field: 'Grand total', before: '₹2,86,440', after: '₹2,86,440', mono: true },
        { field: 'MSME payment due', before: '', after: '8 Nov 2026 (45 days)', material: true },
        { field: 'Against', before: '', after: 'PO-2026-00318 · GRN-2026-00902' }
      ] },
    { id: 'OB-2026-0417', wt: 'erp.sales_invoice.cancel', proposal: 'Cancel invoice INV-2026-0851 · Shree Murugan Traders', cp: 'Shree Murugan Traders', amount: 200000, radius: 'Irreversible', by: { name: 'Collections Agent', kind: 'agent', level: 'A2' }, passed: 6, total: 6, exp: 38, waiting: ['ravi-shankar'], set: 'approval.finance_manager (voice)', quorum: 1, policy: 11, rung: 6,
      why: 'cancelling an invoice is irreversible, so it can never be auto-approved; the Collections Agent is at A2 Propose.', esc: 4088, writeId: 'w_d6e31b48', record: 'INV-2026-0851',
      gateWords: { G9: 'Goods-return note GRN-R-2026-0031 received; no payment against this invoice.', G4: 'Irreversible, so a named person must approve: Ravi Shankar (voice approval allowed).' },
      diff: [
        { field: 'Invoice status', before: 'Submitted', after: 'Cancelled', material: true },
        { field: 'Grand total', before: '₹2,00,000', after: '₹2,00,000', mono: true },
        { field: 'e-Invoice IRN', before: 'Active', after: 'Cancelled at GSTN', material: true },
        { field: 'Shree Murugan Traders outstanding', before: '₹2,00,000', after: '₹0', mono: true },
        { field: 'Reason', before: '', after: 'Customer returned the goods (GRN-R-2026-0031).' }
      ] },
    { id: 'OB-2026-0418', wt: 'erp.credit_note.submit', proposal: 'Raise credit note CN-2026-00077 · ACME Textiles', cp: 'ACME Textiles', amount: 48300, by: { name: 'Ravi Shankar', kind: 'person', level: 'A3' }, passed: 6, total: 6, exp: 171, waiting: ['venkat-raman', 'meenakshi-iyer'], set: 'ar-approvers (either)', quorum: 1, policy: 11, rung: 6,
      why: 'every credit note needs a second named person (dual control). Ravi Shankar proposed it, so he cannot approve it himself; he sent it to you.', esc: 4089, writeId: 'w_c1504b9e', record: 'CN-2026-00077',
      gateWords: { G9: 'Against SINV-2026-01102; rate difference agreed in writing 20 Sep 2026.', G4: 'Ravi Shankar proposed this; a different named person must approve: you or Meenakshi Iyer.' },
      diff: [
        { field: 'Credit note status', before: 'Draft', after: 'Submitted', material: true },
        { field: 'Against invoice', before: '', after: 'SINV-2026-01102' },
        { field: 'Amount', before: '₹48,300', after: '₹48,300', mono: true },
        { field: 'ACME Textiles balance', before: '₹0', after: '₹48,300 in credit', material: true, mono: true }
      ],
      related: [{ seq: 4096, label: 'Not done — Ravi Shankar tried to approve his own credit note (GATE.DUAL_CONTROL_SAME_ACTOR)', outcome: 'refused' }] },
    { id: 'OB-2026-0419', wt: 'erp.period.close', proposal: 'Close accounting period · August 2026', amount: null, radius: 'Whole tenant', by: { name: 'close-agent', kind: 'agent', level: 'A1' }, passed: 6, total: 6, exp: 235, waiting: ['meenakshi-iyer', 'ravi-shankar'], set: 'period-close approvers', quorum: 2, policy: 11, rung: 6,
      why: 'close-agent is at A1 Draft, and a whole-tenant write forces dual control: Meenakshi Iyer and Ravi Shankar must both approve.', esc: 4084, writeId: 'w_90ab11c3', record: 'Accounting period Aug 2026',
      gateWords: { G9: 'Bank reconciled to 31 Aug; no draft entries dated August; GSTR-1 for August drafted.', G4: 'Two named people must approve: Meenakshi Iyer and Ravi Shankar.' },
      diff: [
        { field: 'Period status', before: 'Open', after: 'Closed', material: true },
        { field: 'Posting allowed until', before: '—', after: '31 Aug 2026 (locked)' },
        { field: 'Draft entries in August', before: '0', after: '0', mono: true }
      ] },
    { id: 'OB-2026-0420', wt: 'erp.gstr1.file', proposal: 'File GSTR-1 · August 2026 · 412 invoices', amount: null, radius: 'Crosses an organisation boundary', by: { name: 'gst-agent', kind: 'agent', level: 'A1' }, passed: 7, total: 7, exp: 239, waiting: ['meenakshi-iyer'], set: 'owner', quorum: 1, policy: 11, rung: 6,
      why: 'a filing crosses an organisation boundary (GSTN) and is irreversible, so dual control is forced; gst-agent is at A1 Draft.', esc: 4083, writeId: 'w_4e2a9f10', record: 'GSTR-1 Aug 2026', cp: 'GSTN',
      gateWords: { G9: '412 invoices reconcile to the sales register; IRNs present for all B2B invoices.', G8: 'Inside the declared filing window.', G4: 'A named person must approve: Meenakshi Iyer.' },
      gateNames: { G7: 'Counterparty (GSTN, known)' },
      diff: [
        { field: 'Return status', before: 'Drafted', after: 'Filed with GSTN', material: true },
        { field: 'Invoices', before: '412', after: '412', mono: true },
        { field: 'Taxable value', before: '₹4,86,12,400', after: '₹4,86,12,400', mono: true },
        { field: 'Tax', before: '₹24,30,620', after: '₹24,30,620', mono: true }
      ] },
    { id: 'OB-2026-0421', wt: 'erp.price_list.update', proposal: 'Update price list · Yarn 40s combed · 38 items', amount: null, radius: 'Batch · 38 records', by: { name: 'Invoice Agent', kind: 'agent', level: 'A1' }, passed: 7, total: 7, exp: 72, waiting: ['venkat-raman'], set: 'ar-approvers', quorum: 1, policy: 11, rung: 6,
      why: 'a batch change to prices needs a second named person (dual control); Invoice Agent is at A1 Draft.', esc: 4085, writeId: 'w_2c77e018', record: 'Price list · Standard Selling', cp: null,
      gateWords: { G9: 'Every new rate keeps margin at or above 6% on the current cost sheet.', G5: '1 of 4 price-list changes declared per week.', G4: 'Batch radius, so a second named person is required: you.' },
      diff: [
        { field: 'Items changed', before: '0', after: '38', material: true, mono: true },
        { field: 'YARN-40S · Cotton yarn 40s combed', before: '₹300 / kg', after: '₹312 / kg', mono: true },
        { field: 'YARN-40S-CW · 40s combed, compact', before: '₹318 / kg', after: '₹331 / kg', mono: true },
        { field: 'YARN-40S-GAS · 40s gassed', before: '₹336 / kg', after: '₹349 / kg', mono: true },
        { field: 'Lowest margin after change', before: '5.4%', after: '6.8%', material: true, mono: true },
        { field: 'Effective from', before: '', after: '1 Oct 2026' }
      ],
      related: [{ seq: 4109, label: 'You rejected OB-2026-0410 (same list): "Margin on 40s combed falls below 6%; recheck with sales before changing."', outcome: 'committed' }] },
    { id: 'OB-2026-0422', wt: 'erp.journal_entry.submit', proposal: 'Post journal entry · Freight provision Sep', amount: 135000, by: { name: 'Priya Nair', kind: 'person', level: 'A2' }, passed: 6, total: 6, exp: 140, waiting: ['venkat-raman'], set: 'ar-approvers', quorum: 1, policy: 11, rung: 6,
      why: 'the amount is above ₹1,00,000, so a second named person must approve (dual control).', esc: 4082, writeId: 'w_6f0e2d71', record: 'ACC-JV-2026-00412',
      gateWords: { G9: 'The period September 2026 is open; accounts exist and are not frozen.', G8: 'Inside the declared posting window (period open).', G4: 'Above ₹1,00,000, so a second named person is required: you.' },
      diff: [
        { field: 'Freight Inward - KSM', before: '', after: 'Dr ₹1,35,000', mono: true, material: true },
        { field: 'Accrued Expenses - KSM', before: '', after: 'Cr ₹1,35,000 · Sai Logistics', mono: true, material: true },
        { field: 'Posting date', before: '', after: '30 Sep 2026' },
        { field: 'Remark', before: '', after: 'Freight provision for September; invoices pending.' }
      ] },
    { id: 'OB-2026-0423', wt: 'erp.stock_entry.submit', proposal: 'Move stock · 1,200 kg cotton to Mill 2', amount: null, radius: 'One record', by: { name: 'stock-agent', kind: 'agent', level: 'A4' }, passed: 6, total: 6, exp: 44, waiting: ['priya-nair'], set: 'stores approvers (WhatsApp reply allowed)', quorum: 1, policy: 11, rung: 4,
      why: 'evaluate() returned escalate at policy version 11: rule R-ST-04 sends any transfer over 1,000 kg to a person, even though stock-agent is at A4 Act bounded.', esc: 4081, writeId: 'w_08bd5e44', record: 'STE-2026-02231', cp: null,
      gateWords: { G9: 'Mill 1 bin holds 4,800 kg; after transfer 3,600 kg, above the 2,000 kg reorder level.', G5: '6 of 30 transfers declared per day.' },
      diff: [
        { field: 'Stock entry', before: 'Draft', after: 'Submitted', material: true },
        { field: 'Cotton bales · Mill 1', before: '4,800 kg', after: '3,600 kg', mono: true, material: true },
        { field: 'Cotton bales · Mill 2', before: '900 kg', after: '2,100 kg', mono: true },
        { field: 'Transfer', before: '', after: '1,200 kg · 7 bales' }
      ] },
    { id: 'OB-2026-0424', wt: 'platform.declaration.certify', proposal: 'Certify declaration erp.ar v8', amount: null, radius: 'Whole tenant', by: { name: 'Farah Sheikh', kind: 'person', level: '—' }, passed: 1, total: 1, exp: 1390, waiting: ['arjun-mehta'], set: 'certifiers', quorum: 1, policy: 11, rung: 6,
      why: 'certification is dual control by declaration: the author cannot certify her own version, so a named certifier decides.', esc: 4080, writeId: 'w_b31e77a0', record: 'erp.ar v8', cp: null, decl: 'platform', v: 3,
      gateWords: { G4: 'Farah Sheikh wrote v8; Arjun Mehta, a different named person, must certify.' },
      diff: [
        { field: 'Version', before: 'v7 (in force)', after: 'v8', material: true, mono: true },
        { field: 'Write types', before: '9', after: '10', mono: true },
        { field: 'Added', before: '', after: 'erp.sales_invoice.cancel (irreversible)', material: true },
        { field: 'Lint', before: '', after: 'LN-07 resolved by ADR-0142' },
        { field: 'Compiled digest', before: '7e41…d80f', after: '3b9e…c41d', mono: true }
      ] },
    { id: 'OB-2026-0425', wt: 'platform.autonomy.grant', proposal: 'Raise autonomy · bank-recon-agent · erp.payment_entry.submit A3 → A4', amount: null, radius: 'One record', by: { name: 'Rekha Subramanian', kind: 'person', level: 'A2' }, passed: 5, total: 5, exp: 210, waiting: ['meenakshi-iyer'], set: 'owner', quorum: 1, policy: 11, rung: 6,
      why: 'raising a grant is itself a governed write with dual control; a person who is not the proposer decides.', esc: 4079, writeId: 'w_e18d09b2', record: 'Grant · bank-recon-agent', cp: null, decl: 'platform', v: 3,
      gateWords: { G9: 'Record payment has a reversal plan (snapshot restore, 30 days); 906 committed and 14 refused this month.', G4: 'Rekha Subramanian proposed this; Meenakshi Iyer must decide.' },
      diff: [
        { field: 'Autonomy grant', before: 'A3 Act reversible', after: 'A4 Act bounded', material: true },
        { field: 'Declared blast radius ceiling', before: 'One counterparty', after: 'One counterparty' },
        { field: 'Budget per day', before: '—', after: '₹10,00,000', mono: true, material: true },
        { field: 'Review due', before: '', after: '23 Mar 2027 (180 days)' }
      ] }
  ];
  /* Resolved and expired (spec §4.5 tail + F4) — for history and resolved views */
  var HIST = [
    { id: 'OB-2026-0413', wt: 'erp.sales_invoice.cancel', proposal: 'Cancel invoice INV-2026-0834 · Shree Murugan Traders', amount: 200000, by: { name: 'Collections Agent', kind: 'agent' }, status: 'approved', decidedBy: 'Ravi Shankar', channel: 'Voice', at: '15:19 IST', seq: 4104, commit: 4105, esc: 4103, note: 'Recording ref VR-2026-09-24-0192' },
    { id: 'OB-2026-0410', wt: 'erp.price_list.update', proposal: 'Update price list · Yarn 40s combed · 38 items', amount: null, by: { name: 'Invoice Agent', kind: 'agent' }, status: 'declined', decidedBy: 'Venkat Raman', channel: 'Web', at: '15:25 IST', seq: 4109, reason: 'Margin on 40s combed falls below 6%; recheck with sales before changing.' },
    { id: 'OB-2026-0409', wt: 'erp.purchase_order.submit', proposal: 'Submit purchase order PO-2026-00318 · Coimbatore Castings Pvt Ltd', amount: 620000, by: { name: 'ap-agent', kind: 'agent' }, status: 'approved', decidedBy: 'Venkat Raman', channel: 'Web', at: '11:21 IST', seq: 4094, commit: 4095, esc: 4093 },
    { id: 'OB-2026-0408', wt: 'erp.stock_entry.submit', proposal: 'Move stock · STE-2026-02214 · 800 kg to Mill 2', amount: null, by: { name: 'stock-agent', kind: 'agent' }, status: 'approved-not-done', decidedBy: 'Venkat Raman', channel: 'Web', at: '15:28 IST', seq: 4112, note: 'GATE.SANDBOX_DIVERGED — snapshot restored' },
    { id: 'OB-2026-0405', wt: 'erp.journal_entry.submit', proposal: 'Post journal entry · JV provision (close-agent draft)', amount: 185000, by: { name: 'close-agent', kind: 'agent' }, status: 'expired', decidedBy: null, channel: '—', at: '15:26 IST', seq: 4110 }
  ];

  /* Today's chain (spec §4.6). digests shortened as in the spec. */
  var CHAIN = [
    [4090, '10:02', 'erp.supplier.create', 'Priya Nair', 'person', 'A3', 'committed', '', 'Coimbatore Castings Pvt Ltd (33AAECC9120B1Z4)', '1 per record'],
    [4091, '10:19', 'erp.purchase_invoice.submit', 'ap-agent', 'agent', 'A3', 'committed', '', 'ACC-PINV-2026-00541 · ₹1,86,440', '1 per counterparty'],
    [4092, '10:44', 'erp.sales_invoice.submit', 'Invoice Agent', 'agent', 'A1', 'refused', 'GATE.COUNTERPARTY_UNKNOWN', 'Shree Ganesh Handlooms (unregistered)', '0'],
    [4093, '11:03', 'erp.purchase_order.submit', 'ap-agent', 'agent', 'A2', 'escalated', 'OB-2026-0409', 'PO-2026-00318 · ₹6,20,000', '0'],
    [4094, '11:21', 'platform.obligation.resolve', 'Venkat Raman', 'person', '—', 'committed', 'approve · OB-2026-0409', '—', '1 per record'],
    [4095, '11:21', 'erp.purchase_order.submit', 'ap-agent', 'agent', 'A2', 'committed', 'resubmission', 'PO-2026-00318', '1 per counterparty'],
    [4096, '11:40', 'platform.obligation.resolve', 'Ravi Shankar', 'person', '—', 'refused', 'GATE.DUAL_CONTROL_SAME_ACTOR', 'OB-2026-0418', '0'],
    [4097, '11:42', 'erp.payment_entry.submit', 'Rekha Subramanian', 'person', 'A4', 'committed', '', 'PE-2026-00972 · ACME Textiles · ₹1,12,500', '1 per counterparty'],
    [4098, '14:07', 'erp.sales_invoice.submit', 'ar-agent', 'agent', 'A3', 'refused', 'GATE.PRECONDITION_FAILED', 'ACME Textiles · ₹4,20,000', '0'],
    [4099, '14:16', 'erp.sales_invoice.submit', 'ar-agent', 'agent', 'A2', 'escalated', 'OB-2026-0412', 'ACME Textiles · ₹2,40,000', '0'],
    [4100, '15:02', 'platform.obligation.resolve', 'Venkat Raman', 'person', '—', 'committed', 'approve · OB-2026-0412', '—', '1 per record'],
    [4101, '15:02', 'erp.sales_invoice.submit', 'ar-agent', 'agent', 'A2', 'committed', 'IRN requested', 'SINV-2026-01187 · ₹2,40,000', '1 per counterparty'],
    [4102, '15:10', 'erp.payment_entry.submit', 'bank-recon-agent', 'agent', 'A3', 'refused', 'PLATFORM.TARGET_UNREACHABLE', 'UTR 426817 · ₹75,000', '0 (not billable)'],
    [4103, '15:12', 'erp.sales_invoice.cancel', 'Collections Agent', 'agent', 'A2', 'escalated', 'OB-2026-0413', 'INV-2026-0834 · ₹2,00,000', '0'],
    [4104, '15:19', 'platform.obligation.resolve', 'Ravi Shankar', 'person', '—', 'committed', 'approve · Voice', 'OB-2026-0413', '1 per record'],
    [4105, '15:19', 'erp.sales_invoice.cancel', 'Collections Agent', 'agent', 'A2', 'committed', 'irreversible', 'INV-2026-0834', '1 per counterparty'],
    [4106, '15:21', 'erp.supplier.create', 'vendor-onboarding agent', 'agent', 'A0', 'refused', 'POLICY.AUTONOMY_INSUFFICIENT', 'Palani Dyes & Chemicals', '0'],
    [4107, '15:22', 'erp.credit_limit.change', 'Rekha Subramanian', 'person', 'A2', 'escalated', 'OB-2026-0414', 'ACME Textiles', '0'],
    [4108, '15:24', 'erp.sales_invoice.submit', 'rung1 drafting agent', 'agent', 'A2', 'refused', 'GATE.BUDGET_EXHAUSTED', 'Lakshmi Garments', '0'],
    [4109, '15:25', 'platform.obligation.resolve', 'Venkat Raman', 'person', '—', 'committed', 'reject · OB-2026-0410', 'price list update', '1 per record'],
    [4110, '15:26', 'erp.journal_entry.submit', 'close-agent', 'agent', 'A1', 'refused', 'POLICY.OBLIGATION_EXPIRED', 'JV provision', '0'],
    [4111, '15:27', 'erp.payment_run.submit', 'ap-agent', 'agent', 'A2', 'escalated', 'OB-2026-0411', '14 suppliers · ₹18,42,760', '0'],
    [4112, '15:28', 'erp.stock_entry.submit', 'stock-agent', 'agent', 'A4', 'refused', 'GATE.SANDBOX_DIVERGED', 'STE-2026-02214', '0']
  ].map(function (r) { return { seq: r[0], t: r[1], wt: r[2], actor: r[3], kind: r[4], lvl: r[5], outcome: r[6], code: r[7], obj: r[8], meter: r[9] }; });
  var DIGESTS = { 4089: '71e0…c2d9', 4090: 'a3f9…5e2b', 4091: '0c7d…91fa', 4092: '5b12…e804', 4093: 'e9aa…1370', 4094: '2f64…a0cb', 4095: '8d3e…77c1', 4096: 'c150…4b9e', 4097: '64ab…d2f0', 4098: '1e9c…83a5', 4099: 'b7f2…0e61', 4100: '4c08…f93d', 4101: '9a51…2c7e', 4102: 'd6e3…1b48', 4103: '7702…ae19', 4104: '3fb0…6c55', 4105: 'e18d…09b2', 4106: '5a7c…d3e0', 4107: '0bd4…71f8', 4108: 'c9e1…4a02', 4109: '62f7…b8d9', 4110: '18ac…e57d', 4111: 'f04b…2d96', 4112: 'a8e2…07c3' };
  function chainEntry(seq) { seq = Number(seq); for (var i = 0; i < CHAIN.length; i++) if (CHAIN[i].seq === seq) return CHAIN[i]; return null; }

  E1.data.work = { obligations: OB, history: HIST, chain: CHAIN, writeTypes: WT, agents: AGENTS };

  /* Refusals that need an action (spec §4.6–4.7, F4, F5, F12). Keyed by proof seq. */
  var NOTDONE = {
    4112: { code: 'GATE.SANDBOX_DIVERGED', cls: 'gate', rung: '3 (raised at 7)', gate: 'G9', title: 'Not done — the check on your live books disagreed', short: 'the check on your live books disagreed', wt: 'erp.stock_entry.submit', tried: 'Move stock · STE-2026-02214 · 800 kg cotton to Mill 2', by: { name: 'stock-agent', kind: 'agent', level: 'A4' }, at: '24 Sep 2026, 15:28 IST', decl: 'erp.stock v3',
      rule: 'A write reaches live books only if the gates give the same answer on live as they gave in the shadow sandbox.', numbers: [['Mill 1 bin in the shadow sandbox', '4,800 kg'], ['Mill 1 bin on live, 2 s later', '3,650 kg']],
      operator: 'Snapshot restored. Investigate before resubmitting.', actions: [{ label: 'View both results', href: '#/work/not-done/4112', scroll: 'w-both', icon: 'rows' }, { label: 'Open the record', href: '#/records/object/STE-2026-02214', kind: 'secondary', icon: 'records' }],
      approvedBy: 'Venkat Raman', obligation: 'OB-2026-0408', failed: 'G9', both: [['Precondition: Mill 1 bin ≥ transfer + 2,000 kg reorder level', '4,800 ≥ 2,800 · passed', '3,650 ≥ 2,800 · passed, but the quantity changed'], ['Bin quantity read', '4,800 kg', '3,650 kg (a manual issue of 1,150 kg at 15:27)'], ['Bytes to write', 'Stock entry v1, 800 kg', 'Not written — snapshot restored']] },
    4110: { code: 'POLICY.OBLIGATION_EXPIRED', cls: 'policy', rung: '6', title: 'Not done — nobody decided in time', short: 'nobody decided in time', wt: 'erp.journal_entry.submit', tried: 'Post journal entry · JV provision · ₹1,85,000', by: { name: 'close-agent', kind: 'agent', level: 'A1' }, at: '24 Sep 2026, 15:26 IST', decl: 'erp.ar v7',
      rule: 'An escalated write waits for a named person until its declared expiry; after that it is refused, and the lapse is itself recorded.', numbers: [['Declared expiry', '4 h'], ['Decided by', 'Nobody (OB-2026-0405)']],
      operator: 'Resubmit; expiry is itself a recorded governed event.', actions: [{ label: 'Resubmit', href: '#/work/request/erp.journal_entry.submit?from=4110', icon: 'refresh' }] },
    4108: { code: 'GATE.BUDGET_EXHAUSTED', cls: 'gate', rung: '3', gate: 'G6', title: 'Not done — budget used up for this period', short: 'budget used up for this period', wt: 'erp.sales_invoice.submit', tried: 'Submit invoice · Lakshmi Garments (draft)', by: { name: 'rung1 drafting agent', kind: 'agent', level: 'A2' }, at: '24 Sep 2026, 15:24 IST', decl: 'sales_invoice v4',
      rule: 'rung1 drafting agent may draft up to the declared number of invoices each month.', numbers: [['Declared budget for September', '250 drafts'], ['Used before this draft', '250 drafts']],
      operator: 'Raise the budget; never truncate silently.', actions: [{ label: 'Raise the budget in Studio', href: '#/records/studio/sales_invoice', icon: 'edit' }], failed: 'G6' },
    4106: { code: 'POLICY.AUTONOMY_INSUFFICIENT', cls: 'policy', rung: '6', title: 'Not done — autonomy too low', short: 'autonomy too low', wt: 'erp.supplier.create', tried: 'Add supplier · Palani Dyes & Chemicals', by: { name: 'vendor-onboarding agent', kind: 'agent', level: null }, at: '24 Sep 2026, 15:21 IST', decl: 'erp.ap v5',
      rule: 'vendor-onboarding agent has no grant for Add supplier, so it is at A0 Observe (no grant). Add supplier needs A2 Propose.', numbers: [['Grant held', 'A0 Observe (no grant)'], ['Grant this write type needs', 'A2 Propose']],
      operator: 'Raise the grant — itself a governed write — or route to approval.', actions: [{ label: 'Request a grant change', href: '#/work/request/platform.autonomy.grant?actor=vendor-onboarding%20agent&wt=erp.supplier.create', icon: 'agents' }, { label: 'Route to approval', href: '#/work/request/erp.supplier.create?name=Palani%20Dyes%20%26%20Chemicals', kind: 'secondary' }] },
    4102: { code: 'PLATFORM.TARGET_UNREACHABLE', cls: 'platform', rung: '7', title: 'Our failure — ERPNext did not answer', short: 'ERPNext did not answer', wt: 'erp.payment_entry.submit', tried: 'Record payment · UTR 426817 · ₹75,000', by: { name: 'bank-recon-agent', kind: 'agent', level: 'A3' }, at: '24 Sep 2026, 15:10 IST', decl: 'erp.ar v7',
      rule: 'This is our failure, not a rule. Nothing was changed, you have not been billed, and we have been paged.', numbers: [['Shadow sandbox', 'Applied and re-checked'], ['Live ERPNext', 'No answer in 1,200 ms, 3 tries']],
      operator: 'Page. Nothing was applied.', actions: [{ label: 'Try again (same request)', action: 'w-retry', icon: 'refresh' }, { label: 'See the incident', href: '#/assurance/incidents', kind: 'secondary' }] },
    4098: { code: 'GATE.PRECONDITION_FAILED', cls: 'gate', rung: '3', gate: 'G9', title: 'Not done — credit limit', short: 'credit limit', wt: 'erp.sales_invoice.submit', tried: 'Submit invoice · ACME Textiles · ₹4,20,000', by: { name: 'ar-agent', kind: 'agent', level: 'A3' }, at: '24 Sep 2026, 14:07 IST', decl: 'erp.ar v7',
      rule: 'An invoice may not take a customer above their credit limit.', numbers: [['Limit', '₹3,00,000'], ['Exposure after this invoice', '₹4,20,000']],
      operator: 'Fix the record state.', actions: [{ label: 'Request a limit change', href: '#/work/request/erp.credit_limit.change?customer=ACME%20Textiles', icon: 'edit', note: 'itself a governed write' }, { label: 'Reduce the invoice', href: '#/work/request/erp.sales_invoice.submit?from=4098', kind: 'secondary' }], failed: 'G9' },
    4092: { code: 'GATE.COUNTERPARTY_UNKNOWN', cls: 'gate', rung: '3', gate: 'G7', title: 'Not done — counterparty not registered', short: 'counterparty not registered', wt: 'erp.sales_invoice.submit', tried: 'Submit invoice · Shree Ganesh Handlooms', by: { name: 'Invoice Agent', kind: 'agent', level: 'A1' }, at: '24 Sep 2026, 10:44 IST', decl: 'erp.ar v7',
      rule: 'Shree Ganesh Handlooms is not a registered customer with a validated GSTIN.', numbers: [['Customer master', 'No record'], ['GSTIN validated', 'No']],
      operator: 'Register it.', actions: [{ label: 'Register the customer', href: '#/work/request/erp.customer.create?name=Shree%20Ganesh%20Handlooms', icon: 'plus', note: 'Add customer is itself a governed write' }], failed: 'G7' }
  };
  var NOTDONE_ORDER = [4112, 4110, 4108, 4106, 4102, 4098, 4092];

  /* Reviews (elan1 operator queues + tenant reviews). Phase 4 / L3 items are labelled as previews. */
  var REVIEWS = [
    { id: 'PR-0047', type: 'production', title: 'Production access · LedgerLoop Software Pvt Ltd', applicant: 'Aditya Kulkarni (CTO, LedgerLoop)', subject: 'll.billing v3 · 7 write types', requested: '23 Sep 2026, 17:40 IST', due: '25 Sep 2026', status: 'In review', conformance: '14 of 14', reviewer: 'Kavya Menon' },
    { id: 'PR-0046', type: 'production', title: 'Production access · Sahyadri Agro Foods LLP', applicant: 'Sahyadri Agro Foods LLP (onboarding)', subject: 'erp.ar v1 (uncertified draft)', requested: '22 Sep 2026, 11:05 IST', due: '24 Sep 2026', status: 'In review', conformance: '12 of 14', reviewer: 'Kavya Menon' },
    { id: 'PM-0002', type: 'promotion', title: 'Promotion to Enforced · LedgerLoop billing agent · ll.invoice.post', applicant: 'LedgerLoop Software Pvt Ltd', subject: 'Attested advisory → Enforced', requested: '20 Sep 2026, 12:00 IST', due: '—', status: 'Not yet eligible', conformance: '—', reviewer: 'Kavya Menon' },
    { id: 'GA-2028-0412', type: 'graduation', title: 'Graduation A2 → A3 · sales_invoice.submit · agent · one_counterparty', applicant: 'Meenakshi Iyer (Owner)', subject: 'ar-agent’s action class', requested: 'Phase 4 preview', due: '—', status: 'Preview · Phase 4', conformance: '—', reviewer: 'Venkat Raman' },
    { id: 'RA-2028-8902', type: 'receipt', title: 'Accept receipt 41,288 from ar-org:suryaauto.example', applicant: 'Surya Auto Parts (issuer)', subject: 'receipt.accept · Crosses an organisation boundary', requested: 'L3 preview', due: '—', status: 'Preview · L3', conformance: '—', reviewer: 'Venkat Raman + Meenakshi Iyer' }
  ];
  var REVIEW_TYPES = { production: 'Production access', promotion: 'Promotion review', graduation: 'Graduation review', receipt: 'Receipt acceptance' };

  /* Statutory and window dates (sample; confirm filing dates with your CA). */
  var CAL = [
    { date: '2026-09-25', time: '15:02', kind: 'window', title: 'IRN cancel window closes · SINV-2026-01187', sub: 'After 15:02 the only reversal is a credit note (proof #4,101).', href: '#/work/reverse/4101' },
    { date: '2026-09-28', kind: 'statutory', title: 'MSME payment due · Tiruppur Knit Processors', sub: 'ACC-PINV-2026-00498 · ₹3,42,000 · accepted 14 Aug 2026 · 45 days (MSMED Act, s. 15; Income-tax Act s. 43B(h)).', cover: 'OB-2026-0411', href: '#/work/decide/OB-2026-0411' },
    { date: '2026-10-06', kind: 'statutory', title: 'MSME payment due · Erode Bobbins & Cones', sub: 'ACC-PINV-2026-00512 · ₹64,800 · accepted 22 Aug 2026 · 45 days.', cover: 'OB-2026-0411', href: '#/work/decide/OB-2026-0411' },
    { date: '2026-10-07', kind: 'statutory', title: 'TDS deposit for September', sub: 'Challan 281 · needs a Record payment write by a person (bank-recon-agent is A3 on receipts only).', href: '#/work/request/erp.payment_entry.submit' },
    { date: '2026-10-11', kind: 'statutory', title: 'GSTR-1 for September 2026 due', sub: 'gst-agent drafts at A1; File GSTR-1 is irreversible and crosses an organisation boundary, so Meenakshi Iyer approves.', href: '#/records/write-types/erp.gstr1.file' },
    { date: '2026-10-17', kind: 'statutory', title: 'MSME payment due · Salem Packaging Works', sub: 'ACC-PINV-2026-00527 · ₹1,28,500 · accepted 2 Sep 2026 · not yet in any payment run.', href: '#/work/request/erp.payment_run.submit' },
    { date: '2026-10-20', kind: 'statutory', title: 'GSTR-3B for September 2026 due', sub: 'Tax payment and return; the payment leg is a governed write.', href: '#/records/write-types/erp.gstr1.file' },
    { date: '2026-10-24', time: '11:42', kind: 'window', title: 'Undo window closes · PE-2026-00972', sub: 'Record payment by Rekha Subramanian (proof #4,097). After this, reversal is a compensating entry.', href: '#/work/reverse/4097' },
    { date: '2026-10-24', time: '15:02', kind: 'window', title: 'Credit-note path closes · SINV-2026-01187', sub: '30-day window for the forward path on proof #4,101.', href: '#/work/reverse/4101' },
    { date: '2026-11-08', kind: 'statutory', title: 'MSME payment due · Coimbatore Castings Pvt Ltd', sub: 'ACC-PINV-2026-00541 · ₹1,86,440 · booked 24 Sep 2026 (proof #4,091) · 45 days.', cover: 'OB-2026-0411', href: '#/work/decide/OB-2026-0411' },
    { date: '2026-12-01', kind: 'window', title: 'Rotate production key sk_live_…9c1e', sub: 'ar-agent’s key; turns warning 14 days before.', href: '#/agents/keys/key-prod-01' }
  ];

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */
  function q2(query, patch) { var o = {}; var k; for (k in query) o[k] = query[k]; for (k in patch) o[k] = patch[k]; return o; }
  function isMine(ob) { return (ob.waiting || []).indexOf(USER.id) >= 0; }
  function names(ids) { return (ids || []).map(function (i) { return person(i).name; }); }
  function waitingText(ob) {
    var n = names(ob.waiting);
    if (ob.quorum > 1) return n.join(' + ') + ' (both)';
    return n.join(' or ');
  }
  function amountRadius(ob) {
    if (ob.amount) return c.amount(ob.amount) + (ob.radius && ob.radius !== 'Irreversible' ? '<div class="w-prop__s">' + esc(ob.radius) + '</div>' : (ob.radius === 'Irreversible' ? '<div class="w-prop__s">Irreversible</div>' : ''));
    return '<span>' + esc(ob.radius || c.BLAST[wt(ob.wt).blast - 1][1]) + '</span>';
  }
  function amountRadiusText(ob) { return ob.amount ? fmt.inr(ob.amount) + (ob.radius ? ' · ' + ob.radius : '') : (ob.radius || c.BLAST[wt(ob.wt).blast - 1][1]); }
  function hasDual(ob) { return wt(ob.wt).gates.indexOf('G4') >= 0 && ob.rung !== 4; }
  function gateDotList(ob) { return gateRows(ob).map(function (g) { return g.result === 'pending' ? 'waiting' : g.result; }); }
  function checksBadge(ob, withDual) {
    var h = '<span class="w-checks">' + c.gateDots(gateDotList(ob)) + '<span class="e1-mono">' + ob.passed + ' of ' + ob.total + ' passed</span></span>';
    if (withDual && hasDual(ob)) h += '<div class="w-prop__s">Dual control: ' + (isMine(ob) ? 'you' : ob.quorum > 1 ? '2 people' : '1 person') + '</div>';
    return h;
  }
  function deadline(ob) { return E1.ahead(ob.exp); }
  function declOf(ob) { var w = wt(ob.wt); return (ob.decl || w.decl) + ' v' + (ob.v || w.v); }
  function declId(ob) { return ob.decl || wt(ob.wt).decl; }

  function synthOb(id) {
    var n = Number(String(id).replace(/\D/g, '').slice(-3)) || 7;
    var cps = ['Lakshmi Garments', 'Sri Venkateswara Fabrics', 'Annapoorna Textiles', 'Bhavani Weaves'];
    var cp = cps[n % cps.length], amt = 60000 + (n * 7919 % 180) * 1000;
    return { id: id, wt: 'erp.sales_invoice.submit', proposal: 'Submit invoice SINV-2026-01' + (200 + n % 90) + ' · ' + cp, cp: cp, amount: amt, by: { name: 'ar-agent', kind: 'agent', level: 'A2' }, passed: 5, total: 5, exp: 60 + (n * 37) % 180, waiting: ['venkat-raman'], set: 'ar-approvers', quorum: 1, policy: 11, rung: 6,
      why: 'the proposing agent is at A2 Propose; a person approves before anything is written.', esc: null, writeId: 'w_' + slug(id).replace(/[^a-z0-9]/g, '').slice(-8), record: 'SINV-2026-01' + (200 + n % 90), synthetic: true,
      gateWords: { G9: 'Credit limit ₹3,00,000, exposure after this write ' + fmt.inr(amt) + '.' },
      diff: [{ field: 'Invoice status', before: 'Draft', after: 'Submitted', material: true }, { field: 'Customer', before: cp, after: cp }, { field: 'Grand total', before: fmt.inr(amt), after: fmt.inr(amt), mono: true }, { field: 'Due date', before: '', after: '24 Oct 2026' }] };
  }
  var EXTRA = [
    { id: 'OB-2026-0426', wt: 'platform.tenant.stop', proposal: 'Stop tenant · Kaveri Spinning Mills Pvt Ltd · suspected credential exposure', amount: null, radius: 'Whole tenant', by: { name: 'Venkat Raman', kind: 'person', level: '—' }, passed: 1, total: 1, exp: 58, waiting: ['meenakshi-iyer'], set: 'owner', quorum: 1, policy: 11, rung: 6,
      why: 'stopping a tenant is dual control by declaration: the person who asks cannot also decide.', esc: 4113, writeId: 'w_stop0427', record: null, decl: 'platform', v: 3, raised: 'just now',
      gateWords: { G4: 'Venkat Raman asked; Meenakshi Iyer, a different named person, must decide.' },
      diff: [{ field: 'Tenant status', before: 'Live', after: 'Stopped', material: true }, { field: 'Cause class', before: '', after: 'Suspected credential exposure' }, { field: 'Writes accepted', before: 'Every declared write type', after: 'None (rung 0b refuses)', material: true }, { field: 'Open approvals', before: '14 open', after: '14 frozen, expiry paused' }, { field: 'Reads, verify and exports', before: 'On', after: 'On' }] }
  ];
  function findOb(id) {
    var all = OB.concat(EXTRA);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function findHist(id) { for (var i = 0; i < HIST.length; i++) if (HIST[i].id === id) return HIST[i]; return null; }

  /* Gate rows for an obligation: every declared gate, in declared order; G4 is "waiting" on the first pass. */
  function gateRows(ob) {
    var w = wt(ob.wt), ver = declOf(ob);
    return w.gates.map(function (g) {
      var pending = g === 'G4' && ob.rung !== 4;
      var name = (ob.gateNames && ob.gateNames[g]) || (g === 'G7' && ob.cp ? 'Counterparty (' + ob.cp + ', known)' : GATE_NAME[g]);
      return { id: g, name: name, result: pending ? 'pending' : 'passed', words: (ob.gateWords && ob.gateWords[g]) || gateWords(g, ob), version: ver };
    });
  }
  /* rung1 "What we tested" cells above the full, worded gate list */
  function checksBlock(rows, o) {
    return c.gateCells(rows.map(function (g) { return { id: g.id, name: GATE_NAME[g.id] || g.name, result: g.result === 'pending' ? 'waiting' : g.result }; }), { title: 'What we tested', suite: (o && o.version) || '', min: 120 }) +
      '<div style="margin-top:var(--space-3)">' + gatesHtml(rows, o) + '</div>';
  }
  function gatesHtml(rows, o) {
    o = o || {};
    var MAP = { passed: ['good', 'check', 'passed'], failed: ['critical', 'x', 'failed'], skipped: ['neutral', 'skip', 'skipped'], not_run: ['neutral', 'minus', 'not run'], pending: ['info', 'gate', o.pendingWord || 'waiting for you'] };
    var counted = rows.filter(function (g) { return g.result !== 'pending'; });
    var passed = counted.filter(function (g) { return g.result === 'passed'; }).length;
    var failed = counted.filter(function (g) { return g.result === 'failed'; }).length;
    var pend = rows.filter(function (g) { return g.result === 'pending'; });
    return '<div class="e1-gates">' +
      '<div class="e1-gates__sum"><strong>' + passed + ' of ' + counted.length + ' passed</strong>' + (failed ? ' · <span class="e1-tone--critical">' + failed + ' failed</span>' : '') +
      (pend.length ? ' · <span class="e1-tone--info">dual control: ' + esc(MAP.pending[2]) + '</span>' : '') + (o.version ? ' · <span class="e1-mono">' + esc(o.version) + '</span>' : '') + '</div>' +
      '<ol class="e1-gates__list" role="list">' + rows.map(function (g) {
        var m = MAP[g.result] || MAP.not_run;
        return '<li class="e1-gate e1-gate--' + (g.result === 'pending' ? 'not_run' : esc(g.result)) + '"><span class="e1-gate__icon e1-tone--' + m[0] + '">' + c.icon(m[1], 14) + '</span>' +
          '<span class="e1-gate__id e1-mono">' + esc(g.id) + '</span><span class="e1-gate__main"><span class="e1-gate__name">' + esc(g.name) + ' — <span class="e1-tone--' + m[0] + '">' + esc(m[2]) + '.</span></span>' +
          (g.words ? '<span class="e1-gate__words">' + esc(g.words) + '</span>' : '') + '</span>' +
          (g.version ? '<span class="e1-gate__ver e1-mono">' + esc(g.version) + '</span>' : '') + '</li>';
      }).join('') + '</ol></div>';
  }

  /* The nine-rung mini ladder with 0b drawn as a gate-house before rung 1 (atlas Fig. 6, spec §7.29). */
  function ladder(o) {
    o = o || {};
    var stop = o.stopped;
    var zero = '<div class="w-ladder__0b' + (stop ? ' is-failed' : '') + '"><b>' + (stop ? c.icon('x', 12) : '0b') + '</b><em>0b · Stop</em><span>' + (stop ? 'Refused' : 'Passed') + '</span></div>';
    var body = stop ? '<div class="w-note" style="padding-top:4px">Rungs 1–9 not reached. A stopped workspace writes nothing, including this refusal.</div>' : c.rungs({ outcome: o.outcome || 'escalated', at: o.at, compact: true });
    return '<div class="w-ladder" role="group" aria-label="Right Path: 0b and nine rungs">' + zero + '<div>' + body + '</div></div>' + (o.caption ? '<p class="w-ladder__cap">' + o.caption + '</p>' : '');
  }

  function sibTabs(id) {
    var it = E1.navItem('work', id); if (!it || !it.group) return '';
    var list = E1.nav.work.items.filter(function (x) { return x.group === it.group; });
    return list.length > 1 ? c.tabs(list.map(function (x) { return { id: x.id, label: x.label, href: x.href, count: x.count }; }), id, { label: it.group }) : '';
  }
  function sec(title, body, o) {
    o = o || {};
    var id = o.id || ('w-' + slug(title));
    return '<section class="w-sec" id="' + esc(id) + '" aria-labelledby="' + esc(id) + '-h"><div class="w-sec__head"><h2 class="w-sec__title" id="' + esc(id) + '-h">' + esc(title) + '</h2>' + (o.aside ? '<span class="w-sec__aside">' + o.aside + '</span>' : '') + '</div>' +
      (o.lead ? '<p class="w-sec__lead">' + esc(o.lead) + '</p>' : '') + body + '</section>';
  }
  function banner(kind, title, body, action) {
    var ic = { serious: 'stop', info: 'info', warning: 'clock' }[kind] || 'alert';
    return '<div class="w-banner w-banner--' + kind + '" role="status"><span class="w-banner__icon e1-tone--' + kind + '">' + c.icon(ic, 18) + '</span><div><div class="w-banner__t">' + esc(title) + '</div>' + (body ? '<div class="w-banner__b">' + esc(body) + '</div>' : '') + '</div>' +
      (action ? c.button(action.label, { href: action.href, size: 'sm', kind: 'secondary' }) : '') + '</div>';
  }
  function stoppedBanner() { return banner('serious', 'This workspace is stopped (suspected credential exposure) since 24 Sep 2026, 16:05 IST, by Meenakshi Iyer with Arjun Mehta.', 'No writes, including refusals, are being recorded. Pending approvals are frozen and their expiry is paused.', { label: 'View stop event', href: '#/records/tenants/kaveri-spinning' }); }
  function incidentBanner() { return banner('warning', 'We have a platform problem. Nothing is being approved or written without you, and approval deadlines are paused.', 'ERPNext writes are failing at rung 7 for this tenant (PLATFORM.TARGET_UNREACHABLE). Refusals meter at zero.', { label: 'Status', href: '#/status' }); }
  function statesMenu(path, query, items) {
    return c.menu({ label: 'View states', icon: 'eye', align: 'right', items: [{ label: 'Default', href: E1.href(path, q2(query, { state: '' })), checked: !query.state }].concat(items.map(function (s) { return { label: s[1], href: E1.href(path, q2(query, { state: s[0] })), checked: query.state === s[0], note: s[2] }; })) });
  }
  function result(kind, icon, title, body, actions, meta, live) {
    return '<div class="w-result w-result--' + kind + '" role="' + (kind === 'critical' ? 'alert' : 'status') + '" tabindex="-1" id="w-result"><span class="w-result__icon">' + c.icon(icon, 18) + '</span><div>' +
      '<p class="w-result__t">' + esc(title) + '</p>' + (body ? '<div class="w-result__b">' + body + '</div>' : '') +
      (actions ? '<div class="w-result__acts">' + actions + '</div>' : '') + (meta ? '<p class="w-result__meta">' + meta + '</p>' : '') +
      (live ? '<span class="e1-sr" aria-live="polite">' + esc(live) + '</span>' : '') + '</div></div>';
  }
  function seqChip(seq, label, outcome) {
    return '<a class="w-seq" href="' + proofHref(seq) + '">' + c.outcome(outcome || 'committed', { subtle: true }) + '<code>' + seqTxt(seq) + '</code>' + (label ? '<span>' + esc(label) + '</span>' : '') + '</a>';
  }
  function seqTrail(list) { return '<div class="w-seqs">' + list.map(function (x, i) { return (i ? '<span class="w-seqs__arrow" aria-hidden="true">' + c.icon('arrow-right', 14) + '</span>' : '') + seqChip(x[0], x[1], x[2]); }).join('') + '</div>'; }
  function pauseBtn() { return '<button type="button" class="e1-btn e1-btn--ghost e1-btn--sm w-pausebtn" data-action="w-pause" aria-pressed="false">' + c.icon('pause', 14) + '<span>Pause timers</span></button>'; }
  function keysLegend(split) {
    return '<div class="w-keys" aria-label="Keyboard shortcuts"><span>' + c.kbd('J') + c.kbd('K') + ' move</span><span>' + c.kbd('Enter') + ' open</span><span>' + c.kbd('A') + (split ? ' approve the previewed item' : ' open, ready to approve') + '</span><span>' + c.kbd('R') + (split ? ' reject the previewed item' : ' open, ready to reject') + '</span></div>';
  }
  function reversibleChip(w) { return w.rev === false ? c.reversible(false) : c.reversible(typeof w.rev === 'number' ? w.rev : (w.rev === 'lift' ? 'lift the stop' : w.rev === 'session' ? 'session ends' : w.rev)); }

  /* ------------------------------------------------------------------------
     Shared decision flows (used by Decide, the split view and mobile)
     ------------------------------------------------------------------------ */
  function needsStepUp(ob) { var w = wt(ob.wt); return w.rev === false || w.blast >= 4; }
  function confirmApprove(ob, target) {
    var w = wt(ob.wt), step = needsStepUp(ob);
    var boxId = E1.uid('w-ack');
    E1.modal({
      title: 'Approve: ' + w.label.toLowerCase() + '?', eyebrow: ob.id + ' · ' + ob.wt, size: 'sm',
      body: '<p style="margin-bottom:12px">' + esc(ob.proposal) + (ob.amount ? ' · <span class="e1-mono">' + esc(fmt.inr(ob.amount)) + '</span>' : '') + '</p>' +
        c.kv([['Proposed by', actor(ob.by.name, ob.by.kind, ob.by.level && ob.by.level !== '—' ? ob.by.level + ' ' + (c.AUTONOMY[Number(ob.by.level.slice(1))] || [])[1] : null, 'sm'), { html: true }], ['Blast radius', c.blast(w.blast, { compact: true }), { html: true }], ['Reversal', w.revText], ['Checked against', declOf(ob) + ' · policy v' + ob.policy, { mono: true }]], { compact: true }) +
        (step ? '<div style="margin-top:12px">' + c.checkbox({ id: boxId, label: w.rev === false ? 'I have read every changed field. This cannot be undone.' : 'I have read every changed field. This changes the whole tenant.' }) + '<p class="e1-field__error" id="' + boxId + '-err" role="alert" hidden>' + c.icon('alert', 12) + '<span>Tick the box to confirm you have read the change.</span></p></div>' : '') +
        '<p class="w-note" style="margin-top:12px">Your approval is itself a governed write (platform.obligation.resolve). It records what you were shown: the field diff, ' + ob.total + ' gate results and policy version ' + ob.policy + '.' + (ob.quorum > 1 ? ' Nothing is written until the second person approves too.' : ' The ' + esc(w.label.toLowerCase()) + ' then climbs all nine rungs again from 0b.') + '</p>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Approve', kind: 'gate', onClick: function (e, close, el) {
        if (step) { var b = el.querySelector('#' + boxId); if (!b.checked) { el.querySelector('#' + boxId + '-err').hidden = false; b.focus(); return false; } }
        setTimeout(function () { if (target.mobile) { E1.go('/m/done/' + ob.id, { next: ob.quorum > 1 ? 'first-of-two' : 'approved' }); return; } E1.go(target.path, q2({ state: 'recording', next: target.next || (ob.quorum > 1 ? 'first-of-two' : 'approved'), as: target.as || '' }, target.extra || {})); }, 0);
      } }]
    });
  }
  function reasonValid(v) { v = String(v || '').trim(); return v.length >= 20 && v.split(/\s+/).length >= 3; }
  function rememberReason(id, v) { E1.store.set('w.reason.' + id, v); }
  function recalledReason(id) { return E1.store.get('w.reason.' + id, ''); }

  /* ------------------------------------------------------------------------
     Navigation additions (≤ 5 groups)
     ------------------------------------------------------------------------ */
  E1.navAdd('work', { id: 'stop', label: 'Stop switch', href: '#/work/stop', group: 'Controls' });
  E1.navAdd('work', { id: 'break-glass', label: 'Break-glass', href: '#/work/break-glass', group: 'Controls' });
  (function () { var a = E1.navItem('work', 'approvals'); if (a) a.count = OB.length; var n = E1.navItem('work', 'not-done'); if (n) n.count = NOTDONE_ORDER.length; })();

  /* ========================================================================
     /work/today — Needs you
     ======================================================================== */
  E1.route('/work/today', {
    title: 'Today', layout: 'console', door: 'work', section: 'today', keywords: 'needs you home landing today work',
    render: function (p, q) {
      var st = q.state || '';
      var mine = OB.filter(isMine).sort(function (a, b) { return a.exp - b.exp; });
      var expiring = OB.filter(function (o) { return o.exp <= 60; }).sort(function (a, b) { return a.exp - b.exp; });
      var due7 = CAL.filter(function (x) { return x.date <= '2026-10-01'; });
      var empty = st === 'empty' || st === 'stopped';
      var lead = empty ? 'Nothing needs you right now. Anything that needs a person will appear here first.' : 'What needs you now, ' + USER.name.split(' ')[0] + ': ' + mine.length + ' approvals waiting on you, ' + expiring.length + ' expiring within the hour across the tenant, and ' + NOTDONE_ORDER.length + ' refusals that need an action.';
      var h = c.pageHeader({ eyebrow: 'Thursday 24 Sep 2026 · ' + E1.tenant().name, title: 'Today', lead: lead,
        actions: statesMenu('/work/today', q, [['empty', 'Nothing waiting'], ['stopped', 'Tenant stopped'], ['incident', 'Platform incident']]) + c.button('Open approvals', { kind: 'primary', href: '#/work/approvals', icon: 'work' }) });
      if (st === 'stopped') h += stoppedBanner();
      if (st === 'incident') h += incidentBanner();
      h += '<div class="e1-grid e1-grid--4">' +
        c.stat({ label: 'Waiting on me', value: empty ? '0' : String(mine.length), note: empty ? 'Nothing is waiting for you.' : 'Nearest: ' + wt(mine[0].wt).label.toLowerCase() + ', ' + fmt.duration(mine[0].exp * 60000) + ' left.', href: '#/work/approvals?filter=mine' }) +
        c.stat({ label: 'Expiring within an hour', value: empty ? '0' : String(expiring.length), note: empty ? 'No deadline inside the hour.' : expiring.filter(isMine).length + ' are yours; ' + expiring.filter(function (o) { return (o.waiting || []).indexOf('ravi-shankar') >= 0; }).length + ' wait on Ravi Shankar.', href: '#/work/approvals?filter=expiring' }) +
        c.stat({ label: 'Not done, needing action', value: st === 'stopped' ? '0' : String(NOTDONE_ORDER.length), note: '1 is our failure (PLATFORM.*); every refusal meters at ₹0.', href: '#/work/not-done' }) +
        c.stat({ label: 'Due in the next 7 days', value: String(due7.length), note: 'MSME payment to Tiruppur Knit Processors on 28 Sep.', href: '#/work/obligations' }) + '</div>';

      /* Needs you: mine by deadline, then others about to expire, then refusals and dates (rung1 attention list) */
      var items = [];
      if (!empty) {
        mine.slice(0, 4).forEach(function (o) { items.push({ kind: 'Waiting on you · ' + wt(o.wt).label, gate: true, waiting: true, title: o.proposal, href: '#/work/decide/' + o.id, badge: c.badge('info', 'Waiting for you'),
          meta: [c.who(o.by.name, { kind: o.by.kind }), '<span>' + kindWord(o.by.kind) + '</span>', '<span class="e1-mono">' + esc(amountRadiusText(o)) + '</span>', checksBadge(o), c.countdown(deadline(o), { label: 'Expires' })], actions: [{ label: 'Decide', href: '#/work/decide/' + o.id, kind: 'primary' }] }); });
        expiring.filter(function (o) { return !isMine(o); }).slice(0, 2).forEach(function (o) { items.push({ kind: 'Expiring · not in your resolver set', icon: 'timer', title: o.proposal, href: '#/work/decide/' + o.id, badge: c.badge('neutral', 'Expiring', { icon: 'timer', subtle: true }),
          body: 'Waiting on ' + waitingText(o) + '. You are not in this resolver set.', meta: [c.who(o.by.name, { kind: o.by.kind }), checksBadge(o), c.countdown(deadline(o), { label: 'Expires' })], actions: [{ label: 'View', href: '#/work/decide/' + o.id }] }); });
        [4112, 4102].forEach(function (s) { var r = NOTDONE[s]; items.push({ kind: r.cls === 'platform' ? 'Our failure · PLATFORM.*' : 'Not done · needs an action', icon: r.cls === 'platform' ? 'alert' : 'refuse', title: r.title, href: '#/work/not-done/' + s,
          badge: r.cls === 'platform' ? c.badge('critical', 'Our failure', { icon: 'alert', subtle: true }) : c.outcome('refused', { subtle: true }), body: r.tried,
          meta: [c.who(r.by.name, { kind: r.by.kind }), '<span>' + kindWord(r.by.kind) + '</span>', '<a class="e1-mono" href="' + proofHref(s) + '">proof ' + seqTxt(s) + '</a>', c.cost(0), '<span class="e1-mono">' + esc(r.at.split(', ')[1]) + '</span>'], actions: [{ label: 'See why', href: '#/work/not-done/' + s }] }); });
      }
      items.push({ kind: 'Statutory deadline · due 28 Sep', icon: 'calendar', title: CAL[1].title, href: '#/work/obligations', body: 'Covered by OB-2026-0411 (payment run) if Ravi Shankar and Meenakshi Iyer approve it within the hour.', actions: [{ label: 'Calendar', href: '#/work/obligations' }] });
      var needsBody = empty ? '<div class="w-card-pad">' + c.empty({ title: 'Nothing is waiting for you', why: st === 'stopped' ? 'This workspace is stopped. No new approvals can arrive until the stop is lifted.' : 'Agents are running at their declared autonomy; anything that needs a person will appear here.', action: { label: 'What arrives here', href: '#/work/approvals/arrives' }, compact: true }) + '</div>' + c.attention(items) : c.attention(items);
      h += '<div style="margin-top:var(--space-5)">' + c.card({ id: 'w-needs-you', title: 'Needs you', actions: '<span class="e1-caption e1-muted">One action each, oldest deadline first</span><a class="e1-caption" href="#/work/approvals">All ' + OB.length + ' open approvals</a>', flush: true, body: needsBody }) + '</div>';

      /* Governed activity + agents */
      var cnt = { committed: 0, refused: 0, escalated: 0 };
      CHAIN.forEach(function (e) { cnt[e.outcome]++; });
      var recent = CHAIN.slice().reverse().slice(0, 9);
      var act = '<div class="w-card-pad">' + c.meter([{ label: 'Committed', value: cnt.committed }, { label: 'Not done (₹0)', value: cnt.refused }, { label: 'Waiting on a person (₹0)', value: cnt.escalated }], { caption: CHAIN.length + ' governed writes today · proof #4,090–#4,112' }) + '</div>' +
        c.table({ caption: 'Governed writes today, newest first', dense: true, rowHref: function (r) { return '#/work/writes/' + r.seq; },
          columns: [{ key: 'seq', label: 'Proof', mono: true, render: function (r) { return seqTxt(r.seq); } }, { key: 't', label: 'Time', mono: true }, { key: 'wt', label: 'Write', render: function (r) { return '<span class="w-prop"><span>' + esc(wt(r.wt).label) + '</span><span class="w-prop__s">' + esc(r.obj) + '</span></span>'; } },
            { key: 'actor', label: 'By', render: function (r) { return c.who(r.actor, { kind: r.kind }) + ' <span class="e1-caption e1-muted">· ' + kindWord(r.kind) + '</span>'; } }, { key: 'o', label: 'Outcome', render: function (r) { return c.outcome(r.outcome, { subtle: true, code: /^PLATFORM/.test(r.code) ? r.code : null }); } }, { key: 'meter', label: 'Meter', align: 'right', mono: true, render: function (r) { return esc(r.meter.split(' ')[0]); } }],
          rows: recent });
      var agentsSeen = {};
      CHAIN.forEach(function (e) { if (e.kind !== 'agent') return; var a = agentsSeen[e.actor] = agentsSeen[e.actor] || { name: e.actor, lvl: e.lvl, committed: 0, refused: 0, escalated: 0 }; a.lvl = e.lvl; a[e.outcome]++; });
      var agRows = Object.keys(agentsSeen).map(function (k) { return agentsSeen[k]; }).sort(function (a, b) { return (b.committed + b.refused + b.escalated) - (a.committed + a.refused + a.escalated); });
      var agents = c.table({ caption: 'Agent activity today', dense: true, rowHref: function (r) { return agentHref(r.name); },
        columns: [{ key: 'name', label: 'Agent', render: function (r) { return '<span class="w-prop"><span>' + esc(r.name) + '</span><span class="w-prop__s">Agent · ' + esc((AGENTS[r.name] || {}).owner || '') + '</span></span>'; } }, { key: 'lvl', label: 'Autonomy', render: function (r) { return c.autonomy(r.lvl === 'A0' ? null : r.lvl, { compact: true }); } },
          { key: 'committed', label: 'Committed', align: 'right', mono: true }, { key: 'refused', label: 'Not done', align: 'right', mono: true }, { key: 'escalated', label: 'Waiting', align: 'right', mono: true }], rows: agRows });
      h += '<div class="w-cards2">' +
        c.card({ title: 'Today’s governed activity', actions: '<a class="e1-caption" href="#/assurance/proof">Proof</a>', flush: true, body: st === 'stopped' ? '<div class="w-card-pad">' + c.empty({ title: 'No writes since 16:05 IST', why: 'A stopped workspace writes nothing, including refusals.', action: { label: 'View stop event', href: '#/records/tenants/kaveri-spinning' }, compact: true }) + '</div>' : act, footer: '<span>From the chain · Kaveri Spinning Mills</span>' + c.asOf('15:28') }) +
        c.card({ title: 'Agent activity', actions: '<a class="e1-caption" href="#/agents/registry">Registry</a>', flush: true, body: agents, footer: '<span>Autonomy is the level held on the write type each agent used most today. A refusal is a correct, free outcome, not an agent failure.</span>' }) + '</div>';

      h += '<div style="margin-top:var(--space-5)">' + c.card({ title: 'Every door', actions: '<span class="e1-caption e1-muted">Four doors, one question each</span>', flush: true, body: '<ul class="w-doors" role="list">' + [
        ['work', 'Work', 'What needs me now?', 'Approvals, Not done, requests and the obligations calendar.', '#/work/approvals'],
        ['records', 'Records', 'What changed, and what may change?', 'Objects and their governed timelines, declarations, write types.', '#/records/objects'],
        ['agents', 'Agents', 'Who and what is acting here?', 'The registry, autonomy grants, keys and channels.', '#/agents/registry'],
        ['assurance', 'Assurance', 'Can I show someone this was done properly?', 'Proof, chain standing, refusals and the meter.', '#/assurance/chain']
      ].map(function (d) { return '<li>' + c.doorMark(d[0], { word: true }) + '<div><div class="w-doors__q">' + esc(d[2]) + '</div><div class="w-doors__d">' + esc(d[3]) + '</div></div>' + c.button('Open ' + d[1], { size: 'sm', href: d[4], iconRight: 'arrow-right', kind: 'ghost' }) + '</li>'; }).join('') + '</ul>' }) + '</div>';
      return h;
    }
  });
  function ob1(o) { return kindWord(o.by.kind) + ' · ' + o.by.name + ' · ' + amountRadiusText(o) + ' · ' + o.passed + ' of ' + o.total + ' passed'; }
  function needRow(r) { return '<li><div>' + r.kind + '</div><div><div class="w-needs__t">' + esc(r.t) + '</div><div class="w-needs__s">' + esc(r.s) + '</div></div><div class="w-needs__r">' + r.right + '</div></li>'; }

  /* ========================================================================
     /work/approvals — the inbox (E06 §02)
     ======================================================================== */
  var FILTERS = [['mine', 'Waiting on me'], ['anyone', 'Waiting on anyone'], ['expiring', 'Expiring within an hour'], ['agent', 'Raised by an agent']];
  function filterObs(q) {
    var f = q.filter || 'mine';
    return OB.filter(function (o) {
      if (f === 'mine' && !isMine(o)) return false;
      if (f === 'expiring' && o.exp > 60) return false;
      if (f === 'agent' && o.by.kind !== 'agent') return false;
      if (q.wt && o.wt !== q.wt) return false;
      if (q.cp && (o.cp || '') !== q.cp) return false;
      return true;
    }).sort(function (a, b) { return a.exp - b.exp; });
  }
  function countFor(f, q) { return filterObs(q2(q, { filter: f })).length; }

  E1.route('/work/approvals', {
    title: 'Approvals', layout: 'console', door: 'work', section: 'approvals', keywords: 'inbox queue obligations approve reject waiting on me',
    render: function (p, q) {
      var f = q.filter || 'mine', view = q.view === 'split' ? 'split' : 'list', st = q.state || '';
      var rows = filterObs(q), mineN = OB.filter(isMine).length;
      var h = c.pageHeader({ title: 'Approvals',
        lead: st === 'empty' ? 'Nothing is waiting for you.' : mineN + ' are waiting on you. Oldest deadline first; the filter lives in the address, so a view can be pasted into a message.',
        actions: c.button('What arrives here', { href: '#/work/approvals/arrives', kind: 'ghost', icon: 'info' }) + statesMenu('/work/approvals', q, [['empty', 'Empty', 'Nothing waiting'], ['error', 'Error', 'Platform outage, expiry paused'], ['stopped', 'Tenant stopped'], ['loading', 'Loading']]),
        tabs: c.tabs(FILTERS.map(function (x) { return { id: x[0], label: x[1], href: E1.href('/work/approvals', q2(q, { filter: x[0], sel: '' })), count: st === 'empty' || st === 'stopped' ? 0 : countFor(x[0], q) }; }), f, { label: 'Show' }) });
      if (st === 'stopped') h += stoppedBanner();
      var wts = [], cps = [];
      OB.forEach(function (o) { if (wts.indexOf(o.wt) < 0) wts.push(o.wt); if (o.cp && cps.indexOf(o.cp) < 0 && o.cp.indexOf('suppliers') < 0) cps.push(o.cp); });
      h += '<div class="w-toolbar"><div class="w-toolbar__l">' +
        '<label class="w-inline" for="w-f-wt">Write type ' + c.select({ id: 'w-f-wt', attrs: 'data-w-qs="wt"', value: q.wt || '', options: [{ value: '', label: 'All write types' }].concat(wts.map(function (x) { return { value: x, label: wt(x).label + ' · ' + x }; })) }) + '</label>' +
        '<label class="w-inline" for="w-f-cp">Counterparty ' + c.select({ id: 'w-f-cp', attrs: 'data-w-qs="cp"', value: q.cp || '', options: [{ value: '', label: 'All counterparties' }].concat(cps.sort().map(function (x) { return { value: x, label: x }; })) }) + '</label>' +
        (q.wt || q.cp ? '<a class="e1-filters__clear" href="' + E1.href('/work/approvals', q2(q, { wt: '', cp: '' })) + '">Clear</a>' : '') +
        '</div><div class="w-toolbar__r">' + pauseBtn() + c.segmented([{ id: 'list', label: 'List', icon: 'list', href: E1.href('/work/approvals', q2(q, { view: '' })) }, { id: 'split', label: 'Split view', icon: 'panel-left', href: E1.href('/work/approvals', q2(q, { view: 'split' })) }], view, { label: 'Layout', size: 'sm' }) + '</div></div>';

      if (st === 'loading') return h + c.skeleton({ kind: 'table', rows: 6 });
      if (st === 'empty' || st === 'stopped') {
        return h + c.empty({ title: 'Nothing is waiting for you', why: st === 'stopped' ? 'This workspace is stopped. No new approvals can arrive until the stop is lifted.' : 'Agents are running at their declared autonomy; anything that needs a person will appear here.', action: { label: 'What arrives here', href: '#/work/approvals/arrives' }, icon: 'work' });
      }
      if (st === 'error') {
        h += c.error({ title: 'We cannot show your approvals right now.', reassurance: 'Nothing has been approved in the meantime and nothing expires while this is down.', body: 'These are the rows we last showed you, at 15:28 IST. Expiry is paused on every one of them.', action: [{ label: 'Try again', href: '#/work/approvals' }, { label: 'Status', href: '#/status', kind: 'ghost' }] });
      }
      if (!rows.length) {
        return h + c.empty({ title: 'Nothing matches this view', why: 'No open approval is ' + (FILTERS.filter(function (x) { return x[0] === f; })[0] || ['', 'waiting'])[1].toLowerCase() + (q.wt ? ' for ' + wt(q.wt).label.toLowerCase() : '') + (q.cp ? ' with ' + q.cp : '') + '.', fill: 'Clear the filters, or look at everything waiting on anyone.', action: { label: 'Waiting on anyone', href: '#/work/approvals?filter=anyone' }, icon: 'filter' });
      }
      h += '<div class="w-toolbar" style="margin-top:0">' + keysLegend(view === 'split') + '<span class="e1-caption e1-muted">Sorted by oldest deadline first</span></div>';
      if (view === 'split') h += splitView(rows, q, st);
      else h += '<div id="w-queue">' + queueTable(rows, st) + '</div><div class="w-qcards" role="list" aria-label="Approvals">' + rows.map(function (o) {
        return '<a role="listitem" class="w-mcard" href="#/work/decide/' + o.id + '"><span class="w-mcard__t">' + esc(o.proposal) + '</span><span class="w-mcard__row"><span>' + esc(o.by.name) + ' · <strong>' + kindWord(o.by.kind) + '</strong></span><span class="e1-mono">' + esc(amountRadiusText(o).split(' · ')[0]) + '</span></span><span class="w-mcard__row">' + checksBadge(o) + c.countdown(deadline(o), { label: 'Expires' }) + '</span></a>';
      }).join('') + '</div>';
      h += '<p class="w-note" style="margin-top:14px">One decision per obligation. There is no bulk approve: every approval records the diff you were shown. Expiry defaults to the value declared per write type.</p>';
      return h;
    },
    mount: function (el, p, q) {
      Array.prototype.forEach.call(el.querySelectorAll('select[data-w-qs]'), function (s) {
        s.addEventListener('change', function () { var k = s.getAttribute('data-w-qs'), patch = {}; patch[k] = s.value; patch.sel = ''; E1.go('/work/approvals', q2(q, patch)); });
      });
      kbd.idx = -1;
      if (q.state === 'error') Array.prototype.forEach.call(el.querySelectorAll('[data-deadline]'), function (d) { d.removeAttribute('data-deadline'); var t = d.querySelector('.e1-countdown__t'); if (t) t.textContent = 'Expiry paused'; d.setAttribute('data-state', 'neutral'); });
      var sel = el.querySelector('.w-qitem.is-selected');
      if (sel && q.sel) { try { sel.scrollIntoView({ block: 'nearest' }); } catch (e) { /* old */ } }
    }
  });
  function queueTable(rows, st) {
    return c.table({ caption: 'Approvals, oldest deadline first', stickyHead: true, rowHref: function (r) { return '#/work/decide/' + r.id; },
      columns: [
        { key: 'proposal', label: 'Proposal', render: function (r) { return '<span class="w-prop"><span class="w-prop__t">' + esc(r.proposal) + '</span><span class="w-prop__s e1-mono">' + esc(r.wt) + '</span></span>'; } },
        { key: 'by', label: 'Proposed by', render: function (r) { return actor(r.by.name, r.by.kind, null, 'sm'); } },
        { key: 'amt', label: 'Amount / radius', align: 'right', render: amountRadius },
        { key: 'checks', label: 'Checks', render: function (r) { return checksBadge(r, true); } },
        { key: 'exp', label: 'Expires', nowrap: true, render: function (r) { return c.countdown(deadline(r), { label: 'Expires' }); } },
        { key: 'who', label: 'Waiting on', render: function (r) { return '<span class="w-prop"><span>' + esc(isMine(r) ? (r.waiting.length > 1 ? 'You or ' + names(r.waiting.filter(function (x) { return x !== USER.id; })).join(', ') : 'You') : waitingText(r)) + '</span><span class="w-prop__s">' + esc(r.set) + '</span></span>'; } }
      ], rows: rows });
  }
  function splitView(rows, q, st) {
    var selId = q.sel && rows.some(function (r) { return r.id === q.sel; }) ? q.sel : rows[0].id;
    var ob = findOb(selId);
    var list = '<ul class="w-qlist" role="list" aria-label="Approvals">' + rows.map(function (r) {
      var on = r.id === selId;
      return '<li><a class="w-qitem' + (on ? ' is-selected' : '') + '" href="' + E1.href('/work/approvals', q2(q, { view: 'split', sel: r.id })) + '"' + (on ? ' aria-current="true"' : '') + ' data-w-id="' + esc(r.id) + '">' +
        '<span class="w-qitem__t">' + esc(r.proposal) + '</span>' +
        '<span class="w-qitem__row"><span>' + c.who(r.by.name, { kind: r.by.kind }) + ' · <strong>' + kindWord(r.by.kind) + '</strong></span><span class="e1-mono">' + esc(amountRadiusText(r).split(' · ')[0]) + '</span></span>' +
        '<span class="w-qitem__row">' + checksBadge(r) + c.countdown(deadline(r), { label: 'Expires' }) + '</span></a></li>';
    }).join('') + '</ul>';
    return '<div class="w-splitq"><div>' + list + '</div><div>' + previewPane(ob, q) + '</div></div>';
  }
  function previewPane(ob, q) {
    var w = wt(ob.wt), mine = isMine(ob);
    var acts = mine ? '<div class="w-decide" style="max-width:340px">' + c.button('Approve', { kind: 'gate', full: true, attrs: 'data-action="w-approve" data-value="' + esc(ob.id) + '" data-w-from="split"' }) +
      '<div class="w-decide__gap" aria-hidden="true">or</div>' + c.button('Reject with a reason', { kind: 'danger', icon: 'reject', full: true, href: E1.href('/work/decide/' + ob.id, { act: 'reject' }) }) + '</div>' :
      '<p class="w-note">Waiting on <strong>' + esc(waitingText(ob)) + '</strong>. You are not in this resolver set, so there is nothing for you to press.</p>';
    return c.card({ eyebrow: ob.id + ' · ' + w.label, title: ob.proposal + (ob.amount ? ' · ' + fmt.inr(ob.amount) : ''), actions: c.button('Open full screen', { size: 'sm', kind: 'ghost', href: '#/work/decide/' + ob.id, iconRight: 'arrow-up-right' }),
      body: '<div class="e1-stack">' +
        '<div class="e1-row" style="gap:18px">' + actor(ob.by.name, ob.by.kind, ob.by.level && ob.by.level !== '—' ? ob.by.level + ' ' + (c.AUTONOMY[Number(ob.by.level.slice(1))] || [])[1] : null) + c.blast(w.blast, { compact: true }) + reversibleChip(w) + c.countdown(deadline(ob), { label: 'Expires' }) + '</div>' +
        c.diff(ob.diff || [], { caption: 'Field-level changes proposed by this write' }) +
        gatesHtml(gateRows(ob), { version: declOf(ob) + ' · policy v' + ob.policy, pendingWord: mine ? 'waiting for you' : 'waiting' }) +
        c.callout({ kind: 'info', title: 'Why this reached a person', body: '<p>allow at policy version ' + ob.policy + '. ' + esc(ob.why.charAt(0).toUpperCase() + ob.why.slice(1)) + '</p>' }) + acts + '</div>' });
  }

  /* Keyboard for the queue: J / K move, Enter opens, A / R act (E06 §09). */
  var kbd = { idx: -1, g: 0 };
  document.addEventListener('keydown', function (e) {
    var r = E1.state.route || {};
    if (r.pattern !== '/work/approvals') return;
    var t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    if (typing || e.ctrlKey || e.metaKey || e.altKey || !E1.state.singleKeys || document.querySelector('[role="dialog"]')) return;
    var k = e.key;
    if (k === 'g') { kbd.g = Date.now(); return; }
    if (Date.now() - kbd.g < 1200) return; /* g-then-letter belongs to the door shortcuts */
    var q = r.query || {}, main = document.getElementById('e1-main');
    if (!main) return;
    if (q.view === 'split') {
      var items = Array.prototype.slice.call(main.querySelectorAll('.w-qitem'));
      if (!items.length) return;
      var cur = items.findIndex ? items.findIndex(function (a) { return a.classList.contains('is-selected'); }) : 0;
      var id = items[Math.max(cur, 0)].getAttribute('data-w-id');
      if (k === 'j' || k === 'k') { e.preventDefault(); var n = Math.min(items.length - 1, Math.max(0, cur + (k === 'j' ? 1 : -1))); E1.go('/work/approvals', q2(q, { sel: items[n].getAttribute('data-w-id') }), { replace: true }); }
      else if (k === 'Enter' && !(t.closest && t.closest('a,button'))) { e.preventDefault(); E1.go('/work/decide/' + id); }
      else if (k === 'a') { var ob = findOb(id); if (ob && isMine(ob)) { e.preventDefault(); confirmApprove(ob, { path: '/work/decide/' + id }); } else E1.toast('You are not in the resolver set for ' + id + '.', 'neutral'); }
      else if (k === 'r') { e.preventDefault(); E1.go('/work/decide/' + id, { act: 'reject' }); }
      return;
    }
    var rows = Array.prototype.slice.call(main.querySelectorAll('#w-queue tbody tr[data-href]'));
    if (!rows.length) return;
    if (k === 'j' || k === 'k') {
      e.preventDefault();
      kbd.idx = Math.min(rows.length - 1, Math.max(0, kbd.idx + (k === 'j' ? 1 : -1)));
      rows.forEach(function (tr, i) { tr.classList.toggle('w-kbd-sel', i === kbd.idx); tr.setAttribute('aria-selected', i === kbd.idx ? 'true' : 'false'); });
      var a = rows[kbd.idx].querySelector('a'); if (a) a.focus();
      E1.announce(rows[kbd.idx].querySelector('th').textContent);
    } else if (kbd.idx >= 0 && (k === 'Enter' || k === 'a' || k === 'r')) {
      var href = rows[kbd.idx].getAttribute('data-href');
      if (k === 'Enter' && t.closest && t.closest('a')) return; /* the focused link already opens it */
      e.preventDefault();
      E1.go(href + (k === 'a' ? '?act=approve' : k === 'r' ? '?act=reject' : ''));
    }
  });

  /* ========================================================================
     /work/approvals/arrives — What arrives here
     ======================================================================== */
  E1.route('/work/approvals/arrives', {
    title: 'What arrives here', layout: 'console', door: 'work', section: 'approvals', crumbs: [['Work', '#/work/today'], ['Approvals', '#/work/approvals']], keywords: 'escalate resolver set write types',
    render: function (p, q) {
      var list = [
        ['erp.sales_invoice.submit', 'ar-agent is at A2 Propose; dual control above ₹2,00,000.', 'Web · Mobile · WhatsApp link'],
        ['erp.credit_limit.change', 'Dual control on every limit change.', 'Web · Mobile'],
        ['erp.credit_note.submit', 'Dual control on every credit note; the proposer cannot approve.', 'Web · Mobile'],
        ['erp.purchase_invoice.submit', 'ap-agent acts alone at A3 up to ₹2,00,000; above it, dual control.', 'Web · Mobile'],
        ['erp.price_list.update', 'Batch radius forces dual control; Invoice Agent is at A1 Draft.', 'Web'],
        ['erp.journal_entry.submit', 'Dual control above ₹1,00,000.', 'Web · Mobile']
      ];
      var h = c.pageHeader({ title: 'What arrives here', lead: 'The write types that escalate to you, Venkat, and why. You are in ar-approvers; an owner changes that in a new declaration version.', actions: statesMenu('/work/approvals/arrives', q, [['empty', 'Not in any resolver set']]) });
      if (q.state === 'empty') return h + c.empty({ title: 'No write type escalates to you', why: 'You are not in any resolver set.', fill: 'An owner can add your role in a new declaration version.', action: { label: 'Open declarations', href: '#/records/declarations' }, icon: 'gate' });
      h += c.table({ caption: 'Write types that escalate to you', rowHref: function (r) { return wtHref(r[0]); },
        columns: [{ key: 'l', label: 'Write type', render: function (r) { return '<span class="w-prop"><span class="w-prop__t">' + esc(wt(r[0]).label) + '</span><span class="w-prop__s e1-mono">' + esc(r[0]) + '</span></span>'; } },
          { key: 'b', label: 'Blast radius', render: function (r) { return c.blast(wt(r[0]).blast, { compact: true }) + '<div style="margin-top:4px">' + reversibleChip(wt(r[0])) + '</div>'; } },
          { key: 'w', label: 'Why it escalates', render: function (r) { return esc(r[1]); } },
          { key: 'c', label: 'Where you may approve', render: function (r) { return esc(r[2]); } },
          { key: 'd', label: 'Declaration', mono: true, render: function (r) { return esc(wt(r[0]).decl + ' v' + wt(r[0]).v); } }], rows: list });
      h += '<div class="e1-grid e1-grid--2" style="margin-top:var(--space-5)">' +
        c.callout({ kind: 'rule', title: 'Reply-approval on WhatsApp', body: '<p>Only write types declared <span class="e1-mono">whatsapp_approve: true</span> — low value, reversible, one record — accept an APPROVE or REJECT reply. None of yours qualify, so WhatsApp brings you a link: “Open the console to see the change and decide.”</p><p><a href="#/channels/whatsapp">See the WhatsApp preview</a></p>' }) +
        c.callout({ kind: 'info', title: 'Agents never approve', body: '<p>Resolver sets contain humans only. An agent token that tries to resolve an obligation is refused and recorded.</p><p><a href="#/agents/roles">Roles and resolver sets</a></p>' }) + '</div>';
      return h;
    }
  });

  /* ========================================================================
     /work/decide/:id — THE flagship (E06 §03, atlas Figure 11)
     ======================================================================== */
  var APPROVERS = ['venkat-raman', 'meenakshi-iyer', 'ravi-shankar'];
  function seqsFor(ob) {
    var i = OB.indexOf(ob); if (i < 0) i = 7;
    var res = ob.resolution || (4113 + i * 2), com = ob.commit || res + 1;
    return { esc: ob.esc, res: res, commit: com };
  }
  function nextMine(ob) { var m = OB.filter(isMine).sort(function (a, b) { return a.exp - b.exp; }); for (var i = 0; i < m.length; i++) if (m[i].id !== ob.id) return m[i]; return null; }
  function proposerRole(ob) { return ob.by.level && ob.by.level !== '—' ? ob.by.level + ' ' + ((c.AUTONOMY[Number(ob.by.level.slice(1))] || [])[1] || '') : person(personIdByName(ob.by.name)).role; }
  var DSTATES = [['recording', 'Recording your decision…'], ['approved', 'Approved · posted'], ['rejected', 'Rejected · recorded'], ['same-actor', 'Same actor (you proposed this)'], ['write-failed', 'Approved, write not done'], ['expired', 'Expired'], ['resolved-by-other', 'Resolved by someone else'], ['first-of-two', 'Dual control: 1 of 2 recorded'], ['stale', 'Changed after you opened it'], ['closed-stopped', 'Tenant stopped'], ['decision-error', 'Decision not recorded'], ['error', 'Cannot load']];

  function decideResult(ob, st, q, path) {
    var w = wt(ob.wt), s = seqsFor(ob), erp = /^erp\./.test(ob.wt), by = ob.by.kind === 'agent' ? 'The agent' : ob.by.name;
    var asP = q.as ? person(q.as) : null;
    var nxt = nextMine(ob);
    var nextBtn = nxt ? c.button('Next: ' + wt(nxt.wt).label.toLowerCase(), { href: '#/work/decide/' + nxt.id, kind: 'ghost', iconRight: 'arrow-right' }) : c.button('Back to Approvals', { href: '#/work/approvals', kind: 'ghost' });
    if (st === 'approved') {
      var commitSeq = q.one ? s.res + 2 : s.commit, resSeq = q.one ? s.res + 1 : s.res;
      var t = 'Approved · ' + (erp ? 'posted' : 'recorded') + ' · proof ' + seqTxt(commitSeq);
      var body = '<p>Your approval was recorded as proof ' + seqTxt(resSeq) + '. The write then climbed all nine rungs again, passed the shadow sandbox, and was ' + (erp ? 'written to ERPNext' + (ob.record ? ' as <span class="e1-mono">' + esc(ob.record) + '</span>' : '') : 'recorded') + '. Meter: 1 × ' + esc(w.basis) + '.</p>' +
        (E1.atLeast('L2') ? '<p style="margin-top:6px">' + c.level(E1.state.level, { short: true }) + ' Signed · key fingerprint <span class="e1-mono">ed25519:7a1f…c02e</span> (preview of Assurance Level ' + E1.state.level.slice(1) + ').</p>' : '');
      var acts = c.button('Open the record', { kind: 'primary', href: '#/records/object/' + encodeURIComponent(ob.record || ob.id), icon: 'records' }) +
        (w.rev === false ? '' : c.button('Reverse this (30 days)', { href: '#/work/reverse/' + commitSeq, icon: 'undo' })) +
        c.button('Show the proof', { href: proofHref(commitSeq), kind: 'ghost', icon: 'proof' }) + nextBtn;
      return result('good', 'check', t, body, acts, w.rev === false ? 'Irreversible — no reversal plan. A correction is a new governed write.' : esc(w.revText), 'Approved. ' + (erp ? 'Posted. ' : 'Recorded. ') + 'Proof ' + commitSeq + '.');
    }
    if (st === 'rejected') {
      var reason = recalledReason(ob.id) || 'The rate is below the approved price list; resubmit at ₹312 per kg.';
      return result('neutral', 'refuse', 'Rejected · recorded · proof ' + seqTxt(s.res),
        '<p>' + esc(by) + ' has been told POLICY.APPROVAL_DECLINED. Your reason is on the record:</p><p class="w-just" style="margin-top:8px">“' + esc(reason) + '”</p><p style="margin-top:8px">The original write is never resubmitted. Its proposer’s Not done screen reads “Not done — the approver rejected it”.</p>',
        c.button('Show the record of this decision', { href: proofHref(s.res), icon: 'proof' }) + nextBtn, 'platform.obligation.resolve · decision decline · metered 1 per record', 'Rejected. Recorded. Proof ' + s.res + '.');
    }
    if (st === 'same-actor') {
      var proposer = ob.by.kind === 'person' ? personIdByName(ob.by.name) : null;
      var send = APPROVERS.filter(function (x) { return x !== proposer; }).map(function (x) { var pp = person(x); return c.button(pp.name + ' · ' + pp.role.replace(' (ar-approvers)', ''), { kind: 'secondary', icon: 'send', attrs: 'data-action="w-sendto" data-value="' + esc(pp.name) + '"' }); }).join('');
      return result('neutral', 'refuse', 'You proposed this, so you cannot also approve it.',
        '<p>Send it to:</p><div class="e1-row" style="margin-top:8px" role="group" aria-label="Send to (people only)">' + send + '</div>' +
        '<p class="w-note" style="margin-top:10px">' + (proposer ? 'Shown to ' + esc(ob.by.name) + ', who proposed this write.' : 'Shown when the person who proposed a write presses Approve.') + ' The list holds people only; agents never approve.</p>', '',
        '<code>GATE.DUAL_CONTROL_SAME_ACTOR</code> · recorded as proof #4,096 · metered at zero', null);
    }
    if (st === 'write-failed') {
      return result('critical', 'alert', 'Your approval was recorded. The write itself did not complete, and nothing was changed. We have been paged.',
        '<p>At rung 7 the live re-run disagreed with the shadow sandbox, so the snapshot was restored. Your decision stands as proof ' + seqTxt(s.res) + '; the write is Not done and meters at zero.</p>',
        c.button('Show the record of your approval', { href: proofHref(s.res), icon: 'proof' }) + c.button('See why', { href: '#/work/not-done/4112', kind: 'primary', iconRight: 'arrow-right' }), '<code>GATE.SANDBOX_DIVERGED</code> · snapshot restored · proof #4,112', null);
    }
    if (st === 'expired') {
      var at = fmt.time(deadline(ob));
      return result('neutral', 'timer', 'This request expired at ' + at + ' before anyone decided.',
        '<p>Nothing was written. The expiry is recorded as proof #4,110, and ' + (ob.by.kind === 'agent' ? esc(ob.by.name) + ' has been told POLICY.OBLIGATION_EXPIRED.' : esc(ob.by.name) + ' may resubmit it.') + '</p>',
        (ob.by.kind === 'person' ? c.button('Resubmit (proposer only)', { href: '#/work/request/' + ob.wt + '?from=' + ob.id, icon: 'refresh' }) : c.button('See the Not done entry', { href: '#/work/not-done/4110' })) + c.button('Back to Approvals', { href: '#/work/approvals', kind: 'ghost' }), '<code>POLICY.OBLIGATION_EXPIRED</code> · a governed event with its own proof entry', null);
    }
    if (st === 'resolved-by-other') {
      var other = person((ob.waiting || []).filter(function (x) { return x !== USER.id; })[0] || 'meenakshi-iyer').name;
      return result('info', 'check', other + ' approved this at 15:31. Nothing for you to do.', '<p>The ' + esc(w.label.toLowerCase()) + ' was resubmitted and committed as proof ' + seqTxt(s.commit) + '.</p>',
        c.button('Show the proof', { href: proofHref(s.commit), icon: 'proof' }) + nextBtn, null, null);
    }
    if (st === 'first-of-two') {
      var who = asP ? asP.name : 'Ravi Shankar', rest = names(ob.waiting.filter(function (x) { return x !== (asP ? asP.id : 'ravi-shankar'); }));
      return result('warning', 'gate', 'Approval 1 of 2 recorded · proof ' + seqTxt(s.res),
        '<p>' + esc(who) + '’s approval is on the record. Nothing is written until ' + esc(rest.join(' and ')) + ' approves too; they have been notified on the web and by e-mail. The deadline is unchanged.</p>',
        c.button('Continue as ' + rest[0], { href: E1.href(path, { as: personIdByName(rest[0]), one: '1' }), kind: 'primary', icon: 'user' }) + c.button('Back to Approvals', { href: '#/work/approvals?filter=anyone', kind: 'ghost' }), 'Dual control · two approvers · each approval is its own governed write', 'Approval 1 of 2 recorded.');
    }
    if (st === 'stale') {
      return result('info', 'refresh', 'The change was updated after you opened it. Review it again.', '<p>' + esc(ob.by.name) + ' revised the proposal at 15:31. The diff below is the new version; nothing was approved. Your decision records the version you were shown.</p>',
        c.button('Read the new diff', { href: E1.href(path), attrs: 'data-scrollto="w-change"', kind: 'primary' }), null, null);
    }
    if (st === 'decision-error') {
      return result('critical', 'alert', 'Your decision has not been recorded. Please try again; nothing was approved.', '<p>The approval service did not answer in time. The request is still open and its deadline is paused while we fix it.</p>',
        c.button('Try again', { kind: 'gate', attrs: 'data-action="w-approve" data-value="' + esc(ob.id) + '"' }) + c.button('Status', { href: '#/status', kind: 'ghost' }), '<code>PLATFORM.POLICY_UNAVAILABLE</code> · not billed · we have been paged', null);
    }
    return '';
  }

  E1.route('/work/decide/:id', {
    title: function (p) { var ob = findOb(p.id); return ob ? 'Decide · ' + ob.id : 'Decide'; },
    layout: 'console', door: 'work', section: 'approvals', crumbs: [['Work', '#/work/today'], ['Approvals', '#/work/approvals']], example: '/work/decide/OB-2026-0412', keywords: 'decide approve reject obligation diff gates',
    render: function (p, q) {
      var ob = findOb(p.id), hist = findHist(p.id), path = '/work/decide/' + p.id, st = q.state || '';
      if (!ob && hist) return resolvedView(hist);
      if (!ob && /^OB-\d{4}-\d{4}$/.test(p.id)) ob = synthOb(p.id);
      if (!ob) return c.pageHeader({ title: 'No approval at this address', lead: '“' + p.id + '” is not an obligation id. Obligation ids look like OB-2026-0412.' }) + c.empty({ title: 'Nothing to decide here', why: 'The link may be mistyped, or it may point to a write rather than an approval.', action: [{ label: 'Back to Approvals', href: '#/work/approvals' }, { label: 'Look it up in Proof', href: '#/assurance/proof', kind: 'ghost' }], icon: 'search' });
      if (st === 'error') return c.pageHeader({ eyebrow: ob.id, title: ob.proposal }) + c.error({ title: 'We cannot show this request right now.', reassurance: 'Nothing has been approved in the meantime and nothing expires while this is down.', action: [{ label: 'Try again', href: '#' + path }, { label: 'Status', href: '#/status', kind: 'ghost' }] });
      var w = wt(ob.wt), asP = q.as && PEOPLE[q.as] ? PEOPLE[q.as] : null, viewer = asP ? asP.id : USER.id;
      var inSet = (ob.waiting || []).indexOf(viewer) >= 0;
      var RESULT = ['approved', 'rejected', 'same-actor', 'write-failed', 'expired', 'resolved-by-other', 'first-of-two', 'decision-error'];
      var closed = RESULT.indexOf(st) >= 0 && st !== 'decision-error' && st !== 'same-actor';
      var h = '';
      if (st === 'closed-stopped') h += stoppedBanner();
      if (asP) h += banner('info', 'Previewing as ' + asP.name + ' (' + asP.role + ').', 'The prototype lets you see the screen as the other named approver. Your own session is unchanged.', { label: 'Back to your view', href: '#' + path });
      h += c.pageHeader({ eyebrow: ob.id + ' · ' + w.label + (ob.synthetic ? ' · sample' : ''), title: ob.proposal + (ob.amount ? ' · ' + fmt.inr(ob.amount) : ''),
        actions: statesMenu(path, { as: q.as || '', one: q.one || '' }, DSTATES) + c.button('Split view', { kind: 'ghost', size: 'sm', icon: 'panel-left', href: E1.href('/work/approvals', { filter: isMine(ob) ? 'mine' : 'anyone', view: 'split', sel: ob.id }) }),
        meta: '<span>' + esc(w.label) + ' · <a class="e1-mono" href="' + wtHref(ob.wt) + '">' + esc(ob.wt) + '</a></span><span>Declaration <a class="e1-mono" href="' + declHref(declId(ob)) + '">' + esc(declOf(ob)) + '</a></span><span>Policy <a class="e1-mono" href="#/records/policies/' + ob.policy + '">v' + ob.policy + '</a></span>' + c.badge('neutral', 'Enforced', { icon: 'lock', subtle: true }) + '<span class="e1-mono">' + esc(ob.writeId) + '</span>' });

      /* result region (announced) */
      if (st === 'recording') h += '<div id="w-recording">' + result('info', 'clock', 'Recording your decision…', '<p>' + (q.next === 'rejected' ? 'Your rejection is being written as its own governed write.' : 'Your approval is being written as its own governed write; then the ' + esc(w.label.toLowerCase()) + ' is resubmitted and climbs from 0b.') + '</p><div id="w-rec-rungs" style="margin-top:12px">' + (q.next === 'rejected' || q.next === 'first-of-two' ? '' : ladder({ outcome: 'running', at: 1 })) + '</div>', null, 'Do not close this page. Nothing is approved until this finishes.', 'Recording your decision.') + '</div>';
      else if (st && st !== 'closed-stopped') h += decideResult(ob, st, q, path);
      if (st) h += '<div style="height:16px"></div>';

      /* above the fold: proposal (h1), proposer, deadline, blast radius */
      var expTxt = st === 'closed-stopped' ? '<span class="e1-badge e1-badge--neutral"><span>Expiry paused</span></span>' : closed ? '<span class="e1-caption">Closed</span>' : c.countdown(deadline(ob), { label: 'Expires', warn: 60 });
      h += '<div class="w-fold" role="group" aria-label="Before you decide">' +
        '<div class="w-fold__cell"><span class="w-fold__k">Proposed by</span>' + actor(ob.by.name, ob.by.kind, proposerRole(ob)) + (ob.by.kind === 'agent' ? '<span class="w-fold__sub">An agent proposed this; you are the decision.</span>' : '<span class="w-fold__sub">A person proposed this; a different named person decides.</span>') + '</div>' +
        '<div class="w-fold__cell"><span class="w-fold__k">Deadline</span><span data-w-announce="' + esc(ob.id) + '">' + expTxt + '</span><span class="w-fold__sub">Expires ' + esc(fmt.time(deadline(ob))) + ' · declared expiry ' + esc(w.expiry) + '</span>' + (closed ? '' : '<span>' + pauseBtn() + '</span>') + '</div>' +
        '<div class="w-fold__cell"><span class="w-fold__k">Blast radius (declared)</span>' + c.blast(w.blast, { note: false }) + '<span>' + reversibleChip(w) + '</span></div>' +
        '<div class="w-fold__cell"><span class="w-fold__k">Waiting on</span><span class="w-prop__t">' + esc(inSet && !asP ? (ob.waiting.length > 1 && ob.quorum === 1 ? 'You, or ' + names(ob.waiting.filter(function (x) { return x !== USER.id; })).join(', ') : ob.quorum > 1 ? 'You and ' + names(ob.waiting.filter(function (x) { return x !== viewer; })).join(', ') : 'You') : waitingText(ob)) + '</span><span class="w-fold__sub">' + esc(ob.set) + (ob.quorum > 1 ? ' · two approvers, both required' : '') + '</span></div>' +
        '</div>';

      /* main + decision panel */
      var main = sec('Change', c.diff(ob.diff || [], { caption: 'Field-level changes proposed by this write' }), { id: 'w-change', lead: 'Before and after, field by field. Changed rows say so in words; unchanged rows sit behind Show all fields. Nothing is summarised away.', aside: ob.record ? '<a href="#/records/object/' + encodeURIComponent(ob.record) + '">Open the record</a>' : '' }) +
        sec('Checks', checksBlock(gateRows(ob).map(function (g) { if (g.result === 'pending' && (st === 'approved' || st === 'resolved-by-other')) { g.result = 'passed'; g.words = (st === 'approved' ? 'Approved by ' + (asP ? asP.name : 'you') : 'Approved by another named person') + ' on resubmission (proof ' + seqTxt(seqsFor(ob).res) + ').'; } return g; }), { version: declOf(ob) + ' · policy v' + ob.policy, pendingWord: inSet ? 'waiting for you' : 'waiting for a named person' }), { id: 'w-checks', lead: 'Every declared gate, in declared order, not only the failures — each with the declaration version it ran against.', aside: 'as_of 24 Sep 2026, ' + esc(ob.raised || '15:28 IST') }) +
        sec('Decision', '<p class="w-rule">evaluate() returned <strong>allow at policy version ' + ob.policy + '</strong>. It reached a person because ' + esc(ob.why) + '</p>' +
          '<div style="margin-top:16px">' + (st === 'approved' || st === 'resolved-by-other') ? ladder({ outcome: 'committed', caption: 'Resubmitted with its obligation_ref, it climbed 0b to 9 again and committed as proof ' + seqTxt(q.one ? seqsFor(ob).res + 2 : seqsFor(ob).commit) + '.' }) : ladder({ outcome: 'escalated', at: ob.rung, caption: 'Stopped at rung ' + ob.rung + (ob.rung === 4 ? ': evaluate() escalated — a person approves.' : ': autonomy — a person approves.') + ' After your decision the write is resubmitted and climbs again from 0b; it is never resumed.' }) + '</div>', { id: 'w-decision' }) +
        sec('Obligation', c.kv([
          ['Obligation', ob.id, { mono: true }], ['write_id', ob.writeId, { mono: true }],
          ['Write type', '<a href="' + wtHref(ob.wt) + '">' + esc(w.label) + '</a> <span class="e1-mono e1-muted">' + esc(ob.wt) + '</span>', { html: true }],
          ['Declaration', '<a class="e1-mono" href="' + declHref(declId(ob)) + '">' + esc(declOf(ob)) + '</a> · policy v' + ob.policy, { html: true }],
          ['Enforcement mode', 'Enforced · credential custody'], ['Reversal plan', w.revText],
          ['Declared expiry', w.expiry + ' (per write type)'], ['Resolver set', ob.set + ' · people only'],
          ['Raised', ob.esc ? '<a href="' + proofHref(ob.esc) + '">Escalated · proof ' + seqTxt(ob.esc) + '</a>' + (ob.raised ? ' · ' + esc(ob.raised) : '') : 'Escalated earlier today', { html: true }],
          ['Reply by WhatsApp', w.wa ? 'Allowed: APPROVE or REJECT, bound to this obligation id' : 'Off for this write: ' + (w.rev === false ? 'it is irreversible.' : w.blast > 1 ? 'its radius is wider than one record.' : 'not declared.')]
        ], { cols: 2 }), { id: 'w-obligation' }) +
        sec('Related records', seqTrail((ob.related || []).map(function (r) { return [r.seq, r.label, r.outcome]; }).concat(ob.esc ? [[ob.esc, 'Escalated · ' + ob.id, 'escalated']] : []).concat(st === 'approved' ? [[seqsFor(ob).res, 'Your approval', 'committed'], [seqsFor(ob).commit, 'Committed', 'committed']] : st === 'rejected' ? [[seqsFor(ob).res, 'Your rejection', 'committed']] : [])) +
          '<p class="w-note" style="margin-top:10px">One approved decision leaves three proof entries: the escalation, your resolution and the resubmission. On expiry a fourth records the lapse.</p>', { id: 'w-related' }) +
        '<div style="margin-top:var(--space-6)">' + (E1.atLeast('L2') ? c.callout({ kind: 'info', title: c.level(E1.state.level, { short: true }) + ' preview', body: '<p>At Assurance Level ' + E1.state.level.slice(1) + ' your decision would be signed and anchored. Your tenant runs at L1 today.</p>' }) :
          c.callout({ kind: 'info', title: 'L1 Guarded', body: '<p>This record is hash-chained. It is not signed, and it cannot yet be checked by someone who does not trust elan1. That arrives at Assurance Level 2.</p>' })) + '</div>';

      var panel;
      if (st === 'recording') panel = c.card({ title: 'Your decision', body: '<div class="w-decide">' + c.button('Recording…', { kind: 'gate', full: true, loading: true, disabled: true }) + '</div>' });
      else if (closed) panel = c.card({ title: 'Your decision', body: '<p class="w-note">This request is closed. See the result above.</p>' });
      else if (st === 'same-actor') panel = c.card({ title: 'Your decision', body: '<p class="w-note">Approve is not offered to the person who proposed a write. Use <strong>Send to</strong> above.</p>' });
      else if (st === 'closed-stopped') panel = c.card({ title: 'Your decision', body: '<p class="w-note">This request is frozen while the workspace is stopped. Its expiry is paused; nothing can be approved until the stop is lifted.</p>' + c.button('View stop event', { href: '#/records/tenants/kaveri-spinning', full: true }) });
      else if (!inSet) {
        panel = c.card({ title: 'Your decision', body: '<p class="w-note">Waiting on <strong>' + esc(waitingText(ob)) + '</strong>. You are not in this resolver set, so there is nothing for you to press.</p>' +
          '<div class="e1-stack e1-stack--sm" style="margin-top:12px">' + ob.waiting.map(function (x) { return c.button('Preview as ' + person(x).name, { href: E1.href(path, { as: x }), kind: 'ghost', size: 'sm', icon: 'eye' }); }).join('') + '</div>' });
      } else {
        panel = c.card({ title: 'Your decision', body: '<div class="w-decide">' +
          '<div class="w-decide__approve">' + c.button(ob.quorum > 1 ? (q.one === '1' ? 'Approve (2 of 2)' : 'Approve (1 of 2)') : 'Approve', { kind: 'gate', size: 'lg', full: true, attrs: 'data-action="w-approve" data-value="' + esc(ob.id) + '" id="w-approve-btn"' }) +
          '<p class="w-note">Recorded as its own governed write. ' + (w.rev === false ? '<strong>Irreversible — cannot be auto-approved.</strong>' : esc(w.revText)) + '</p></div>' +
          '<div class="w-decide__gap" aria-hidden="true">or</div>' +
          c.button('Reject', { kind: 'danger', full: true, icon: 'reject', attrs: 'data-w-reject-open aria-expanded="false" aria-controls="w-reject"' }) +
          '<div class="w-reason" id="w-reject" hidden style="margin-top:12px">' +
            c.field('Why are you rejecting this?', c.textarea({ id: 'w-reason', rows: 4, describedBy: 'w-reason-msg', placeholder: 'Say what would need to change for you to approve.' }), { id: 'w-reason', required: true, help: 'At least one sentence (20 characters, 3 words). It is recorded on the proof and sent to the proposer.' }) +
            '<div class="e1-row" style="gap:8px">' + c.button('Reject with this reason', { kind: 'danger', disabled: true, attrs: 'id="w-reject-go"' }) + c.button('Cancel', { kind: 'ghost', attrs: 'data-w-reject-cancel' }) + '</div></div>' +
          '</div>' });
      }
      var dual = '';
      if (ob.quorum > 1) {
        var firstDone = q.one === '1';
        dual = c.card({ title: 'Dual control · two approvers', body: '<div class="e1-stack e1-stack--sm">' + ob.waiting.map(function (x, i) {
          var done = (firstDone && i === 0) || (st === 'first-of-two' && x === (asP ? asP.id : 'ravi-shankar')) || st === 'approved';
          return '<div class="w-approver"><div><div class="w-approver__n">Approver ' + (i + 1) + ' of 2</div>' + actor(person(x).name, 'person', person(x).role, 'sm') + '</div>' + (done ? c.badge('good', 'Approved', { icon: 'check' }) : c.badge('neutral', 'Not yet', { icon: 'minus' })) + '</div>';
        }).join('') + '<p class="w-note">Two different named people, neither of them the proposer. Each approval is its own governed write; nothing is written until both are recorded.</p></div>' });
      }
      var links = c.card({ title: 'Links', body: '<ul class="e1-stack e1-stack--sm" role="list" style="list-style:none;margin:0;padding:0">' + [
        ob.record ? ['records', 'The record · ' + ob.record, '#/records/object/' + encodeURIComponent(ob.record)] : null,
        ob.esc ? ['proof', 'The proof · escalation ' + seqTxt(ob.esc), proofHref(ob.esc)] : ['proof', 'Proof', '#/assurance/proof'],
        [ob.by.kind === 'agent' ? 'agents' : 'user', (ob.by.kind === 'agent' ? 'The agent · ' : 'The person · ') + ob.by.name, actorHref(ob.by.name, ob.by.kind)],
        ['tag', 'The write type · ' + ob.wt, wtHref(ob.wt)],
        ['file-text', 'The declaration · ' + declOf(ob), declHref(declId(ob))],
        ['scale', 'The rules · policy v' + ob.policy, '#/records/policies/' + ob.policy]
      ].filter(Boolean).map(function (l) { return '<li><a style="display:grid;grid-template-columns:16px minmax(0,1fr);gap:8px;align-items:start;text-decoration:none;overflow-wrap:anywhere" href="' + l[2] + '">' + c.icon(l[0], 14) + '<span>' + esc(l[1]) + '</span></a></li>'; }).join('') + '</ul>' });
      h += '<div class="e1-split" style="margin-top:var(--space-5)"><div>' + main + '</div><aside class="w-panel" aria-label="Decision">' + panel + dual + links + '</aside></div>';
      return h;
    },
    mount: function (el, p, q) {
      var path = '/work/decide/' + p.id, ob = findOb(p.id) || (/^OB-\d{4}-\d{4}$/.test(p.id) ? synthOb(p.id) : null);
      var h1 = el.querySelector('.e1-ph__title'); if (h1 && !q.state) { h1.setAttribute('tabindex', '-1'); try { h1.focus({ preventScroll: true }); } catch (e) { /* ok */ } }
      var res = el.querySelector('#w-result'); if (res && q.state !== 'recording') { try { res.focus({ preventScroll: false }); } catch (e) { /* ok */ } }
      if (!ob) return;
      var open = el.querySelector('[data-w-reject-open]'), box = el.querySelector('#w-reject'), ta = el.querySelector('#w-reason'), go = el.querySelector('#w-reject-go');
      function showReject(on) { if (!box) return; box.hidden = !on; open.setAttribute('aria-expanded', on ? 'true' : 'false'); if (on) ta.focus(); }
      if (open) open.addEventListener('click', function () { showReject(box.hidden); });
      var cancel = el.querySelector('[data-w-reject-cancel]'); if (cancel) cancel.addEventListener('click', function () { showReject(false); open.focus(); });
      if (ta) ta.addEventListener('input', function () {
        var ok = reasonValid(ta.value); go.disabled = !ok;
        var msg = el.querySelector('#w-reason-msg'); if (msg) msg.textContent = ok ? 'Ready. This reason is recorded on the proof and sent to the proposer.' : 'At least one sentence (20 characters, 3 words). ' + ta.value.trim().length + ' characters so far.';
      });
      if (go) go.addEventListener('click', function () { if (!reasonValid(ta.value)) return; rememberReason(ob.id, ta.value.trim()); E1.go(path, { state: 'recording', next: 'rejected', as: q.as || '', one: q.one || '' }); });
      if (q.act === 'reject' && box) showReject(true);
      if (q.act === 'approve') { var ab = el.querySelector('#w-approve-btn'); if (ab) { try { ab.scrollIntoView({ block: 'center' }); } catch (e) { /* ok */ } ab.focus(); E1.toast('Read the change and the checks, then press Approve.', 'info', { timeout: 3200 }); } }
      if (q.state === 'recording') {
        var next = q.next || 'approved', holder = el.querySelector('#w-rec-rungs'), step = 1, stopAt = next === 'write-failed' ? 7 : 9;
        var tick = function () {
          var r = E1.state.route || {};
          if (r.pattern !== '/work/decide/:id' || (r.query || {}).state !== 'recording' || r.params.id !== p.id) return;
          if (holder && holder.innerHTML) holder.innerHTML = ladder({ outcome: 'running', at: Math.min(step, 9) });
          step++;
          if (!holder || !holder.innerHTML || step > stopAt + 1) { E1.go(path, { state: next, as: q.as || '', one: q.one || '' }, { replace: true }); return; }
          setTimeout(tick, 260);
        };
        setTimeout(tick, holder && holder.innerHTML ? 300 : 1100);
      }
    }
  });
  E1.action('w-approve', function (el) {
    var id = el.getAttribute('data-value'), ob = findOb(id) || synthOb(id), r = E1.state.route || {}, qq = r.query || {};
    var target = { path: '/work/decide/' + id, as: qq.as || '' };
    if (qq.one === '1') { target.next = 'approved'; target.extra = { one: '1' }; }
    if (r.pattern === '/m/decide/:id') { target.path = '/m/decide/' + id; target.mobile = true; }
    confirmApprove(ob, target);
  });
  E1.action('w-sendto', function (el) { E1.toast('Sent to ' + el.getAttribute('data-value') + '. You will see the outcome here.', 'good'); E1.announce('Sent to ' + el.getAttribute('data-value')); });
  E1.action('w-pause', function (btn) {
    var main = document.getElementById('e1-main'); if (!main) return;
    var on = btn.getAttribute('aria-pressed') !== 'true';
    Array.prototype.forEach.call(main.querySelectorAll(on ? '[data-deadline]' : '[data-w-paused]'), function (d) {
      if (on) { d.setAttribute('data-w-paused', d.getAttribute('data-deadline')); d.removeAttribute('data-deadline'); var t = d.querySelector('.e1-countdown__t'); if (t) t.textContent = 'Timer paused'; }
      else { d.setAttribute('data-deadline', d.getAttribute('data-w-paused')); d.removeAttribute('data-w-paused'); }
    });
    Array.prototype.forEach.call(main.querySelectorAll('.w-pausebtn'), function (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.querySelector('span').textContent = on ? 'Resume timers' : 'Pause timers'; });
    E1.toast(on ? 'On-screen timers paused. The obligations still expire at their declared time.' : 'Timers resumed.', 'neutral', { timeout: 3200 });
    if (!on && E1.tick) E1.tick();
  });
  /* Announce the Decide deadline at 1 h, 15 min and 5 min (E06 §09) */
  var announced = {};
  setInterval(function () {
    var el = document.querySelector('[data-w-announce] [data-deadline]'); if (!el) return;
    var id = el.parentNode.getAttribute('data-w-announce'), left = (new Date(el.getAttribute('data-deadline')).getTime() - Date.now()) / 60000;
    [60, 15, 5].forEach(function (m) { var key = id + ':' + m; if (left <= m && left > m - 1 && !announced[key]) { announced[key] = 1; E1.announce(id + ' expires in ' + m + (m === 60 ? ' minutes (1 hour)' : ' minutes')); } });
  }, 20000);

  function resolvedView(hi) {
    var w = wt(hi.wt);
    var word = { approved: 'approved by ' + hi.decidedBy + (hi.channel === 'Voice' ? ' by voice' : '') + ' at ' + hi.at, declined: 'rejected by ' + hi.decidedBy + ' at ' + hi.at, expired: 'not decided in time; it expired at ' + hi.at, 'approved-not-done': 'approved by ' + hi.decidedBy + ', but the write itself did not complete (GATE.SANDBOX_DIVERGED)' }[hi.status];
    var kind = hi.status === 'approved' ? 'good' : hi.status === 'approved-not-done' ? 'critical' : 'neutral';
    var trail = [];
    if (hi.esc) trail.push([hi.esc, 'Escalated', 'escalated']);
    trail.push([hi.seq, hi.status === 'declined' ? 'Rejected' : hi.status === 'expired' ? 'Expired' : hi.status === 'approved-not-done' ? 'Not done' : 'Approved', hi.status === 'approved' || hi.status === 'declined' ? 'committed' : 'refused']);
    if (hi.commit) trail.push([hi.commit, 'Committed', 'committed']);
    return c.pageHeader({ eyebrow: hi.id + ' · ' + w.label + ' · closed', title: hi.proposal + (hi.amount ? ' · ' + fmt.inr(hi.amount) : '') }) +
      result(kind, kind === 'good' ? 'check' : kind === 'critical' ? 'alert' : 'refuse', 'This request is no longer open.', '<p>It was ' + esc(word) + ' — see proof ' + seqTxt(hi.seq) + '.</p>' + (hi.reason ? '<p class="w-just" style="margin-top:8px">“' + esc(hi.reason) + '”</p>' : '') + (hi.note ? '<p class="w-note" style="margin-top:8px">' + esc(hi.note) + '</p>' : ''),
        c.button('Show proof ' + seqTxt(hi.seq), { href: proofHref(hi.seq), kind: 'primary', icon: 'proof' }) + (hi.status === 'approved-not-done' ? c.button('See why', { href: '#/work/not-done/' + hi.seq }) : '') + c.button('Escalation history', { href: '#/work/escalations', kind: 'ghost' }), null, null) +
      sec('Related records', seqTrail(trail)) +
      sec('Proposal', c.kv([['Proposed by', actor(hi.by.name, hi.by.kind), { html: true }], ['Write type', w.label + ' · ' + hi.wt], ['Channel of the decision', hi.channel]], { cols: 2 }));
  }

  /* ========================================================================
     /work/not-done — refusals that need an action (E06 §04)
     ======================================================================== */
  NOTDONE[4096] = { code: 'GATE.DUAL_CONTROL_SAME_ACTOR', cls: 'gate', rung: '3', gate: 'G4', title: 'You proposed this, so you cannot also approve it', short: 'same person proposed and approved', wt: 'platform.obligation.resolve', tried: 'Approve OB-2026-0418 · Raise credit note CN-2026-00077', by: { name: 'Ravi Shankar', kind: 'person', level: null }, at: '24 Sep 2026, 11:40 IST', decl: 'platform v3',
    rule: 'A second named actor, not the proposer, must approve a dual-control write.', numbers: [['Proposed by', 'Ravi Shankar'], ['Approval attempted by', 'Ravi Shankar']],
    operator: 'Find a second named actor.', actions: [{ label: 'Send to Venkat Raman', action: 'w-sendto', value: 'Venkat Raman', icon: 'send' }, { label: 'Send to Meenakshi Iyer', action: 'w-sendto', value: 'Meenakshi Iyer', kind: 'secondary', icon: 'send' }], failed: 'G4' };
  function ndGates(r) {
    var list = wt(r.wt).gates.map(function (g) { return { id: g, name: g === 'G7' ? 'Counterparty' : GATE_NAME[g], result: 'passed', words: gateWords(g, { cp: /ACME/.test(r.tried) ? 'ACME Textiles' : null }), version: r.decl }; });
    if (r.failed !== 'G4') list.forEach(function (g) { if (g.id === 'G4') { g.result = 'not_run'; g.words = 'Not asked: a second person is sought only once every other gate has passed.'; } });
    if (r.failed) list.forEach(function (g) { if (g.id === r.failed) { g.result = 'failed'; g.words = r.numbers.map(function (n) { return n[0] + ' ' + n[1]; }).join(' · ') + '.'; } });
    if (r.code === 'GATE.SANDBOX_DIVERGED') list.forEach(function (g) { if (g.id === 'G9') g.words = 'Passed in the shadow sandbox; the same check on live read a different bin quantity.'; });
    list.sort(function (a, b) { return (a.result === 'failed' ? 0 : 1) - (b.result === 'failed' ? 0 : 1); });
    return list;
  }
  function rungNum(r) { return Number(String(r.rung).charAt(0)) || 3; }

  E1.route('/work/not-done', {
    title: 'Not done', layout: 'console', door: 'work', section: 'not-done', keywords: 'refusals refused not done operator action',
    render: function (p, q) {
      var st = q.state || '';
      var rows = NOTDONE_ORDER.map(function (s) { var r = NOTDONE[s]; return { seq: s, r: r }; }).filter(function (x) {
        if (q.cls && x.r.cls !== q.cls) return false;
        if (q.kind && x.r.by.kind !== q.kind) return false;
        if (q.wt && x.r.wt !== q.wt) return false;
        return true;
      });
      var h = c.pageHeader({ title: 'Not done', lead: 'Refusals that need an action. A refusal is a correct, free outcome: each one names its rule and one next step, has a proof record, and meters at ₹0.',
        actions: statesMenu('/work/not-done', q, [['empty', 'Nothing needs you'], ['stopped', 'Tenant stopped']]) + c.button('All refusals as evidence', { href: '#/assurance/refusals', kind: 'ghost', iconRight: 'arrow-right' }) });
      if (st === 'stopped') {
        h += stoppedBanner();
        return h + c.table({ caption: 'Not done while stopped', rowHref: function () { return '#/work/not-done/stopped'; }, columns: [{ key: 'a', label: 'What was tried' }, { key: 'b', label: 'Reason' }, { key: 'c', label: 'Proof' }], rows: [{ a: 'Submit invoice · Nilgiri Tea Traders example', b: 'Not done — this workspace is stopped', c: 'None (a stopped workspace writes nothing)' }] });
      }
      var chips = function (key, list, label) { return c.filters(list.map(function (x) { return { label: x[1], href: E1.href('/work/not-done', q2(q, (function () { var o = {}; o[key] = q[key] === x[0] ? '' : x[0]; return o; })())), active: q[key] === x[0] }; }), { label: label }); };
      h += '<div class="e1-stack e1-stack--sm" style="margin-bottom:14px">' + chips('cls', [['policy', 'Policy'], ['gate', 'Gate'], ['platform', 'Platform (our failure)']], 'Class') + chips('kind', [['agent', 'Agent'], ['person', 'Person']], 'By') + '</div>';
      if (st === 'empty' || !rows.length) return h + c.empty({ title: 'Nothing was refused that needs you', why: 'Refusals still appear in Assurance → Refusals as evidence.', action: { label: 'Open Refusals', href: '#/assurance/refusals' }, icon: 'refuse' });
      h += c.table({ caption: 'Refusals that need an action', rowHref: function (x) { return '#/work/not-done/' + x.seq; },
        columns: [
          { key: 'reason', label: 'Reason', render: function (x) { return '<span class="w-prop"><span class="w-prop__t">' + esc(x.r.title) + '</span><span class="w-prop__s"><code>' + esc(x.r.code) + '</code> · rung ' + esc(x.r.rung) + '</span></span>'; } },
          { key: 'when', label: 'When', mono: true, nowrap: true, render: function (x) { return esc(x.r.at.split(', ')[1]); } },
          { key: 'tried', label: 'What was tried', render: function (x) { return esc(x.r.tried); } },
          { key: 'by', label: 'By', render: function (x) { return actor(x.r.by.name, x.r.by.kind, null, 'sm'); } },
          { key: 'o', label: 'Outcome', render: function (x) { return c.outcome('refused', { code: x.r.cls === 'platform' ? x.r.code : null, subtle: true }); } },
          { key: 'next', label: 'Next action', render: function (x) { return esc(x.r.operator); } },
          { key: 'seq', label: 'Proof', mono: true, align: 'right', render: function (x) { return '<a href="' + proofHref(x.seq) + '">' + seqTxt(x.seq) + '</a>'; } }
        ], rows: rows });
      h += '<p class="w-note" style="margin-top:12px">Not billed — refusals meter at zero. A platform failure (PLATFORM.*) is ours, pages us, and is never billed either.</p>';
      return h;
    }
  });

  E1.route('/work/not-done/:id', {
    title: function (p) { var r = NOTDONE[p.id]; return r ? r.title : p.id === 'stopped' ? 'Not done — this workspace is stopped' : 'Not done'; },
    layout: 'console', door: 'work', section: 'not-done', crumbs: [['Work', '#/work/today'], ['Not done', '#/work/not-done']], example: '/work/not-done/4108', keywords: 'refusal explanation not done code rule',
    render: function (p, q) {
      var variants = c.menu({ label: 'Variants', icon: 'eye', align: 'right', items: [{ label: 'Gate · credit limit (#4,098)', href: '#/work/not-done/4098' }, { label: 'Policy · autonomy too low (#4,106)', href: '#/work/not-done/4106' }, { label: 'Platform · our failure (#4,102)', href: '#/work/not-done/4102' }, { label: 'Shadow sandbox disagreed (#4,112)', href: '#/work/not-done/4112' }, { label: 'Tenant stopped (no proof record)', href: '#/work/not-done/stopped' }] });
      if (p.id === 'stopped') {
        return c.pageHeader({ eyebrow: 'Not done · Nilgiri Tea Traders Pvt Ltd · example', title: 'Not done — this workspace is stopped', actions: variants }) +
          '<p class="w-code-small"><code>POLICY.TENANT_STOPPED</code> · rung 0b</p>' +
          '<p class="w-rule" style="margin-top:10px">This workspace is stopped (suspected credential exposure) since 24 Sep 2026, 16:05 IST, by Meenakshi Iyer with Arjun Mehta. No writes, including refusals, are being recorded.</p>' +
          '<div style="margin-top:16px">' + ladder({ stopped: true }) + '</div>' +
          '<div class="e1-split" style="margin-top:var(--space-5)"><div>' + c.callout({ kind: 'rule', title: 'Why there is no proof link', body: '<p>A stopped workspace writes nothing, so this refusal has no proof record. The stop itself is proof #612. It is the only refusal without a record of its own.</p>' }) + '</div>' +
          '<aside class="w-panel"><div class="w-action"><span class="w-action__q">What to do</span><span class="w-action__t">Resolve the stop event; it names its cause class.</span><div class="w-action__row">' + c.button('View stop event', { kind: 'primary', href: '#/records/tenants/nilgiri-tea', icon: 'stop' }) + '</div></div><p class="w-note">Not billed — nothing was recorded or metered.</p></aside></div>';
      }
      var r = NOTDONE[p.id], ce = chainEntry(p.id);
      if (!r) {
        if (ce && ce.outcome !== 'refused') return c.pageHeader({ title: 'This write was not refused', lead: 'Proof ' + seqTxt(ce.seq) + ' is ' + (ce.outcome === 'committed' ? 'committed' : 'waiting on a person') + ', so there is nothing to explain here.' }) + c.empty({ title: 'Nothing is Not done at ' + seqTxt(ce.seq), why: wt(ce.wt).label + ' · ' + ce.obj + ' · ' + ce.actor + ' (' + kindWord(ce.kind) + ').', action: [{ label: 'Open the write', href: '#/work/writes/' + ce.seq }, { label: 'Show the proof', href: proofHref(ce.seq), kind: 'ghost' }], icon: 'check' });
        return c.pageHeader({ title: 'No refusal at this address', lead: 'Refusals are addressed by their proof number, such as #4,098.' }) + c.empty({ title: 'We could not find “' + p.id + '”', why: 'It may belong to another tenant, or it may be a write that was not refused.', action: [{ label: 'Back to Not done', href: '#/work/not-done' }, { label: 'Search the proof', href: '#/assurance/proof', kind: 'ghost' }], icon: 'search' });
      }
      var plat = r.cls === 'platform', seq = Number(p.id);
      var h = c.pageHeader({ eyebrow: (plat ? 'Our failure' : 'Not done') + ' · ' + kindWord(r.by.kind) + ' · ' + r.by.name, title: r.title, actions: variants });
      h += '<p class="w-code-small"><code>' + esc(r.code) + '</code> · rung ' + esc(r.rung) + (r.gate ? ' · ' + esc(r.gate) : '') + '</p>';
      h += '<p class="w-rule" style="margin-top:10px">' + esc(plat ? 'This is our failure, not a rule. Nothing was changed, you have not been billed, and we have been paged.' : r.rule) + '</p>';
      h += '<dl class="w-nums">' + r.numbers.map(function (n) { return '<div><dt>' + esc(n[0]) + '</dt><dd>' + esc(n[1]) + '</dd></div>'; }).join('') +
        '<div><dt>Declaration</dt><dd style="font-size:var(--text-lead)"><a href="' + declHref(r.decl.split(' ')[0]) + '">' + esc(r.decl) + '</a></dd></div><div><dt>Time</dt><dd style="font-size:var(--text-lead)">' + esc(r.at) + '</dd></div></dl>';
      var main = sec('What was tried', c.kv([['Write', esc(r.tried), { html: true }], ['By', actor(r.by.name, r.by.kind, r.by.level === null ? c.AUTONOMY[0][0] + ' Observe (no grant)' : r.by.level ? r.by.level + ' ' + (c.AUTONOMY[Number(r.by.level.slice(1))] || [])[1] : null), { html: true }], ['Write type', '<a href="' + wtHref(r.wt) + '">' + esc(wt(r.wt).label) + '</a> <span class="e1-mono e1-muted">' + esc(r.wt) + '</span>', { html: true }], ['Outcome', r.cls === 'platform' ? c.badge('critical', 'Our failure', { icon: 'alert' }) : c.outcome('refused'), { html: true }]], { cols: 2 }));
      if (r.both) main += sec('Both results', c.table({ caption: 'Shadow sandbox result against the live re-run', columns: [{ key: 0, label: 'Check' }, { key: 1, label: 'Shadow sandbox' }, { key: 2, label: 'Live re-run' }], rows: r.both.map(function (b) { return { 0: b[0], 1: b[1], 2: b[2] }; }) }) + '<p class="w-note" style="margin-top:8px">Approved by ' + esc(r.approvedBy) + ' (' + esc(r.obligation) + '). Your approval stands on the record; the write did not.</p>', { id: 'w-both' });
      main += sec('Gate results', c.gates(ndGates(r), { version: r.decl }), { lead: 'Every declared gate ran, even after the first failure. ' + (r.failed ? 'The failed one is first.' : 'All passed; the refusal came from a later rung.') });
      main += sec('Where it stopped', ladder({ outcome: 'refused', at: rungNum(r), caption: 'Refused at rung ' + esc(r.rung) + '. Rung 8 still wrote the record (record_id zero, record_version 0); rung 9 metered it at zero.' }));
      var acts = r.actions.map(function (a, i) {
        if (a.action) return c.button(a.label, { kind: i === 0 ? 'primary' : (a.kind || 'secondary'), icon: a.icon, attrs: 'data-action="' + a.action + '"' + (a.value ? ' data-value="' + esc(a.value) + '"' : '') });
        return c.button(a.label, { kind: i === 0 ? 'primary' : (a.kind || 'secondary'), href: a.href, icon: a.icon, attrs: a.scroll ? 'data-scrollto="' + a.scroll + '"' : '' });
      }).join('');
      var side = '<div class="w-action"><span class="w-action__q">What to do</span><span class="w-action__t">' + esc(r.operator) + '</span><div class="w-action__row">' + acts + '</div>' + (r.actions[0].note ? '<span class="w-note">' + esc(r.actions[0].label) + ' is ' + esc(r.actions[0].note) + '.</span>' : '') + '</div>' +
        c.button('Show the record of this refusal', { href: proofHref(seq), kind: 'ghost', icon: 'proof', full: true }) +
        '<p class="w-note">' + (plat ? 'Not billed — platform failures are ours and never billable.' : 'Not billed — refusals meter at zero.') + ' The refusal is evidence.</p>' +
        c.card({ title: 'Proof ' + seqTxt(seq), body: c.kv([['prev_digest → digest', '<span class="e1-mono">' + esc((DIGESTS[seq - 1] || '—') + ' → ' + (DIGESTS[seq] || '—')) + '</span>', { html: true }], ['record_id', '00000000-0000-0000-0000-000000000000', { mono: true }], ['Mode', 'live'], ['Level', c.level('L1'), { html: true }]], { compact: true }) });
      h += '<div class="e1-split" style="margin-top:var(--space-5)"><div>' + main + '</div><aside class="w-panel" aria-label="Next action">' + side + '</aside></div>';
      return h;
    }
  });
  E1.action('w-retry', function () { E1.toast('Retried with the same intent_id. ERPNext answered this time; we will show the result here.', 'info', { title: 'Try again (same request)' }); });

  /* ========================================================================
     Requests — New request, compiled from each write type's payload schema
     ======================================================================== */
  var MYGRANT = { 'erp.payment_entry.submit': 'A4', 'erp.sales_invoice.submit': 'A4', 'erp.credit_limit.change': 'A2', 'erp.credit_note.submit': 'A2', 'erp.journal_entry.submit': 'A4', 'erp.customer.create': 'A3', 'erp.supplier.create': 'A3', 'platform.autonomy.grant': 'A2', 'erp.payment_run.submit': 'A2' };
  var CUSTOMERS = ['ACME Textiles', 'Lakshmi Garments', 'Shree Murugan Traders', 'Annapoorna Textiles', 'Sri Venkateswara Fabrics'];
  var SCHEMA = {
    'erp.payment_entry.submit': [['party', 'Customer', 'select', CUSTOMERS], ['amount', 'Amount received', 'money'], ['ref', 'Bank reference (UTR)', 'text', 'UTR 428119'], ['date', 'Posting date', 'date', '2026-09-24'], ['against', 'Against invoice', 'select', ['SINV-2026-01102 · ₹1,12,500', 'SINV-2026-01187 · ₹2,40,000', 'On account (no invoice)']]],
    'erp.sales_invoice.submit': [['party', 'Customer', 'select', CUSTOMERS], ['item', 'Item', 'select', ['YARN-40S · Cotton yarn 40s combed', 'YARN-40S-CW · 40s combed, compact', 'YARN-30S · Cotton yarn 30s carded']], ['qty', 'Quantity (kg)', 'number', '400'], ['rate', 'Rate per kg', 'money', '300'], ['amount', 'Grand total', 'money']],
    'erp.credit_limit.change': [['party', 'Customer', 'select', CUSTOMERS], ['current', 'Current limit', 'readonly', '₹3,00,000'], ['amount', 'New limit', 'money', '500000'], ['reason', 'Reason', 'textarea', '']],
    'erp.credit_note.submit': [['party', 'Customer', 'select', CUSTOMERS], ['against', 'Against invoice', 'select', ['SINV-2026-01102', 'SINV-2026-01187']], ['amount', 'Amount', 'money'], ['reason', 'Reason', 'textarea', '']],
    'erp.journal_entry.submit': [['dr', 'Debit account', 'select', ['Freight Inward - KSM', 'Power & Fuel - KSM', 'Repairs - KSM']], ['cr', 'Credit account', 'select', ['Accrued Expenses - KSM', 'Creditors - KSM']], ['amount', 'Amount', 'money'], ['reason', 'Remark', 'text', '']],
    'erp.customer.create': [['name', 'Customer name', 'text', ''], ['gstin', 'GSTIN', 'text', ''], ['amount', 'Opening credit limit', 'money', '100000']],
    'erp.supplier.create': [['name', 'Supplier name', 'text', ''], ['gstin', 'GSTIN', 'text', ''], ['udyam', 'Udyam (MSME) number', 'text', '']],
    'platform.autonomy.grant': [['actor', 'Agent', 'select', ['vendor-onboarding agent', 'bank-recon-agent', 'ar-agent', 'ap-agent', 'stock-agent']], ['wt', 'Write type', 'select', ['erp.supplier.create', 'erp.payment_entry.submit', 'erp.sales_invoice.submit']], ['to', 'Proposed grant', 'select', ['A1 Draft', 'A2 Propose', 'A3 Act reversible', 'A4 Act bounded']], ['reason', 'Justification (your words)', 'textarea', '']],
    'erp.payment_run.submit': [['bills', 'Bills to include', 'select', ['3 MSME bills due by 8 Nov · ₹5,93,240', 'All bills due this week · ₹18,42,760']], ['bank', 'Bank account', 'select', ['HDFC Current ··4471']], ['amount', 'Total', 'money', '593240']]
  };
  function schemaFor(name) { return SCHEMA[name] || [['ref', 'Reference', 'text', ''], ['amount', 'Amount (if any)', 'money'], ['reason', 'Notes', 'textarea', '']]; }
  function scopeAnswer(name, amt, viaAgent) {
    var w = wt(name), g = MYGRANT[name] || 'A2';
    if (viaAgent) return { kind: 'escalated', text: viaAgent + ' will draft this and propose it at A2 Propose. It comes back to Approvals, and a person approves before anything is written.' };
    if (name === 'erp.sales_invoice.submit' && amt > 300000) return { kind: 'refused', text: 'Checks will refuse this: it would take the customer above the ₹3,00,000 credit limit (GATE.PRECONDITION_FAILED). It will be recorded at ₹0.' };
    if (/Above ₹2,00,000/.test(w.dual) && amt > 200000) return { kind: 'escalated', text: 'This will need approval from a second named person (Meenakshi Iyer or Ravi Shankar), because the amount is above ₹2,00,000.' };
    if (/Above ₹1,00,000/.test(w.dual) && amt > 100000) return { kind: 'escalated', text: 'This will need approval from a second named person, because the amount is above ₹1,00,000.' };
    if (/Above ₹5,00,000/.test(w.dual) && amt > 500000) return { kind: 'escalated', text: 'This will need approval from Ravi Shankar, because the amount is above ₹5,00,000.' };
    if (/^Always|Forced/.test(w.dual) || g === 'A2' || w.rev === false) return { kind: 'escalated', text: 'This will need approval from ' + (name === 'erp.credit_limit.change' ? 'Meenakshi Iyer or Ravi Shankar' : 'a second named person') + ', because ' + (w.rev === false ? 'it is irreversible and can never be auto-approved.' : /^Always|Forced/.test(w.dual) ? 'the declaration requires dual control on every ' + w.label.toLowerCase() + '.' : 'you hold A2 Propose on it.') };
    return { kind: 'committed', text: 'You can commit this yourself: you hold ' + g + ' ' + c.AUTONOMY[Number(g.slice(1))][1] + ' on ' + w.label + ', and it is ' + w.revText.charAt(0).toLowerCase() + w.revText.slice(1) };
  }

  E1.route('/work/requests', {
    title: 'Requests', layout: 'console', door: 'work', section: 'requests', keywords: 'new request submit write form ask agent',
    render: function (p, q) {
      var mine = Object.keys(MYGRANT);
      var h = c.pageHeader({ title: 'Requests', lead: 'Ask for a change in words the declaration understands. Each form is compiled from the write type’s payload, and it tells you before you press Confirm whether the change will need a person.', actions: statesMenu('/work/requests', q, [['empty', 'Nothing raised yet']]) });
      var newRows = mine.map(function (n) { var w = wt(n), sa = scopeAnswer(n, 0); return { n: n, w: w, self: sa.kind === 'committed' }; });
      h += '<div style="margin-top:var(--space-5)">' + c.card({ title: 'New request', actions: '<span class="e1-caption e1-muted">' + newRows.length + ' write types you may submit from the web console</span>', flush: true,
        body: c.table({ caption: 'Write types you may request', rowHref: function (r) { return '#/work/request/' + r.n; }, columns: [
          { key: 'n', label: 'Write type', render: function (r) { return '<span class="w-prop"><span class="w-prop__t">' + esc(r.w.label) + '</span><span class="w-prop__s e1-mono">' + esc(r.n) + '</span></span>'; } },
          { key: 'g', label: 'Your grant', mono: true, render: function (r) { return esc(MYGRANT[r.n]); } },
          { key: 'b', label: 'Blast radius', render: function (r) { return c.blast(r.w.blast, { compact: true }); } },
          { key: 's', label: 'Before you press Confirm', render: function (r) { return r.self ? c.verdict('pass', 'You can commit this yourself', { icon: 'check' }) : c.verdict('watch', 'Needs a second named person' + (/Above/.test(r.w.dual) ? ' ' + r.w.dual.toLowerCase() : ''), { icon: 'gate' }); } },
          { key: 'a', label: 'Open', align: 'right', render: function (r) { return c.button('New request', { size: 'sm', href: '#/work/request/' + r.n, icon: 'plus' }); } }
        ], rows: newRows, empty: { title: 'No write type you may submit', why: 'Only the write types you may submit from the web console are shown.' } }),
        footer: '<span>Only the write types you may submit from the web console are shown. Controls you may not use are not rendered.</span>' }) + '</div>';
      h += '<div style="margin-top:var(--space-5)">' + c.card({ title: 'Ask an agent', actions: '<span class="e1-caption e1-muted">Agents propose; people approve</span>', flush: true, body: c.attention([
        { kind: 'ar-agent · A2 Propose', icon: 'agents', title: 'Ask ar-agent to draft an invoice', href: '#/work/request/erp.sales_invoice.submit?agent=ar-agent', body: 'ar-agent proposes at A2; the draft returns to Approvals for a person. Use it for routine invoices against open sales orders.', meta: [c.who('ar-agent', { kind: 'agent' }), c.tag('erp.sales_invoice.submit'), c.channel('Web')], actions: [{ label: 'New request to ar-agent', href: '#/work/request/erp.sales_invoice.submit?agent=ar-agent' }] },
        { kind: 'gst-agent · A1 Draft · due 11 Oct 2026', icon: 'agents', title: 'Ask gst-agent to draft GSTR-1 for September', href: '#/work/request/erp.gstr1.file?agent=gst-agent', body: 'gst-agent drafts at A1. Filing is irreversible and crosses an organisation boundary, so Meenakshi Iyer approves. Due 11 Oct 2026.', meta: [c.who('gst-agent', { kind: 'agent' }), c.tag('erp.gstr1.file'), c.reversible(false)], actions: [{ label: 'New request to gst-agent', href: '#/work/request/erp.gstr1.file?agent=gst-agent' }] }
      ]) }) + '</div>';
      var reqs = CHAIN.filter(function (e) { return e.kind === 'person' && e.wt.indexOf('platform.') !== 0; });
      h += sec('Recent requests by people', q.state === 'empty' ? c.empty({ title: 'You have not raised a request today', why: 'Requests you submit here appear in this list with their outcome and proof number.', action: { label: 'Record a payment', href: '#/work/request/erp.payment_entry.submit' }, icon: 'file-text' }) :
        c.table({ caption: 'Requests by people today', rowHref: function (e) { return e.outcome === 'escalated' ? '#/work/decide/' + e.code : '#/work/writes/' + e.seq; }, columns: [{ key: 'wt', label: 'Request', render: function (e) { return '<span class="w-prop"><span class="w-prop__t">' + esc(wt(e.wt).label) + '</span><span class="w-prop__s">' + esc(e.obj) + '</span></span>'; } }, { key: 'actor', label: 'By', render: function (e) { return actor(e.actor, 'person', null, 'sm'); } }, { key: 't', label: 'Time', mono: true }, { key: 'o', label: 'Outcome', render: function (e) { return c.outcome(e.outcome, { subtle: true }) + (e.outcome === 'escalated' ? ' <span class="e1-caption e1-mono">' + esc(e.code) + '</span>' : ''); } }, { key: 'seq', label: 'Proof', mono: true, align: 'right', render: function (e) { return seqTxt(e.seq); } }], rows: reqs }));
      return h;
    }
  });

  E1.route('/work/request/:writeType', {
    title: function (p) { return 'New request · ' + wt(p.writeType).label; }, layout: 'console', door: 'work', section: 'requests', crumbs: [['Work', '#/work/today'], ['Requests', '#/work/requests']], example: '/work/request/erp.payment_entry.submit', keywords: 'new request form',
    render: function (p, q) {
      var name = p.writeType, w = wt(name), fields = schemaFor(name), st = q.state || '';
      var from = q.from ? chainEntry(q.from) || NOTDONE[q.from] : null;
      var viaAgent = q.agent || '';
      var h = c.pageHeader({ eyebrow: 'New request · ' + name, title: w.label, lead: w.unknown ? 'This write type is not in the declarations you can see. Check the name, or pick one from Requests.' : 'Compiled from the declared payload of ' + name + ' at ' + w.decl + ' v' + w.v + '. Nothing is written until you confirm and every rung passes.',
        actions: c.button('Write type', { href: wtHref(name), kind: 'ghost', icon: 'tag' }) });
      if (w.unknown) return h + c.empty({ title: 'No form for “' + name + '”', why: 'A request form exists only for a write type declared at an explicit version. There is no generic write.', action: { label: 'Back to Requests', href: '#/work/requests' }, icon: 'file-text' });
      if (st === 'checking' || st === 'committed' || st === 'escalated') return h + requestOutcome(name, q);
      var pre = { party: q.customer || (from && /ACME/.test(from.tried || from.obj || '') ? 'ACME Textiles' : ''), name: q.name || '', actor: q.actor || '', wt: q.wt || '' };
      if (q.from === '4098') { pre.amount = '300000'; pre.qty = '1000'; pre.rate = '300'; }
      if (from) h += banner('info', 'Starting from ' + (NOTDONE[q.from] ? NOTDONE[q.from].title + ' (proof ' + seqTxt(q.from) + ')' : 'proof ' + seqTxt(q.from)), q.from === '4098' ? 'The refused draft was ₹4,20,000. The limit is ₹3,00,000 and nothing else is outstanding, so ₹3,00,000 or less will pass the credit-limit check.' : 'The values that can be reused are filled in. This is a new request with its own proof.');
      if (viaAgent) h += banner('info', 'New request to ' + viaAgent, viaAgent + ' drafts and proposes this at ' + (viaAgent === 'gst-agent' ? 'A1 Draft' : 'A2 Propose') + '. It will come back to Approvals before anything is written.');
      var form = '<form id="w-req" class="e1-stack" novalidate>' + fields.map(function (f) {
        var id = 'w-rq-' + f[0], v = pre[f[0]] !== undefined && pre[f[0]] !== '' ? pre[f[0]] : (f[3] && typeof f[3] === 'string' ? f[3] : '');
        var ctrl;
        if (f[2] === 'select') ctrl = c.select({ id: id, name: f[0], options: f[3], value: v || f[3][0] });
        else if (f[2] === 'textarea') ctrl = c.textarea({ id: id, name: f[0], rows: 3, value: v, placeholder: f[0] === 'reason' ? 'One or two sentences. Recorded on the proof, never evaluated.' : '' });
        else if (f[2] === 'readonly') ctrl = c.input({ id: id, name: f[0], value: v, readonly: true, mono: true });
        else if (f[2] === 'money') ctrl = c.input({ id: id, name: f[0], value: v, prefix: '₹', mono: true, attrs: 'inputmode="numeric" autocomplete="off"', placeholder: '0' });
        else if (f[2] === 'number') ctrl = c.input({ id: id, name: f[0], value: v, mono: true, attrs: 'inputmode="numeric"' });
        else if (f[2] === 'date') ctrl = c.input({ id: id, name: f[0], value: v, type: 'date' });
        else ctrl = c.input({ id: id, name: f[0], value: v });
        return c.field(f[1], ctrl, { id: id, required: f[2] !== 'textarea' && f[2] !== 'readonly', optional: f[2] === 'textarea' && f[0] !== 'reason' });
      }).join('') +
        '<div class="e1-row" style="gap:10px;margin-top:6px">' + c.button('Confirm', { kind: 'gate', type: 'submit', attrs: 'id="w-req-go"' }) + c.button('Cancel', { kind: 'ghost', href: '#/work/requests' }) + '</div></form>';
      var side = c.card({ title: 'Before you press Confirm', body: '<div id="w-scope" aria-live="polite"></div>' +
        '<div style="margin-top:14px">' + c.kv([['Blast radius', c.blast(w.blast, { compact: true }), { html: true }], ['Reversal', reversibleChip(w) + '<div class="w-note" style="margin-top:4px">' + esc(w.revText) + '</div>', { html: true }], ['Dual control', w.dual], ['Gates that will run', w.gates.map(function (g) { return GATE_NAME[g]; }).join(' · ')], ['Declaration', w.decl + ' v' + w.v, { mono: true }], ['Channel', 'Web console']], { compact: true }) + '</div>' });
      h += '<div class="e1-split"><div>' + c.card({ body: form }) + '</div><aside class="w-panel">' + side + '</aside></div>';
      return h;
    },
    mount: function (el, p, q) {
      var form = el.querySelector('#w-req'); if (!form) { if (q.state === 'checking') runChecking(el, p, q); return; }
      var name = p.writeType;
      function amt() {
        var a = form.querySelector('[name="amount"]'), qty = form.querySelector('[name="qty"]'), rate = form.querySelector('[name="rate"]');
        if (qty && rate && a) { var t = (Number(String(qty.value).replace(/\D/g, '')) || 0) * (Number(String(rate.value).replace(/\D/g, '')) || 0); a.value = t ? String(t) : ''; a.readOnly = true; }
        return a ? Number(String(a.value).replace(/[^\d]/g, '')) || 0 : 0;
      }
      function scope() {
        var sa = scopeAnswer(name, amt(), q.agent), box = el.querySelector('#w-scope');
        var tone = sa.kind === 'committed' ? 'good' : sa.kind === 'refused' ? 'neutral' : 'warning';
        box.innerHTML = '<p class="e1-label" style="margin-bottom:6px">What will happen</p>' + c.badge(tone, sa.kind === 'committed' ? 'You can commit this' : sa.kind === 'refused' ? 'Will be Not done' : 'Needs a person', { icon: sa.kind === 'committed' ? 'check' : sa.kind === 'refused' ? 'refuse' : 'gate' }) + '<p class="w-note" style="margin-top:8px">' + esc(sa.text) + '</p><p class="w-meter-hint" style="margin-top:6px">From scope(): advisory, not a decision. The rungs decide when you confirm.</p>';
        return sa;
      }
      form.addEventListener('input', scope); form.addEventListener('change', scope); scope();
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var bad = null;
        Array.prototype.forEach.call(form.querySelectorAll('input:not([readonly])'), function (i) { var f = i.closest('.e1-field'); var req = f && f.querySelector('.e1-field__req'); if (req && !String(i.value).trim()) { i.setAttribute('aria-invalid', 'true'); if (!bad) bad = i; } else i.removeAttribute('aria-invalid'); });
        if (bad) { bad.focus(); E1.toast('Fill in the required fields first. Nothing was submitted.', 'neutral'); return; }
        var sa = scope(), a = amt(), party = (form.querySelector('[name="party"]') || form.querySelector('[name="name"]') || form.querySelector('[name="actor"]') || {}).value || '';
        E1.go('/work/request/' + name, { state: 'checking', out: sa.kind, amount: a || '', party: party, agent: q.agent || '' });
      });
    }
  });
  function runChecking(el, p, q) {
    var holder = el.querySelector('#w-chk'), n = 1, stopAt = q.out === 'refused' ? 3 : q.out === 'escalated' ? 6 : 9;
    var tick = function () {
      var r = E1.state.route || {}; if (r.pattern !== '/work/request/:writeType' || (r.query || {}).state !== 'checking') return;
      if (holder) holder.innerHTML = ladder({ outcome: 'running', at: n });
      var lab = el.querySelector('#w-chk-l'); if (lab) lab.textContent = n < 7 ? 'Checking…' : n === 7 ? 'Applying to the shadow sandbox…' : 'Applied. Writing the proof…';
      n++;
      if (n > stopAt + 1) {
        if (q.out === 'refused') { E1.go('/work/not-done/4098', null, { replace: true }); return; }
        E1.go('/work/request/' + p.writeType, { state: q.out === 'escalated' ? 'escalated' : 'committed', amount: q.amount || '', party: q.party || '', agent: q.agent || '' }, { replace: true }); return;
      }
      setTimeout(tick, 240);
    };
    setTimeout(tick, 200);
  }
  function requestOutcome(name, q) {
    var w = wt(name), amtTxt = q.amount ? fmt.inr(Number(q.amount)) : '';
    if (q.state === 'checking') return result('info', 'clock', 'Checking…', '<p id="w-chk-l">Checking…</p><div id="w-chk" style="margin-top:12px">' + ladder({ outcome: 'running', at: 1 }) + '</div>', null, 'Every declared gate runs; nothing is written until rung 7.', 'Checking.');
    if (q.state === 'escalated') {
      var to = q.agent ? q.agent : name === 'erp.credit_limit.change' || name === 'platform.autonomy.grant' ? 'Meenakshi Iyer' : 'Meenakshi Iyer or Ravi Shankar';
      return result('warning', 'gate', q.agent ? 'Sent to ' + q.agent + ' · OB-2026-0426 will follow its draft' : 'Sent for approval to ' + to + ' · OB-2026-0426',
        '<p>' + esc(w.label) + (q.party ? ' · ' + esc(q.party) : '') + (amtTxt ? ' · <span class="e1-mono">' + esc(amtTxt) + '</span>' : '') + ' is escalated and waiting on a person. The escalation is proof #4,113 and meters at zero. You will see the outcome here and in your notifications.</p>',
        c.button('See it in Approvals', { href: '#/work/approvals?filter=anyone', kind: 'primary' }) + c.button('Back to Requests', { href: '#/work/requests', kind: 'ghost' }), 'Escalated · waiting on a person', 'Escalated. Waiting on a person.');
    }
    var label = { 'erp.payment_entry.submit': 'Payment recorded', 'erp.customer.create': 'Customer added', 'erp.supplier.create': 'Supplier added', 'erp.journal_entry.submit': 'Journal entry posted', 'erp.sales_invoice.submit': 'Invoice submitted' }[name] || (w.label + ' · committed');
    return result('good', 'check', label + ' · proof #4,113',
      '<p>' + esc(w.label) + (q.party ? ' · ' + esc(q.party) : '') + (amtTxt ? ' · <span class="e1-mono">' + esc(amtTxt) + '</span>' : '') + ' climbed all nine rungs, passed the shadow sandbox and was written to ERPNext. Meter: 1 × ' + esc(w.basis) + '.</p>',
      c.button('Open the entry in Records', { href: '#/records/object/PE-2026-00981', kind: 'primary', icon: 'records' }) + (w.rev === false ? '' : c.button('Reverse this (30 days)', { href: '#/work/reverse/4113', icon: 'undo' })) + c.button('Show the proof', { href: proofHref(4113), kind: 'ghost', icon: 'proof' }),
      esc(w.revText), label + '. Proof 4113.');
  }

  /* ========================================================================
     /work/writes/:id — a write and its rung trace
     ======================================================================== */
  var WRITE_ALIAS = { w_8c21f4a0: 4101, 'w_8c21': 4101 };
  function rungNotes(e) {
    var w = wt(e.wt);
    var n = { 1: 'actor_kind = ' + (e.kind === 'agent' ? 'agent' : 'human') + ', from the token', 2: w.decl + ' v' + w.v + ' · reachable from this channel', 3: w.gates.length + ' declared gates ran in order', 4: 'allow at policy v11', 5: c.BLAST[w.blast - 1][1] + ', as declared', 6: (e.lvl === '—' ? 'Person' : e.lvl) + ' grant held', 7: 'snapshot → shadow sandbox → live', 8: 'seq ' + fmt.num(e.seq) + ' · ' + (DIGESTS[e.seq] || ''), 9: e.meter };
    if (e.seq === 4101) n[6] = 'A2 Propose · approved by Venkat Raman (#4,100)';
    return n;
  }
  E1.route('/work/writes/:id', {
    title: function (p) { var e = chainEntry(WRITE_ALIAS[p.id] || p.id); return e ? wt(e.wt).label + ' · ' + seqTxt(e.seq) : 'Write'; }, layout: 'console', door: 'work', section: 'requests', crumbs: [['Work', '#/work/today'], ['Requests', '#/work/requests']], example: '/work/writes/4101', keywords: 'write activity rung trace',
    render: function (p, q) {
      var e = chainEntry(WRITE_ALIAS[p.id] || p.id);
      if (!e) return c.pageHeader({ title: 'No write at this address', lead: 'Writes are addressed by proof number (#4,101) or write_id.' }) + c.empty({ title: 'We could not find “' + p.id + '”', why: 'Only writes recorded on this tenant’s chain are shown here.', action: [{ label: 'Today’s activity', href: '#/work/today' }, { label: 'Proof', href: '#/assurance/proof', kind: 'ghost' }], icon: 'search' });
      var w = wt(e.wt), plat = /^PLATFORM/.test(e.code);
      var h = c.pageHeader({ eyebrow: 'Proof ' + seqTxt(e.seq) + ' · ' + e.t + ' IST · 24 Sep 2026', title: w.label + ' · ' + e.obj, meta: c.outcome(e.outcome, { code: e.outcome === 'refused' ? e.code : null }) + '<span>' + esc(e.actor) + ' · <strong>' + kindWord(e.kind) + '</strong>' + (e.lvl !== '—' ? ' · ' + esc(e.lvl) : '') + '</span><span class="e1-mono">' + esc(e.wt) + '</span>',
        actions: c.button('Show the proof', { href: proofHref(e.seq), icon: 'proof' }) + (e.outcome === 'committed' && w.rev !== false && e.wt.indexOf('platform.') !== 0 ? c.button('Reverse this', { href: '#/work/reverse/' + e.seq, icon: 'undo' }) : '') + (e.outcome === 'refused' ? c.button('Why it was not done', { href: '#/work/not-done/' + e.seq, kind: 'primary' }) : '') + (e.outcome === 'escalated' ? c.button('Decide', { href: '#/work/decide/' + e.code, kind: 'primary' }) : '') });
      var at = e.outcome === 'committed' ? 9 : e.outcome === 'escalated' ? 6 : (NOTDONE[e.seq] ? rungNum(NOTDONE[e.seq]) : 3);
      var ladderHtml = '<div class="w-ladder"><div class="w-ladder__0b"><b>0b</b><em>0b · Stop</em><span>Passed</span></div><div>' + c.rungs({ outcome: e.outcome === 'committed' ? 'committed' : e.outcome === 'escalated' ? 'escalated' : 'refused', at: at, notes: rungNotes(e) }) + '</div></div>';
      h += sec('Rung trace', ladderHtml, { lead: 'Every rung this write reached, lit by its outcome. Unreached rungs are marked Not reached, never blank.', aside: '<a href="' + proofHref(e.seq) + '/path">Full path inspector</a>' });
      var sub = '';
      if (e.outcome === 'committed' && e.wt.indexOf('platform.') !== 0) {
        sub = '<ol class="w-steps" role="list">' + [['camera', 'Snapshot taken', 'Before-image of every field the write touches.', '18 ms'], ['layers', 'Applied in the shadow sandbox', 'The same bytes against a copy of your books.', '410 ms'], ['gate', 'Gates re-run in the shadow sandbox', w.gates.length + ' of ' + w.gates.length + ' passed again.', '9 ms'], ['key', 'Single-use credential minted', 'One write, ten-minute life, held by the kernel.', '21 ms'], ['upload', 'Identical bytes applied to live ERPNext', 'Via Frappe’s own API; ERPNext returned the document name.', '640 ms'], ['gate', 'Gates re-run on live', 'Agreed with the shadow sandbox.', '11 ms'], ['check', 'Committed, with one outbox row', 'Commit order preserved.', '6 ms']].map(function (s) {
          return '<li><span class="w-steps__i e1-tone--good">' + c.icon(s[0] === 'camera' ? 'clock' : s[0], 12) + '</span><div><div class="w-steps__t">' + esc(s[1]) + '</div><div class="w-steps__d">' + esc(s[2]) + '</div></div><span class="w-steps__m">' + esc(s[3]) + '</span></li>';
        }).join('') + '</ol><p class="w-meter-hint" style="margin-top:6px">Timings are sample values [unverified]. The declared end-to-end budget is ≤ 2 s p95, not yet measured.</p>';
        h += sec('Rung 7 · Act, the single writer', sub);
      }
      if (plat) h += sec('Rung 7 · Act', c.callout({ kind: 'critical', title: 'Our failure', body: '<p>This is our failure, not a rule. Nothing was changed, you have not been billed, and we have been paged. The shadow sandbox applied; live ERPNext did not answer.</p>' }));
      var trail = e.seq === 4101 || e.seq === 4100 || e.seq === 4099 ? [[4099, 'Escalated', 'escalated'], [4100, 'Approved by Venkat', 'committed'], [4101, 'Committed', 'committed']] : e.seq === 4095 || e.seq === 4094 || e.seq === 4093 ? [[4093, 'Escalated', 'escalated'], [4094, 'Approved by Venkat', 'committed'], [4095, 'Committed', 'committed']] : e.seq === 4105 || e.seq === 4104 || e.seq === 4103 ? [[4103, 'Escalated', 'escalated'], [4104, 'Approved by Ravi · Voice', 'committed'], [4105, 'Committed', 'committed']] : [[e.seq, wt(e.wt).label, e.outcome]];
      h += sec('Related records', seqTrail(trail));
      h += sec('Details', c.kv([['Proof', seqTxt(e.seq), { mono: true }], ['write_id', 'w_' + (DIGESTS[e.seq] || '0000').replace(/[^0-9a-f]/g, '').slice(0, 8), { mono: true }], ['Channel', e.kind === 'agent' ? 'SDK (act scope)' : 'Web console'], ['as_of', '24 Sep 2026, ' + e.t + ' IST'], ['Declaration', w.decl + ' v' + w.v, { mono: true }], ['Policy', 'v11', { mono: true }], ['Blast radius', c.blast(w.blast, { compact: true }), { html: true }], ['Reversal', w.revText], ['Meter', e.meter + (e.outcome !== 'committed' ? ' · refusals and escalations meter at zero' : '')], ['prev_digest → digest', (DIGESTS[e.seq - 1] || '') + ' → ' + (DIGESTS[e.seq] || ''), { mono: true }]], { cols: 2 }));
      return h;
    }
  });

  /* ========================================================================
     /work/reverse/:id — Reverse this (itself a governed write)
     ======================================================================== */
  E1.route('/work/reverse/:id', {
    title: 'Reverse this', layout: 'console', door: 'work', section: 'requests', crumbs: [['Work', '#/work/today'], ['Requests', '#/work/requests']], example: '/work/reverse/4097', keywords: 'reverse undo reversal credit note snapshot',
    render: function (p, q) {
      var seq = Number(WRITE_ALIAS[p.id] || p.id), e = chainEntry(seq), st = q.state || '';
      if (!e && seq >= 4113) e = { seq: seq, t: 'now', wt: 'erp.payment_entry.submit', actor: USER.name, kind: 'person', lvl: 'A4', outcome: 'committed', code: '', obj: 'PE-2026-00981', meter: '1 per counterparty' };
      if (!e) return c.pageHeader({ title: 'Nothing to reverse at this address' }) + c.empty({ title: 'We could not find “' + p.id + '”', why: 'Reversal is offered only for committed writes on this tenant’s chain, by proof number.', action: { label: 'Today’s activity', href: '#/work/today' }, icon: 'undo' });
      var w = wt(e.wt);
      var menu = statesMenu('/work/reverse/' + p.id, q, [['closed', 'Window closed'], ['after-irn', 'IRN window passed (invoices)'], ['done', 'Reversed']]);
      var h = c.pageHeader({ eyebrow: 'Reverse this · proof ' + seqTxt(e.seq), title: 'Reverse ' + w.label.toLowerCase() + ' · ' + e.obj, lead: 'Reversal is itself a governed write and gets its own proof record. The system chooses the path; nothing is ever silently deleted.', actions: menu });
      if (e.outcome === 'refused') return h + c.empty({ title: 'Nothing to reverse', why: 'This write was not done, so nothing changed in your books.', action: { label: 'See why it was not done', href: '#/work/not-done/' + e.seq }, icon: 'refuse' });
      if (e.outcome === 'escalated') return h + c.empty({ title: 'Nothing to reverse yet', why: 'This write is waiting on a person; nothing has been written.', action: { label: 'Open the approval', href: '#/work/decide/' + e.code }, icon: 'gate' });
      if (w.rev === false || e.wt.indexOf('platform.obligation') === 0) return h + c.callout({ kind: 'rule', title: 'Irreversible', body: '<p>' + (e.wt.indexOf('platform.obligation') === 0 ? 'A decision is recorded, not reversed. A new request supersedes it.' : 'This write was declared irreversible. There is no reversal plan.') + '</p><p>A correction is a new governed write with its own record.</p>' }) + '<div style="margin-top:16px">' + c.button('Back to the write', { href: '#/work/writes/' + e.seq, kind: 'secondary', icon: 'arrow-left' }) + '</div>';
      if (st === 'closed') return h + c.callout({ kind: 'rule', title: 'Window closed', body: '<p>This write can no longer be reversed here. The 30-day window closed on 24 Oct 2026.</p><p>A correction is a new governed write, such as a credit note or a compensating journal entry.</p>' });
      var isInv = e.wt === 'erp.sales_invoice.submit';
      if (isInv && st === 'after-irn') return h + c.callout({ kind: 'rule', title: 'The IRN window has passed', body: '<p>The e-invoice can no longer be cancelled (24-hour IRN window). Reversal is a credit note, which is a different governed write with its own record.</p>' }) + '<div style="margin-top:16px">' + c.button('Raise credit note', { href: '#/work/request/erp.credit_note.submit?from=' + e.seq, kind: 'primary', icon: 'file-text' }) + '</div>';
      if (st === 'done') return h + result('info', 'undo', 'Reversed · proof #4,113', '<p>The reversal climbed every rung and was written to ERPNext. The original write (proof ' + seqTxt(e.seq) + ') stays on the chain; the reversal sits next to it.</p>', c.button('Show the reversal proof', { href: proofHref(4113), kind: 'primary', icon: 'proof' }) + c.button('Open the record', { href: '#/records/object/' + encodeURIComponent(e.obj.split(' · ')[0]), icon: 'records' }), 'Meter: 1 × ' + esc(w.basis), 'Reversed. Proof 4113.');
      var until = e.seq === 4097 ? '24 Oct 2026, 11:42 IST' : isInv ? '25 Sep 2026, 15:02 IST (IRN), then a credit note until 24 Oct 2026' : '24 Oct 2026, ' + e.t + ' IST';
      var fast = isInv ? 'Fast path — cancel the IRN and the invoice in ERPNext (target_native_undo), inside the 24-hour IRN window.' : /snapshot/.test(w.revText) ? 'Fast path — restore the snapshot taken before this write.' : /credit note|debit note|compensating/.test(w.revText) ? 'Forward path — raise a compensating entry.' : 'Fast path — undo it in ERPNext (target_native_undo).';
      var diff = e.seq === 4097 ? [{ field: 'PE-2026-00972 status', before: 'Submitted', after: 'Cancelled', material: true }, { field: 'ACME Textiles outstanding', before: '₹0', after: '₹1,12,500', material: true, mono: true }, { field: 'SINV-2026-01102 status', before: 'Paid', after: 'Unpaid', material: true }, { field: 'Bank · HDFC Current ··4471', before: '₹1,12,500 receipt', after: 'Receipt removed' }, { field: 'Amount', before: '₹1,12,500', after: '₹1,12,500', mono: true }] :
        isInv ? [{ field: 'SINV-2026-01187 status', before: 'Submitted', after: 'Cancelled', material: true }, { field: 'e-Invoice IRN', before: 'Active', after: 'Cancelled at GSTN', material: true }, { field: 'ACME Textiles credit exposure', before: '₹2,40,000', after: '₹0', mono: true, material: true }] :
        [{ field: e.obj.split(' · ')[0] + ' status', before: 'Submitted', after: 'Cancelled', material: true }, { field: 'Written by', before: e.actor, after: e.actor }];
      var main = sec('What the reversal changes', c.diff(diff, { caption: 'What reversing this will change' })) +
        sec('Gates that will run', gatesHtml(w.gates.map(function (g) { return { id: g, name: GATE_NAME[g], result: 'not_run', words: g === 'G4' ? 'A second named person must approve this reversal.' : gateWords(g, { cp: /ACME/.test(e.obj) ? 'ACME Textiles' : null }), version: w.decl + ' v' + w.v }; }), { version: w.decl + ' v' + w.v }).replace(/— not run\./g, '— will run.').replace(/<strong>0 of (\d+) passed<\/strong>/, '<strong>$1 gates will run, in declared order</strong>'));
      if (e.seq === 4097) main += c.callout({ kind: 'caveat', title: 'Knock-on', body: '<p>If you reverse this, ACME Textiles owes ₹1,12,500 again. The pending invoice OB-2026-0412 would then take ACME to ₹3,52,500, above its ₹3,00,000 limit; its gates re-run when it is resubmitted and would refuse it.</p><p><a href="#/work/decide/OB-2026-0412">Open OB-2026-0412</a></p>' });
      var side = '<div class="w-action"><span class="w-action__q">Available until</span><span class="w-action__t">' + esc(until) + '</span>' +
        '<p class="w-note"><strong>The path the system chose:</strong> ' + esc(fast) + ' You do not choose.</p>' +
        (/Always/.test(w.dual) ? '<p class="w-note">This reversal needs a second named person (dual control).</p>' : '') +
        c.button('Reverse this', { kind: 'gate', full: true, attrs: 'data-action="w-reverse" data-value="' + e.seq + '"' }) + '</div>' +
        '<p class="w-note">This reversal is itself a governed write and gets its own proof record. The original stays on the chain.</p>' +
        c.card({ title: 'Original write', body: c.kv([['Proof', '<a href="' + proofHref(e.seq) + '">' + seqTxt(e.seq) + '</a>', { html: true }], ['Write', w.label + ' · ' + e.obj], ['By', actor(e.actor, e.kind, null, 'sm'), { html: true }], ['At', '24 Sep 2026, ' + e.t + ' IST']], { compact: true }) });
      return h + '<div class="e1-split"><div>' + main + '</div><aside class="w-panel">' + side + '</aside></div>';
    }
  });
  E1.action('w-reverse', function (el) {
    var seq = el.getAttribute('data-value');
    E1.confirm({ title: 'Reverse proof ' + seqTxt(seq) + '?', eyebrow: 'Reverse this', kind: 'gate', confirmLabel: 'Reverse this', body: '<p>The system will take the path shown. The reversal is a governed write: every gate runs again and it gets its own proof record.</p>',
      onConfirm: function () { setTimeout(function () { E1.go('/work/reverse/' + seq, { state: 'done' }); }, 0); } });
  });

  /* ========================================================================
     /work/obligations — calendar of deadlines that will need a governed write
     ======================================================================== */
  var KIND_WORD = { approval: 'Approval obligation', statutory: 'Statutory deadline', window: 'Window closing' };
  E1.route('/work/obligations', {
    title: 'Obligations calendar', layout: 'console', door: 'work', section: 'obligations', keywords: 'calendar deadlines MSME 45 days GST GSTR-1 GSTR-3B TDS expiry',
    render: function (p, q) {
      var view = q.view === 'month' ? 'month' : 'list', kind = q.kind || '';
      var items = CAL.slice();
      var todayItem = { date: '2026-09-24', kind: 'approval', title: OB.length + ' approval obligations expire today', sub: 'Nearest: ' + OB.slice().sort(function (a, b) { return a.exp - b.exp; })[0].proposal + '.', href: '#/work/approvals?filter=anyone' };
      items.unshift(todayItem);
      items.splice(2, 0, { date: '2026-09-25', kind: 'approval', title: 'OB-2026-0424 expires · Certify declaration erp.ar v8', sub: 'Waiting on Arjun Mehta. Declared expiry for certification: 24 h.', href: '#/work/decide/OB-2026-0424' });
      if (kind) items = items.filter(function (x) { return x.kind === kind; });
      var h = c.pageHeader({ title: 'Obligations calendar', lead: 'Every deadline that will need a governed write: approvals the kernel opened, statutory dates, and undo windows that close.',
        actions: c.segmented([{ id: 'list', label: 'List', icon: 'list', href: E1.href('/work/obligations', q2(q, { view: '' })) }, { id: 'month', label: 'Month', icon: 'calendar', href: E1.href('/work/obligations', q2(q, { view: 'month' })) }], view, { label: 'View', size: 'sm' }) });
      h += '<div class="e1-grid e1-grid--4">' +
        c.stat({ label: 'Approval obligations open', value: String(OB.length), note: 'The nearest expires in ' + fmt.duration(38 * 60000) + '.', href: '#/work/approvals?filter=anyone' }) +
        c.stat({ label: 'MSME payments due in 45 days', value: '4', note: '₹7,21,740 across 4 suppliers; 3 are in OB-2026-0411.', href: E1.href('/work/obligations', { kind: 'statutory' }) }) +
        c.stat({ label: 'GST returns due', value: '2', note: 'GSTR-1 on 11 Oct, GSTR-3B on 20 Oct (September).' }) +
        c.stat({ label: 'Undo windows closing', value: '3', note: 'The IRN window for SINV-2026-01187 closes tomorrow at 15:02.', href: E1.href('/work/obligations', { kind: 'window' }) }) + '</div>';
      h += '<div class="w-toolbar">' + c.filters([['', 'All'], ['approval', 'Approval obligations'], ['statutory', 'Statutory deadlines'], ['window', 'Windows closing']].map(function (k) { return { label: k[1], href: E1.href('/work/obligations', q2(q, { kind: k[0] })), active: kind === k[0] }; }), { label: 'Show' }) +
        '<div class="w-toolbar__r">' + ['approval', 'statutory', 'window'].map(function (k) { return '<span class="w-kindmark w-kindmark--' + k + '"><i></i>' + KIND_WORD[k] + '</span>'; }).join('') + '</div></div>';
      if (!items.length) return h + c.empty({ title: 'Nothing of this kind is due', why: 'No ' + KIND_WORD[kind].toLowerCase() + ' falls in the next 90 days.', action: { label: 'Show everything', href: '#/work/obligations' }, icon: 'calendar' });
      if (view === 'month') h += monthGrid(q.m || '2026-09', items) + '<div style="margin-top:12px" class="e1-row">' + ['2026-09', '2026-10', '2026-11', '2026-12'].map(function (m) { return c.chip(monthName(m), { href: E1.href('/work/obligations', q2(q, { m: m })), selected: (q.m || '2026-09') === m }); }).join('') + '</div><p class="w-note" style="margin-top:8px">The month grid needs a wide screen; on a phone the list below shows the same dates.</p>' + listView(items.filter(function (x) { return x.date.slice(0, 7) === (q.m || '2026-09'); }), true);
      else h += listView(items);
      h += '<div class="e1-grid e1-grid--2" style="margin-top:var(--space-6)">' +
        c.callout({ kind: 'rule', title: 'MSME 45-day rule', body: '<p>Micro and small suppliers are paid within 45 days of acceptance where the terms are agreed in writing, 15 days otherwise (MSMED Act, s. 15). An unpaid amount is not deductible until it is paid (Income-tax Act, s. 43B(h)). Suppliers are flagged from their Udyam number on the supplier record.</p>' }) +
        c.callout({ kind: 'info', title: 'Where these dates come from', body: '<p>Approval expiries come from the kernel. Statutory dates come from the ledger1 pack’s filing calendar for a monthly GST filer (sample data; confirm with your CA). Windows come from each write type’s declared reversal plan.</p><p><a href="#/records/packs/ledger1">ledger1 pack</a></p>' }) + '</div>';
      return h;
    }
  });
  function monthName(m) { var d = new Date(m + '-01T00:00:00Z'); return d.toLocaleString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }); }
  function listView(items, compact) {
    var byDate = {}, order = [];
    items.forEach(function (x) { if (!byDate[x.date]) { byDate[x.date] = []; order.push(x.date); } byDate[x.date].push(x); });
    order.sort();
    return '<div class="e1-stack" style="' + (compact ? 'margin-top:var(--space-5)' : '') + '">' + order.map(function (d) {
      var dt = new Date(d + 'T00:00:00Z'), days = Math.round((dt - new Date('2026-09-24T00:00:00Z')) / 86400000);
      var head = dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).replace('Sept', 'Sep') + (days === 0 ? ' · today' : days === 1 ? ' · tomorrow' : ' · in ' + days + ' days');
      return '<section aria-label="' + esc(head) + '"><h2 class="e1-label" style="margin-bottom:6px">' + esc(head) + '</h2><ul class="w-needs" role="list">' + byDate[d].map(function (x) {
        return '<li><div><span class="w-kindmark w-kindmark--' + x.kind + '"><i></i>' + esc(KIND_WORD[x.kind]) + '</span></div><div><div class="w-needs__t">' + esc(x.title) + (x.time ? ' <span class="e1-mono e1-caption e1-muted">' + esc(x.time) + ' IST</span>' : '') + '</div><div class="w-needs__s">' + esc(x.sub) + (x.cover ? ' Covered by ' + esc(x.cover) + '.' : '') + '</div></div>' +
          '<div class="w-needs__r">' + c.button(x.kind === 'approval' ? 'Open' : x.kind === 'window' ? 'Review' : 'Plan the write', { size: 'sm', href: x.href }) + '</div></li>';
      }).join('') + '</ul></section>';
    }).join('') + '</div>';
  }
  function monthGrid(m, items) {
    var first = new Date(m + '-01T00:00:00Z'), y = first.getUTCFullYear(), mo = first.getUTCMonth();
    var start = (first.getUTCDay() + 6) % 7, daysIn = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
    var cells = '', i;
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(function (d) { cells += '<div class="w-cal__h" role="columnheader">' + d + '</div>'; });
    var total = Math.ceil((start + daysIn) / 7) * 7;
    for (i = 0; i < total; i++) {
      var dn = i - start + 1, inM = dn >= 1 && dn <= daysIn;
      var iso = inM ? y + '-' + String(mo + 1).padStart(2, '0') + '-' + String(dn).padStart(2, '0') : '';
      var ev = inM ? items.filter(function (x) { return x.date === iso; }) : [];
      cells += '<div class="w-cal__d' + (inM ? '' : ' is-out') + (iso === '2026-09-24' ? ' is-today' : '') + '" role="gridcell">' + (inM ? '<span class="w-cal__n">' + dn + '</span>' : '') +
        ev.map(function (x) { return '<a class="w-cal__e w-cal__e--' + x.kind + '" href="' + x.href + '" title="' + esc(x.title) + '">' + esc(x.title) + '</a>'; }).join('') + '</div>';
    }
    return '<div class="w-cal" role="grid" aria-label="' + esc(monthName(m)) + '">' + cells + '</div>';
  }

  /* ========================================================================
     /work/escalations — how every escalation ended
     ======================================================================== */
  E1.route('/work/escalations', {
    title: 'Escalations', layout: 'console', door: 'work', section: 'escalations', keywords: 'obligation history resolved declined expired',
    render: function (p, q) {
      var f = q.status || 'all';
      var rows = HIST.filter(function (x) { return f === 'all' || x.status === f; });
      var h = c.pageHeader({ title: 'Escalations', lead: 'Every escalation and how it ended: approved, rejected, expired, or approved but not done. Each ending is its own proof record; nothing is a stale row.', actions: statesMenu('/work/escalations', q, [['empty', 'No history yet']]), tabs: c.tabs([['all', 'All'], ['approved', 'Approved'], ['declined', 'Rejected'], ['expired', 'Expired'], ['approved-not-done', 'Approved, not done']].map(function (t) { return { id: t[0], label: t[1], href: E1.href('/work/escalations', { status: t[0] === 'all' ? '' : t[0] }), count: t[0] === 'all' ? HIST.length : HIST.filter(function (x) { return x.status === t[0]; }).length }; }), f, { label: 'Ended' }) });
      h += '<div class="e1-grid e1-grid--4">' + c.stat({ label: 'Open now', value: String(OB.length), href: '#/work/approvals?filter=anyone', note: 'Waiting on a person.' }) + c.stat({ label: 'Approved today', value: '3', note: 'One of them by voice.' }) + c.stat({ label: 'Rejected today', value: '1', note: 'Reason recorded on #4,109.' }) + c.stat({ label: 'Expired today', value: '1', note: 'Recorded as #4,110.' }) + '</div>';
      h += '<div style="margin-top:var(--space-5)"></div>';
      if (q.state === 'empty' || !rows.length) return h + '<div style="margin-top:16px">' + c.empty({ title: 'No escalation has ended this way yet', why: 'Escalations appear here once a person approves or rejects them, or once they expire.', action: { label: 'Open approvals', href: '#/work/approvals?filter=anyone' }, icon: 'history' }) + '</div>';
      h += '<div style="margin-top:16px">' + c.table({ caption: 'Ended escalations', rowHref: function (x) { return '#/work/decide/' + x.id; },
        columns: [{ key: 'id', label: 'Obligation', render: function (x) { return '<span class="w-prop"><span class="w-prop__t">' + esc(x.proposal) + '</span><span class="w-prop__s e1-mono">' + esc(x.id) + '</span></span>'; } },
          { key: 'by', label: 'Proposed by', render: function (x) { return actor(x.by.name, x.by.kind, null, 'sm'); } },
          { key: 'st', label: 'Ended', render: function (x) { return x.status === 'approved' ? c.badge('good', 'Approved', { icon: 'check' }) : x.status === 'declined' ? c.outcome('refused', { label: 'Rejected' }) : x.status === 'expired' ? c.outcome('expired') : c.outcome('refused', { label: 'Approved · not done' }); } },
          { key: 'dec', label: 'Decided by', render: function (x) { return x.decidedBy ? esc(x.decidedBy) + ' <span class="e1-caption e1-muted">· ' + esc(x.channel) + '</span>' : '<span class="e1-muted">Nobody, in time</span>'; } },
          { key: 'at', label: 'When', mono: true },
          { key: 'seq', label: 'Proof', mono: true, align: 'right', render: function (x) { return '<a href="' + proofHref(x.seq) + '">' + seqTxt(x.seq) + '</a>'; } }], rows: rows }) + '</div>';
      return h;
    }
  });

  /* ========================================================================
     /work/reviews — production, promotion, graduation, receipt acceptance
     ======================================================================== */
  E1.route('/work/reviews', {
    title: 'Reviews', layout: 'console', door: 'work', section: 'reviews', keywords: 'production key review promotion graduation receipt acceptance',
    render: function (p, q) {
      var t = q.type || 'all', rows = REVIEWS.filter(function (r) { return t === 'all' || r.type === t; });
      var h = c.pageHeader({ title: 'Reviews', lead: 'Decisions that a named person reads in full before anything changes. Production access and promotion reviews run in elan1’s own operator tenant; graduation and receipt acceptance run in yours.', tabs: c.tabs([{ id: 'all', label: 'All', href: '#/work/reviews', count: REVIEWS.length }].concat(Object.keys(REVIEW_TYPES).map(function (k) { return { id: k, label: REVIEW_TYPES[k], href: '#/work/reviews?type=' + k, count: REVIEWS.filter(function (r) { return r.type === k; }).length }; })), t, { label: 'Review type' }) });
      h += '<div style="margin-top:16px">' + c.table({ caption: 'Reviews', rowHref: function (r) { return '#/work/reviews/' + r.id; }, empty: { title: 'No review of this type', why: 'Nothing is waiting for a reviewer here.', action: { label: 'All reviews', href: '#/work/reviews' } },
        columns: [{ key: 'title', label: 'Review', render: function (r) { return '<span class="w-prop"><span class="w-prop__t">' + esc(r.title) + '</span><span class="w-prop__s"><span class="e1-mono">' + esc(r.id) + '</span> · ' + esc(r.subject) + '</span></span>'; } },
          { key: 'type', label: 'Type', render: function (r) { return esc(REVIEW_TYPES[r.type]); } },
          { key: 'applicant', label: 'Raised by' },
          { key: 'requested', label: 'Requested', nowrap: true },
          { key: 'due', label: 'Due', nowrap: true, render: function (r) { return r.type === 'production' ? esc(r.due) + '<div class="w-prop__s">Two working days</div>' : esc(r.due); } },
          { key: 'status', label: 'Status', render: function (r) { return /Preview/.test(r.status) ? c.badge('info', r.status, { icon: 'eye' }) : /Not yet/.test(r.status) ? c.badge('neutral', r.status) : c.badge('warning', r.status, { icon: 'clock' }); } }], rows: rows }) + '</div>';
      return h;
    }
  });

  var WHAT_WE_SAY = [
    'Author and certify a declaration first. The Studio is open with your sandbox key.',
    'Tell us which mode, and if Enforced, which mechanism — credential custody or token acceptance.',
    'Every irreversible write type needs a named human at rung 6.',
    'The basis is not a pricing parameter. Here is the mapping.',
    'Consent, residency, retention, dual control, counterparty and precondition are not configurable. Rate, budget and schedule are.',
    'You need L2. It arrives at Assurance Level 2, behind its gates. Keep talking to us and do not buy this yet.',
    'We run in India today. We will tell you when that changes.',
    'Give us a person, not a distribution list.'
  ];
  function checkRow(ok, title, ev) { return '<li><span class="w-steps__i e1-tone--' + (ok === true ? 'good' : ok === false ? 'critical' : 'neutral') + '">' + c.icon(ok === true ? 'check' : ok === false ? 'x' : 'minus', 12) + '</span><div><div class="w-steps__t">' + esc(title) + '</div><div class="w-steps__d">' + ev + '</div></div><span class="e1-caption">' + (ok === true ? 'Passed' : ok === false ? 'Not met' : 'Not checked') + '</span></li>'; }

  E1.route('/work/reviews/:id', {
    title: function (p) { var r = REVIEWS.filter(function (x) { return x.id === p.id; })[0]; return r ? r.title : 'Review'; }, layout: 'console', door: 'work', section: 'reviews', crumbs: [['Work', '#/work/today'], ['Reviews', '#/work/reviews']], example: '/work/reviews/PR-0047', keywords: 'review production promotion graduation receipt',
    render: function (p, q) {
      var r = REVIEWS.filter(function (x) { return x.id === p.id; })[0];
      if (!r) {
        var guess = /^PR-/.test(p.id) ? 'production' : /^PM-/.test(p.id) ? 'promotion' : /^GA-/.test(p.id) ? 'graduation' : /^RA-/.test(p.id) ? 'receipt' : null;
        if (!guess) return c.pageHeader({ title: 'No review at this address' }) + c.empty({ title: 'We could not find “' + p.id + '”', why: 'Review ids start with PR (production), PM (promotion), GA (graduation) or RA (receipt acceptance).', action: { label: 'All reviews', href: '#/work/reviews' }, icon: 'search' });
        r = REVIEWS.filter(function (x) { return x.type === guess; })[0];
      }
      if (r.type === 'production') return productionReview(r, q);
      if (r.type === 'promotion') return promotionReview(r, q);
      if (r.type === 'graduation') return graduationReview(r, q);
      return receiptReview(r, q);
    },
    mount: function (el, p, q) {
      var ta = el.querySelector('#w-gr-basis'), go = el.querySelector('#w-gr-decline');
      if (ta && go) ta.addEventListener('input', function () { go.disabled = !reasonValid(ta.value); });
      if (go) go.addEventListener('click', function () { E1.go('/work/reviews/' + p.id, { state: 'declined' }); });
      var sel = el.querySelector('#w-pr-reason'), ref = el.querySelector('#w-pr-refuse'), say = el.querySelector('#w-pr-say');
      if (sel && say) sel.addEventListener('change', function () { say.textContent = '“' + WHAT_WE_SAY[Number(sel.value)] + '”'; });
      if (ref) ref.addEventListener('click', function () { E1.confirm({ title: 'Refuse ' + p.id + '?', kind: 'danger', confirmLabel: 'Refuse and send', body: '<p>The applicant receives this sentence, and the refusal is recorded on the operator chain:</p><p class="w-just" style="margin-top:8px">' + esc(say.textContent) + '</p>', onConfirm: function () { setTimeout(function () { E1.go('/work/reviews/' + p.id, { state: 'refused', why: sel.value }); }, 0); } }); });
    }
  });
  function productionReview(r, q) {
    var ok = r.id === 'PR-0047';
    var h = c.pageHeader({ eyebrow: 'Production access review · ' + r.id + ' · elan1 operator tenant', title: r.title.replace('Production access · ', ''), lead: '“A production key is a credential to somebody’s books, and there is no honest way to issue one without a human reading what the applicant declared.” We check four things, and only four.',
      actions: statesMenu('/work/reviews/' + r.id, q, [['approved', 'Approved · key issued'], ['refused', 'Refused']]) });
    h += banner('info', 'Viewing as Kavya Menon, onboarding reviewer (elan1).', 'This queue lives in elan1’s operator tenant. Promise: a person reads it within two working days — due ' + r.due + '.');
    if (q.state === 'approved') h += result('good', 'key', 'Approved · production key issued · operator proof #88', '<p>sk_live_…7f3a is scoped to tenant ledgerloop, 7 write types and residency domain in. It is shown once, in the applicant’s console — never here.</p>', c.button('Back to Reviews', { href: '#/work/reviews', kind: 'ghost' }), null, 'Approved. Key issued.') + '<div style="height:16px"></div>';
    if (q.state === 'refused') h += result('neutral', 'refuse', 'Refused · the applicant has been told', '<p class="w-just">“' + esc(WHAT_WE_SAY[Number(q.why || 0)]) + '”</p>', c.button('Back to Reviews', { href: '#/work/reviews', kind: 'ghost' }), 'Recorded on the operator chain', null) + '<div style="height:16px"></div>';
    var checks = '<ul class="w-steps" role="list">' +
      checkRow(true, '1 · Enforcement mode stated in writing, and it matches channels[].mode', 'Attested advisory over MCP, stated in the request and in block 7 of ' + (ok ? 'll.billing v3' : 'erp.ar v1') + '.') +
      checkRow(true, '2 · Every write type has a reversal plan or an explicit irreversible flag', ok ? '7 of 7 write types declare one (L0-S03 passed).' : '4 of 4 write types declare one.') +
      checkRow(ok, '3 · All three outcomes proved in the sandbox tenant', ok ? 'Committed #296, refused #301 (GATE.DUAL_CONTROL_PENDING) and an escalation #306 resolved by a real human, Aditya Kulkarni, at #307.' : 'Committed and refused are proved; no escalation has been resolved by a real human yet.') +
      checkRow(ok, '4 · A named human certified the declaration', ok ? 'Certified by Arjun Mehta, 19 Sep 2026 · compiled digest 3b9e…c41d.' : 'erp.ar v1 is an uncertified draft.') + '</ul>';
    var att = c.kv([['Conformance result file', (ok ? '14 of 14 · ' : '12 of 14 (C9, C12 failing) · ') + 'sha256 c8f1…2270'], ['Declaration version', ok ? 'll.billing v3' : 'erp.ar v1 (draft)', { mono: true }], ['Target system', ok ? 'ERPNext (customer-hosted) via Frappe API' : 'ERPNext (hosted)'], ['Residency domain', 'in · Mumbai'], ['Production owner', ok ? 'Aditya Kulkarni (a person, not a list)' : 'accounts@sahyadri… (a distribution list)'], ['Mode and mechanism', 'Attested advisory · MCP (caller holds the credential)']], { cols: 2 });
    var side = '<div class="w-action"><span class="w-action__q">Decision</span>' + (ok ? c.button('Approve and issue key', { kind: 'gate', full: true, attrs: 'data-action="w-pr-approve" data-value="' + r.id + '"' }) : '<p class="w-note"><strong>Two of four checks are not met,</strong> so approval is not offered. Refuse with the sentence that fits.</p>') +
      '<div class="w-decide__gap" aria-hidden="true">or refuse</div>' +
      c.field('Refusal category', c.select({ id: 'w-pr-reason', options: WHAT_WE_SAY.map(function (s, i) { return { value: String(i), label: (i + 1) + ' · ' + s.split('.')[0] }; }), value: ok ? '0' : '0' }), { id: 'w-pr-reason' }) +
      '<p class="w-note">What we say: <span id="w-pr-say">“' + esc(WHAT_WE_SAY[0]) + '”</span></p>' + c.button('Refuse', { kind: 'danger', full: true, attrs: 'id="w-pr-refuse"' }) + '</div>';
    return h + '<div class="e1-split"><div>' + sec('The four checks', checks) + sec('Attachments', att) + sec('After approval', '<p class="w-note">elan1 issues sk_live_… scoped to the tenant, the declared write types and the residency domain. The first governed action reads “Applied · proof #1”, with its undo window. Every write still runs through the shadow sandbox.</p>') + '</div><aside class="w-panel">' + side + '</aside></div>';
  }
  E1.action('w-pr-approve', function (el) { var id = el.getAttribute('data-value'); E1.confirm({ title: 'Approve ' + id + ' and issue a production key?', kind: 'gate', confirmLabel: 'Approve and issue', body: '<p>All four checks passed. The key is scoped to one tenant, its declared write types and residency domain in, and is shown once to the applicant.</p>', onConfirm: function () { setTimeout(function () { E1.go('/work/reviews/' + id, { state: 'approved' }); }, 0); } }); });

  function promotionReview(r, q) {
    var inr = q.state === 'in-review';
    var h = c.pageHeader({ eyebrow: 'Promotion review · ' + r.id + ' · elan1 operator tenant', title: 'LedgerLoop billing agent · ll.invoice.post', lead: 'Attested advisory → Enforced, per write type. The kernel must hold the credential before anyone may say “this write could not have occurred without passing the gates”.', actions: statesMenu('/work/reviews/' + r.id, q, [['in-review', 'Eligible, in review']]) });
    if (!inr) h += c.callout({ kind: 'rule', title: 'Not yet eligible', body: '<p>A promotion needs at least 30 days of production traffic in Attested advisory. ll.invoice.post has 0 of 30 days: LedgerLoop is a sandbox tenant (mode: sandbox) and has not been issued a production key.</p><p>“A consumer who cannot close it is not a failed customer; they are an honest Attested advisory customer.”</p>' });
    var steps = [['Bypass proof', 'C2 against the real target: every attempt to write around the kernel fails.', inr ? 'Passed · 6 attempts, all refused · #1,204–#1,209' : ''], ['Long-lived credential check', 'No credential that could write to the target is held outside the kernel.', inr ? 'Passed · inventory of 3 credentials, 0 long-lived' : ''], ['Rollback drill', 'Fast path and forward path both exercised.', inr ? 'Passed · snapshot restore #1,221 · credit note #1,223' : ''], ['New declaration version certified (dual control)', 'channels[].mode changes to enforced in a new version.', ''], ['Approved', 'The mode boundary is rendered on Assurance → Enforcement.', '']];
    h += sec('Status', '<ul class="w-steps" role="list">' + steps.map(function (s, i) { var done = !!s[2]; return '<li><span class="w-steps__i e1-tone--' + (done ? 'good' : 'neutral') + '">' + c.icon(done ? 'check' : 'minus', 12) + '</span><div><div class="w-steps__t">' + (i + 1) + ' · ' + esc(s[0]) + '</div><div class="w-steps__d">' + esc(s[1]) + (done ? ' <span class="e1-mono">' + esc(s[2]) + '</span>' : '') + '</div></div><span class="e1-caption">' + (done ? 'Passed' : 'Not started') + '</span></li>'; }).join('') + '</ul>');
    h += sec('Eligibility', c.progress(inr ? 34 : 0, 30, { label: 'Days of production traffic in Attested advisory', note: (inr ? '34' : '0') + ' of 30 days', state: inr ? 'good' : undefined }));
    h += '<div style="margin-top:16px">' + c.button('Open Enforcement', { href: '#/assurance/enforcement', iconRight: 'arrow-right' }) + '</div>';
    return h;
  }

  function graduationReview(r, q) {
    var st = q.state || '';
    var h = c.pageHeader({ eyebrow: 'Graduation review · ' + r.id + ' · autonomy.graduate', title: 'A2 → A3 · sales_invoice.submit · agent · one_counterparty', lead: 'Numbers, not recommendations. The justification is written by a person; there is no “we suggest approving”.',
      actions: statesMenu('/work/reviews/' + r.id, q, [['approved', 'Approved'], ['declined', 'Declined'], ['same-actor', 'Same actor'], ['stale', 'Stale score']]) });
    h += c.callout({ kind: 'caveat', title: 'Phase 4 · specified, not built', body: '<p>Earned autonomy arrives in Phase 4. The numbers below are the worked example from the earned-autonomy specification (window to 24 Sep 2028), not this tenant’s history. Today, grants change only through a governed request such as OB-2026-0425.</p>' });
    h += '<div style="height:12px"></div>';
    if (st === 'approved') h += result('good', 'check', 'sales_invoice.submit now acts at A3 from the next write. Supervised until 14 Oct 2028.', '<p>The graduation is on the chain. For 30 days, 1 in 10 writes goes to a person, chosen by the record’s own digest. Lowering it needs one person and one press.</p>', c.button('Autonomy history', { href: '#/agents/autonomy/history' }), null, 'Approved.') + '<div style="height:12px"></div>';
    if (st === 'declined') h += result('neutral', 'refuse', 'Declined · recorded', '<p>Meenakshi Iyer has been told POLICY.APPROVAL_DECLINED with your basis. A new proposal needs a fresh 30-day window.</p>', null, null, 'Declined.') + '<div style="height:12px"></div>';
    if (st === 'same-actor') h += result('neutral', 'refuse', 'You proposed this graduation. A second named person must decide it.', null, c.button('Send to Venkat Raman', { attrs: 'data-action="w-sendto" data-value="Venkat Raman"', icon: 'send' }), '<code>GATE.DUAL_CONTROL_SAME_ACTOR</code>', null) + '<div style="height:12px"></div>';
    if (st === 'stale') h += result('neutral', 'refresh', 'The score is older than 24 hours. Recompute before deciding.', '<p>Last computed 26 Sep 2028 — stale. A stale score cannot be used in a graduation.</p>', c.button('Open the action class', { href: '#/agents/autonomy/sales_invoice.submit' }), '<code>GATE.PRECONDITION_FAILED</code>', null) + '<div style="height:12px"></div>';
    var counters = [['submitted', '1,142'], ['approved_unamended', '900'], ['approved_amended', '11'], ['declined', '4'], ['expired', '3'], ['escalated', '918'], ['refused_by_gate', '214'], ['refused_by_policy', '0'], ['reversed_in_window', '1'], ['corrected_after_window', '0'], ['sandbox_diverged', '0']];
    var main = sec('Counters · 180-day window', '<dl class="w-counters">' + counters.map(function (x) { return '<div><dt>' + x[0] + '</dt><dd>' + x[1] + '</dd></div>'; }).join('') + '</dl><p class="w-note" style="margin-top:8px">Refusals by gate: precondition 120 · counterparty 61 · credit limit 22 · retention 11. Refusals are not failures; the refusal rate is neutral in the score.</p>') +
      sec('Score', c.kv([['precedent_score', '87', { mono: true }], ['Function', 'score_v1', { mono: true }], ['Seq range', '12,001–58,940', { mono: true }], ['Computed', '24 Sep 2028, 02:10 IST (within 24 h)']], { cols: 2 }) + '<div class="w-model" style="margin-top:10px"><strong>Summary written by a model. Check it against the counts.</strong> 900 of 918 escalations were approved without change; none was corrected after its window and none diverged in the shadow sandbox.</div>') +
      sec('Eight conditions', '<ul class="w-steps" role="list">' + [['≥ 90 days of continuous history', '180 days, chain continuous'], ['≥ 200 records with ≥ 100 approvals', '1,142 records · 911 approvals'], ['approved_unamended ratio at or above threshold', '98.0% of approvals'], ['Zero corrected_after_window and zero sandbox_diverged (hard bar)', '0 and 0'], ['Reversal plan drilled once, dated (hard bar)', 'Drilled 02 Aug 2028'], ['No declaration or policy change in the last 30 days', 'Last change 11 Jul 2028'], ['Tenant not stopped and no open P0', 'Live · no open P0'], ['precedent_score at or above threshold, computed within 24 h', '87 · 8 h ago']].map(function (x) { return checkRow(st === 'stale' && /score/.test(x[0]) ? false : true, x[0], esc(x[1])); }).join('') + '</ul>') +
      sec('Justification (verbatim)', '<p class="w-just">“ar-agent has invoiced ACME, Lakshmi Garments and our other regular customers for six months with almost no changes from us. Every invoice can still be cancelled within 24 hours and credited within 30 days, and the drill in August worked. I want it to act alone on this class, with the 1-in-10 sample for the first month.”</p><p class="w-note" style="margin-top:6px">Written by Meenakshi Iyer (Owner). Not pre-filled by us.</p>') +
      sec('Supervised period', c.kv([['Length', '30 days'], ['Sampling', '1 in 10, chosen by record digest'], ['Auto-revert', 'Below the maintenance threshold — “Reversion is not a failure state.”'], ['Revoke', 'One person, one press, no justification needed']], { cols: 2 }));
    var side = st ? c.card({ title: 'Your decision', body: '<p class="w-note">See the result above.</p>' }) : c.card({ title: 'Your decision', body: '<div class="w-decide">' + c.button('Approve graduation', { kind: 'gate', full: true, href: E1.href('/work/reviews/' + r.id, { state: 'approved' }) }) + '<p class="w-note">autonomy.graduate · dual control · blast radius Whole tenant. Takes effect at the next write.</p><div class="w-decide__gap" aria-hidden="true">or</div>' +
      c.field('Basis for declining', c.textarea({ id: 'w-gr-basis', rows: 3, placeholder: 'Say what would need to change.' }), { id: 'w-gr-basis', help: 'Required: at least one sentence.' }) + c.button('Decline', { kind: 'danger', full: true, disabled: true, attrs: 'id="w-gr-decline"' }) + '</div>' });
    return h + '<div class="e1-split"><div>' + main + '</div><aside class="w-panel">' + side + '</aside></div>';
  }

  function receiptReview(r, q) {
    var h = c.pageHeader({ eyebrow: 'Receipt acceptance · ' + r.id + ' · receipt.accept', title: 'Accept receipt 41,288 from ar-org:suryaauto.example', lead: 'Binding another organisation’s record into your chain crosses an organisation boundary, so two named people approve it.' });
    var lk = c.locked({ level: 'L3', title: 'Receipt acceptance arrives at Assurance Level 3 Proven', why: 'A receipt is checked with the issuer’s signature, anchor and key, all of which arrive at L3. Nothing here is claimed at your current level, so nothing is shown as if it were.', items: ['Verifier result as a gate input', 'Key discovery route, stated', 'Disclosed fields: 3 of 11', 'Two-approver binding record'] });
    if (lk) return h + lk;
    if (q.state === 'accepted') h += result('good', 'check', 'Receipt accepted — bound at record 8,902 to issuer record 41,288', '<p>There is no callback to the issuer.</p>', null, c.level(E1.state.level, { short: true }) + ' preview', 'Receipt accepted.') + '<div style="height:12px"></div>';
    if (q.state === 'replayed') h += result('neutral', 'refuse', 'Not done — already bound at record 8,902', '<p>Treat it as the same event, not a second one.</p>', null, '<code>GATE.RECEIPT_REPLAYED</code>', null) + '<div style="height:12px"></div>';
    var gates = [{ id: 'V', name: 'Verifier result', result: 'passed', words: 'Digest, Ed25519 signature and RFC 3161 anchor verified offline · verdict PASS.', version: 'elan1-verify' }, { id: 'G7', name: 'Counterparty (Surya Auto Parts, known)', result: 'passed', words: 'Accepted on a key document fetched four minutes ago (route 2).', version: 'erp.ap v5' }, { id: 'G2', name: 'Residency (Mumbai)', result: 'passed', words: 'Receipt and tenant both in domain in.', version: 'erp.ap v5' }, { id: 'G9', name: 'Precondition', result: 'passed', words: 'Audience ar-org:kaverimills.example matches; expires 01 Oct 2028; not replayed.', version: 'erp.ap v5' }];
    h += '<div class="e1-split"><div>' + sec('Checks', c.gates(gates, { version: 'receipt.accept · ' + c.BLAST[4][1] })) +
      sec('What the receipt discloses', c.kv([['Issuer', 'ar-org:suryaauto.example · record 41,288'], ['Disclosed', 'invoice_no · grand_total · customer_gstin (3 of 11)'], ['Withheld', '8 fields, committed but not revealed'], ['Key discovery', 'Route 2 · issuer-published key document']], { cols: 2 }) +
        c.callout({ kind: 'rule', title: 'Limits', body: '<p>This establishes that the issuer’s governed write path produced this record under these rules at this time. It does not establish that the underlying transaction occurred.</p>' })) + '</div>' +
      '<aside class="w-panel">' + c.card({ title: 'Two approvers', body: '<div class="e1-stack e1-stack--sm"><div class="w-approver"><div><div class="w-approver__n">Approver 1 of 2</div>' + actor('Venkat Raman', 'person', 'Accounts head', 'sm') + '</div>' + c.badge('neutral', 'You') + '</div><div class="w-approver"><div><div class="w-approver__n">Approver 2 of 2</div>' + actor('Meenakshi Iyer', 'person', 'Owner', 'sm') + '</div>' + c.badge('neutral', 'Not yet') + '</div>' +
        c.button('Approve binding (1 of 2)', { kind: 'gate', full: true, href: E1.href('/work/reviews/' + r.id, { state: 'accepted' }) }) + '<div class="w-decide__gap" aria-hidden="true">or</div>' + c.button('Show a replayed receipt', { kind: 'ghost', full: true, href: E1.href('/work/reviews/' + r.id, { state: 'replayed' }) }) + '</div>' }) + '</aside></div>';
    return h;
  }

  /* ========================================================================
     /work/stop — stop switch request (dual control)
     ======================================================================== */
  E1.route('/work/stop', {
    title: 'Stop switch', layout: 'console', door: 'work', section: 'stop', keywords: 'stop tenant kill switch halt all writes dual control',
    render: function (p, q) {
      var st = q.state || '';
      var h = c.pageHeader({ tabs: sibTabs('stop'), title: 'Stop switch', lead: 'Stopping this workspace halts every write at rung 0b, including refusals. It is a governed write with dual control: you ask, and a second named person decides.', actions: statesMenu('/work/stop', q, [['requested', 'Stop requested'], ['stopped', 'Workspace stopped']]) });
      if (st === 'stopped') {
        h += stoppedBanner();
        return h + '<div class="e1-split"><div>' + sec('While stopped', whatStopDoes()) + '</div><aside class="w-panel">' + c.card({ title: 'Lift the stop', body: '<p class="w-note">Lifting is the same dual-control write: you ask, a second named person decides. Writes resume at the next request; nothing queued is replayed.</p>' + c.button('Request to lift the stop', { kind: 'gate', full: true, attrs: 'data-action="w-lift"' }) }) + '</aside></div>';
      }
      if (st === 'requested') h += result('warning', 'gate', 'Stop requested · waiting on Meenakshi Iyer · OB-2026-0426', '<p>Nothing has stopped yet. The workspace stops when a second named person approves; the stop is then its own proof record, and every console shows the banner.</p>', c.button('Open the request', { href: '#/work/decide/OB-2026-0426', kind: 'primary' }) + c.button('Cancel the request', { kind: 'ghost', attrs: 'data-action="w-stop-cancel"' }), 'platform.tenant.stop · dual control · escalated at rung 6', 'Stop requested.') + '<div style="height:16px"></div>';
      h += '<div class="e1-grid e1-grid--2" style="align-items:start"><div>' + c.card({ title: 'This workspace', body: c.kv([['Tenant', E1.tenant().name], ['Status', c.badge('good', 'Live', { icon: 'check' }), { html: true }], ['Chain head', '#4,112', { mono: true }], ['Open approvals', String(OB.length) + ' (would freeze, expiry paused)']], { compact: true }) }) +
        '<div style="margin-top:16px">' + sec('What a stop does', whatStopDoes()) + '</div></div>';
      var form = st === 'requested' ? c.empty({ title: 'A stop request is already open', why: 'OB-2026-0426 is waiting on Meenakshi Iyer.', action: { label: 'Open it', href: '#/work/decide/OB-2026-0426' }, icon: 'stop', compact: true }) :
        '<form id="w-stop" class="e1-stack" novalidate>' +
        c.field('Cause class', c.select({ id: 'w-stop-cause', options: ['Suspected credential exposure', 'Agent misbehaviour', 'Customer request', 'Residency concern', 'Platform incident'] }), { id: 'w-stop-cause', required: true, help: 'It is recorded with the stop and shown on every refusal while stopped.' }) +
        c.field('What happened', c.textarea({ id: 'w-stop-why', rows: 3, placeholder: 'One or two sentences a colleague could act on.' }), { id: 'w-stop-why', required: true, help: 'At least one sentence (20 characters, 3 words).' }) +
        c.field('Second approver', c.select({ id: 'w-stop-2', options: [{ value: 'meenakshi-iyer', label: 'Meenakshi Iyer · Owner' }, { value: 'ravi-shankar', label: 'Ravi Shankar · Finance manager' }] }), { id: 'w-stop-2', required: true, help: 'A person, not you. Agents never approve.' }) +
        c.checkbox({ id: 'w-stop-ack', label: 'I understand this stops all writes, including refusals, until the stop is lifted by the same dual-control write.' }) +
        c.button('Request a stop', { kind: 'danger', type: 'submit', icon: 'stop' }) + '</form>';
      h += c.card({ title: 'Request a stop', body: form }) + '</div>';
      h += '<p class="w-note" style="margin-top:16px">Stopping another organisation is done from its tenant record by elan1 operators, with the same dual control: <a href="#/records/tenants">Tenants</a>.</p>';
      return h;
    },
    mount: function (el) {
      var f = el.querySelector('#w-stop'); if (!f) return;
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var why = f.querySelector('#w-stop-why'), ack = f.querySelector('#w-stop-ack');
        if (!reasonValid(why.value)) { why.setAttribute('aria-invalid', 'true'); why.focus(); E1.toast('Say what happened in at least one sentence. Nothing was requested.', 'neutral'); return; }
        if (!ack.checked) { ack.focus(); E1.toast('Tick the box to confirm you understand what a stop does.', 'neutral'); return; }
        E1.confirm({ title: 'Request a stop of ' + E1.tenant().name + '?', kind: 'danger', confirmLabel: 'Request the stop', body: '<p>A second named person must approve before anything stops. When they do, every write — including refusals — halts at rung 0b.</p>', onConfirm: function () { setTimeout(function () { E1.go('/work/stop', { state: 'requested' }); }, 0); } });
      });
    }
  });
  function whatStopDoes() {
    return '<ul class="w-steps" role="list">' + [['stop', 'Every write is refused at rung 0b', 'POLICY.TENANT_STOPPED, carrying the cause class and the time. These are the only refusals without a proof record.'], ['eye', 'Reads continue', 'Verify, exports and every screen keep working; a stop holds writes, not reads.'], ['pause', 'Approvals freeze', 'Open obligations stay open with their expiry paused.'], ['bell', 'Everyone is told', 'Webhook tenant.stopped; a banner on every console for this tenant.'], ['check', 'Verified, not assumed', 'We attempt a write and expect POLICY.TENANT_STOPPED.']].map(function (s) { return '<li><span class="w-steps__i">' + c.icon(s[0], 12) + '</span><div><div class="w-steps__t">' + esc(s[1]) + '</div><div class="w-steps__d">' + esc(s[2]) + '</div></div><span></span></li>'; }).join('') + '</ul>';
  }
  E1.action('w-lift', function () { E1.toast('Lift requested · waiting on Meenakshi Iyer. The workspace stays stopped until she approves.', 'info'); });
  E1.action('w-stop-cancel', function () { E1.toast('Stop request withdrawn. The withdrawal is recorded; nothing was stopped.', 'neutral'); E1.go('/work/stop'); });

  /* ========================================================================
     /work/break-glass — a declared write type, not an admin mode
     ======================================================================== */
  E1.route('/work/break-glass', {
    title: 'Break-glass', layout: 'console', door: 'work', section: 'break-glass', keywords: 'break glass emergency access operator dual control',
    render: function (p, q) {
      var st = q.state || '', op = q.as === 'operator';
      var h = c.pageHeader({ tabs: sibTabs('break-glass'), title: 'Break-glass', lead: 'There is no admin mode. Break-glass is a declared write type with dual control, recorded in the operator’s own chain and visible to you, with an alert within one minute.', actions: statesMenu('/work/break-glass', q, [['active', 'Session open'], ['requested', 'Operator request pending']]) });
      if (st === 'active') h += banner('warning', 'Break-glass session open · RB1 record writer behind · 15:40–16:40 IST', 'Arjun Rao (SRE, elan1) with Arjun Mehta as second approver. Read-only diagnostics on the outbox; no record store writes. Operator proof #214. You were alerted at 15:40:38.', { label: 'Operator record', href: '#/assurance/incidents' });
      if (st === 'requested') h += banner('info', 'An elan1 operator has asked for break-glass on this tenant.', 'RB12 break-glass access · requested by Arjun Rao at 15:36 IST · waiting on a second elan1 approver. You will be alerted within one minute if it opens.');
      var decl = c.card({ title: 'The declared write type', body: c.kv([['Write type', 'platform.breakglass', { mono: true }], ['Declaration', 'platform v3 · certified by Kavya Menon, 20 Sep 2026'], ['Blast radius', c.blast(4, { compact: true }), { html: true }], ['Dual control', 'Always · two elan1 operators, neither the requester alone'], ['Window', 'At most 60 minutes; ends by itself'], ['Scope', 'One named runbook step (RB1–RB12), read-only unless the step says otherwise'], ['Alert', 'Tenant owner and elan1 lead within 1 minute'], ['Recorded in', 'The operator’s own chain, visible to this tenant']], { compact: true }) });
      var hist = st === 'active' ? c.table({ caption: 'Break-glass on this tenant', columns: [{ key: 'a', label: 'When' }, { key: 'b', label: 'Runbook' }, { key: 'c', label: 'Operators' }, { key: 'd', label: 'Proof', mono: true }], rows: [{ a: '24 Sep 2026, 15:40–16:40 IST', b: 'RB1 record writer behind', c: 'Arjun Rao + Arjun Mehta', d: 'operator #214' }] }) :
        c.empty({ title: 'No break-glass access has been used on this tenant', why: 'Every use would appear here with its runbook step, both operators and its record in the operator chain.', fill: 'You are alerted within one minute of any session opening.', action: { label: 'Incidents', href: '#/assurance/incidents' }, icon: 'lock' });
      var form = op ? '<form id="w-bg" class="e1-stack" novalidate>' + c.field('Runbook step', c.select({ id: 'w-bg-rb', options: ['RB1 record writer behind', 'RB3 write committed without a record', 'RB7 tenant must be stopped', 'RB10 declaration version must be withdrawn', 'RB12 break-glass access'] }), { id: 'w-bg-rb', required: true }) +
        c.field('Window', c.select({ id: 'w-bg-w', options: ['15 minutes', '30 minutes', '60 minutes'] }), { id: 'w-bg-w', required: true }) +
        c.field('Reason', c.textarea({ id: 'w-bg-why', rows: 3 }), { id: 'w-bg-why', required: true, help: 'Shown to the tenant word for word.' }) +
        c.field('Second operator', c.select({ id: 'w-bg-2', options: ['Arjun Mehta · elan1 lead', 'Kavya Menon · onboarding reviewer'] }), { id: 'w-bg-2', required: true }) +
        c.button('Request break-glass', { kind: 'danger', attrs: 'data-action="w-bg-req"' }) + '</form>' :
        '<p class="w-note">Only elan1 operators can raise a break-glass request, so the form is not shown to you. You see every request and every session.</p>' + c.button('Preview the operator form', { href: E1.href('/work/break-glass', { as: 'operator' }), kind: 'ghost', icon: 'eye', size: 'sm' });
      h += '<div class="e1-split"><div>' + decl + sec('History', hist) + '</div><aside class="w-panel">' + c.card({ title: op ? 'Request (operator view)' : 'Who can ask', body: form }) + '</aside></div>';
      return h;
    }
  });
  E1.action('w-bg-req', function (el) { var f = el.closest('form'), why = f.querySelector('#w-bg-why'); if (!reasonValid(why.value)) { why.setAttribute('aria-invalid', 'true'); why.focus(); E1.toast('Give a reason of at least one sentence; the tenant reads it word for word.', 'neutral'); return; } E1.go('/work/break-glass', { state: 'requested' }); });
  E1.on('submit', '#w-bg', function (e) { e.preventDefault(); });

  /* ========================================================================
     MOBILE (layout 'mobile') — the same decision at 390 px, 44 px targets
     ======================================================================== */
  function appbar(title, backHref, backLabel, right) {
    return '<div class="e1-m-appbar">' + (backHref ? '<a href="' + backHref + '" aria-label="' + esc(backLabel || 'Back') + '">' + c.icon('arrow-left', 20) + '</a>' : '<span style="width:44px" aria-hidden="true"></span>') +
      '<span class="e1-m-appbar__title">' + esc(title) + '</span>' + (right || '<span style="width:44px" aria-hidden="true"></span>') + '</div>';
  }
  function mTabbar(active) {
    return '<nav class="e1-m-tabbar" aria-label="App">' + [['approvals', 'Approvals', 'work', '#/m/approvals'], ['today', 'Today', 'home', '#/work/today'], ['not-done', 'Not done', 'refuse', '#/work/not-done'], ['proof', 'Proof', 'proof', '#/assurance/proof']].map(function (t) {
      return '<a href="' + t[3] + '"' + (t[0] === active ? ' class="is-active" aria-current="page"' : '') + '>' + c.icon(t[2], 20) + '<span>' + t[1] + '</span></a>';
    }).join('') + '</nav>';
  }
  E1.route('/m/approvals', {
    title: 'Approvals on a phone', layout: 'mobile', lead: 'The same queue as the console, as cards that keep all four facts: who proposed it (in words), the money or radius, whether every gate passed, and the time left.', back: ['Open the console queue', '#/work/approvals'], keywords: 'mobile phone approvals',
    render: function (p, q) {
      var f = q.filter || 'mine', rows = filterObs({ filter: f });
      var h = appbar('Approvals', '#/work/today', 'Back to Today', '<a href="#/work/today" aria-label="Notifications">' + c.icon('bell', 20) + '</a>');
      h += '<div class="w-m-seg">' + c.segmented([{ id: 'mine', label: 'Mine', href: '#/m/approvals' }, { id: 'anyone', label: 'Anyone', href: '#/m/approvals?filter=anyone' }, { id: 'expiring', label: '< 1 h', href: '#/m/approvals?filter=expiring' }], f, { label: 'Show' }) + '</div>';
      h += '<div class="e1-m-body">';
      if (q.state === 'empty' || !rows.length) h += c.empty({ title: 'Nothing is waiting for you', why: 'Agents are running at their declared autonomy; anything that needs a person will appear here.', action: { label: 'What arrives here', href: '#/work/approvals/arrives' }, compact: true });
      else h += '<p class="e1-caption e1-muted">' + rows.length + ' · oldest deadline first</p>' + rows.map(function (o) {
        return '<a class="w-mcard" href="#/m/decide/' + o.id + '"><span class="w-mcard__t">' + esc(o.proposal) + '</span>' +
          '<span class="w-mcard__row"><span>' + esc(o.by.name) + ' · <strong>' + kindWord(o.by.kind) + '</strong></span><span class="e1-mono">' + esc(amountRadiusText(o).split(' · ')[0]) + '</span></span>' +
          '<span class="w-mcard__row">' + checksBadge(o) + c.countdown(deadline(o), { label: 'Expires' }) + '</span></a>';
      }).join('');
      return h + '</div>' + mTabbar('approvals');
    }
  });

  E1.route('/m/decide/:id', {
    title: 'Decide on a phone', layout: 'mobile', lead: 'Diff collapsed to the changed fields, with Show all fields. Approve and Reject are 48 px tall with a 12 px gap, never adjacent without one.', back: ['Open the full Decide screen', '#/work/decide/OB-2026-0412'], example: '/m/decide/OB-2026-0412', keywords: 'mobile decide approve reject',
    render: function (p, q) {
      var ob = findOb(p.id) || (/^OB-\d{4}-\d{4}$/.test(p.id) ? synthOb(p.id) : null);
      if (!ob) return appbar('Decide', '#/m/approvals', 'Back to approvals') + '<div class="e1-m-body">' + c.empty({ title: 'This request is no longer open', why: 'It may have been decided, or the link is mistyped.', action: { label: 'Back to approvals', href: '#/m/approvals' }, compact: true }) + '</div>';
      var w = wt(ob.wt), mine = isMine(ob);
      var h = appbar('Decide', '#/m/approvals', 'Back to approvals', '<a href="#/work/decide/' + ob.id + '" aria-label="Open in the console">' + c.icon('external', 18) + '</a>');
      h += '<div class="e1-m-body">' +
        '<div><p class="e1-label">' + esc(ob.id) + ' · ' + esc(w.label) + '</p><h2 class="e1-text-section" style="margin-top:4px">' + esc(ob.proposal) + (ob.amount ? ' · ' + esc(fmt.inr(ob.amount)) : '') + '</h2><div style="margin-top:6px">' + c.countdown(deadline(ob), { label: 'Expires' }) + '</div></div>' +
        '<div class="w-mfacts"><div><span class="w-fold__k">Proposed by</span>' + actor(ob.by.name, ob.by.kind, ob.by.level && ob.by.level !== '—' ? ob.by.level : null, 'sm') + '</div><div><span class="w-fold__k">Blast radius</span>' + c.blast(w.blast, { compact: true }) + reversibleChip(w) + '</div></div>' +
        c.diff(ob.diff || [], { caption: 'Changed fields' }) +
        '<details class="w-mdetails"><summary><span>' + ob.passed + ' of ' + ob.total + ' passed' + (hasDual(ob) ? ' · dual control: ' + (mine ? 'you' : 'waiting') : '') + '</span>' + c.icon('chevron-down', 16) + '</summary><div>' + gatesHtml(gateRows(ob), { version: declOf(ob), pendingWord: mine ? 'waiting for you' : 'waiting' }) + '</div></details>' +
        c.callout({ kind: 'info', title: 'Why you', body: '<p>allow at policy version ' + ob.policy + '. ' + esc(ob.why.charAt(0).toUpperCase() + ob.why.slice(1)) + '</p>' }) +
        '<p class="w-note">' + (w.wa ? 'Reply by WhatsApp is on for this write: it is low value, reversible and touches one record.' : 'Reply by WhatsApp is off for this write: ' + (w.rev === false ? 'it is irreversible.' : 'its radius is wider than one record.')) + '</p>' +
        '<p class="w-note">L1 Guarded · this record is hash-chained, not signed.</p></div>';
      if (mine) h += '<div class="e1-m-actions">' + c.button('Reject', { kind: 'danger', attrs: 'data-action="w-m-reject" data-value="' + esc(ob.id) + '"' }) + c.button('Approve', { kind: 'gate', attrs: 'data-action="w-approve" data-value="' + esc(ob.id) + '"' }) + '</div>';
      else h += '<div class="e1-m-actions" style="grid-template-columns:1fr"><p class="w-note" style="text-align:center">Waiting on ' + esc(waitingText(ob)) + '. There is nothing for you to press.</p></div>';
      return h;
    }
  });
  E1.action('w-m-reject', function (el) {
    var id = el.getAttribute('data-value');
    var s = E1.sheet({ title: 'Reject with a reason', body: c.field('Why are you rejecting this?', c.textarea({ id: 'w-m-reason', rows: 4, placeholder: 'Say what would need to change for you to approve.' }), { id: 'w-m-reason', required: true, help: 'At least one sentence. Recorded on the proof and sent to the proposer.' }),
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Reject', kind: 'danger', onClick: function (e, close, box) { var ta = box.querySelector('#w-m-reason'); if (!reasonValid(ta.value)) { ta.setAttribute('aria-invalid', 'true'); ta.focus(); E1.toast('Write at least one sentence (20 characters, 3 words).', 'neutral'); return false; } rememberReason(id, ta.value.trim()); setTimeout(function () { E1.go('/m/done/' + id, { next: 'rejected' }); }, 0); } }] });
    setTimeout(function () { var t = s.el.querySelector('#w-m-reason'); if (t) t.focus(); }, 40);
  });

  E1.route('/m/done/:id', {
    title: 'Decision recorded', layout: 'mobile', lead: 'The outcome is announced in a live region: “Approved. Posted. Proof 4101.” The next item is one tap away.', back: ['Back to the phone queue', '#/m/approvals'], example: '/m/done/OB-2026-0412', keywords: 'mobile done approved',
    render: function (p, q) {
      var ob = findOb(p.id) || synthOb(p.id), st = q.state || (q.next ? 'recording' : 'approved'), s = seqsFor(ob), w = wt(ob.wt);
      var h = appbar('Decided', '#/m/approvals', 'Back to approvals') + '<div class="e1-m-body">';
      if (st === 'recording') h += result('info', 'clock', 'Recording your decision…', '<p>Your decision is being written as its own governed write.</p>', null, null, 'Recording your decision.');
      else if (st === 'rejected') h += result('neutral', 'refuse', 'Rejected · recorded · proof ' + seqTxt(s.res), '<p>' + esc(ob.by.kind === 'agent' ? 'The agent' : ob.by.name) + ' has been told POLICY.APPROVAL_DECLINED. Your reason is on the record.</p>', c.button('Show the record', { href: proofHref(s.res), full: true }), null, 'Rejected. Recorded. Proof ' + s.res + '.');
      else if (st === 'first-of-two') h += result('warning', 'gate', 'Approval 1 of 2 recorded · proof ' + seqTxt(s.res), '<p>Nothing is written until the second person approves too.</p>', null, null, 'Approval 1 of 2 recorded.');
      else h += result('good', 'check', 'Approved · posted · proof ' + seqTxt(s.commit), '<p>' + esc(ob.proposal) + '</p>', c.button('Open the record', { href: '#/records/object/' + encodeURIComponent(ob.record || ob.id), kind: 'primary', full: true }) + (w.rev === false ? '' : c.button('Reverse this (30 days)', { href: '#/work/reverse/' + s.commit, full: true })), null, 'Approved. Posted. Proof ' + s.commit + '.');
      var n = nextMine(ob);
      h += n ? '<a class="w-mcard" href="#/m/decide/' + n.id + '"><span class="e1-label">Next waiting on you</span><span class="w-mcard__t">' + esc(n.proposal) + '</span><span class="w-mcard__row"><span>' + esc(n.by.name) + ' · <strong>' + kindWord(n.by.kind) + '</strong></span>' + c.countdown(deadline(n), { label: 'Expires' }) + '</span></a>' : '';
      return h + c.button('Back to approvals', { href: '#/m/approvals', kind: 'ghost', full: true }) + '</div>' + mTabbar('approvals');
    },
    mount: function (el, p, q) {
      if (q.state || !q.next) return;
      setTimeout(function () { var r = E1.state.route || {}; if (r.pattern === '/m/done/:id' && !(r.query || {}).state) E1.go('/m/done/' + p.id, { state: q.next }, { replace: true }); }, 1300);
    }
  });

  /* ========================================================================
     CHANNELS — WhatsApp, voice and e-mail previews (layout 'mobile')
     ======================================================================== */
  E1.route('/channels/whatsapp', {
    title: 'WhatsApp approval preview', layout: 'mobile', lead: 'A notification channel. Reply APPROVE or REJECT works only for write types declared whatsapp_approve (low value, reversible, one record); otherwise the only action is the link.', back: ['Channels', '#/agents/channels'], keywords: 'whatsapp channel template reply',
    render: function (p, q) {
      var cs = q.case || 'link', ob = cs === 'link' || cs === 'freetext' ? findOb('OB-2026-0412') : findOb('OB-2026-0423');
      var w = wt(ob.wt);
      var h = '<div class="w-m-seg" style="padding-bottom:10px">' + c.segmented([{ id: 'link', label: 'Link only', href: '#/channels/whatsapp' }, { id: 'reply', label: 'Reply allowed', href: '#/channels/whatsapp?case=reply' }, { id: 'freetext', label: '“yes”', href: '#/channels/whatsapp?case=freetext' }], cs === 'replied' || cs === 'rejected' ? 'reply' : cs, { label: 'Template case', size: 'sm' }) + '</div>';
      h += '<div class="w-chathead">' + c.avatar('elan1', { kind: 'system', size: 'sm' }) + '<div><div class="w-chathead__t">elan1 approvals · Kaveri Spinning Mills</div><div class="w-chathead__s">Business account · template message</div></div></div>';
      h += '<div class="w-chat" role="log" aria-label="Messages"><span class="w-chat__day">Today</span>';
      h += '<div class="w-bub w-bub--in"><strong>elan1 · Approval needed · Kaveri Spinning Mills</strong><br>' + esc(ob.proposal.replace(' · ', ', ')) + (ob.amount ? ', ' + esc(fmt.inr(ob.amount)) : '') + '<br>Proposed by ' + esc(ob.by.name) + ' (' + kindWord(ob.by.kind) + ')<br>' + ob.passed + ' of ' + ob.total + ' checks passed · expires ' + esc(fmt.time(deadline(ob))) +
        (w.wa ? '<br><br>Reply <strong>APPROVE</strong> or <strong>REJECT</strong>. Your reply is bound to ' + esc(ob.id) + ' and expires with it.' : '') +
        '<a class="w-bub__link" href="#/m/decide/' + ob.id + '">Open the console to see the change and decide.</a>' +
        (w.wa && cs === 'reply' ? '<div class="w-bub__btns">' + c.button('APPROVE', { href: '#/channels/whatsapp?case=replied', kind: 'secondary' }) + c.button('REJECT', { href: '#/channels/whatsapp?case=rejected', kind: 'secondary' }) + '</div>' : '') +
        '<span class="w-bub__meta">' + esc(fmt.time(E1.ago(2)).replace(' IST', '')) + '</span></div>';
      if (cs === 'replied') h += '<div class="w-bub w-bub--out">APPROVE<span class="w-bub__meta">now</span></div><div class="w-bub w-bub--in">Approved. Posted. Proof #4,113.<br><span class="e1-caption">Move stock · 1,200 kg cotton to Mill 2 · recorded as approved by Priya Nair via WhatsApp.</span><span class="w-bub__meta">now</span></div>';
      if (cs === 'rejected') h += '<div class="w-bub w-bub--out">REJECT<span class="w-bub__meta">now</span></div><div class="w-bub w-bub--in">Rejected and recorded. A reason is required: reply with one sentence, or open the console to write it.<a class="w-bub__link" href="#/m/decide/' + ob.id + '?act=reject">Write the reason in the console</a><span class="w-bub__meta">now</span></div>';
      if (cs === 'freetext') h += '<div class="w-bub w-bub--out">yes<span class="w-bub__meta">now</span></div><div class="w-bub w-bub--in">A reply here cannot approve this change. Open the console to see the change and decide.<a class="w-bub__link" href="#/m/decide/' + ob.id + '">Open ' + esc(ob.id) + '</a><span class="w-bub__meta">now</span></div>';
      h += '<div class="w-chat__day" style="max-width:92%;text-align:center">' + (w.wa ? 'Move stock is declared whatsapp_approve: one record, reversible, low value.' : 'Submit invoice is above ₹1,00,000 and touches one counterparty, so it is link-only. WhatsApp is easy to spoof and is not trusted to move money.') + '</div></div>';
      h += '<form class="w-compose" data-w-wa aria-label="Reply">' + c.input({ id: 'w-wa-in', placeholder: 'Message', attrs: 'aria-label="Message"' }) + c.button('Send', { kind: 'primary', type: 'submit', icon: 'send', iconOnly: true, attrs: 'style="min-width:44px;min-height:44px"' }) + '</form>';
      return h;
    }
  });
  E1.on('submit', 'form[data-w-wa]', function (e, f) {
    e.preventDefault();
    var v = String(f.querySelector('input').value || '').trim().toUpperCase(), cs = ((E1.state.route || {}).query || {}).case || 'link';
    if (!v) return;
    if ((v === 'APPROVE' || v === 'REJECT') && (cs === 'reply' || cs === 'replied' || cs === 'rejected')) E1.go('/channels/whatsapp', { case: v === 'APPROVE' ? 'replied' : 'rejected' });
    else E1.go('/channels/whatsapp', { case: 'freetext' });
  });

  E1.route('/channels/voice', {
    title: 'Voice approval preview', layout: 'mobile', lead: 'rung1 Voice: inbound, or a call the platform places to a known approver’s registered number. Approvals only, with a spoken confirmation and a one-time code, in Tamil or English.', back: ['Channels', '#/agents/channels'], keywords: 'voice call approval rung1',
    render: function (p, q) {
      var out = q.outcome || '', ob = findOb('OB-2026-0417');
      var line = function (who, txt, sys) { return '<div class="w-vline' + (sys ? ' w-vline--sys' : '') + '"><span class="w-vline__w">' + esc(who) + '</span><span class="w-vline__s">' + txt + '</span></div>'; };
      var h = '<div class="w-chathead">' + c.avatar('rung1 Voice', { kind: 'system', size: 'sm' }) + '<div><div class="w-chathead__t">rung1 Voice · call to Ravi Shankar</div><div class="w-chathead__s">Registered number ··· 4471 · English (Tamil available) · 01:12</div></div></div>';
      h += '<div class="e1-m-body"><div class="w-voice" role="log" aria-label="Call transcript">' +
        line('Voice', 'Hello Ravi. This is the Kaveri Spinning Mills approval line. There is one request waiting for you.', true) +
        line('Voice', 'To confirm it is you, please say the six-digit code sent to your phone.', true) +
        line('Ravi', '“Four one seven, two nine zero.”') +
        line('Voice', 'Thank you. The Collections Agent, an agent, proposes to cancel invoice INV-2026-0851 for Shree Murugan Traders, for two lakh rupees. The customer returned the goods. Six of six checks passed. Cancelling an invoice cannot be undone. Do you approve? Say yes or no.', true) +
        (out === 'yes' ? line('Ravi', '“Yes.”') + line('Voice', 'Please confirm: you approve cancelling invoice INV-2026-0851, which cannot be undone. Say confirm.', true) + line('Ravi', '“Confirm.”') + line('Voice', 'Approved. Recorded as proof #4,113 with recording reference VR-2026-09-24-0193. Goodbye.', true) : '') +
        (out === 'no' ? line('Ravi', '“No. The return note is not signed yet.”') + line('Voice', 'Rejected. Your reason is recorded: “The return note is not signed yet.” Proof #4,113. Goodbye.', true) : '') +
        '</div>' +
        (out ? result(out === 'yes' ? 'good' : 'neutral', out === 'yes' ? 'check' : 'refuse', out === 'yes' ? 'Approved by voice · proof #4,113' : 'Rejected by voice · proof #4,113', '<p>The proof records that the decision came through the Voice channel, with the recording reference and the time. Voice cannot create, edit or delete anything.</p>', c.button('Open the request', { href: '#/work/decide/' + ob.id, full: true }), null, null) :
          '<div class="w-two">' + c.button('Say “yes”', { kind: 'gate', href: '#/channels/voice?outcome=yes', full: true }) + c.button('Say “no”', { kind: 'danger', href: '#/channels/voice?outcome=no', full: true }) + '</div>') +
        '<p class="w-note">Voice answers only a pending approval. It never proposes, edits or deletes, and it cannot approve anything that is not waiting on the person called.</p></div>';
      return h;
    }
  });

  E1.route('/channels/email', {
    title: 'E-mail notification preview', layout: 'mobile', lead: 'E-mail delivers items into Work. It carries the facts and a link; a reply cannot approve anything.', back: ['Channels', '#/agents/channels'], keywords: 'email notification approval',
    render: function () {
      var ob = findOb('OB-2026-0412');
      return appbar('Inbox', '#/m/approvals', 'Back') +
        '<article class="w-mail" aria-label="E-mail preview"><header class="w-mail__head"><span class="w-mail__subj">Approval needed · Submit invoice SINV-2026-01187 · ₹2,40,000</span><span class="w-mail__from">elan1 approvals &lt;approvals@kaveri.elan1.in&gt; · to Venkat Raman · ' + esc(fmt.time(E1.ago(13))) + '</span></header>' +
        '<div class="w-mail__body"><p>Venkat, one request is waiting on you in Kaveri Spinning Mills.</p>' +
        c.kv([['Proposal', ob.proposal], ['Proposed by', 'ar-agent (Agent) · A2 Propose'], ['Amount', fmt.inr(ob.amount)], ['Checks', '5 of 5 passed · dual control: waiting for you'], ['Blast radius', 'One counterparty · reversible (cancel IRN within 24 h)'], ['Expires', fmt.time(deadline(ob))]], { compact: true }) +
        c.button('Open the console to see the change and decide', { kind: 'primary', href: '#/m/decide/' + ob.id, full: true }) +
        '<p class="w-note">The link opens this request after you sign in. It does not approve anything by itself.</p></div>' +
        '<footer class="w-mail__foot">A reply to this e-mail cannot approve or reject anything. You receive these because you are in ar-approvers. <a href="#/account/notifications">Notification settings</a></footer></article>';
    }
  });

  /* Palette shortcuts */
  E1.cmdAdd({ id: 'w-oldest', label: 'Decide the nearest deadline waiting on me', group: 'Work', icon: 'gate', run: function () { var m = OB.filter(isMine).sort(function (a, b) { return a.exp - b.exp; })[0]; E1.go('/work/decide/' + m.id); }, keywords: 'approve next oldest' });
  E1.cmdAdd({ id: 'w-new-payment', label: 'Record a payment', group: 'Work', icon: 'plus', run: '#/work/request/erp.payment_entry.submit', keywords: 'new request payment' });
})();
